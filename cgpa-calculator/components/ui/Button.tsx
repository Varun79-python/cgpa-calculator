import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  loading?: boolean;
  children?: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'btn inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 min-h-[44px] select-none',
        {
          'bg-[var(--ink)] text-[var(--bg)] border border-[var(--ink)] hover:opacity-85': variant === 'primary',
          'bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)] hover:bg-[var(--surface2)]': variant === 'secondary',
          'bg-transparent text-[var(--ink-mid)] border border-transparent hover:text-[var(--ink)]': variant === 'ghost',
          'bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30': variant === 'danger',
          'px-4 py-2 text-sm': size === 'sm',
          'px-5 py-3 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
          'opacity-50 cursor-not-allowed': disabled || loading,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <i className="fa-solid fa-spinner fa-spin" />
      ) : icon ? (
        <i className={`fa-solid fa-${icon}`} />
      ) : null}
      {children}
    </button>
  );
}
