import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  ChevronRight, 
  Copy, 
  Terminal, 
  Globe, 
  Zap, 
  Check,
  ArrowUpRight,
  BookOpen,
  Wrench,
  History,
  Users
} from 'lucide-react';
import { SERVER_NAME, SERVER_IPS, OFFICIAL_WEBSITE } from '../constants';

type ThemeType = 'blueprint' | 'aura' | 'voxel';

const Home: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeType>('blueprint');

  useEffect(() => {
    const themes: ThemeType[] = ['blueprint', 'aura', 'voxel'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    setTheme(randomTheme);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-700 ${
      theme === 'blueprint' ? 'bg-slate-50 dark:bg-slate-950' : 
      theme === 'aura' ? 'bg-white dark:bg-slate-950' : 
      'bg-stone-50 dark:bg-slate-950'
    }`}>
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.18] dark:opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(to right, rgba(148,163,184,.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,.18) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59,130,246,.45) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[-6rem] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        {/* Hero Section - Magazine Layout */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12 lg:mb-24">
          <div className="lg:col-span-8 space-y-4 lg:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/30 bg-slate-950/80 text-cyan-300 shadow-[0_0_24px_rgba(6,182,212,.15)] backdrop-blur-md animate-in fade-in duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.35em]">Documentation Hub v2.0</span>
            </div>
            
            <h1 className="text-[clamp(2rem,12vw,8rem)] font-black tracking-tighter leading-[0.82] text-slate-900 dark:text-white animate-in fade-in slide-in-from-left-8 duration-1000 delay-150">
              {SERVER_NAME.split(' ')[0]}<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 dark:from-cyan-300 dark:via-sky-300 dark:to-violet-300 drop-shadow-[0_0_18px_rgba(56,189,248,.18)]">
                {SERVER_NAME.split(' ')[1] || 'WIKI'}
              </span>
            </h1>
          </div>
          
          <div className="lg:col-span-4 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <p className="text-[clamp(1.1rem,2vw,1.5rem)] text-slate-500 font-medium leading-tight dark:text-slate-400 border-l-4 border-cyan-400 pl-4 md:pl-6">
              这里是 StarMC 的文档中心，从硬核生电、休闲农场到社区社交，你想知道的都在这里。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link 
                to="/wiki/index" 
                onMouseEnter={() => import('./WikiPage')}
                className="flex-1 px-6 md:px-8 py-4 md:py-5 font-bold rounded-2xl flex items-center justify-between group bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,.22)] active:scale-[0.98] transition-all duration-300 border border-cyan-300/40"
              >
                立即开始探索
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href={OFFICIAL_WEBSITE} target="_blank" rel="noreferrer" className="px-6 md:px-8 py-4 md:py-5 bg-slate-950/90 border border-cyan-400/20 text-cyan-100 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-900 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(59,130,246,.14)] active:scale-[0.98] transition-all duration-300">
                官网
                <ArrowUpRight size={20} />
              </a>
            </div>
          </div>
        </header>

        {/* Featured Section - Grid System */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px rounded-4xl md:rounded-[3rem] overflow-hidden border border-cyan-400/20 mb-20 md:mb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 bg-slate-950/60 shadow-[0_0_60px_rgba(34,211,238,.08)] backdrop-blur-xl">
          {[
            { 
              title: "生存与经营", 
              desc: "纯净生存底色，配合农场、技能等长期玩法，让生存不再只有挖矿",
              icon: <Zap className="text-cyan-300" />, 
            },
            { 
              title: "深度探索", 
              desc: "任务系统与世界资源点分布，给喜欢跑图和收集的你更多理由",
              icon: <Compass className="text-sky-300" />, 
            },
            { 
              title: "社区社交", 
              desc: "婚姻、公会、表情动作，在服务器里找到能玩到一块的伙伴",
              icon: <Globe className="text-indigo-300" />, 
            }
          ].map((item, i) => (
            <div key={i} className="relative overflow-hidden bg-slate-950 p-8 md:p-12 transition-all duration-500 group hover:bg-slate-900/80">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.16),transparent_45%),linear-gradient(135deg,rgba(2,6,23,.35),transparent)] opacity-90" />
              <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.35) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
              <div className="relative z-10">
                <div className="mb-6 md:mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,.12)] transition-transform duration-500 group-hover:scale-110">
                  {item.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-4 text-white group-hover:translate-x-1 transition-transform">{item.title}</h3>
                <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed group-hover:translate-x-1 transition-transform delay-75">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Access Points - Editorial Style */}
        <section className="mb-24 md:mb-40">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 md:mb-16">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black mb-4 md:mb-6 dark:text-white tracking-tight">服务器接入点</h2>
              <p className="text-lg md:text-xl text-slate-500 font-medium dark:text-slate-400">
                选择最适合你的连接线路。建议根据你的网络环境优先尝试主线路。
              </p>
            </div>
            <div className={`hidden lg:block h-px flex-1 mx-12 mb-6 ${
              theme === 'blueprint' ? 'bg-slate-300 dark:bg-slate-700' :
              theme === 'aura' ? 'bg-blue-200 dark:bg-blue-800' :
              'bg-emerald-200 dark:bg-emerald-800'
            }`} />
            <div className="text-right">
              <span className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest">ACCESS POINTS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            {[
              { label: "Java版大厅主路", ip: SERVER_IPS.primary, icon: <Zap size={24} className={theme === 'voxel' ? 'text-emerald-500' : 'text-amber-500'} />, badge: "bgp均衡负载 / 南京 杭州 上海" },
              { label: "Java版大厅主力", ip: SERVER_IPS.secondary, icon: <Globe size={24} className={theme === 'voxel' ? 'text-teal-500' : 'text-blue-500'} />, badge: "bgp主力 / 宿迁" },
              { label: "Java版大厅备用", ip: SERVER_IPS.tertiary, icon: <Compass size={24} className={theme === 'voxel' ? 'text-amber-500' : 'text-emerald-500'} />, badge: "bgp备用 / 宿迁" }
            ].map((item, i) => (
              <div key={i} className={`group p-6 md:p-10 rounded-4xl md:rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden ${
                theme === 'blueprint' ? 'bg-slate-100/50 border-slate-200 hover:border-slate-400 hover:bg-white dark:bg-slate-900/50 dark:border-slate-800' :
                theme === 'aura' ? 'bg-white/40 backdrop-blur-md border-white/40 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 dark:bg-slate-900/40 dark:border-slate-800/40' :
                'bg-stone-100/80 border-stone-200 hover:border-emerald-300 hover:bg-white dark:bg-slate-900/80 dark:border-slate-800'
              }`}>
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700 ${
                  theme === 'blueprint' ? 'bg-slate-500/10' :
                  theme === 'aura' ? 'bg-blue-500/20' :
                  'bg-emerald-500/20'
                }`} />
                <div className="flex items-center justify-between mb-6 md:mb-8 relative z-10">
                  <div className={`p-4 rounded-2xl shadow-sm group-hover:rotate-6 transition-transform ${
                    theme === 'aura' ? 'bg-white/80 dark:bg-slate-800/80' : 'bg-white dark:bg-slate-800'
                  }`}>{item.icon}</div>
                  <span className={`px-3 py-1 text-[10px] md:text-xs font-black rounded-full text-center ${
                    theme === 'blueprint' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' :
                    theme === 'aura' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  }`}>
                    {item.badge}
                  </span>
                </div>
                <div className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest mb-4 dark:text-slate-500 relative z-10">{item.label}</div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 relative z-10">
                  <div className={`flex-1 px-4 md:px-6 py-3 md:py-4 rounded-2xl border transition-colors shadow-inner flex items-center justify-center sm:justify-start ${
                    theme === 'aura' ? 'bg-white/60 dark:bg-slate-950/60 border-white/40 group-hover:border-blue-300' :
                    'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 group-hover:border-blue-300 dark:group-hover:border-blue-700'
                  }`}>
                    <code className="text-base md:text-xl text-slate-900 font-mono font-bold dark:text-white break-all">{item.ip}</code>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(item.ip)}
                    className={`px-6 md:px-8 py-3 md:py-4 flex items-center justify-center gap-2 font-black rounded-2xl transition-all relative overflow-hidden active:scale-95 shrink-0 ${
                      copied === item.ip 
                        ? 'bg-emerald-500 text-white' 
                        : theme === 'blueprint' ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 shadow-lg' :
                          theme === 'aura' ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20' :
                          'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20'
                    }`}
                  >
                    {copied === item.ip ? <Check size={18} /> : <Copy size={18} />}
                    <span className="text-sm md:text-base">{copied === item.ip ? '已复制' : '复制地址'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Editorial */}
        <footer className={`border-t pt-20 pb-24 space-y-16 ${
          theme === 'blueprint' ? 'border-slate-200 dark:border-slate-800' :
          theme === 'aura' ? 'border-blue-100 dark:border-blue-900/50' :
          'border-emerald-100 dark:border-emerald-900/50'
        }`}>
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  theme === 'blueprint' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' :
                  theme === 'aura' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' :
                  'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                }`}>
                  <Terminal size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter dark:text-white uppercase">StarMC Wiki</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm">
                舵星归途 StarMC 官方服务器 Wiki。在这里，每一行文档都为你指引归途。
              </p>
            </div>
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">快速入口</h4>
              <ul className="space-y-2">
                <li><Link to="/wiki/index" onMouseEnter={() => import('./WikiPage')} className={`text-lg font-bold transition-colors ${
                  theme === 'blueprint' ? 'text-slate-900 dark:text-white hover:text-slate-600' :
                  theme === 'aura' ? 'text-slate-900 dark:text-white hover:text-blue-600' :
                  'text-slate-900 dark:text-white hover:text-emerald-600'
                }`}>Wiki 首页</Link></li>
                <li><Link to="/wiki/intro" onMouseEnter={() => import('./WikiPage')} className={`text-lg font-bold transition-colors ${
                  theme === 'blueprint' ? 'text-slate-900 dark:text-white hover:text-slate-600' :
                  theme === 'aura' ? 'text-slate-900 dark:text-white hover:text-blue-600' :
                  'text-slate-900 dark:text-white hover:text-emerald-600'
                }`}>新手路线</Link></li>
                <li><Link to="/wiki/commands" onMouseEnter={() => import('./WikiPage')} className={`text-lg font-bold transition-colors ${
                  theme === 'blueprint' ? 'text-slate-900 dark:text-white hover:text-slate-600' :
                  theme === 'aura' ? 'text-slate-900 dark:text-white hover:text-blue-600' :
                  'text-slate-900 dark:text-white hover:text-emerald-600'
                }`}>常用功能</Link></li>
                <li><Link to="/wiki/announcement" onMouseEnter={() => import('./WikiPage')} className={`text-lg font-bold transition-colors ${
                  theme === 'blueprint' ? 'text-slate-900 dark:text-white hover:text-slate-600' :
                  theme === 'aura' ? 'text-slate-900 dark:text-white hover:text-blue-600' :
                  'text-slate-900 dark:text-white hover:text-emerald-600'
                }`}>更新日志</Link></li>
              </ul>
            </div>
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">贡献者</h4>
              <a href="https://github.com/addxiaoyi" target="_blank" rel="noreferrer" className={`group flex items-center gap-4 rounded-3xl border px-4 py-4 transition-all hover:-translate-y-0.5 ${
                theme === 'blueprint' ? 'border-slate-200 bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-950' :
                theme === 'aura' ? 'border-blue-100 bg-white/80 hover:shadow-lg hover:shadow-blue-500/10 dark:border-blue-900/50 dark:bg-slate-950/80' :
                'border-emerald-100 bg-white hover:shadow-lg hover:shadow-emerald-500/10 dark:border-emerald-900/50 dark:bg-slate-950'
              }`}>
                <img
                  src="https://github.com/addxiaoyi.png"
                  alt="addxiaoyi avatar"
                  className="h-12 w-12 rounded-2xl border border-slate-200 object-cover dark:border-slate-800"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white">addxiaoyi</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                      theme === 'blueprint' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' :
                      theme === 'aura' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    }`}>维护者</span>
                  </div>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">github.com/addxiaoyi</p>
                </div>
                <ArrowUpRight size={18} className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: '新手路线', desc: '先看加入教程、入门必看、服务器规范。', href: '/wiki/intro' },
              { icon: Wrench, title: '常用功能', desc: '常用指令、领地、经济和基础设置一页就够。', href: '/wiki/commands' },
              { icon: History, title: '更新日志', desc: '先看公告页，及时了解规则和内容变化。', href: '/wiki/announcement' },
            ].map((item, i) => (
              <Link key={i} to={item.href} onMouseEnter={() => import('./WikiPage')} className={`group rounded-3xl border p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${
                theme === 'blueprint' ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950' :
                theme === 'aura' ? 'border-blue-100 bg-white/80 dark:border-blue-900/50 dark:bg-slate-950/80' :
                'border-emerald-100 bg-white dark:border-emerald-900/50 dark:bg-slate-950'
              }`}>
                <div className="mb-4 flex items-center gap-3">
                  <div className={`rounded-2xl p-3 ${theme === 'voxel' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300'}`}>
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
