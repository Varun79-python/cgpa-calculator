import { Subject, CalculationResult, HistoryEntry } from '@/types';

interface PDFOptions {
  result: CalculationResult;
  type: string;
  subjects?: Subject[];
  studentInfo?: {
    name?: string;
    roll?: string;
    branch?: string;
    university?: string;
  };
  includeCharts?: boolean;
}

export async function generatePDF(options: PDFOptions): Promise<void> {
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 20;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  let y = MARGIN;

  const setColor = (r: number, g: number, b: number) => doc.setTextColor(r, g, b);
  const setFont = (style: 'normal' | 'bold', size: number) => {
    doc.setFont(style === 'bold' ? 'Helvetica-Bold' : 'Helvetica');
    doc.setFontSize(size);
  };

  // Background accent bar
  doc.setFillColor(108, 99, 255);
  doc.rect(0, 0, 5, PAGE_H, 'F');
  doc.setFillColor(10, 10, 15);
  doc.rect(5, 0, PAGE_W - 5, PAGE_H, 'F');

  // Header
  doc.setFillColor(108, 99, 255);
  doc.rect(MARGIN, y, CONTENT_W, 45, 'F');
  doc.setTextColor(255, 255, 255);
  setFont('bold', 22);
  doc.text('GPA Suite', PAGE_W / 2, y + 16, { align: 'center' });
  setFont('normal', 10);
  doc.text('CGPA · SGPA · Percentage Calculator', PAGE_W / 2, y + 28, { align: 'center' });
  setFont('normal', 8);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })}`, PAGE_W / 2, y + 38, { align: 'center' });
  y += 55;

  // Score card
  const scoreNum = options.result.num || 0;
  const scoreColor: [number, number, number] = scoreNum >= 9 ? [255, 215, 0]
    : scoreNum >= 8 ? [155, 127, 255]
    : scoreNum >= 7 ? [77, 217, 224]
    : scoreNum >= 6 ? [105, 240, 174]
    : [248, 113, 113];

  doc.setFillColor(15, 15, 25);
  doc.roundedRect(MARGIN, y, CONTENT_W, 55, 5, 5, 'F');
  doc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, y, CONTENT_W, 55, 5, 5, 'S');
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  setFont('bold', 36);
  doc.text(scoreNum.toFixed(2), PAGE_W / 2 - 10, y + 32, { align: 'center' });
  doc.setTextColor(200, 200, 220);
  setFont('normal', 9);
  const pct = options.result.pct?.toFixed(2) || '—';
  doc.text(`${options.type} · ${pct}%`, PAGE_W / 2, y + 45, { align: 'center' });
  y += 68;

  // Subjects table
  if (options.subjects && options.subjects.length > 0) {
    doc.setFillColor(108, 99, 255);
    doc.rect(MARGIN, y, CONTENT_W, 8, 'F');
    doc.setTextColor(255, 255, 255);
    setFont('bold', 8);
    doc.text('Subject', MARGIN + 4, y + 6);
    doc.text('Credits', MARGIN + CONTENT_W - 50, y + 6);
    doc.text('Grade', MARGIN + CONTENT_W - 25, y + 6);
    y += 10;

    setFont('normal', 8);
    options.subjects.forEach((s, i) => {
      if (y > PAGE_H - 25) { doc.addPage(); y = MARGIN; }
      const bg = i % 2 === 0 ? [20, 20, 32] : [15, 15, 25];
      doc.setFillColor(bg[0], bg[1], bg[2]);
      doc.rect(MARGIN, y, CONTENT_W, 7, 'F');
      doc.setTextColor(220, 220, 240);
      doc.text(s.name || `Subject ${i + 1}`, MARGIN + 4, y + 5.5);
      doc.text(s.credits?.toString() || '—', MARGIN + CONTENT_W - 50, y + 5.5);
      doc.text(s.grade?.toString() || '—', MARGIN + CONTENT_W - 25, y + 5.5);
      y += 7.5;
    });
    y += 10;
  }

  // Footer on first page
  doc.setTextColor(100, 100, 130);
  setFont('normal', 7);
  doc.text('GPA Suite — Free for students', MARGIN, PAGE_H - MARGIN + 5);

  doc.save(`GPA-Report-${options.type}-${Date.now()}.pdf`);
}
