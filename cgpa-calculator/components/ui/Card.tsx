import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'glow';
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({
  children,
  className,
  variant = 'default',
  onClick,
  hover = false,
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border transition-all duration-200',
        {
          'bg-[var(--surface)] border-[var(--border)]': variant === 'default',
          'bg-[var(--surface)]/60 backdrop-blur-xl border-[var(--border)]': variant === 'glass',
          'bg-[var(--surface)] border-[var(--violet)]/30 shadow-lg shadow-[var(--violet)]/5': variant === 'glow',
          'cursor-pointer hover:border-[var(--violet)]/40 hover:shadow-lg hover:shadow-[var(--violet)]/5': hover,
        },
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {children}
    </div>
  );
}
