import { Subject } from '@/types';

export interface OCRProgress {
  status: string;
  progress: number;
}

/* ── Grade Letter → Grade Point ──
   Uses Raghu Engineering College (Autonomous) AR23 grading:
   O/S=10, A=9, B=8, C=7, D=6, E=5, F/AB=0
   Also supports common +grades (A+, B+, C+) for other colleges.
*/
const GRADE_MAP: Record<string, number> = {
  'O': 10, 'S': 10, 'A+': 10,
  'A': 9,
  'B+': 8, 'B': 8,
  'C+': 7, 'C': 7,
  'D': 6, 'E': 5,
  'F': 0, 'AB': 0,
};

const GRADE_KEYS = Object.keys(GRADE_MAP).sort((a, b) => b.length - a.length);

const MAX_CREDITS = 12; // Must cover project/thesis work (up to 12cr)
const MIN_CREDITS = 0.5;

const SKIP_LINES = /^(sem|sub|grade|credit|total|result|sgpa|cgpa|page|roll|name|reg|univ|code|©|year|elect|batch|regular|supplementary|remedial|pass|fail|honors|minor|total\s+credits|total\s+points)/i;
const DATE_FRAGMENTS = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec):\w+/gi;
const YEAR_FRAGMENT = /\b\d{2}-\s*(regular|supplementary|remedial)?\s*/gi;

// ── Helpers ──

