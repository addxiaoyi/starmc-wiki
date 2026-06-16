import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Copy, Terminal, Globe, Zap, Check, ArrowUpRight, BookOpen, Wrench, History, Compass } from 'lucide-react';
import { SERVER_NAME, SERVER_IPS, OFFICIAL_WEBSITE } from '../constants';

type ThemeType = 'blueprint' | 'aura' | 'voxel';

const Home: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeType>('blueprint');

  useEffect(() => {
    const themes: ThemeType[] = ['blueprint', 'aura', 'voxel'];
    setTheme(themes[Math.floor(Math.random() * themes.length)]);
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme === 'blueprint' ? 'bg-slate-50 dark:bg-slate-950' : theme === 'aura' ? 'bg-white dark:bg-slate-950' : 'bg-stone-50 dark:bg-slate-950'}`}>
      <div className="relative z-10 mx-auto max-w-8xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <header className="grid grid-cols-1 gap-10 xl:grid-cols-12 xl:items-end xl:gap-14 mb-12 lg:mb-24">
          <div className="min-w-0 space-y-5 sm:space-y-6 xl:col-span-8 xl:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-60 animate-ping"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-500"></span>
              </span>
              <span className="truncate text-[10px] font-semibold uppercase tracking-[0.3em]">StarMC Wiki</span>
            </div>

            <h1 className="max-w-[10ch] text-[clamp(3rem,14vw,8rem)] font-semibold tracking-[-0.1em] leading-[0.84] text-slate-950 dark:text-white sm:max-w-none sm:text-[clamp(4rem,11vw,8rem)] xl:tracking-[-0.08em] xl:leading-[0.86]">
              <span className="block">{SERVER_NAME.split(' ')[0]}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-slate-700 to-slate-900 dark:from-slate-200 dark:to-white">
                {SERVER_NAME.split(' ')[1] || 'WIKI'}
              </span>
            </h1>
          </div>

          <div className="min-w-0 space-y-5 xl:col-span-4 xl:pt-6 sm:space-y-6 md:space-y-8">
            <p className="max-w-xl border-l-4 border-slate-300 pl-4 text-base font-normal leading-relaxed text-slate-500 dark:text-slate-400 sm:pl-6 sm:text-lg md:text-[clamp(1.05rem,2vw,1.35rem)]">
              StarMC Wiki 汇总了服务器规则、入门指引和常用内容。
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
              <Link to="/wiki/index" onMouseEnter={() => import('./WikiPage')} className="inline-flex min-w-0 items-center justify-between rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition-all duration-300 hover:bg-slate-800 active:scale-[0.98] sm:px-7 md:px-8 md:py-5">
                <span className="truncate">立即开始探索</span>
                <ChevronRight size={20} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href={OFFICIAL_WEBSITE} target="_blank" rel="noreferrer" className="inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-900 transition-all duration-300 hover:bg-slate-50 active:scale-[0.98] dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900 sm:px-7 md:px-8 md:py-5">
                官网
                <ArrowUpRight size={20} />
              </a>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] border border-slate-200 bg-white mb-20 md:mb-32 shadow-[0_20px_70px_rgba(15,23,42,.06)] dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: '生存与经营', desc: '围绕生存、农场和技能展开。', glyph: '生' },
            { title: '探索与任务', desc: '任务与资源点分布，适合跑图和收集。', glyph: '探' },
            { title: '社区互动', desc: '公会、婚姻和表情动作，让交流更自然。', glyph: '社' },
          ].map((item, i) => (
            <article key={i} className="bg-white p-6 sm:p-8 md:p-10 dark:bg-slate-950">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-black text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
                  {item.glyph}
                </div>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>
              <h3 className={`mb-2 text-2xl font-semibold tracking-[-0.04em] sm:text-[1.85rem] md:text-3xl text-slate-900 dark:text-white`}>
                {item.title}
              </h3>
              <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400 md:text-base">
                {item.desc}
              </p>
            </article>
          ))}
        </section>

        <section className="mb-20 sm:mb-24 md:mb-40">
          <div className="mb-8 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white sm:text-4xl md:text-5xl">服务器接入点</h2>
              <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-slate-500 dark:text-slate-400 sm:text-lg md:text-xl">
                选择一条稳定的线路。
              </p>
            </div>
            <div className="flex items-center gap-4 self-start lg:self-auto">
              <div className={`hidden h-px w-24 lg:block xl:w-40 ${theme === 'blueprint' ? 'bg-slate-300 dark:bg-slate-700' : theme === 'aura' ? 'bg-blue-200 dark:bg-blue-800' : 'bg-emerald-200 dark:bg-emerald-800'}`} />
              <span className="text-xs font-black tracking-widest text-slate-400 sm:text-sm">线路</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 md:gap-8">
            {[
              { label: 'Java版大厅主路', ip: SERVER_IPS.primary, glyph: '主', badge: '稳定', tone: 'cyan' },
              { label: 'Java版大厅主力', ip: SERVER_IPS.secondary, glyph: '力', badge: '主力', tone: 'sky' },
              { label: 'Java版大厅备用', ip: SERVER_IPS.tertiary, glyph: '备', badge: '备用', tone: 'indigo' },
            ].map((item, i) => (
              <div key={i} className={`rounded-[2rem] border bg-white p-6 shadow-sm dark:bg-slate-950 ${theme === 'blueprint' ? 'border-slate-200' : theme === 'aura' ? 'border-slate-200/70' : 'border-slate-200'}`}>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 ${item.tone === 'cyan' ? 'border-cyan-200 text-cyan-700 dark:border-cyan-900/50 dark:text-cyan-300' : item.tone === 'sky' ? 'border-sky-200 text-sky-700 dark:border-sky-900/50 dark:text-sky-300' : 'border-indigo-200 text-indigo-700 dark:border-indigo-900/50 dark:text-indigo-300'}`}>
                    <span className="text-lg font-black leading-none">{item.glyph}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">线路</span>
                  </div>
                  <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">{item.label}</div>
                  <div className={`rounded-2xl border px-4 py-3 shadow-inner ${theme === 'aura' ? 'bg-white/60 border-slate-200/70 dark:bg-slate-950/60 dark:border-slate-800' : 'bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800'}`}>
                    <code className="block truncate font-mono text-sm font-bold leading-6 text-slate-900 dark:text-white sm:text-base md:text-lg xl:text-xl">
                      {item.ip}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.ip)}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-all active:scale-95 sm:w-auto ${copied === item.ip ? 'bg-emerald-500 text-white' : theme === 'blueprint' ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900' : theme === 'aura' ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                  >
                    {copied === item.ip ? <Check size={18} /> : <Copy size={18} />}
                    <span className="text-sm sm:text-base">{copied === item.ip ? '已复制' : '复制地址'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className={`border-t pt-20 pb-24 space-y-16 ${theme === 'blueprint' ? 'border-slate-200 dark:border-slate-800' : theme === 'aura' ? 'border-blue-100 dark:border-blue-900/50' : 'border-emerald-100 dark:border-emerald-900/50'}`}>
          <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-5">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-2 ${theme === 'blueprint' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : theme === 'aura' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'}`}>
                  <Terminal size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase dark:text-white">StarMC Wiki</span>
              </div>
              <p className="max-w-sm font-medium text-slate-500 dark:text-slate-400">
                StarMC 官方 Wiki。
              </p>
            </div>

            <div className="space-y-4 lg:col-span-3">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">导航</h4>
              <ul className="space-y-2">
                <li><Link to="/wiki/index" onMouseEnter={() => import('./WikiPage')} className="text-lg font-bold text-slate-900 transition-colors hover:text-slate-600 dark:text-white dark:hover:text-slate-300">Wiki 首页</Link></li>
                <li><Link to="/wiki/intro" onMouseEnter={() => import('./WikiPage')} className="text-lg font-bold text-slate-900 transition-colors hover:text-slate-600 dark:text-white dark:hover:text-slate-300">新手指南</Link></li>
                <li><Link to="/wiki/commands" onMouseEnter={() => import('./WikiPage')} className="text-lg font-bold text-slate-900 transition-colors hover:text-slate-600 dark:text-white dark:hover:text-slate-300">常用内容</Link></li>
                <li><Link to="/wiki/announcement" onMouseEnter={() => import('./WikiPage')} className="text-lg font-bold text-slate-900 transition-colors hover:text-slate-600 dark:text-white dark:hover:text-slate-300">公告更新</Link></li>
              </ul>
            </div>

            <div className="space-y-4 lg:col-span-4 xl:pl-2">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">成员</h4>
              <a href="https://github.com/addxiaoyi" target="_blank" rel="noreferrer" className={`group flex items-center gap-4 rounded-3xl border px-4 py-4 transition-all hover:-translate-y-0.5 ${theme === 'blueprint' ? 'border-slate-200 bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-950' : theme === 'aura' ? 'border-blue-100 bg-white/80 hover:shadow-lg hover:shadow-blue-500/10 dark:border-blue-900/50 dark:bg-slate-950/80' : 'border-emerald-100 bg-white hover:shadow-lg hover:shadow-emerald-500/10 dark:border-emerald-900/50 dark:bg-slate-950'}`}>
                <img src="https://github.com/addxiaoyi.png" alt="addxiaoyi avatar" className="h-12 w-12 rounded-2xl border border-slate-200 object-cover dark:border-slate-800" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white">addxiaoyi</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${theme === 'blueprint' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : theme === 'aura' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>成员</span>
                  </div>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">github.com/addxiaoyi</p>
                </div>
                <ArrowUpRight size={18} className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: BookOpen, title: '新手路线', desc: '查看加入教程、入门必看和服务器规范。', href: '/wiki/intro' },
              { icon: Wrench, title: '常用功能', desc: '了解常用指令、领地、经济和基础设置。', href: '/wiki/commands' },
              { icon: History, title: '更新日志', desc: '查看公告，了解规则和内容变化。', href: '/wiki/announcement' },
            ].map((item, i) => (
              <Link key={i} to={item.href} onMouseEnter={() => import('./WikiPage')} className={`group rounded-3xl border p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${theme === 'blueprint' ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950' : theme === 'aura' ? 'border-blue-100 bg-white/80 dark:border-blue-900/50 dark:bg-slate-950/80' : 'border-emerald-100 bg-white dark:border-emerald-900/50 dark:bg-slate-950'}`}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-100 p-3 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    <item.icon size={20} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{item.title}</h3>
                </div>
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{item.desc}</p>
              </Link>
            ))}
          </section>
        </footer>
      </div>
    </div>
  );
};

export default Home;
