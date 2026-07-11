import Head from 'next/head';
import { useState, useCallback, useRef } from 'react';
import Header from '@/components/Responsive/Header';
import Footer from '@/components/Responsive/Footer';
import Tabs from '@/components/Responsive/Tabs';
import HistorySidebar from '@/components/Responsive/HistorySidebar';
import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';
import { showToast } from '@/components/Shared/Toast';

type ReportCategory = 'bug' | 'improvement' | 'suggestion' | 'other';
type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

interface ReportForm {
  name: string;
  email: string;
  category: ReportCategory;
  priority: ReportPriority;
  subject: string;
  description: string;
  steps: string;
  expected: string;
  actual: string;
  screenshot: string | null;
  screenshotName: string | null;
}

const CATEGORIES: { value: ReportCategory; label: string; icon: string; color: string; desc: string }[] = [
  { value: 'bug', label: 'Bug Report', icon: 'fa-solid fa-bug', color: '#EF4444', desc: 'Something is broken or not working' },
  { value: 'improvement', label: 'Improvement', icon: 'fa-solid fa-arrow-up-right-dots', color: '#3B82F6', desc: 'Enhance an existing feature' },
  { value: 'suggestion', label: 'New Feature', icon: 'fa-solid fa-lightbulb', color: '#8B5CF6', desc: 'Suggest something new' },
  { value: 'other', label: 'Other', icon: 'fa-solid fa-comment', color: '#6B7280', desc: 'General feedback or question' },
];

const PRIORITIES: { value: ReportPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#10B981' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'high', label: 'High', color: '#F97316' },
  { value: 'critical', label: 'Critical', color: '#EF4444' },
];

