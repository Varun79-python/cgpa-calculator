import { useThemeStore } from '@/store/useStore';

const THEMES: Record<string, { icon: string; label: string }> = {
  light:  { icon: 'fa-sun',      label: 'Light' },
  dark:   { icon: 'fa-moon',     label: 'Dark' },
  system: { icon: 'fa-desktop',  label: 'System' },
};

export default function ThemeToggle() {
  const theme = useThemeStore(s => s.theme);
  const cycleTheme = useThemeStore(s => s.cycleTheme);
  const meta = THEMES[theme] || THEMES.light;

  return (
    <button
      className="icon-btn"
      onClick={cycleTheme}
      title={`Theme: ${meta.label}`}
      aria-label={`Switch theme — currently ${meta.label}`}
    >
      <i className={`fa-solid ${meta.icon}`} />
    </button>
  );
}
