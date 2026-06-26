import React, { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../constants';

interface UseKeyboardNavigationOptions {
  isSearchOpen: boolean;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
  sidebarRef?: React.RefObject<HTMLElement | null>;
}

export const useKeyboardNavigation = ({
  isSearchOpen,
  onOpenSearch,
  onCloseSearch,
}: UseKeyboardNavigationOptions) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 如果搜索框已打开，只处理 Escape
      if (isSearchOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCloseSearch();
        }
        return;
      }

      // ⌘K / Ctrl+K: 打开搜索
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
        return;
      }

      // ?: 显示快捷键帮助（当没有输入框获得焦点时）
      if (e.key === '?' && !isInputFocused()) {
        // 可以扩展为显示快捷键提示面板
        return;
      }

      // j/↓: 下一项 (类似 Vim/GitHub)
      // k/↑: 上一项
      // Enter: 确认选择
      // Esc: 关闭弹窗/取消
      // g: 回到顶部 (需连续按 gg)
      // ?: 显示帮助
    },
    [isSearchOpen, onOpenSearch, onCloseSearch]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// 辅助函数：检查是否有输入框获得焦点
const isInputFocused = () => {
  const active = document.activeElement;
  if (!active) return false;
  const tag = active.tagName.toLowerCase();
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    (active as HTMLElement).isContentEditable
  );
};

// 快捷键常量定义
export const KEYBOARD_SHORTCUTS = {
  SEARCH: { key: 'K', modifiers: ['⌘', 'Ctrl'], description: '打开搜索' },
  ESCAPE: { key: 'Esc', modifiers: [], description: '关闭弹窗/取消' },
  NAV_PREV: { key: 'K', modifiers: [], description: '上一项' },
  NAV_NEXT: { key: 'J', modifiers: [], description: '下一项' },
  SCROLL_TOP: { key: 'G', modifiers: [], description: '回到顶部' },
  HELP: { key: '?', modifiers: [], description: '显示帮助' },
} as const;

// 快捷键帮助面板组件
export const KeyboardShortcutsHelp: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-slate-200 dark:border-slate-800"
      onClick={e => e.stopPropagation()}
    >
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm font-mono">?</kbd>
        键盘快捷键
      </h2>
      <div className="space-y-3">
        {[
          { keys: ['⌘', 'K'], desc: '打开搜索' },
          { keys: ['Esc'], desc: '关闭弹窗' },
          { keys: ['J'], desc: '下一项' },
          { keys: ['K'], desc: '上一项' },
          { keys: ['Enter'], desc: '确认选择' },
        ].map(({ keys, desc }) => (
          <div key={keys.join('')} className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">{desc}</span>
            <div className="flex gap-1">
              {keys.map(k => (
                <kbd key={k} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm font-mono text-slate-700 dark:text-slate-300">
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onClose}
        className="mt-6 w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
      >
        关闭
      </button>
    </div>
  </div>
);
