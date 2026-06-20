import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, hoverable = false, className = '', ...props }) => {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl transition-all duration-300
        ${hoverable ? 'hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-emerald-500/5 hover:bg-slate-900/80' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Decorative gradient corner light */}
      <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
