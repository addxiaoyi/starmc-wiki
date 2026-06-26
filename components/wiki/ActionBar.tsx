import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2, Edit3, Download, Upload, ExternalLink as ExternalLinkIcon, History, Github, FileEdit } from 'lucide-react';
import { ContributionWorkflow } from '../ContributionWorkflow';

interface ActionBarProps {
  slug: string;
  isAdmin: boolean;
  onShare: () => void;
  copied: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({ slug, isAdmin, onShare, copied }) => {
  const [showContribution, setShowContribution] = useState(false);

  const handleDownloadTemplate = () => {
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
      .catch(() => {
        const fallbackContent = `<!--
TITLE: 页面标题
CATEGORY: 侧边栏分类
LAST_UPDATED: ${new Date().toISOString().split('T')[0]}
PARENT:
ICON: 📄
-->

# 新页面标题

在此编写内容...`;
        const blob = new Blob([fallbackContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template.md';
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-black text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all dark:text-slate-400 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <ArrowLeft size={16} />
            返回首页
          </Link>

          {/* 贡献文档按钮 - 所有用户可见 */}
          <button
            onClick={() => setShowContribution(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-black text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all dark:bg-purple-950 dark:text-purple-400 dark:hover:bg-purple-900"
          >
            <Github size={16} />
            贡献文档
          </button>

          {slug === 'template' && isAdmin && (
            <button
              onClick={handleDownloadTemplate}
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
              onClick={onShare}
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

      {showContribution && (
        <ContributionWorkflow
          defaultSlug={slug}
          onClose={() => setShowContribution(false)}
        />
      )}
    </>
  );
};
