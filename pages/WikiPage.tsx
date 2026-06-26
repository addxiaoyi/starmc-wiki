
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { ChevronRight, Share2, Upload, MessageCircle } from 'lucide-react';
import { MOCK_PAGES, NAVIGATION } from '../constants';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { WikiPageSkeleton } from '../components/Skeleton';
import { SEOMeta } from '../components/SEOMeta';
import { Comments } from '../components/Comments';
import { TableOfContents, MobileToc, Breadcrumb, PageMeta, PageNavigation, ActionBar } from '../components/wiki';
import { WikiPage as WikiPageType, TocItem } from '../types';

const WikiPage: React.FC = () => {
  const { "*": slug } = useParams();
  const location = useLocation();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [meta, setMeta] = useState<Partial<WikiPageType>>({});
  const [showComments, setShowComments] = useState(false);

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

  const toc = useMemo((): TocItem[] => {
    const headings = content.split('\n')
      .filter(line => line.startsWith('## ') || line.startsWith('### '))
      .map(line => {
        const level = line.startsWith('## ') ? 2 : 3;
        const text = line.replace(/^#+ /, '').trim();
        const id = text.toLowerCase().replace(/[^\w一-龥]+/g, '-');
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

  const handleTocSelect = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (!basePageInfo && !loading && !meta.title) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <WikiPageSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 dark:bg-rose-950/30 dark:text-rose-400">
          <span className="text-4xl">📄</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-4 dark:text-white">文档加载失败</h1>
        <p className="text-slate-500 mb-8 dark:text-slate-400">抱歉，我们无法找到该页面的 Markdown 源文件。</p>
        <a href="/" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all dark:bg-white dark:text-slate-900">
          返回首页
        </a>
      </div>
    );
  }

  return (
    <>
      <SEOMeta
        title={displayInfo?.title}
        description={`${displayInfo?.title} - ${displayInfo?.category}页面。${meta.description || 'StarMC 服务器 Wiki 文档。'}`}
        path={`/wiki/${slug}`}
        type="article"
      />
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-16 animate-in fade-in slide-in-from-right-4 duration-500 relative"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 w-full h-0.5 z-100 pointer-events-none bg-transparent">
        <div
          className="h-full bg-slate-900/70 dark:bg-white/70 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* 拖拽上传遮罩 */}
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

      {/* 浮动操作按钮 */}
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
            <span className="text-xl">☰</span>
          </button>
        )}
      </div>

      {/* 移动端目录 */}
      <MobileToc
        toc={toc}
        activeId={activeId}
        isOpen={showMobileToc}
        onClose={() => setShowMobileToc(false)}
        onSelect={handleTocSelect}
      />

      {/* 主内容区 */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 min-w-0 w-full">
          <div className="max-w-4xl">
            {/* 面包屑导航 */}
            <Breadcrumb category={displayInfo?.category} title={displayInfo?.title || slug} />

            {/* 页面元数据 */}
            <PageMeta
              lastUpdated={displayInfo?.lastUpdated}
              category={displayInfo?.category}
              pageBadge={pageBadge}
              badgeTone={badgeTone}
            />

            {/* 标题 */}
            <h1 className="text-3xl lg:text-5xl font-semibold tracking-[-0.06em] leading-tight text-slate-950 dark:text-white wrap-break-word mb-8 lg:mb-12">
              {displayInfo?.title || slug}
            </h1>

            {/* Markdown 内容 */}
            <div className="relative">
              <MarkdownRenderer content={content} />
            </div>

            {/* 子页面 */}
            {subPages.length > 0 && (
              <div className="mt-16 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 dark:text-white">
                  <span className="text-xl">📚</span>
                  相关子页面
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {subPages.map(page => (
                    <a
                      key={page.slug}
                      href={`/wiki/${page.slug}`}
                      className="group p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all dark:bg-slate-950 dark:border-slate-800 dark:hover:border-indigo-500"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors dark:text-slate-300 dark:group-hover:text-indigo-400">{page.title}</span>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-all dark:text-slate-700" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 底部导航和操作 */}
            <footer className="mt-16 lg:mt-20 pt-8 border-t border-slate-100 dark:border-slate-800">
              <PageNavigation prev={navigationLinks.prev} next={navigationLinks.next} />
              <ActionBar
                slug={slug || ''}
                isAdmin={isAdmin}
                onShare={handleShare}
                copied={copied}
              />
            </footer>

            {/* 评论区 */}
            {!showComments ? (
              <button
                onClick={() => setShowComments(true)}
                className="mt-12 w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-500 dark:hover:border-indigo-700 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                <span className="font-semibold">展开评论</span>
              </button>
            ) : (
              <Comments slug={slug || ''} />
            )}
          </div>
        </div>

        {/* 桌面端目录 */}
        <TableOfContents
          toc={toc}
          activeId={activeId}
          onSelect={handleTocSelect}
          lastUpdated={displayInfo?.lastUpdated}
        />
      </div>

      {/* 管理员信息面板 */}
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
    </>
  );
};

export default WikiPage;
