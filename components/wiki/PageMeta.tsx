import React from 'react';
import { Calendar, Tag } from 'lucide-react';

interface BadgeSvgProps {
  tone: string;
}

const BadgeSvg: React.FC<BadgeSvgProps> = ({ tone }) => {
  const common = 'fill-none stroke-current stroke-[1.7]';
  switch (tone) {
    case 'cyan':
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 lg:h-5 lg:w-5" aria-hidden="true">
          <path className={common} d="M12 2l4 7h-8l4-7Z" />
          <path className={common} d="M5 10h14l-2 10H7L5 10Z" />
        </svg>
      );
    case 'emerald':
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 lg:h-5 lg:w-5" aria-hidden="true">
          <path className={common} d="M4 15c2-6 6-9 8-9s6 3 8 9" />
          <path className={common} d="M6 15h12v5H6z" />
        </svg>
      );
    case 'indigo':
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 lg:h-5 lg:w-5" aria-hidden="true">
          <circle className={common} cx="12" cy="12" r="8" />
          <path className={common} d="M8 12h8M12 8v8" />
        </svg>
      );
    case 'slate':
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 lg:h-5 lg:w-5" aria-hidden="true">
          <rect className={common} x="5" y="4" width="14" height="16" rx="2" />
          <path className={common} d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 lg:h-5 lg:w-5" aria-hidden="true">
          <path className={common} d="M4 7h16v10H4z" />
          <path className={common} d="M8 7V4h8v3" />
        </svg>
      );
  }
};

interface PageMetaProps {
  lastUpdated?: string;
  category?: string;
  pageBadge?: string;
  badgeTone?: string;
}

export const PageMeta: React.FC<PageMetaProps> = ({
  lastUpdated = '2026-02-10',
  category = '文档',
  pageBadge = 'W',
  badgeTone = 'blue',
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-[10px] lg:text-xs text-slate-400 mb-4 dark:text-slate-500">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-full dark:bg-slate-950 dark:border-slate-800">
        <Calendar size={12} />
        <span className="whitespace-nowrap">{lastUpdated}</span>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-full dark:bg-slate-950 dark:border-slate-800">
        <Tag size={12} />
        <span className="whitespace-nowrap">{category}</span>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-full dark:bg-slate-950 dark:border-slate-800">
        <BadgeSvg tone={badgeTone} />
        <span className="text-sm font-semibold tracking-wider">{pageBadge}</span>
      </div>
    </div>
  );
};
