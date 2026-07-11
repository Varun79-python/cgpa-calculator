interface AnimatedNumberProps {
  value?: number;
  decimals?: number;
  fontSize?: string;
  color?: string;
}

export default function AnimatedNumber({
  value = 0,
  decimals = 2,
  fontSize = '2.8rem',
}: AnimatedNumberProps) {
  return (
    <span
      style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize,
        fontWeight: 700,
        color: 'inherit',
        letterSpacing: '-0.03em',
        lineHeight: 1,
        display: 'inline-block',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {value.toFixed(decimals)}
    </span>
  );
}

export function AnimatedPercentage({ value = 0, decimals = 2 }: { value?: number; decimals?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2 }}>
      <AnimatedNumber value={value} decimals={decimals} fontSize="1.1rem" />
      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>%</span>
    </span>
  );
}
