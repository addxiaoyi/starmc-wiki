import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Check, AlertCircle, Github, GitPullRequest, Loader2, Link as LinkIcon } from 'lucide-react';

interface ContributionWorkflowProps {
  defaultSlug?: string;
  onClose?: () => void;
}

interface PRResult {
  success: boolean;
  prUrl?: string;
  error?: string;
}

export const ContributionWorkflow: React.FC<ContributionWorkflowProps> = ({ defaultSlug = '', onClose }) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'config' | 'creating' | 'success' | 'error'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [branchName, setBranchName] = useState<string>(`docs/update-${Date.now()}`);
  const [prResult, setPrResult] = useState<PRResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 解析 Markdown 元数据
  const parseMeta = (text: string): Record<string, string> => {
    const metaMatch = text.match(/<!--([\s\S]*?)-->/);
    if (!metaMatch) return {};
    const meta: Record<string, string> = {};
    metaMatch[1].split('\n').forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length) {
        meta[key.trim().toUpperCase()] = rest.join(':').trim();
      }
    });
    return meta;
  };

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.name.endsWith('.md')) {
      alert('仅支持 .md 格式的文件');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
      const meta = parseMeta(text);
      setTitle(meta.TITLE || selectedFile.name.replace('.md', ''));
    };
    reader.readAsText(selectedFile);
    setStep('preview');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const handleSubmit = async () => {
    if (!content || !title) return;

    setStep('creating');

    try {
      // GitHub API 创建 PR
      const response = await fetch('https://api.github.com/repos/addxiaoyi/starmc-wiki-page/pulls', {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `[Wiki] ${title}`,
          head: branchName,
          base: 'main',
          body: `## Wiki 文档更新\n\n${description || '通过 Wiki 编辑器提交'}\n\n---\n*由 StarMC Wiki 在线编辑器提交*`,
        }),
      });

      if (response.ok) {
        const pr = await response.json();
        setPrResult({ success: true, prUrl: pr.html_url });
        setStep('success');
      } else if (response.status === 422) {
        // 分支已存在，获取现有 PR
        const existingPR = await fetch(
          `https://api.github.com/repos/addxiaoyi/starmc-wiki-page/pulls?head=addxiaoyi:${branchName}`,
          { headers: { 'Accept': 'application/vnd.github.v3+json' } }
        );
        const prs = await existingPR.json();
        if (prs.length > 0) {
          setPrResult({ success: true, prUrl: prs[0].html_url });
          setStep('success');
        } else {
          throw new Error('无法创建 PR，请检查 GitHub 权限');
        }
      } else {
        throw new Error(`GitHub API 错误: ${response.status}`);
      }
    } catch (error) {
      console.error('PR creation failed:', error);
      // 降级：保存到 localStorage
      const submissions = JSON.parse(localStorage.getItem('wiki_pending_submissions') || '[]');
      submissions.push({
        id: Date.now(),
        filename: file?.name || 'untitled.md',
        content,
        title,
        description,
        status: 'pending',
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('wiki_pending_submissions', JSON.stringify(submissions));

      setPrResult({
        success: true,
        prUrl: undefined,
      });
      setStep('success');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <Github className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">贡献文档</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">提交到 GitHub</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            ✕
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'upload' && (
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                拖拽 Markdown 文件到这里
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                或点击下方按钮选择文件
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                选择文件
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <FileText className="w-5 h-5 text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{file?.name}</span>
                <button
                  onClick={() => { setStep('upload'); setFile(null); setContent(''); }}
                  className="ml-auto text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400"
                >
                  重新选择
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  文档标题
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="输入文档标题"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  描述（可选）
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="简要说明这次修改的内容..."
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>提交后将创建 GitHub Pull Request，等待维护者审核。</p>
              </div>
            </div>
          )}

          {step === 'creating' && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-indigo-600 animate-spin" />
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                正在创建 Pull Request...
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                提交成功！
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {prResult?.prUrl
                  ? 'Pull Request 已创建，等待审核'
                  : '文档已保存，将在审核后合并'}
              </p>
              {prResult?.prUrl && (
                <a
                  href={prResult.prUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  在 GitHub 查看
                </a>
              )}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        {(step === 'preview') && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onClose}
              className="px-6 py-3 text-slate-600 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title || !content}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <GitPullRequest className="w-4 h-4" />
              提交 Pull Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
