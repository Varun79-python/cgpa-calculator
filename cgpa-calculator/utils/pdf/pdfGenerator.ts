import { Subject, CalculationResult } from '@/types';

interface PDFOptions {
  result: CalculationResult;
  type: string;
  subjects?: Subject[];
}

export async function generatePDF(options: PDFOptions): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const W = 210, H = 297, M = 20, CW = W - M * 2;
  let y = M;

  // Helpers
  const font = (s: 'normal' | 'bold', sz: number) => {
    doc.setFont(s === 'bold' ? 'Helvetica-Bold' : 'Helvetica');
    doc.setFontSize(sz);
  };

  const line = (yy: number, x1 = M, x2 = M + CW) => {
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.2);
    doc.line(x1, yy, x2, yy);
  };

  const section = (title: string) => {
    font('bold', 8);
    doc.setTextColor(60, 60, 60);
    doc.text(title, M, y);
    y += 4;
    line(y);
    y += 5;
  };

  const checkPage = (needed = 30) => {
    if (y > H - needed) { doc.addPage(); y = M; }
  };

  // ═══════════════════════════════════════
  // PAGE HEADER
  // ═══════════════════════════════════════

  // Top accent bar
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, W, 3, 'F');

  y = 16;

  // Brand
  font('bold', 28);
  doc.setTextColor(10, 10, 10);
  doc.text('CGPA Calculator', M, y);
  y += 8;

  // Subtitle
  font('normal', 10);
  doc.setTextColor(120, 120, 120);
  doc.text(`${options.type} Academic Report`, M, y);
  y += 5;

  // Date
  font('normal', 7);
  doc.setTextColor(170, 170, 170);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`, M, y);
  y += 8;

  // Divider
  line(y);
  y += 8;

  // ═══════════════════════════════════════
  // SCORE HERO
  // ═══════════════════════════════════════

  const score = options.result.num || 0;
  const pct = options.result.pct;

  // Score card background
  doc.setFillColor(248, 248, 255);
  doc.roundedRect(M, y, CW, 52, 4, 4, 'F');

  // Left accent line on card
  doc.setFillColor(99, 102, 241);
  doc.roundedRect(M, y, 3, 52, 1.5, 1.5, 'F');

  // Score label
  font('bold', 8);
  doc.setTextColor(140, 140, 140);
  doc.text(options.type, M + 14, y + 14);

  // Score value
  font('bold', 44);
  doc.setTextColor(10, 10, 10);
  doc.text(score.toFixed(2), M + 14, y + 36);

  // Percentage
  if (pct !== undefined) {
    font('normal', 10);
    doc.setTextColor(100, 100, 100);
    doc.text(`${pct.toFixed(1)}%`, W - M - 2, y + 14, { align: 'right' });
  }

  // Meta
  if (options.result.meta) {
    font('normal', 7);
    doc.setTextColor(150, 150, 150);
    doc.text(options.result.meta, W - M - 2, y + 22, { align: 'right' });
  }

  // Performance badge
  let badge = 'Average';
  if (score >= 9) badge = 'Excellent';
  else if (score >= 8) badge = 'Great';
  else if (score >= 7) badge = 'Good';

  const badgeColor: [number, number, number] = score >= 9 ? [99, 102, 241]
    : score >= 8 ? [59, 130, 246]
    : score >= 7 ? [16, 185, 129]
    : [156, 163, 175];

  const bw = badge.length * 2.8 + 10;
  doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  doc.roundedRect(W - M - bw - 2, y + 32, bw, 7, 3.5, 3.5, 'F');
  font('bold', 6);
  doc.setTextColor(255, 255, 255);
  doc.text(badge, W - M - bw / 2 - 2, y + 37.5, { align: 'center' });

  y += 62;

  // ═══════════════════════════════════════
  // SUBJECT TABLE
  // ═══════════════════════════════════════

  if (options.subjects && options.subjects.length > 0) {
    section('Subject Breakdown');

    // Table header
    const colX = [M + 2, M + 10, M + CW - 60, M + CW - 38, M + CW - 18];

    doc.setFillColor(10, 10, 10);
    doc.rect(M, y, CW, 7, 'F');
    font('bold', 6);
    doc.setTextColor(255, 255, 255);
    doc.text('#', colX[0], y + 5);
    doc.text('SUBJECT', colX[1], y + 5);
    doc.text('CREDITS', colX[2] + 8, y + 5, { align: 'center' });
    doc.text('GRADE', colX[3] + 6, y + 5, { align: 'center' });
    doc.text('POINTS', colX[4] + 6, y + 5, { align: 'center' });
    y += 8;

    let totalCr = 0, totalPts = 0;

    // Grade letter lookup
    const getLetter = (g: number) => {
      if (g >= 10) return 'O';
      if (g >= 9) return 'A';
      if (g >= 8) return 'B+';
      if (g >= 7) return 'C+';
      if (g >= 6) return 'D';
      if (g >= 5) return 'E';
      return 'F';
    };

    options.subjects.forEach((s, i) => {
      checkPage(20);

      // Alternating row
      if (i % 2 === 0) {
        doc.setFillColor(250, 250, 252);
        doc.rect(M, y, CW, 7, 'F');
      }

      const cr = parseFloat(s.credits as string) || 0;
      const gr = parseFloat(s.grade as string) || 0;
      totalCr += cr;
      totalPts += cr * gr;
      const letter = getLetter(gr);

      // Row number
      font('normal', 6);
      doc.setTextColor(180, 180, 180);
      doc.text(`${i + 1}`, colX[0], y + 5);

      // Subject name
      font('normal', 7);
      doc.setTextColor(40, 40, 40);
      const name = s.name || `Subject ${i + 1}`;
      doc.text(name.length > 28 ? name.slice(0, 28) + '…' : name, colX[1], y + 5);

      // Credits
      font('bold', 7);
      doc.setTextColor(60, 60, 60);
      doc.text(cr.toFixed(1), colX[2] + 8, y + 5, { align: 'center' });

      // Grade letter
      doc.setTextColor(99, 102, 241);
      doc.text(letter, colX[3] + 6, y + 5, { align: 'center' });

      // Grade points
      doc.setTextColor(60, 60, 60);
      doc.text(gr.toFixed(1), colX[4] + 6, y + 5, { align: 'center' });

      y += 7.5;
    });

    // Total row
    y += 1;
    doc.setFillColor(245, 245, 250);
    doc.rect(M, y, CW, 8, 'F');
    line(y);

    font('bold', 7);
    doc.setTextColor(10, 10, 10);
    doc.text('TOTAL', colX[1], y + 5.5);
    doc.text(`${totalCr.toFixed(1)} cr`, colX[2] + 8, y + 5.5, { align: 'center' });
    doc.text(totalCr > 0 ? (totalPts / totalCr).toFixed(2) : '—', colX[4] + 6, y + 5.5, { align: 'center' });
    y += 14;
  }

  // ═══════════════════════════════════════
  // PERFORMANCE STATS
  // ═══════════════════════════════════════

  checkPage(50);
  section('Performance Summary');

  const grades = options.subjects ? options.subjects.map(s => parseFloat(s.grade as string)).filter(g => !isNaN(g)) : [];
  const avg = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
  const high = grades.length > 0 ? Math.max(...grades) : 0;
  const low = grades.length > 0 ? Math.min(...grades) : 0;
  const totalCredits = options.subjects ? options.subjects.reduce((sum, s) => sum + (parseFloat(s.credits as string) || 0), 0) : 0;

  const getLetter = (g: number) => {
    if (g >= 10) return 'O';
    if (g >= 9) return 'A';
    if (g >= 8) return 'B+';
    if (g >= 7) return 'C+';
    if (g >= 6) return 'D';
    if (g >= 5) return 'E';
    return 'F';
  };

  const stats: [string, string, string][] = [
    ['SGPA', score.toFixed(2), 'Score'],
    ['Percentage', `${(pct || 0).toFixed(1)}%`, 'Performance'],
    ['Total Credits', totalCredits.toString(), 'Credits earned'],
    ['Subjects', grades.length.toString(), 'Completed'],
    ['Highest', `${getLetter(high)} (${high})`, 'Best grade'],
    ['Lowest', `${getLetter(low)} (${low})`, 'Needs focus'],
  ];

  const cardW = (CW - 8) / 3;
  const cardH = 14;

  stats.forEach(([label, value, sub], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const sx = M + col * (cardW + 4);
    const sy = y + row * (cardH + 4);

    // Card background
    doc.setFillColor(250, 250, 252);
    doc.roundedRect(sx, sy, cardW, cardH, 2, 2, 'F');

    // Accent dot
    doc.setFillColor(99, 102, 241);
    doc.circle(sx + 4, sy + 4, 1, 'F');

    // Label
    font('normal', 5.5);
    doc.setTextColor(140, 140, 140);
    doc.text(label.toUpperCase(), sx + 7, sy + 4.5);

    // Value
    font('bold', 12);
    doc.setTextColor(10, 10, 10);
    doc.text(value, sx + 4, sy + 12);

    // Sub text
    font('normal', 5);
    doc.setTextColor(170, 170, 170);
    doc.text(sub, sx + cardW - 3, sy + 12, { align: 'right' });
  });

  y += 36;

  // ═══════════════════════════════════════
  // GRADE SCALE REFERENCE
  // ═══════════════════════════════════════

  checkPage(60);
  section('Grade Scale Reference');

  const scale: [string, string, string][] = [
    ['O / S / A+ (Outstanding)', '10', '9.5 – 10.0'],
    ['A (Excellent)', '9', '8.5 – 9.49'],
    ['B+ / B (Very Good)', '8', '7.5 – 8.49'],
    ['C+ / C (Good)', '7', '6.5 – 7.49'],
    ['D (Above Average)', '6', '5.5 – 6.49'],
    ['E (Average)', '5', '4.5 – 5.49'],
    ['F (Fail)', '0', 'Below 4.5'],
  ];

  // Header
  doc.setFillColor(248, 248, 252);
  doc.rect(M, y, CW, 6, 'F');
  font('bold', 5.5);
  doc.setTextColor(100, 100, 100);
  doc.text('GRADE', M + 4, y + 4.5);
  doc.text('POINTS', M + 65, y + 4.5);
  doc.text('RANGE', M + 100, y + 4.5);
  y += 7;

  scale.forEach(([grade, pts, range], i) => {
    if (i % 2 === 0) {
      doc.setFillColor(252, 252, 254);
      doc.rect(M, y, CW, 6, 'F');
    }
    font('normal', 6);
    doc.setTextColor(50, 50, 50);
    doc.text(grade, M + 4, y + 4.5);
    doc.setTextColor(99, 102, 241);
    doc.text(pts, M + 65, y + 4.5);
    doc.setTextColor(120, 120, 120);
    doc.text(range, M + 100, y + 4.5);
    y += 6;
  });

  y += 8;

  // ═══════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);

    // Bottom divider
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.2);
    doc.line(M, H - 16, M + CW, H - 16);

    // Footer text
    font('normal', 6);
    doc.setTextColor(170, 170, 170);
    doc.text('Generated by CGPA Calculator — Free for students', M, H - 12);

    // Page number
    doc.text(`${i} / ${pages}`, M + CW, H - 12, { align: 'right' });

    // Top accent bar on every page
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, W, 1.5, 'F');
  }

  // Save
  doc.save(`SGPA-Report-${score.toFixed(2)}-${Date.now()}.pdf`);
}
