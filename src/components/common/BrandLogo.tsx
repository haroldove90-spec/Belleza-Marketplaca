import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<Props> = ({ size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-16 h-16 text-xl',
  };

  const titleSizes = {
    sm: 'text-sm font-bold tracking-tight',
    md: 'text-base font-bold tracking-tight',
    lg: 'text-2xl font-extrabold tracking-tight',
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className={`${iconSizes[size]} rounded-2xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-600 flex items-center justify-center text-white shadow-md shadow-rose-950/10 shrink-0 relative overflow-hidden`}
      >
        <span className="font-serif font-black tracking-tighter">MB</span>
        <Sparkles className="w-3 h-3 absolute top-1 right-1 text-amber-300 opacity-90" />
      </div>
      <div>
        <div className={`text-slate-900 leading-tight ${titleSizes[size]}`}>
          Marketplace <span className="text-rose-600">Belleza</span>
        </div>
        {showSubtitle && (
          <div className="text-[10px] uppercase font-semibold tracking-widest text-slate-400">
            Cosmética &amp; Salón Pro
          </div>
        )}
      </div>
    </div>
  );
};