export default function ReportBugPage() {
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ReportForm>({
    name: '',
    email: '',
    category: 'bug',
    priority: 'medium',
    subject: '',
    description: '',
    steps: '',
    expected: '',
    actual: '',
    screenshot: null,
    screenshotName: null,
  });

  const [dragOver, setDragOver] = useState(false);
  const [sending, setSending] = useState(false);

  const updateField = useCallback((field: keyof ReportForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleScreenshot = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Only images are supported', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm(prev => ({
        ...prev,
        screenshot: e.target?.result as string,
        screenshotName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const removeScreenshot = useCallback(() => {
    setForm(prev => ({ ...prev, screenshot: null, screenshotName: null }));
    if (fileRef.current) fileRef.current.value = '';
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!form.subject.trim()) {
      showToast('Please enter a subject', 'error');
      return;
    }
    if (!form.description.trim()) {
      showToast('Please describe the issue', 'error');
      return;
    }

    setSending(true);

    try {
      const catMeta = CATEGORIES.find(c => c.value === form.category);
      const priMeta = PRIORITIES.find(p => p.value === form.priority);

      const body = [
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `  CGPA Calculator — ${catMeta?.label || form.category}`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ``,
        `📌 Category: ${catMeta?.label || form.category}`,
        `🔴 Priority: ${priMeta?.label || form.priority}`,
        `🎓 Degree: ${label}`,
        ``,
        `👤 Reporter: ${form.name || 'Anonymous'}`,
        `📧 Email: ${form.email || 'Not provided'}`,
        ``,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `  ISSUE DETAILS`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ``,
        `📋 Subject: ${form.subject}`,
        ``,
        `📝 Description:`,
        form.description,
        ``,
      ];

      if (form.category === 'bug') {
        if (form.steps) {
          body.push(`🔄 Steps to Reproduce:`, form.steps, ``);
        }
        if (form.expected) {
          body.push(`✅ Expected Behavior:`, form.expected, ``);
        }
        if (form.actual) {
          body.push(`❌ Actual Behavior:`, form.actual, ``);
        }
      }

      if (form.screenshotName) {
        body.push(`📸 Screenshot: ${form.screenshotName}`, `(See attached image)`, ``);
      }

      body.push(
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `  SYSTEM INFO`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ``,
        `🖥️ Browser: ${typeof navigator !== 'undefined' ? navigator.userAgent.split(' ').slice(-1)[0] : 'Unknown'}`,
        `📱 Screen: ${typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown'}`,
        `🕐 Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
        ``,
        `Sent from CGPA Calculator v4.0.0`,
      );

      const subject = `[${catMeta?.label || 'Report'}] ${form.subject}`;
      const mailtoBody = body.join('\n');
      const mailtoUrl = `mailto:supplecostadmin@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

      // Try to use EmailJS-like approach via form submission
      // For direct email, we open mailto as fallback
      window.open(mailtoUrl, '_blank');

      showToast('Opening your email client...', 'success');

      // Reset form after a delay
      setTimeout(() => {
        setForm({
          name: '',
          email: '',
          category: 'bug',
          priority: 'medium',
          subject: '',
          description: '',
          steps: '',
          expected: '',
          actual: '',
          screenshot: null,
          screenshotName: null,
        });
        if (fileRef.current) fileRef.current.value = '';
      }, 1000);

    } catch (err) {
      showToast('Failed to open email client. Please email supplecostadmin@gmail.com directly.', 'error');
    } finally {
      setSending(false);
    }
  }, [form, label]);

  const selectedCat = CATEGORIES.find(c => c.value === form.category);

  return (
    <>
      <Head>
        <title>Report a Bug — {label} CGPA Calculator</title>
        <meta name="description" content="Report bugs, suggest improvements, or contact the admin team for the CGPA Calculator." />
      </Head>

      <div className="app">
        <Header />
        <Tabs />

        <main id="main-content" style={{ maxWidth: '720px', margin: '0 auto', padding: 'var(--sp-5)' }}>
          {/* Hero Section */}
          <div style={{
            textAlign: 'center',
            padding: 'var(--sp-8) var(--sp-4)',
            background: 'linear-gradient(135deg, var(--ink) 0%, var(--ink-2) 100%)',
            borderRadius: 'var(--radius-xl)',
            color: 'var(--surface)',
            marginBottom: 'var(--sp-6)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 30% 50%, rgba(99,102,241,0.3) 0%, transparent 50%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '56px', height: '56px',
                margin: '0 auto var(--sp-4)',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--text-xl)',
                backdropFilter: 'blur(8px)',
              }}>
                <i className="fa-solid fa-bug" />
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: 'var(--sp-2)',
              }}>
                Report a Bug
              </h1>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '400px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}>
                Found something wrong? Help us fix it. Your report goes directly to our admin team.
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div style={{
            display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap',
            marginBottom: 'var(--sp-6)',
          }}>
            <div style={{
              flex: 1, minWidth: '200px',
              padding: 'var(--sp-4)',
              background: 'var(--surface-2)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                background: 'var(--accent)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <i className="fa-solid fa-envelope" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)' }}>Email Admin</div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)' }}>supplecostadmin@gmail.com</div>
              </div>
            </div>
            <div style={{
              flex: 1, minWidth: '200px',
              padding: 'var(--sp-4)',
              background: 'var(--surface-2)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                background: '#10B981', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <i className="fa-solid fa-clock" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)' }}>Response Time</div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)' }}>Usually within 24 hours</div>
              </div>
            </div>
          </div>

          {/* Category Selector */}
          <div style={{ marginBottom: 'var(--sp-6)' }}>
            <label style={{
              display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: 'var(--ink-4)', marginBottom: 'var(--sp-3)',
            }}>
              What are you reporting?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-2)' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => updateField('category', cat.value)}
                  style={{
                    padding: 'var(--sp-4)',
                    background: form.category === cat.value ? 'var(--surface)' : 'var(--surface-2)',
                    border: `2px solid ${form.category === cat.value ? cat.color : 'var(--border-solid)'}`,
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                >
                  {form.category === cat.value && (
                    <div style={{
                      position: 'absolute', top: '8px', right: '8px',
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: cat.color, color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.6rem',
                    }}>
                      <i className="fa-solid fa-check" />
                    </div>
                  )}
                  <div style={{
                    width: '32px', height: '32px', borderRadius: 'var(--radius-md)',
                    background: `${cat.color}15`, color: cat.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-2)',
                  }}>
                    <i className={cat.icon} />
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>
                    {cat.label}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--ink-4)', lineHeight: 1.4 }}>
                    {cat.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
            {/* Name & Email Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-4)', marginBottom: 'var(--sp-2)' }}>
                  Your Name <span style={{ color: 'var(--ink-5)' }}>(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="input"
                  style={{ height: '40px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-4)', marginBottom: 'var(--sp-2)' }}>
                  Your Email <span style={{ color: 'var(--ink-5)' }}>(optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="input"
                  style={{ height: '40px' }}
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-4)', marginBottom: 'var(--sp-2)' }}>
                Priority
              </label>
              <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                {PRIORITIES.map(pri => (
                  <button
                    key={pri.value}
                    onClick={() => updateField('priority', pri.value)}
                    style={{
                      flex: 1,
                      padding: 'var(--sp-2) var(--sp-3)',
                      background: form.priority === pri.value ? pri.color : 'var(--surface-2)',
                      color: form.priority === pri.value ? 'white' : 'var(--ink-3)',
                      border: `1px solid ${form.priority === pri.value ? pri.color : 'var(--border-solid)'}`,
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-2xs)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {pri.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-4)', marginBottom: 'var(--sp-2)' }}>
                Subject *
              </label>
              <input
                type="text"
                placeholder="Brief summary of the issue..."
                value={form.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                className="input"
                style={{ height: '40px' }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-4)', marginBottom: 'var(--sp-2)' }}>
                Description *
              </label>
              <textarea
                placeholder="Describe the issue in detail. What happened? What did you expect?"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                style={{
                  width: '100%', minHeight: '120px',
                  padding: 'var(--sp-3)',
                  border: '1px solid var(--border-solid)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-sm)',
                  resize: 'vertical',
                  outline: 'none',
                  lineHeight: 1.6,
                }}
              />
            </div>

            {/* Bug-specific fields */}
            {form.category === 'bug' && (
              <div style={{
                padding: 'var(--sp-4)',
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-solid)',
              }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                  <i className="fa-solid fa-circle-info" style={{ color: 'var(--accent)' }} />
                  Bug Details (helps us fix faster)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--ink-4)', marginBottom: 'var(--sp-1)' }}>
                      Steps to Reproduce
                    </label>
                    <textarea
                      placeholder={"1. Go to SGPA Calculator\n2. Enter invalid grade\n3. Click Calculate\n4. See error..."}
                      value={form.steps}
                      onChange={(e) => updateField('steps', e.target.value)}
                      style={{
                        width: '100%', minHeight: '80px',
                        padding: 'var(--sp-3)',
                        border: '1px solid var(--border-solid)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--surface)',
                        color: 'var(--ink)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-2xs)',
                        resize: 'vertical',
                        outline: 'none',
                        lineHeight: 1.6,
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--ink-4)', marginBottom: 'var(--sp-1)' }}>
                        Expected Behavior
                      </label>
                      <textarea
                        placeholder="What should happen?"
                        value={form.expected}
                        onChange={(e) => updateField('expected', e.target.value)}
                        style={{
                          width: '100%', minHeight: '60px',
                          padding: 'var(--sp-2)',
                          border: '1px solid var(--border-solid)',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--surface)',
                          color: 'var(--ink)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: 'var(--text-2xs)',
                          resize: 'vertical',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--ink-4)', marginBottom: 'var(--sp-1)' }}>
                        Actual Behavior
                      </label>
                      <textarea
                        placeholder="What actually happens?"
                        value={form.actual}
                        onChange={(e) => updateField('actual', e.target.value)}
                        style={{
                          width: '100%', minHeight: '60px',
                          padding: 'var(--sp-2)',
                          border: '1px solid var(--border-solid)',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--surface)',
                          color: 'var(--ink)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: 'var(--text-2xs)',
                          resize: 'vertical',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Screenshot Upload */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-4)', marginBottom: 'var(--sp-2)' }}>
                Screenshot <span style={{ color: 'var(--ink-5)' }}>(optional)</span>
              </label>

              {form.screenshot ? (
                <div style={{
                  position: 'relative',
                  border: '1px solid var(--border-solid)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                }}>
                  <img
                    src={form.screenshot}
                    alt="Screenshot preview"
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      background: 'var(--surface-2)',
                      display: 'block',
                    }}
                  />
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: 'var(--sp-2) var(--sp-3)',
                    background: 'var(--surface-2)',
                  }}>
                    <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {form.screenshotName}
                    </span>
                    <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
                      <button
                        className="btn btn-sm"
                        onClick={() => fileRef.current?.click()}
                      >
                        <i className="fa-solid fa-arrows-rotate" /> Replace
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={removeScreenshot}
                        style={{ color: 'var(--grade-d)' }}
                      >
                        <i className="fa-solid fa-trash" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                  style={{ padding: 'var(--sp-6) var(--sp-4)' }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleScreenshot(file);
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleScreenshot(file);
                    }}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-icon" style={{ width: '48px', height: '48px' }}>
                    <i className="fa-solid fa-cloud-arrow-up" />
                  </div>
                  <div className="upload-text" style={{ fontSize: 'var(--text-sm)' }}>
                    Drop a screenshot here
                  </div>
                  <div className="upload-hint">
                    or click to browse · JPG, PNG up to 5MB
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div style={{
            padding: 'var(--sp-5)',
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-solid)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
              marginBottom: 'var(--sp-4)',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                background: selectedCat?.color ? `${selectedCat.color}15` : 'var(--surface-3)',
                color: selectedCat?.color || 'var(--ink-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <i className={selectedCat?.icon || 'fa-solid fa-paper-plane'} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)' }}>
                  Ready to send?
                </div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)' }}>
                  Your email client will open with a pre-filled report
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={sending}
              style={{
                width: '100%',
                height: '48px',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
                cursor: sending ? 'not-allowed' : 'pointer',
                opacity: sending ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--sp-2)',
                transition: 'all 0.15s ease',
              }}
            >
              {sending ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" />
                  Preparing Report...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane" />
                  Send Report to Admin
                </>
              )}
            </button>

            <div style={{
              textAlign: 'center',
              marginTop: 'var(--sp-3)',
              fontSize: 'var(--text-2xs)',
              color: 'var(--ink-5)',
            }}>
              Reports are sent to <strong>supplecostadmin@gmail.com</strong>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <HistorySidebar />
    </>
  );
}