function cleanName(name: string): string {
  return name
    .replace(DATE_FRAGMENTS, '')
    .replace(YEAR_FRAGMENT, '')
    .replace(/[•·●▪►→*#@]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeGrade(g: string): string | null {
  const upper = g.toUpperCase();
  if (GRADE_MAP[upper] !== undefined) return upper;
  const first = upper[0];
  if (GRADE_MAP[first] !== undefined && upper.split('').every(ch => ch === first || ch === first.toLowerCase())) {
    return first;
  }
  return null;
}

function normalizeCredits(rawStr: string): number {
  // Step 0: Handle OCR misread of "0.5" as "05" (parseFloat("05") = 5, silently wrong)
  // If raw string starts with "0", has more digits, and no decimal point, try "0.X" first.
  if (rawStr.startsWith('0') && rawStr.length > 1 && !rawStr.includes('.') && /^\d+$/.test(rawStr)) {
    const rest = rawStr.slice(1);
    const d = parseFloat('0.' + rest);
    if (!isNaN(d) && d >= MIN_CREDITS && d <= MAX_CREDITS) return d;
  }

  // Step 1: Direct parse (handles "0.5", "1", "2", "3", "1.5" etc.)
  const c = parseFloat(rawStr);
  if (!isNaN(c) && c >= MIN_CREDITS && c <= MAX_CREDITS) return c;

  // Step 2: OCR may have lost the decimal point: "15" → "1.5", "25" → "2.5"
  // Try: first digit + "." + remaining digits
  if (rawStr.length >= 2) {
    const first = rawStr[0];
    let restDigits = '';
    for (let k = 1; k < rawStr.length; k++) {
      const ch = rawStr[k];
      if (ch >= '0' && ch <= '9') restDigits += ch;
      else break;
    }
    if (restDigits.length > 0) {
      const d = parseFloat(first + '.' + restDigits);
      if (!isNaN(d) && d >= MIN_CREDITS && d <= MAX_CREDITS) return d;
    }
  }

  // Step 3: Fallback — first digit only (handles stray noise digits)
  const firstDigit = rawStr.match(/^(\d)/);
  if (firstDigit) {
    const d = parseFloat(firstDigit[1]);
    if (!isNaN(d) && d >= MIN_CREDITS && d <= MAX_CREDITS) return d;
  }

  return NaN;
}

function extractEntry(line: string): {
  code: string;
  name: string;
  rawGrade: string;
  rawCredits: string;
} | null {
  // 1) Try exact grade keys (longest first: "B+" before "B")
  for (const gk of GRADE_KEYS) {
    const escaped = gk.replace('+', '\\+');
    const re = new RegExp(`^([\\w]{4,})\\s+(.+?)\\s+${escaped}\\s+(\\d+(?:\\.\\d+)?)(?:\\s|$)`, 'i');
    const m = line.match(re);
    if (m) return { code: m[1], name: m[2].trim(), rawGrade: gk, rawCredits: m[3] };
  }

  // 1b) Single-letter grades that OCR may have missed a "+" after
  //     e.g., marksheet has "B+" but Tesseract read "B" (missing tiny +)
  //     Check if "+" appears anywhere right after the matched letter
  for (const gk of GRADE_KEYS) {
    if (gk.includes('+')) continue; // only check single-letter keys
    const escaped = gk.replace('+', '\\+');
    // Allow an optional "+" between grade letter and whitespace
    const re = new RegExp(`^([\\w]{4,})\\s+(.+?)\\s+${escaped}\\+?\\s+(\\d+(?:\\.\\d+)?)(?:\\s|$)`, 'i');
    const m = line.match(re);
    if (m) {
      // Check if a "+" exists near the grade in the original line
      const gradeIdx = m[0].search(new RegExp(escaped, 'i'));
      const plusNearby = gradeIdx >= 0 && m[0].slice(gradeIdx, gradeIdx + 4).includes('+');
      if (plusNearby) {
        // Use the plus variant (e.g., "B+" not "B")
        const plusKey = gk + '+';
        if (GRADE_MAP[plusKey] !== undefined) {
          return { code: m[1], name: m[2].trim(), rawGrade: plusKey, rawCredits: m[3] };
        }
      }
    }
  }

  // 2) Fallback: try each word for normalized grade
  const parts = line.split(/\s+/);
  for (let idx = 0; idx < parts.length; idx++) {
    const norm = normalizeGrade(parts[idx]);
    if (!norm) continue;
    const code = parts[0];
    if (!/^[\w]{4,}$/.test(code)) continue;
    if (idx < 2) continue;
    const name = parts.slice(1, idx).join(' ');
    if (name.length < 2) continue;
    const creditsRaw = parts[idx + 1];
    if (!creditsRaw || !/^\d+(?:\.\d+)?$/.test(creditsRaw)) continue;
    const credits = normalizeCredits(creditsRaw);
    if (isNaN(credits)) continue;

    // In fallback, also check for nearby "+"
    let finalGrade = norm;
    const rawWord = parts[idx];
    if (rawWord.endsWith('+') || line.slice(line.indexOf(rawWord) + rawWord.length, line.indexOf(rawWord) + rawWord.length + 2).includes('+')) {
      const plusKey = norm + '+';
      if (GRADE_MAP[plusKey] !== undefined) finalGrade = plusKey;
    }

    return { code, name, rawGrade: finalGrade, rawCredits: creditsRaw };
  }

  return null;
}

function looksLikeNewEntry(line: string): boolean {
  if (line.length < 10) return false;
  const parts = line.split(/\s+/);
  if (!/^[\w]{4,}$/.test(parts[0])) return false;
  for (let idx = 2; idx < parts.length - 1; idx++) {
    if (normalizeGrade(parts[idx]) && /^\d+(?:\.\d+)?$/.test(parts[idx + 1])) {
      return true;
    }
  }
  return false;
}

/** Core transcript parser — used by both image & PDF paths */
export function parseTranscript(text: string): Subject[] {
  const subjects: Subject[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let idCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length < 6) continue;
    if (SKIP_LINES.test(line)) continue;
    if (/^\d+$/.test(line)) continue;
    if (/^\d{2}:\d{2}/.test(line)) continue;

    const found = extractEntry(line);
    if (!found) continue;

    let { code, name, rawGrade, rawCredits } = found;

    let j = i + 1;
    let contCount = 0;
    while (j < lines.length && contCount < 6) {
      const next = lines[j].trim();
      if (next.length < 2) { j++; continue; }
      if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec):/i.test(next)) { j++; continue; }
      if (/^(regular|supplementary|remedial|pass|fail)$/i.test(next)) { j++; continue; }
      if (/^\d{2}-$/i.test(next)) { j++; continue; }
      if (/^(code|subject|grade|credit|total|result|©)/i.test(next)) { j++; continue; }
      if (/^total\s/i.test(next)) { j++; continue; }
      if (looksLikeNewEntry(next)) break;
      name += ' ' + next;
      contCount++;
      j++;
    }

    name = cleanName(name);
    const gradeLetter = normalizeGrade(rawGrade);
    const credits = normalizeCredits(rawCredits);

    if (!gradeLetter) continue;
    if (isNaN(credits)) continue;
    if (name.length < 2 || !/[a-zA-Z]/.test(name)) continue;

    const gradePoint = GRADE_MAP[gradeLetter];

    const dup = subjects.some(s =>
      s.name.toLowerCase() === name.toLowerCase() &&
      Math.abs(parseFloat(s.credits as string) - credits) < 0.1
    );
    if (dup) continue;

    subjects.push({
      id: ++idCounter,
      name,
      credits,
      grade: gradePoint.toString(),
    });
  }

  // Fallback if nothing found
  if (subjects.length === 0) {
    const genericPattern = /([A-Za-z\s\-&,/]+)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/g;
    let m;
    while ((m = genericPattern.exec(text)) !== null) {
      const sname = cleanName(m[1].trim());
      const credits = parseFloat(m[2]);
      const gradeNum = parseFloat(m[3]);
      if (sname.length > 2 && credits >= MIN_CREDITS && credits <= MAX_CREDITS && gradeNum >= 0 && gradeNum <= 10) {
        subjects.push({
          id: ++idCounter,
          name: sname,
          credits,
          grade: gradeNum.toString(),
        });
      }
    }
  }

  return subjects;
}

