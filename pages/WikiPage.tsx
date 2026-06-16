
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, Navigate, Link, useLocation } from 'react-router-dom';
import { ExternalLink as ExternalLinkIcon, Calendar, Tag, ChevronRight, ArrowLeft, Share2, Edit3, Loader2, Download, Layers, List, History, Upload } from 'lucide-react';
import { MOCK_PAGES, NAVIGATION } from '../constants';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { WikiPage as WikiPageType } from '../types';

const BadgeSvgBase: React.FC<{ tone: string }> = ({ tone }) => {
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

const BadgeSvg = React.memo(BadgeSvgBase);

const WikiPage: React.FC = () => {
  const { "*": slug } = useParams();
  const location = useLocation();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [meta, setMeta] = useState<Partial<WikiPageType>>({});

  const [isDragging, setIsDragging] = useState(false);

  const basePageInfo = MOCK_PAGES.find(p => p.slug === slug);

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.md')) {
      alert('仅支持 .md 格式的文档提交');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const submissions = JSON.parse(localStorage.getItem('wiki_pending_submissions') || '[]');
      const newSubmission = {
        id: Date.now(),
        filename: file.name,
        content: content,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('wiki_pending_submissions', JSON.stringify([...submissions, newSubmission]));
      alert('文档已提交！请等待管理员审核。');
    };
    reader.readAsText(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const [activeId, setActiveId] = useState<string>('');
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const isAdmin = useMemo(() => {
    const search = new URLSearchParams(location.search);
    return search.get('admin') === 'true' || localStorage.getItem('starmc_admin') === 'true';
  }, [location.search]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = (window.scrollY / totalHeight) * 100;
          setReadingProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parseMetadata = (text: string) => {
    const metaMatch = text.match(/<!--([\s\S]*?)-->/);
    if (!metaMatch) return { cleanContent: text, metadata: {} };

    const metaStr = metaMatch[1];
    const metadata: any = {};
    const lines = metaStr.split('\n');
    
    lines.forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim().toUpperCase();
        const value = parts.slice(1).join(':').trim();
        if (key === 'TITLE') metadata.title = value;
        if (key === 'CATEGORY') metadata.category = value;
        if (key === 'LAST_UPDATED') metadata.lastUpdated = value;
        if (key === 'PARENT') metadata.parent = value;
        if (key === 'ICON') metadata.icon = value;
      }
    });

    return {
      cleanContent: text.replace(metaMatch[0], '').trim(),
      metadata
    };
  };

  const toc = useMemo(() => {
    const headings = content.split('\n')
      .filter(line => line.startsWith('## ') || line.startsWith('### '))
      .map(line => {
        const level = line.startsWith('## ') ? 2 : 3;
        const text = line.replace(/^#+ /, '').trim();
        const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
        return { level, text, id };
      });
    return headings;
  }, [content]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries.filter(entry => entry.isIntersecting);
        if (visibleHeadings.length > 0) {
          const topHeading = visibleHeadings.sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top)[0];
          setActiveId(topHeading.target.id);
        }
      },
      { 
        rootMargin: '-80px 0% -80% 0%',
        threshold: 0
      }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observerRef.current!.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [toc]);

  useEffect(() => {
    const fetchContent = async () => {
      if (!slug) return;
      setLoading(true);
      setError(false);
      try {
        const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
        const response = await fetch(`${baseUrl}/content/wiki/${slug}.md?v=${Date.now()}`);

        if (!response.ok) {
          const fileName = slug.split('/').pop();
          const fallbackResponse = await fetch(`${baseUrl}/content/wiki/${fileName}.md?v=${Date.now()}`);

          if (!fallbackResponse.ok) {
            throw new Error(`Failed to load markdown: ${response.status}`);
          }

          const text = await fallbackResponse.text();
          const { cleanContent, metadata } = parseMetadata(text);
          setContent(cleanContent);
          setMeta(metadata);
        } else {
          const text = await response.text();
          const { cleanContent, metadata } = parseMetadata(text);
          setContent(cleanContent);
          setMeta(metadata);
        }

        setActiveId('');
      } catch (err) {
        console.error('Error fetching markdown:', err);
        if (basePageInfo?.content) {
          setContent(basePageInfo.content);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug, basePageInfo]);

  const displayInfo = useMemo(() => ({
    ...basePageInfo,
    ...meta,
    title: meta.title || basePageInfo?.title || slug,
    category: meta.category || basePageInfo?.category || '文档',
    lastUpdated: meta.lastUpdated || basePageInfo?.lastUpdated || '2026-02-10',
  }), [basePageInfo, meta, slug]);

  const pageBadge = useMemo(() => {
    const source = displayInfo?.title || slug || 'W';
    return source.slice(0, 1).toUpperCase();
  }, [displayInfo, slug]);

  const badgeTone = useMemo(() => {
    const category = displayInfo?.category || '';
    if (category.includes('附魔')) return 'cyan';
    if (category.includes('新手') || category.includes('入门')) return 'slate';
    if (category.includes('生存') || category.includes('玩法')) return 'emerald';
    if (category.includes('社区') || category.includes('社交')) return 'indigo';
    return 'blue';
  }, [displayInfo]);

  const subPages = useMemo(() => {
    return MOCK_PAGES.filter(p => p.parent === slug);
  }, [slug]);

  const handleShare = async () => {
    const shareUrl = window.location.origin + location.pathname;
    if (navigator.share) {
      try {
        await navigator.share({
          title: displayInfo?.title || 'StarMC Wiki',
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  const navigationLinks = useMemo(() => {
    const allItems: { title: string; path: string }[] = [];

    const extractItems = (items: any[]) => {
      items.forEach(item => {
        if (item.path && item.path.startsWith('/wiki/')) {
          allItems.push({ title: item.title, path: item.path });
        }
        if (item.items) {
          extractItems(item.items);
        }
      });
    };

    NAVIGATION.forEach(section => {
      if (section.items) {
        extractItems(section.items);
      }
    });

    const uniqueItems = allItems.filter((item, index, self) =>
      index === self.findIndex((t) => t.path === item.path)
    );

    const currentIndex = uniqueItems.findIndex(item => item.path === `/wiki/${slug}`);
    return {
      prev: currentIndex > 0 ? uniqueItems[currentIndex - 1] : null,
      next: currentIndex < uniqueItems.length - 1 ? uniqueItems[currentIndex + 1] : null
    };
  }, [slug]);

  if (!basePageInfo && !loading && !meta.title) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 size={40} className="animate-spin text-slate-200 dark:text-slate-700" />
        <p className="text-sm font-medium">正在从云端同步文档...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 dark:bg-rose-950/30 dark:text-rose-400">
          <Tag size={40} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-4 dark:text-white">文档加载失败</h1>
        <p className="text-slate-500 mb-8 dark:text-slate-400">抱歉，我们无法找到该页面的 Markdown 源文件。</p>
        <Link to="/" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all dark:bg-white dark:text-slate-900">
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div 
      className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-16 animate-in fade-in slide-in-from-right-4 duration-500 relative"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="fixed top-0 left-0 w-full h-0.5 z-100 pointer-events-none bg-transparent">
        <div 
          className="h-full bg-slate-900/70 dark:bg-white/70 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {isDragging && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-white/60 backdrop-blur-md border border-slate-200 m-4 rounded-[2.5rem] pointer-events-none animate-in fade-in duration-200 dark:bg-slate-950/60 dark:border-slate-800">
          <div className="bg-white/90 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800">
            <div className="w-16 h-16 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center dark:bg-slate-800 dark:text-white">
              <Upload size={32} />
            </div>
            <p className="text-xl font-semibold tracking-[-0.03em] text-slate-900 dark:text-white">松开以提交新文档</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">文件将直接发送至管理员审核后台</p>
          </div>
        </div>
      )}
      
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {readingProgress > 20 && (
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 rounded-full shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-center hover:bg-white dark:hover:bg-slate-900 transition-all active:scale-95 animate-in fade-in zoom-in duration-300 backdrop-blur-md"
          >
            <ChevronRight size={24} className="-rotate-90" />
          </button>
        )}
        
        {toc.length > 0 && (
          <button 
            onClick={() => setShowMobileToc(!showMobileToc)}
            className="lg:hidden w-12 h-12 bg-white/90 text-slate-900 rounded-full shadow-sm border border-slate-200 flex items-center justify-center hover:bg-white transition-all active:scale-95 dark:bg-slate-900/90 dark:text-white dark:border-slate-800 backdrop-blur-md"
          >
            <List size={24} />
          </button>
        )}
      </div>

      {showMobileToc && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowMobileToc(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-950/95 rounded-t-[2.5rem] p-8 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 border-t border-slate-200 dark:border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-900 dark:text-white flex items-center gap-2">
                <List size={20} className="text-slate-500" />
                目录 / Contents
              </h3>
              <button onClick={() => setShowMobileToc(false)} className="text-slate-400 hover:text-slate-600 p-2">
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
                      setShowMobileToc(false);
                      const target = document.getElementById(item.id);
                      if (target) {
                        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
                        window.scrollTo({ top, behavior: 'smooth' });
                      }
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
      
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 min-w-0 w-full">
          <div className="max-w-4xl">
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6 lg:mb-8 dark:text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none">
              <Link to="/" className="hover:text-slate-700 dark:hover:text-white transition-colors shrink-0">首页</Link>
              <ChevronRight size={12} />
              <span className="text-slate-600 dark:text-slate-300 shrink-0">{displayInfo?.category || 'Wiki'}</span>
              <ChevronRight size={12} />
              <span className="text-slate-900 dark:text-white truncate">{displayInfo?.title || slug}</span>
            </nav>

            <header className="mb-8 lg:mb-12">
              <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-[10px] lg:text-xs text-slate-400 mb-4 dark:text-slate-500">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-full dark:bg-slate-950 dark:border-slate-800">
                  <Calendar size={12} />
                  <span className="whitespace-nowrap">{displayInfo?.lastUpdated || '2026-02-10'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-full dark:bg-slate-950 dark:border-slate-800">
                  <Tag size={12} />
                  <span className="whitespace-nowrap">{displayInfo?.category || '文档'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-full dark:bg-slate-950 dark:border-slate-800">
                  <BadgeSvg tone={badgeTone} />
                  <span className="text-sm font-semibold tracking-wider">{pageBadge}</span>
                </div>
              </div>
              <h1 className="text-3xl lg:text-5xl font-semibold tracking-[-0.06em] leading-tight text-slate-950 dark:text-white wrap-break-word mb-4">
                {displayInfo?.title || slug}
              </h1>
            </header>

            <div className="relative">
              <MarkdownRenderer content={content} />
            </div>

            {subPages.length > 0 && (
              <div className="mt-16 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 dark:text-white">
                  <Layers size={20} className="text-indigo-500" />
                  相关子页面
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {subPages.map(page => (
                    <Link 
                      key={page.slug}
                      to={`/wiki/${page.slug}`}
                      className="group p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all dark:bg-slate-950 dark:border-slate-800 dark:hover:border-indigo-500"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors dark:text-slate-300 dark:group-hover:text-indigo-400">{page.title}</span>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-all dark:text-slate-700" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <footer className="mt-16 lg:mt-20 pt-8 border-t border-slate-100 dark:border-slate-800">
              {(navigationLinks.prev || navigationLinks.next) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                  {navigationLinks.prev ? (
                    <Link 
                      to={navigationLinks.prev.path}
                      className="flex flex-col gap-2 p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-500 hover:shadow-md transition-all dark:bg-slate-900/50 dark:border-slate-800"
                    >
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">上一篇</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <ArrowLeft size={20} />
                        {navigationLinks.prev.title}
                      </span>
                    </Link>
                  ) : <div />}
                  
                  {navigationLinks.next && (
                    <Link 
                      to={navigationLinks.next.path}
                      className="flex flex-col gap-2 p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-500 hover:shadow-md transition-all items-end text-right dark:bg-slate-900/50 dark:border-slate-800"
                    >
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">下一篇</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        {navigationLinks.next.title}
                        <ChevronRight size={20} />
                      </span>
                    </Link>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                  <Link 
                    to="/" 
                    className="flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-black text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all dark:text-slate-400 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <ArrowLeft size={16} />
                    返回首页
                  </Link>
                  {slug === 'template' && isAdmin && (
                    <button 
                      onClick={() => {
                        const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
                        const filePath = `${baseUrl}/content/wiki/template.md`;
                        fetch(filePath)
                          .then(res => res.text())
                          .then(text => {
                            const blob = new Blob([text], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'template.md';
                            a.click();
                            URL.revokeObjectURL(url);
                          })
                          .catch(err => {
                            console.error('Download failed:', err);
                            const fallbackContent = `<!--\nTITLE: 页面标题\nCATEGORY: 侧边栏分类\nLAST_UPDATED: ${new Date().toISOString().split('T')[0]}\nPARENT: \nICON: 📄\n-->\n\n# 新页面标题\n\n在此编写内容...`;
                            const blob = new Blob([fallbackContent], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'template.md';
                            a.click();
                            URL.revokeObjectURL(url);
                          });
                      }}
                      className="flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all dark:bg-indigo-950 dark:text-indigo-400 dark:hover:bg-indigo-900"
                    >
                      <Download size={16} />
                      下载模板
                    </button>
                  )}
                  {isAdmin && (
                    <a 
                      href="https://codeberg.org/addxiaoyi/starmc-wiki-page/src/branch/main/public/content/wiki" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900"
                    >
                      <Upload size={16} />
                      上传文档
                    </a>
                  )}
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <div className="flex items-center gap-1">
                    <button 
                      className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative dark:hover:text-white" 
                      title="分享"
                      onClick={handleShare}
                    >
                      <Share2 size={18} />
                      {copied && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap dark:bg-slate-600">
                          已复制!
                        </span>
                      )}
                    </button>
                    {isAdmin && (
                      <>
                        <Link 
                          to="/history"
                          className="p-2 text-slate-400 hover:text-slate-900 transition-colors dark:hover:text-white"
                          title="全站变更历史"
                        >
                          <History size={18} />
                        </Link>
                        <a 
                          href={`https://codeberg.org/addxiaoyi/starmc-wiki-page/commits/branch/main/public/content/wiki/${slug}.md`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-slate-900 transition-colors dark:hover:text-white"
                          title="源码历史"
                        >
                          <ExternalLinkIcon size={18} />
                        </a>
                      </>
                    )}
                  </div>
                  {isAdmin && (
                    <a 
                      href={`https://codeberg.org/addxiaoyi/starmc-wiki-page/src/branch/main/public/content/wiki/${slug}.md`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-black text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900"
                    >
                      <Edit3 size={16} />
                      编辑 (MD)
                    </a>
                  )}
                </div>
              </div>
            </footer>
          </div>
        </div>

        {toc.length > 0 && (
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
                        const target = document.getElementById(item.id);
                        if (target) {
                          const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
                          window.scrollTo({ top, behavior: 'smooth' });
                        }
                      }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
              
              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-slate-400 dark:text-slate-600">
                    <History size={16} />
                    <span className="text-[10px] font-mono uppercase tracking-widest">页面历史</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    文档更新于 {displayInfo?.lastUpdated}。如发现错误，欢迎点击上方编辑按钮提交修改。
                  </p>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Meta info for contribution - Only visible to admins */}
      {isAdmin && (
        <div className="mt-20 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 dark:bg-blue-950 dark:border-blue-900">
          <h3 className="text-lg font-bold text-blue-900 mb-4 dark:text-blue-200">管理员维护信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <p className="text-blue-700 dark:text-blue-300"><strong>页面 ID:</strong> {slug}</p>
              <p className="text-blue-700 dark:text-blue-300"><strong>分类:</strong> {displayInfo?.category}</p>
            </div>
            <div className="space-y-2">
              <p className="text-blue-700 dark:text-blue-300"><strong>源文件路径:</strong> <code>public/content/wiki/{slug}.md</code></p>
              <p className="text-blue-700 dark:text-blue-300"><strong>最后更新:</strong> {displayInfo?.lastUpdated}</p>
            </div>
          </div>
          <p className="mt-6 text-xs text-blue-500 dark:text-blue-400 italic">提示：此面板仅在 URL 包含 ?admin=true 或 localStorage 包含 starmc_admin=true 时可见。</p>
        </div>
      )}
    </div>
  );
};

export default WikiPage;
