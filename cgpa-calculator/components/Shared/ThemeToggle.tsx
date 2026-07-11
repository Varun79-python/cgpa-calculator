import { useThemeStore } from '@/store/useStore';

const THEME_META: Record<string, { icon: string; label: string; title: string }> = {
  light: { icon: 'fa-sun',     label: 'Light', title: 'Light mode' },
  dark:  { icon: 'fa-moon',    label: 'Dark',  title: 'Dark mode' },
  black: { icon: 'fa-circle',  label: 'Black', title: 'Black mode (OLED)' },
  white: { icon: 'fa-circle',  label: 'White', title: 'White mode (high contrast)' },
};

export default function ThemeToggle() {
  const theme = useThemeStore(s => s.theme);
  const cycleTheme = useThemeStore(s => s.cycleTheme);
  const meta = THEME_META[theme] || THEME_META.light;

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-2 px-3 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-mid)] hover:text-[var(--ink)] text-sm"
      title={meta.title}
      aria-label={`Switch theme — currently ${meta.label}`}
    >
      <i className={`fa-solid ${meta.icon}`} />
      <span className="hidden sm:inline text-xs">{meta.label}</span>
    </button>
  );
}
