
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Book } from 'lucide-react';
import { search as doSearch, SearchResult } from '../services/searchEngine';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!isOpen) return;
    
    const id = setTimeout(() => {
      if (query.trim() === '') {
        setResults([]);
        setTotal(0);
        return;
      }
      const r = doSearch(query, page, pageSize);
      setResults(r.results);
      setTotal(r.total);
    }, 150);
    return () => clearTimeout(id);
  }, [query, page, isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-start justify-center pt-2 sm:pt-20 px-2 sm:px-4 bg-slate-900/60 backdrop-blur-sm dark:bg-black/80"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 dark:bg-slate-900 dark:border dark:border-slate-800 flex flex-col max-h-[85vh] sm:max-h-[70vh]" onClick={e => e.stopPropagation()}>
        <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center gap-3 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <Search className="text-slate-400 flex-shrink-0" size={18} />
          <input 
            autoFocus
            type="text" 
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            placeholder="搜索文档..." 
            className="flex-1 outline-none text-sm sm:text-lg text-slate-900 placeholder:text-slate-300 bg-transparent dark:text-white dark:placeholder:text-slate-600 min-w-0"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 flex-shrink-0">
            <X size={18} />
          </button>
        </div>
        <div className="p-2 sm:p-4 overflow-y-auto flex-1">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-slate-400">
              <div className="mb-3"><Book size={32} className="mx-auto opacity-20" /></div>
              <p className="text-sm font-medium">请输入关键词开始搜索</p>
            </div>
          ) : (
            <>
              <ul className="space-y-2 sm:space-y-3">
                {results.map(r => (
                  <li key={r.slug} className="p-2.5 sm:p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors dark:border-slate-800 dark:hover:bg-slate-800">
                    <Link 
                      to={`/wiki/${r.slug}`} 
                      onClick={onClose}
                      className="font-black text-sm sm:text-base text-slate-900 dark:text-white block mb-1"
                    >
                      {r.title}
                    </Link>
                    <div className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2" dangerouslySetInnerHTML={{ __html: r.snippet }} />
                  </li>
                ))}
                {results.length === 0 && (
                  <li className="py-12 text-center text-slate-400 font-medium">无匹配结果</li>
                )}
              </ul>
              <div className="mt-4 sm:mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="text-[9px] sm:text-xs text-slate-500 uppercase tracking-widest font-black">共 {total} 条</div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button 
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-2.5 py-1.5 text-[9px] sm:text-xs font-black rounded-lg border border-slate-200 disabled:opacity-30 dark:border-slate-800 dark:text-slate-400 transition-all active:scale-95"
                  >
                    上一页
                  </button>
                  <button 
                    disabled={page * pageSize >= total}
                    onClick={() => setPage(p => p + 1)}
                    className="px-2.5 py-1.5 text-[9px] sm:text-xs font-black rounded-lg border border-slate-200 disabled:opacity-30 dark:border-slate-800 dark:text-slate-400 transition-all active:scale-95"
                  >
                    下一页
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
