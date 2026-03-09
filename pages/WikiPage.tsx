
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate, Link, useLocation } from 'react-router-dom';
import { ExternalLink as ExternalLinkIcon, Calendar, Tag, ChevronRight, ArrowLeft, Share2, Edit3, Loader2, Download, Layers, List, History, Upload } from 'lucide-react';
import { MOCK_PAGES, NAVIGATION } from '../constants';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { WikiPage as WikiPageType } from '../types';

const WikiPage: React.FC = () => {
  const { "*": slug } = useParams();
  const location = useLocation();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [meta, setMeta] = useState<Partial<WikiPageType>>({});

  const [isDragging, setIsDragging] = useState(false);

  // 基础信息
  const basePageInfo = MOCK_PAGES.find(p => p.slug === slug);

  // 处理文件上传
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

  // 监听滚动更新活跃目录项
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0% -80% 0%' }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  // 解析 MD 中的元数据
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

  const [showMobileToc, setShowMobileToc] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!slug) return;
      setLoading(true);
      setError(false);
      try {
        // 优先尝试从 API 路径获取
        const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
        const response = await fetch(`${baseUrl}/content/wiki/${slug}.md?v=${Date.now()}`);
        if (!response.ok) throw new Error(`Failed to load markdown: ${response.status}`);
        const text = await response.text();
        
        const { cleanContent, metadata } = parseMetadata(text);
        setContent(cleanContent);
        setMeta(metadata);
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

  // 合并元数据
  const displayInfo = useMemo(() => ({
    ...basePageInfo,
    ...meta,
    title: meta.title || basePageInfo?.title || slug,
    category: meta.category || basePageInfo?.category || '文档',
    lastUpdated: meta.lastUpdated || basePageInfo?.lastUpdated || '2026-02-10',
  }), [basePageInfo, meta, slug]);

  // 获取子页面 (通过 parent 字段)
  const subPages = useMemo(() => {
    return MOCK_PAGES.filter(p => p.parent === slug);
  }, [slug]);

  // 生成文章目录 (TOC)
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

  // 管理员权限检查
  const isAdmin = useMemo(() => {
    return new URLSearchParams(location.search).get('admin') === 'true' || 
           localStorage.getItem('starmc_admin') === 'true' ||
           window.location.hostname === 'localhost';
  }, [location.search]);

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

  // 计算上下页导航
  const navigationLinks = useMemo(() => {
    const allItems: { title: string; path: string }[] = [];
    NAVIGATION.forEach(section => {
      section.items.forEach(item => {
        if (item.path.startsWith('/wiki/')) {
          allItems.push({ title: item.title, path: item.path });
        }
        if (item.items) {
          item.items.forEach(subItem => {
            if (subItem.path.startsWith('/wiki/')) {
              allItems.push({ title: subItem.title, path: subItem.path });
            }
          });
        }
      });
    });

    const currentIndex = allItems.findIndex(item => item.path === `/wiki/${slug}`);
    return {
      prev: currentIndex > 0 ? allItems[currentIndex - 1] : null,
      next: currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null
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
      className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-16 animate-in fade-in slide-in-from-right-4 duration-500 relative"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* 拖拽上传覆盖层 */}
      {isDragging && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-blue-600/20 backdrop-blur-sm border-4 border-dashed border-blue-500 m-4 rounded-[2.5rem] pointer-events-none animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-4xl shadow-2xl flex flex-col items-center gap-4 dark:bg-slate-900">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center dark:bg-blue-900/30 dark:text-blue-400">
              <Upload size={32} />
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white">松开以提交新文档</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">文件将直接发送至管理员审核后台</p>
          </div>
        </div>
      )}
      
      {/* 手机端目录悬浮按钮 */}
      {toc.length > 0 && (
        <button 
          onClick={() => setShowMobileToc(!showMobileToc)}
          className="fixed bottom-6 right-6 z-50 lg:hidden w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all active:scale-95"
        >
          <List size={24} />
        </button>
      )}

      {/* 手机端目录抽屉 */}
      {showMobileToc && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowMobileToc(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-8 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <List size={20} className="text-indigo-500" />
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
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1 min-w-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6 lg:mb-8 dark:text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link to="/" className="hover:text-blue-500 transition-colors shrink-0">首页</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 dark:text-slate-300 shrink-0">{displayInfo?.category || 'Wiki'}</span>
            <ChevronRight size={12} />
            <span className="text-blue-500 truncate">{displayInfo?.title || slug}</span>
          </nav>

          {/* Hero Header */}
          <header className="mb-8 lg:mb-12">
            <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-[10px] lg:text-xs font-mono text-slate-400 mb-4 dark:text-slate-500">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-md dark:bg-slate-900 dark:text-slate-400">
                <Calendar size={12} />
                <span className="whitespace-nowrap">{displayInfo?.lastUpdated || '2026-02-10'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400 rounded-md">
                <Tag size={12} />
                <span className="whitespace-nowrap">{displayInfo?.category || '文档'}</span>
              </div>
              {displayInfo?.icon && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md dark:bg-indigo-950 dark:text-indigo-400">
                  <span className="text-base lg:text-lg">{displayInfo.icon}</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight dark:text-white wrap-break-word mb-4">
              {displayInfo?.title || slug}
            </h1>
          </header>

          {/* Main Content Area */}
          <div className="relative">
            <MarkdownRenderer content={content} />
          </div>

          {/* 子页面导航 (如果存在) */}
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

          {/* Page Footer / Controls */}
          <footer className="mt-16 lg:mt-20 pt-8 border-t border-slate-100 dark:border-slate-800">
            {/* 上下页导航 */}
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
                      // 使用 fetch 获取原始文件内容，这样下载的文件会包含最新的注释元数据
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
                          // 降级方案：手动生成
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

        {/* Table of Contents - Sticky Sidebar */}
        {toc.length > 0 && (
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
              <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-6 dark:text-slate-600">
                <List size={14} />
                目录 / Contents
              </div>
              <ul className="space-y-3">
                {toc.map((item, i) => (
                  <li 
                    key={i} 
                    className={`${item.level === 3 ? 'ml-4' : ''}`}
                  >
                    <a 
                      href={`#${item.id}`}
                      className={`block text-sm font-medium transition-all leading-relaxed py-1 px-2 rounded-lg ${
                        activeId === item.id 
                          ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/50' 
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        const target = document.getElementById(item.id);
                        if (target) {
                          const top = target.getBoundingClientRect().top + window.pageYOffset - 100;
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
