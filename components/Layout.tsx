import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Github as GithubIcon, Terminal, ChevronRight, ExternalLink as ExternalLinkIcon, Moon, Sun } from 'lucide-react';
import { NAVIGATION, OFFICIAL_WEBSITE } from '../constants';

const SearchModal = lazy(() => import('./SearchModal'));

export const Header: React.FC<{
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
  isDark: boolean;
  toggleDark: (e: React.MouseEvent) => void;
}> = ({ onOpenSearch, onToggleSidebar, isDark, toggleDark }) => (
  <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
    <div className="mx-auto flex h-16 max-w-8xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={onToggleSidebar} className="rounded-lg p-2 -ml-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden" aria-label="打开目录">
          <Menu size={20} />
        </button>
        <Link to="/" className="flex min-w-0 items-center gap-1.5" onMouseEnter={() => import('../pages/Home')}>
          <div className="rounded-lg bg-slate-900 p-1.5 text-white dark:bg-white dark:text-slate-900"><Terminal size={18} /></div>
          <span className="truncate text-sm font-black dark:text-white">舵星归途</span>
        </Link>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={(e) => { e.preventDefault(); onOpenSearch(); }} className="hidden items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-600 transition-all active:scale-95 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-300 sm:inline-flex">
          <Search size={14} />
          <span className="text-xs font-semibold">搜索</span>
        </button>
        <button onClick={toggleDark} className="flex items-center justify-center rounded-lg bg-slate-100 p-2 text-slate-600 transition-all active:scale-90 dark:bg-slate-800 dark:text-slate-300" title="切换主题">
          {isDark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-blue-600" />}
        </button>
      </div>
      <button onClick={onOpenSearch} className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 lg:flex">
        <Search size={16} />
        <span className="truncate">搜索文档...</span>
        <kbd className="ml-2 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-sans text-xs dark:border-slate-700 dark:bg-slate-800">⌘K</kbd>
      </button>
      <div className="hidden h-6 w-px bg-slate-200 sm:block dark:bg-slate-800" />
      <a href={OFFICIAL_WEBSITE} target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white sm:flex">
        <ExternalLinkIcon size={14} />
        官网
      </a>
    </div>
  </header>
);

const NAV_STORAGE_KEY = 'starmc_sidebar_expanded_path';
const SECTION_STORAGE_KEY = 'starmc_sidebar_expanded_section';
const MAX_DEPTH = 6;

type NavNode = {
  title: string;
  path?: string;
  icon?: string;
  items?: NavNode[];
};

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void; onOpenSearch: () => void }> = ({ isOpen, onClose, onOpenSearch }) => {
  const location = useLocation();
  const [expandedPath, setExpandedPath] = useState<string[]>(() => {
    if (typeof globalThis.window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(NAV_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [expandedSection, setExpandedSection] = useState<string>(() => {
    if (typeof globalThis.window === 'undefined') return '';
    return localStorage.getItem(SECTION_STORAGE_KEY) || '';
  });

  useEffect(() => {
    try { localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(expandedPath)); } catch {}
  }, [expandedPath]);

  useEffect(() => {
    try { localStorage.setItem(SECTION_STORAGE_KEY, expandedSection); } catch {}
  }, [expandedSection]);

  useEffect(() => {
    const findAncestors = (items: NavNode[], ancestors: string[] = []): string[] | null => {
      for (const item of items) {
        const key = item.path || item.title;
        if (item.path === location.pathname) return ancestors;
        if (item.items?.length) {
          const found = findAncestors(item.items, [...ancestors, key]);
          if (found) return found;
        }
      }
      return null;
    };

    for (const section of NAVIGATION) {
      const ancestors = findAncestors((section.items || []) as NavNode[]);
      if (ancestors) {
        setExpandedSection(section.title);
        setExpandedPath(ancestors);
        return;
      }
    }
  }, [location.pathname]);

  const isPathActive = (itemPath?: string) => !!itemPath && (location.pathname === itemPath || location.pathname.startsWith(itemPath.replace(/\/$/, '')));

  const renderNavItems = (items: NavNode[], level = 0) => {
    if (level >= MAX_DEPTH) return null;

    return (
      <ul className={`${level > 0 ? 'ml-3 mt-2 border-l border-slate-200 pl-3 dark:border-slate-800' : 'space-y-1'}`}>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const hasChildren = !!item.items?.length;
          const key = item.path || item.title;
          const isExpanded = hasChildren ? expandedPath[level] === key : false;
          const isAncestorActive = hasChildren && (isPathActive(item.path) || item.items!.some((child) => isPathActive(child.path)));

          const handleToggle = () => {
            setExpandedPath((prev) => {
              const next = prev.slice(0, level);
              if (prev[level] === key) return next;
              next[level] = key;
              return next;
            });
          };

          return (
            <li key={key}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={handleToggle}
                  className={`group flex w-full items-center justify-between px-2 py-2 text-left text-sm transition-colors ${isExpanded || isAncestorActive ? 'font-semibold text-slate-950 dark:text-white' : 'font-medium text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'}`}
                >
                  <span className="flex items-center gap-2 leading-5">
                    {item.icon && <span className="text-base opacity-80">{item.icon}</span>}
                    {item.title}
                  </span>
                  <ChevronRight size={14} className={`shrink-0 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
                </button>
              ) : item.path ? (
                <Link
                  to={item.path}
                  onClick={() => globalThis.innerWidth < 1024 && onClose()}
                  onMouseEnter={() => { if (item.path.startsWith('/wiki/')) import('../pages/WikiPage'); }}
                  className={`block px-2 py-2 text-sm leading-5 transition-colors ${isActive ? 'font-semibold text-slate-950 dark:text-white' : 'font-medium text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'}`}
                >
                  <span className="flex items-center gap-2">
                    {item.icon && <span className="text-base opacity-80">{item.icon}</span>}
                    {item.title}
                  </span>
                </Link>
              ) : (
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{item.title}</div>
              )}
              {hasChildren && isExpanded && renderNavItems(item.items as NavNode[], level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      {isOpen && (
        <div role="button" tabIndex={0} className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden animate-in fade-in duration-300" onClick={onClose} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClose(); } }} aria-label="关闭菜单" />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[18rem] border-r border-slate-200 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block dark:border-slate-800 dark:bg-slate-950 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full overflow-y-auto px-4 py-6">
          <div className="mb-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">目录导航</span>
              <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"><X size={20} /></button>
            </div>
            <div className="text-xs leading-5 text-slate-500 dark:text-slate-400">点击目录展开，点击页面跳转。</div>
          </div>
          <nav className="space-y-5">
            {NAVIGATION.map((section) => {
              const isSectionExpanded = expandedSection === section.title;
              return (
                <div key={section.title} className="rounded-xl border border-slate-200 bg-slate-50/80 px-2 py-2 dark:border-slate-800 dark:bg-slate-900/30">
                  <button
                    type="button"
                    onClick={() => setExpandedSection((prev) => (prev === section.title ? '' : section.title))}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${isSectionExpanded ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-700 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-950 dark:hover:text-white'}`}
                  >
                    <span className="text-sm font-semibold tracking-wide">{section.title}</span>
                    <ChevronRight size={16} className={`text-slate-400 transition-transform duration-200 ${isSectionExpanded ? 'rotate-90' : ''}`} />
                  </button>
                  {isSectionExpanded && (
                    <div className="mt-2">
                      {renderNavItems(section.items as NavNode[])}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [showSyncNotify, setShowSyncNotify] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [isDark, setIsDark] = useState(() => {
    if (typeof globalThis.window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return false;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDark = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIsDark(!isDark); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); } if (e.key === 'Escape') setSearchOpen(false); };
    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSearchOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSearchOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      globalThis.dispatchEvent(new CustomEvent('sync-notify', { detail: `已同步 [${now}]` }));
    }, 1000);
    const handleSyncNotify = (e: any) => { setSyncMsg(e.detail || '已同步'); setShowSyncNotify(true); setTimeout(() => setShowSyncNotify(false), 2700); };
    globalThis.addEventListener('sync-notify', handleSyncNotify);
    return () => { globalThis.removeEventListener('sync-notify', handleSyncNotify); clearTimeout(timer); };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header onOpenSearch={() => setSearchOpen(true)} onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} isDark={isDark} toggleDark={toggleDark} />
      <div className="flex-1 flex flex-col lg:flex-row max-w-8xl mx-auto w-full relative">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} onOpenSearch={() => setSearchOpen(true)} />
        <main className="flex-1 min-w-0 bg-white dark:bg-slate-950">
          <div className="sticky top-16 z-30 flex items-center justify-between gap-3 border-b border-slate-100 bg-white/70 p-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/70 lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              <Menu size={18} />
              目录
            </button>
            <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
              <Search size={18} />
              搜索
            </button>
          </div>
          {children}
        </main>
      </div>
      <Suspense fallback={null}><SearchModal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} /></Suspense>
      {showSyncNotify && (
        <div className="pointer-events-none fixed top-4 right-4 z-[999] max-w-[calc(100vw-2rem)] sm:top-6 sm:right-6 sm:max-w-sm">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
            <div className="rounded-lg bg-blue-500 p-1.5 text-white"><GithubIcon size={16} /></div>
            <div className="min-w-0 flex flex-col">
              <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">{syncMsg || '同步成功'}</span>
              <span className="truncate text-[10px] text-slate-400 font-medium">{new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\//g, '-')}</span>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes sms-float {0% { opacity: 0; transform: translateY(-12px); } 12% { opacity: 1; transform: translateY(0); } 88% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-8px); }} .animate-sms-float { animation: sms-float 2.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }`}</style>
    </div>
  );
};
