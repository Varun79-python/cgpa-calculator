import { ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function TiltCard({
  children,
  className = '',
  style = {},
}: TiltCardProps) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
