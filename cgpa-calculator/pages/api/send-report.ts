import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

type ReportPayload = {
  name: string;
  email: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
  steps: string;
  expected: string;
  actual: string;
  screenshotName: string | null;
  browser: string;
  screen: string;
  time: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  bug: 'Bug Report',
  improvement: 'Improvement',
  suggestion: 'New Feature',
  other: 'Other',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { subject, description } = req.body;
  if (!subject?.trim() || !description?.trim()) {
    return res.status(400).json({ success: false, error: 'Subject and description are required' });
  }

  const data = req.body as ReportPayload;
  const catLabel = CATEGORY_LABELS[data.category] || 'Report';

  const bodyLines = [
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `  CGPA Calculator — ${catLabel}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `📌 Category: ${catLabel}`,
    `🔴 Priority: ${(data.priority || 'medium').toUpperCase()}`,
    ``,
    `👤 Reporter: ${data.name || 'Anonymous'}`,
    `📧 Email: ${data.email || 'Not provided'}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `  ISSUE DETAILS`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `📋 Subject: ${data.subject}`,
    ``,
    `📝 Description:`,
    data.description,
    ``,
  ];

  if (data.category === 'bug') {
    if (data.steps) bodyLines.push(`🔄 Steps to Reproduce:`, data.steps, ``);
    if (data.expected) bodyLines.push(`✅ Expected Behavior:`, data.expected, ``);
    if (data.actual) bodyLines.push(`❌ Actual Behavior:`, data.actual, ``);
  }

  if (data.screenshotName) {
    bodyLines.push(`📸 Screenshot: ${data.screenshotName}`, `(Contact reporter for the image)`, ``);
  }

  bodyLines.push(
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `  SYSTEM INFO`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `🖥️  Browser: ${data.browser || 'Unknown'}`,
    `📱 Screen: ${data.screen || 'Unknown'}`,
    `🕐 Time: ${data.time || 'Unknown'}`,
    ``,
    `Sent from CGPA Calculator v4.0.0`,
  );

  const emailBody = bodyLines.join('\n');

  // Send via Resend if API key is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'CGPA Calculator <onboarding@resend.dev>',
        to: 'supplecostadmin@gmail.com',
        replyTo: data.email || undefined,
        subject: `[${catLabel}] ${data.subject}`,
        text: emailBody,
      });

      return res.status(200).json({ success: true, sent: true });
    } catch (err: any) {
      console.error('Resend send failed:', err);
      return res.status(200).json({
        success: true,
        sent: false,
        fallback: true,
        error: 'Email service error. Report logged.',
      });
    }
  }

  // No API key configured
  return res.status(200).json({
    success: true,
    sent: false,
    fallback: true,
    error: 'Resend API key not configured. Set RESEND_API_KEY env var.',
  });
}
