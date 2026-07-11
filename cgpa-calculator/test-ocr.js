const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

/* ── Grade Letter → Grade Point ──
   Raghu Engineering College (Autonomous) AR23 grading:
   O/S=10, A=9, B=8, C=7, D=6, E=5, F/AB=0
   Also supports common +grades (A+, B+, C+) for other colleges.
*/
const GRADE_MAP = {
  'O': 10, 'S': 10, 'A+': 10,
  'A': 9,
  'B+': 8, 'B': 8,
  'C+': 7, 'C': 7,
  'D': 6, 'E': 5,
  'F': 0, 'AB': 0,
};

const GRADE_KEYS = Object.keys(GRADE_MAP).sort((a, b) => b.length - a.length);
const MAX_CREDITS = 6;
const MIN_CREDITS = 0.5;

const SKIP_LINES = /^(sem|sub|grade|credit|total|result|sgpa|cgpa|page|roll|name|reg|univ|code|©|year|elect|batch|regular|supplementary|remedial|pass|fail|honors|minor|total\s+credits|total\s+points)/i;

function cleanName(name) {
  return name
    .replace(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec):\w+/gi, '')
    .replace(/\b\d{2}-\s*(regular|supplementary|remedial)?\s*/gi, '')
    .replace(/[•·●▪►→*#@]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Normalize grade: "Ss" → "S", "AA" → "A", "Oo" → "O", keep "AB"
function normalizeGrade(g) {
  const upper = g.toUpperCase();
  if (GRADE_MAP[upper] !== undefined) return upper;
  const first = upper[0];
  if (GRADE_MAP[first] !== undefined && upper.split('').every(ch => ch === first || ch === first.toLowerCase())) return first;
  return null;
}

// If credits > MAX_CREDITS, try recovering the missing decimal point
// "15" → try "1.5" (decimal lost in OCR), fallback to first digit "1"
function normalizeCredits(rawStr) {
  const c = parseFloat(rawStr);
  if (!isNaN(c) && c >= MIN_CREDITS && c <= MAX_CREDITS) return c;

  // Try: first digit + "." + remaining digits ("15" → "1.5")
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

  // Fallback: first digit only (stray noise from table borders)
  const firstDigit = rawStr.match(/^(\d)/);
  if (firstDigit) {
    const d = parseFloat(firstDigit[1]);
    if (!isNaN(d) && d >= MIN_CREDITS && d <= MAX_CREDITS) return d;
  }

  return NaN;
}

// ── Extract raw fields from a line ──
function extractEntry(line) {
  for (const gk of GRADE_KEYS) {
    const escaped = gk.replace('+', '\\+');
    const re = new RegExp(`^([\\w]{4,})\\s+(.+?)\\s+${escaped}\\s+(\\d+(?:\\.\\d+)?)(?:\\s|$)`, 'i');
    const m = line.match(re);
    if (m) return { code: m[1], name: m[2].trim(), rawGrade: gk, rawCredits: m[3] };
  }
  // Fallback: try first-character normalization for each word
  // Find a word that when normalized matches a grade
  const parts = line.split(/\s+/);
  for (let idx = 0; idx < parts.length; idx++) {
    const word = parts[idx];
    const norm = normalizeGrade(word);
    if (!norm) continue;
    // Everything after code up to this word is subject name
    // Look for a code at start (5+ alphanumeric)
    const code = parts[0];
    if (!/^[\w]{4,}$/.test(code)) continue;
    if (idx < 2) continue; // Need at least code + some name
    const name = parts.slice(1, idx).join(' ');
    if (name.length < 2) continue;
    // Next part should be credits number
    const creditsRaw = parts[idx + 1];
    if (!creditsRaw || !/^\d+(?:\.\d+)?$/.test(creditsRaw)) continue;
    const credits = normalizeCredits(creditsRaw);
    if (isNaN(credits)) continue;
    return { code, name, rawGrade: norm, rawCredits: creditsRaw };
  }
  return null;
}

// Check if line starts a new subject entry (handles normalized grades)
function looksLikeNewEntry(line) {
  if (line.length < 10) return false;
  const parts = line.split(/\s+/);
  if (!/^[\w]{4,}$/.test(parts[0])) return false;
  // Check each word as potential grade
  for (let idx = 2; idx < parts.length - 1; idx++) {
    const norm = normalizeGrade(parts[idx]);
    if (!norm) continue;
    // Next token should be a number (credits)
    if (/^\d+(?:\.\d+)?$/.test(parts[idx + 1])) return true;
  }
  return false;
}

function parseTranscript(text) {
  const subjects = [];
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

    // Look ahead for continuation lines
    let j = i + 1;
    let contCount = 0;
    while (j < lines.length && contCount < 4) {
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

    const gradePoints = GRADE_MAP[gradeLetter];

    // Dedup
    const dup = subjects.some(s =>
      s.name.toLowerCase() === name.toLowerCase() &&
      Math.abs(parseFloat(s.credits) - credits) < 0.1
    );
    if (dup) continue;

    subjects.push({
      id: ++idCounter,
      name,
      credits,
      grade: gradePoints.toString(),
    });
  }

  return subjects;
}

async function testOCR() {
  console.log('=== OCR TEST: marks.jpeg (v4 — HANDLE OCR NOISE) ===\n');

  const imagePath = path.join(process.cwd(), 'marks.jpeg');
  const imageBuffer = fs.readFileSync(imagePath);
  console.log('Image size:', imageBuffer.length, 'bytes\n');

  console.log('Running Tesseract OCR...');
  const { data } = await Tesseract.recognize(imageBuffer, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        process.stdout.write('\rProgress: ' + Math.round((m.progress || 0) * 100) + '%');
      }
    },
  });

  console.log('\n\n=== RAW TEXT ===\n');
  console.log(data.text);

  console.log('\n=== PARSED SUBJECTS ===\n');
  const subjects = parseTranscript(data.text);

  if (subjects.length === 0) {
    console.log('No subjects could be parsed.');
    return;
  }

  let totalCredits = 0;
  let totalPoints = 0;

  subjects.forEach((s, i) => {
    const c = parseFloat(s.credits);
    const g = parseFloat(s.grade);
    console.log(`  ${String(i+1).padStart(2)}. [${c} cr × ${g} pts = ${(c*g).toFixed(1)}] ${s.name}`);
    if (!isNaN(c) && !isNaN(g) && c > 0) {
      totalCredits += c;
      totalPoints += c * g;
    }
  });

  console.log(`\n  ─────────────────────────────────`);
  console.log(`  Total Credits: ${totalCredits}`);
  console.log(`  Total Points:  ${totalPoints.toFixed(2)}`);

  if (totalCredits > 0) {
    const sgpa = (totalPoints / totalCredits).toFixed(2);
    const pct = ((parseFloat(sgpa) - 0.5) * 10).toFixed(2);
    console.log(`  SGPA: ${sgpa}`);
    console.log(`  Percentage: ${pct}%`);
  }

  console.log(`\n  ─── Ground Truth vs Detected ───`);
  const groundTruth = [
    { name: 'Communicative English', credits: 2, grade: 8 },       // B = 8
    { name: 'Applied Chemistry', credits: 3, grade: 10 },          // S = 10
    { name: 'Linear Algebra and Calculus', credits: 3, grade: 9 }, // A = 9
    { name: 'Basic Electrical and Electronics Engineering', credits: 3, grade: 9 }, // A = 9
    { name: 'Engineering Graphics', credits: 3, grade: 10 },       // S = 10
    { name: 'Communicative English Lab', credits: 1, grade: 9 },   // A = 9
    { name: 'Applied Chemistry Lab', credits: 1, grade: 10 },      // S = 10
    { name: 'Electrical and Electronics Engineering Workshop', credits: 1.5, grade: 9 }, // A = 9
    { name: 'IT Workshop', credits: 1, grade: 10 },                // S = 10
    { name: 'NSS/NCC/scouts and Guides/Community Service', credits: 0.5, grade: 10 }, // S = 10
  ];

  let detected = 0;
  let missed = 0;
  for (const gt of groundTruth) {
    const found = subjects.some(s => {
      const nameMatch = s.name.toLowerCase().includes(gt.name.toLowerCase().substring(0, 15));
      const crMatch = Math.abs(parseFloat(s.credits) - gt.credits) < 0.1;
      const grMatch = parseFloat(s.grade) === gt.grade;
      return nameMatch && crMatch && grMatch;
    });
    if (found) {
      console.log(`  ✅ ${gt.name} [${gt.credits}cr, ${gt.grade}pts]`);
      detected++;
    } else {
      console.log(`  ❌ MISSING: ${gt.name} [${gt.credits}cr, ${gt.grade}pts]`);
      missed++;
    }
  }
  console.log(`\n  Result: ${detected}/10 detected, ${missed}/10 missed`);
}

testOCR().catch(console.error);
