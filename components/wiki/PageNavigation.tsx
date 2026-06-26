import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface NavLink {
  title: string;
  path: string;
}

interface PageNavigationProps {
  prev: NavLink | null;
  next: NavLink | null;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({ prev, next }) => {
  if (!prev && !next) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
      {prev ? (
        <Link
          to={prev.path}
          data-nav="prev"
          rel="prev"
          className="flex flex-col gap-2 p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-500 hover:shadow-md transition-all dark:bg-slate-900/50 dark:border-slate-800"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">上一篇</span>
          <span className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowLeft size={20} />
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next && (
        <Link
          to={next.path}
          data-nav="next"
          rel="next"
          className="flex flex-col gap-2 p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-500 hover:shadow-md transition-all items-end text-right dark:bg-slate-900/50 dark:border-slate-800"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">下一篇</span>
          <span className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            {next.title}
            <ChevronRight size={20} />
          </span>
        </Link>
      )}
    </div>
  );
};
