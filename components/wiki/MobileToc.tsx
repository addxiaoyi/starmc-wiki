import React from 'react';
import { ChevronRight, List } from 'lucide-react';
import { TocItem } from '../../types';

interface MobileTocProps {
  toc: TocItem[];
  activeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export const MobileToc: React.FC<MobileTocProps> = ({
  toc,
  activeId,
  isOpen,
  onClose,
  onSelect,
}) => {
  if (toc.length === 0) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-950/95 rounded-t-[2.5rem] p-8 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 border-t border-slate-200 dark:border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-900 dark:text-white flex items-center gap-2">
                <List size={20} className="text-slate-500" />
                目录 / Contents
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
                <ChevronRight size={24} className="rotate-90" />
              </button>
            </div>
            <ul className="space-y-4">
              {toc.map((item, i) => (
                <li key={i} className={item.level === 3 ? 'ml-6' : ''}>
                  <a
                    href={`#${item.id}`}
                    className={`block text-base font-bold transition-all py-2 px-4 rounded-xl ${
                      activeId === item.id
                        ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/50'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelect(item.id);
                      onClose();
                    }}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
