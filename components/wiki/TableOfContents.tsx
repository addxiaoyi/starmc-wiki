import React from 'react';
import { List, History } from 'lucide-react';
import { TocItem } from '../../types';

interface TableOfContentsProps {
  toc: TocItem[];
  activeId: string;
  onSelect: (id: string) => void;
  lastUpdated?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  toc,
  activeId,
  onSelect,
  lastUpdated,
}) => {
  if (toc.length === 0) return null;

  return (
    <aside className="hidden lg:block w-64 sticky top-24 shrink-0">
      <div className="pl-6 border-l border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm mb-6">
          <List size={18} className="text-indigo-500" />
          本页目录 / TOC
        </div>
        <ul className="space-y-1">
          {toc.map((item, i) => (
            <li key={i} className={item.level === 3 ? 'ml-4' : ''}>
              <a
                href={`#${item.id}`}
                className={`block py-1.5 text-sm font-bold transition-all border-l-2 -ml-[2px] pl-4 ${
                  activeId === item.id
                    ? 'text-indigo-600 border-indigo-500 dark:text-indigo-400'
                    : 'text-slate-400 border-transparent hover:text-slate-600 hover:border-slate-200 dark:text-slate-500 dark:hover:text-slate-400'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(item.id);
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>

        {lastUpdated && (
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-slate-400 dark:text-slate-600">
                <History size={16} />
                <span className="text-[10px] font-mono uppercase tracking-widest">页面历史</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                文档更新于 {lastUpdated}。如发现错误，欢迎点击上方编辑按钮提交修改。
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
