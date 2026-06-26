import React, { useEffect, useRef, useState } from 'react';

interface CommentsProps {
  slug: string;
  theme?: 'light' | 'dark' | 'preferred_color_scheme';
}

/**
 * 评论系统组件 - 基于 Giscus
 *
 * 注意：Giscus 需要 GitHub Discussions 功能
 * 如果使用 Codeberg/Gitea，请手动配置或使用其他评论方案
 *
 * 配置步骤：
 * 1. 在 GitHub 仓库启用 Discussions
 * 2. 安装 giscus app: https://github.com/apps/giscus
 * 3. 从 https://giscus.app 获取 repo-id 和 category-id
 * 4. 更新下面的配置
 */
export const Comments: React.FC<CommentsProps> = ({
  slug,
  theme = 'preferred_color_scheme',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // 清理旧评论
    containerRef.current.innerHTML = '';

    // 尝试加载 Giscus
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';

    // ====== 在这里填入你的 Giscus 配置 ======
    script.setAttribute('data-repo', 'YOUR_USERNAME/YOUR_REPO');
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID');
    script.setAttribute('data-category', 'Wiki 讨论');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');
    // =======================================

    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', slug);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      console.warn('Giscus 评论系统加载失败，请检查配置');
    };

    containerRef.current.appendChild(script);
  }, [slug, theme]);

  return (
    <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">💬</span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          评论
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          基于 GitHub Discussions
        </span>
      </div>

      {!isLoaded && (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
      )}

      <div ref={containerRef} className="giscus" />

      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          <strong>配置说明：</strong> 评论功能需要 GitHub 仓库。
          请参考 <a
            href="https://giscus.app"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-900 dark:hover:text-amber-200"
          >
            giscus.app
          </a> 获取配置信息，然后更新此组件中的 data-repo、data-repo-id 和 data-category-id。
        </p>
      </div>

      <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
        评论需要 GitHub 账号。发表评论即表示你同意我们的
        <a
          href="/COMMENTS.md"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-600 dark:hover:text-slate-300"
        >
          评论准则
        </a>
        。
      </p>
    </div>
  );
};
