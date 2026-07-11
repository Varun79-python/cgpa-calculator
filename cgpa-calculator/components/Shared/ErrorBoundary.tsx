import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
          fontFamily: 'var(--font-sans)',
          padding: '20px',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 20px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--red-soft, #FEE2E2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--red, #DC2626)' }} />
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--ink-3, #71717A)', marginBottom: '20px', lineHeight: 1.6 }}>
              An unexpected error occurred. Your data is saved locally and won't be lost.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 20px',
                  background: 'var(--accent, #6366F1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md, 8px)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '10px 20px',
                  background: 'var(--surface, #fff)',
                  color: 'var(--ink, #0A0A0A)',
                  border: '1px solid var(--border-solid, #E5E5E5)',
                  borderRadius: 'var(--radius-md, 8px)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Go Home
              </button>
            </div>
            {this.state.error && (
              <details style={{ marginTop: '16px', textAlign: 'left' }}>
                <summary style={{ fontSize: '12px', color: 'var(--ink-4, #A1A1AA)', cursor: 'pointer' }}>
                  Error details
                </summary>
                <pre style={{
                  marginTop: '8px',
                  padding: '12px',
                  background: 'var(--surface-2, #F5F5F5)',
                  borderRadius: 'var(--radius-md, 8px)',
                  fontSize: '11px',
                  color: 'var(--ink-3, #71717A)',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                }}>
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