// ── Image OCR ──

async function ocrImage(
  file: File,
  onProgress?: (progress: OCRProgress) => void
): Promise<{ text: string; subjects: Subject[] }> {
  const Tesseract = await import('tesseract.js');

  const { data } = await Tesseract.recognize(file, 'eng', {
    logger: (m: { status: string; progress?: number }) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress({ status: m.status, progress: m.progress || 0 });
      }
    },
  });

  const subjects = parseTranscript(data.text);
  return { text: data.text, subjects };
}

// ── PDF OCR ──

async function ocrPDF(
  file: File,
  onProgress?: (progress: OCRProgress) => void
): Promise<{ text: string; subjects: Subject[] }> {
  const pdfjsLib = await import('pdfjs-dist');
  // Set worker via CDN (avoids public/ copy in Next.js)
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  onProgress?.({ status: 'loading pdf', progress: 0 });

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = Math.min(pdf.numPages, 20); // cap at 20 pages
  if (pdf.numPages > 20) {
    console.warn(`PDF has ${pdf.numPages} pages; processing first 20 only.`);
  }
  let fullText = '';

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    // Scale 2× for better OCR accuracy on text
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvas, viewport }).promise;

    // OCR this page
    const pageText = await recognizeCanvas(
      canvas,
      onProgress,
      i,
      totalPages
    );
    fullText += pageText + '\n';
  }

  const subjects = parseTranscript(fullText);
  return { text: fullText, subjects };
}

async function recognizeCanvas(
  canvas: HTMLCanvasElement,
  onProgress?: (progress: OCRProgress) => void,
  pageIndex?: number,
  totalPages?: number
): Promise<string> {
  const Tesseract = await import('tesseract.js');

  const base = pageIndex ? (pageIndex - 1) / totalPages! : 0;
  const weight = totalPages ? 1 / totalPages! : 1;

  const { data } = await Tesseract.recognize(canvas, 'eng', {
    logger: (m: { status: string; progress?: number }) => {
      if (m.status === 'recognizing text' && onProgress) {
        const overall = base + (m.progress || 0) * weight;
        onProgress({ status: `Page ${pageIndex}/${totalPages}`, progress: overall });
      }
    },
  });

  return data.text;
}

// ── Public API: auto-detect file type ──

export async function performOCR(
  file: File,
  onProgress?: (progress: OCRProgress) => void
): Promise<{ text: string; subjects: Subject[] }> {
  const name = file.name.toLowerCase();

  // PDF detection
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) {
    return ocrPDF(file, onProgress);
  }

  // Image detection
  const isImage =
    file.type.startsWith('image/') ||
    /\.(jpe?g|png|webp|bmp|gif|tiff?)$/i.test(name);

  if (!isImage) {
    throw new Error(
      `Unsupported file type: "${file.type || name}". Please upload an image (JPG, PNG, WebP) or a PDF.`
    );
  }

  // Images (JPEG, PNG, WebP, BMP, GIF, TIFF, etc.) — Tesseract handles natively
  return ocrImage(file, onProgress);
}
