import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  category?: string;
  title?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ category, title }) => {
  return (
    <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6 lg:mb-8 dark:text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none">
      <Link
        to="/"
        className="hover:text-slate-700 dark:hover:text-white transition-colors shrink-0"
      >
        首页
      </Link>
      <ChevronRight size={12} />
      <span className="text-slate-600 dark:text-slate-300 shrink-0">
        {category || 'Wiki'}
      </span>
      <ChevronRight size={12} />
      <span className="text-slate-900 dark:text-white truncate">
        {title}
      </span>
    </nav>
  );
};
