import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`} />
);

export const WikiPageSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:py-16">
    {/* 面包屑导航骨架 */}
    <div className="flex items-center gap-2 mb-6 lg:mb-8">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-32" />
    </div>

    {/* 标签骨架 */}
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <Skeleton className="h-7 w-28 rounded-full" />
      <Skeleton className="h-7 w-24 rounded-full" />
      <Skeleton className="h-7 w-20 rounded-full" />
    </div>

    {/* 标题骨架 */}
    <div className="mb-8 lg:mb-12">
      <Skeleton className="h-10 w-3/4 mb-3" />
      <Skeleton className="h-10 w-1/2" />
    </div>

    {/* 内容骨架 */}
    <div className="space-y-4">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-5 w-full" />

      {/* 列表项 */}
      <div className="space-y-3 mt-8">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-5 w-full ml-4" />
        <Skeleton className="h-5 w-full ml-4" />
        <Skeleton className="h-5 w-3/4 ml-4" />
      </div>

      {/* 引用块 */}
      <div className="h-24 w-full rounded-xl border-l-4 border-indigo-500 bg-slate-100 dark:bg-slate-800" />

      {/* 代码块 */}
      <div className="h-32 w-full rounded-xl bg-slate-900" />

      {/* 更多内容 */}
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-2/3" />
    </div>

    {/* 分页导航骨架 */}
    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-24 rounded-3xl" />
        <Skeleton className="h-24 rounded-3xl" />
      </div>
    </div>
  </div>
);

export const HomeSkeleton: React.FC = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 pt-8 sm:px-6 lg:px-8 lg:pt-12 max-w-8xl mx-auto">
    <div className="mb-12 lg:mb-24">
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-12 xl:items-end xl:gap-14">
        <div className="xl:col-span-8 space-y-5">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-32 w-2/3" />
        </div>
        <div className="xl:col-span-4 space-y-5">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-px rounded-xl border border-slate-200 bg-white mb-20 md:mb-32 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white p-6 sm:p-8 dark:bg-slate-950">
          <Skeleton className="h-12 w-12 rounded-lg mb-5" />
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  </div>
);
