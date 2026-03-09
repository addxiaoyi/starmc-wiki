import { NavItem, WikiPage } from './types';

export const SERVER_NAME = "舵星归途 StarMC";
export const OFFICIAL_WEBSITE = "https://star-web.top";
export const GITHUB_DOCS_PATH = "(docs)";

export const SERVER_IPS = {
  primary: "mc.star-mc.top",
  secondary: "play.star-mc.top",
  mod: "mod.star-mc.top"
};

export const NAVIGATION: NavItem[] = [
  {
    title: "Wiki 首页",
    items: [
      { title: "欢迎", path: "/wiki/index" },
    ]
  },
  {
    title: "新手指南",
    items: [
      { 
        title: "入门必看", 
        path: "/wiki/intro",
        items: [
          { title: "加入教程", path: "/wiki/join" },
          { title: "服务器规范", path: "/wiki/rules" },
          { title: "常见问题 FAQ", path: "/wiki/faq" },
        ]
      },
      { title: "公告与指南", path: "/wiki/announcement" },
      { title: "服务器矩阵", path: "/wiki/server-matrix" },
    ]
  },
  {
    title: "核心系统",
    icon: "🛠️",
    items: [
      { 
        title: "基础支撑", 
        path: "/wiki/core/ResourceLoading",
        items: [
          { title: "自定义资源加载", path: "/wiki/core/ResourceLoading" },
          { title: "跨平台连接指南", path: "/wiki/core/CrossPlatform" },
          { title: "世界高度与边界", path: "/wiki/core/WorldLimits" },
        ]
      },
      {
        title: "游戏机制",
        path: "/wiki/commands",
        items: [
          { title: "基础指令", path: "/wiki/commands" },
          { title: "领地系统", path: "/wiki/residence" },
          { title: "经济与贸易", path: "/wiki/economy" },
          { title: "附魔功能指南", path: "/wiki/enchantments_guide" },
          { title: "红石限制说明", path: "/wiki/redstone" },
        ]
      }
    ]
  },
  {
    title: "生存与探险",
    icon: "⛰️",
    items: [
      { 
        title: "农场生活", 
        path: "/wiki/gameplay/Farming",
        items: [
          { title: "农作物种植指南", path: "/wiki/gameplay/Farming" },
          { title: "趣味垂钓系统", path: "/wiki/gameplay/Fishing" },
        ]
      },
      {
        title: "成长与社交",
        path: "/wiki/gameplay/Skills",
        items: [
          { title: "个人能力与属性", path: "/wiki/gameplay/Skills" },
          { title: "公会与团队建设", path: "/wiki/gameplay/Guilds" },
          { title: "伴侣与婚姻系统", path: "/wiki/social/Marriage" },
        ]
      },
      { title: "城市交通网络", path: "/wiki/gameplay/Transportation" },
    ]
  },
  {
    title: "社区与个性化",
    icon: "🎭",
    items: [
      { 
        title: "玩家形象", 
        path: "/wiki/social/Identity",
        items: [
          { title: "个性化标识系统", path: "/wiki/social/Identity" },
          { title: "皮肤与披风", path: "/wiki/customization" },
        ]
      },
      {
        title: "社交互动",
        path: "/wiki/social/Interaction",
        items: [
          { title: "互动表情与图片", path: "/wiki/social/Expression" },
          { title: "动作与肢体交互", path: "/wiki/social/Interaction" },
          { title: "聊天增强功能", path: "/wiki/social/ChatEnhance" },
        ]
      }
    ]
  },
  {
    title: "经济与福利",
    icon: "💰",
    items: [
      { 
        title: "商业贸易", 
        path: "/wiki/utility/Trading",
        items: [
          { title: "自助贸易商店", path: "/wiki/utility/Trading" },
          { title: "地标传送系统", path: "/wiki/utility/Warp" },
        ]
      },
      {
        title: "日常福利",
        path: "/wiki/utility/Quests",
        items: [
          { title: "每日挑战任务", path: "/wiki/utility/Quests" },
          { title: "福利抽奖系统", path: "/wiki/utility/Luck" },
          { title: "日常签到福利", path: "/wiki/utility/CheckIn" },
        ]
      },
      { title: "服务反馈中心", path: "/wiki/utility/Support" },
    ]
  },
  {
    title: "保姆级教程",
    icon: "📖",
    items: [
      { 
        title: "新手之路", 
        path: "/wiki/guide-survival",
        items: [
          { title: "生存手册", path: "/wiki/guide-survival" },
          { title: "安装与配置", path: "/wiki/guide-install" },
          { title: "启动器指南", path: "/wiki/guide-launcher" },
          { title: "特色玩法探索", path: "/wiki/guide-features" },
          { title: "无脑教程文档", path: "/wiki/guide-no-brain" },
        ]
      }
    ]
  },
  {
    title: "开发者与贡献者",
    items: [
      { title: "贡献指南", path: "/wiki/contributing" },
      { title: "基础模板", path: "/wiki/template" },
    ]
  }
];

export const MOCK_PAGES: WikiPage[] = [
  {
    id: "index",
    slug: "index",
    title: "舵星归途 Wiki",
    category: "首页",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "🏠"
  },
  {
    id: "contributing",
    slug: "contributing",
    title: "贡献指南与 MD 规范",
    category: "开发者与贡献者",
    lastUpdated: "2026-02-10",
    content: "",
    icon: "📝"
  },
  {
    id: "template",
    slug: "template",
    title: "Wiki 页面基础模板",
    category: "开发者与贡献者",
    lastUpdated: "2026-02-10",
    content: "",
    icon: "📄"
  },
  {
    id: "core-resourceloading",
    slug: "core/ResourceLoading",
    title: "自定义资源加载",
    category: "核心系统",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "🛠️",
    parent: "core-base"
  },
  {
    id: "core-crossplatform",
    slug: "core/CrossPlatform",
    title: "跨平台连接指南",
    category: "核心系统",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "🌐",
    parent: "core-base"
  },
  {
    id: "core-worldlimits",
    slug: "core/WorldLimits",
    title: "世界高度与边界",
    category: "核心系统",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "📏",
    parent: "core-base"
  },
  {
    id: "gameplay-farming",
    slug: "gameplay/Farming",
    title: "农作物种植指南",
    category: "生存与探险",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "🌾",
    parent: "gameplay-farming-parent"
  },
  {
    id: "gameplay-fishing",
    slug: "gameplay/Fishing",
    title: "趣味垂钓系统",
    category: "生存与探险",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "🎣",
    parent: "gameplay-farming-parent"
  },
  {
    id: "gameplay-skills",
    slug: "gameplay/Skills",
    title: "个人能力与属性",
    category: "生存与探险",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "🗡️",
    parent: "gameplay-growth"
  },
  {
    id: "gameplay-transportation",
    slug: "gameplay/Transportation",
    title: "城市交通网络",
    category: "生存与探险",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "🚇"
  },
  {
    id: "gameplay-guilds",
    slug: "gameplay/Guilds",
    title: "公会与团队建设",
    category: "生存与探险",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "🛡️",
    parent: "gameplay-growth"
  },
  {
    id: "social-identity",
    slug: "social/Identity",
    title: "个性化标识系统",
    category: "社区与个性化",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "🆔",
    parent: "social-identity-parent"
  },
  {
    id: "social-marriage",
    slug: "social/Marriage",
    title: "伴侣与婚姻系统",
    category: "生存与探险",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "💍",
    parent: "gameplay-growth"
  },
  {
    id: "social-expression",
    slug: "social/Expression",
    title: "互动表情与图片",
    category: "社区与个性化",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "🖼️",
    parent: "social-interaction-parent"
  },
  {
    id: "social-interaction",
    slug: "social/Interaction",
    title: "动作与肢体交互",
    category: "社区与个性化",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "🏃",
    parent: "social-interaction-parent"
  },
  {
    id: "social-chatenhance",
    slug: "social/ChatEnhance",
    title: "聊天增强功能",
    category: "社区与个性化",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "💬",
    parent: "social-interaction-parent"
  },
  {
    id: "utility-trading",
    slug: "utility/Trading",
    title: "自助贸易商店",
    category: "经济与福利",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "💰",
    parent: "utility-trading-parent"
  },
  {
    id: "utility-quests",
    slug: "utility/Quests",
    title: "每日挑战任务",
    category: "经济与福利",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "📜",
    parent: "utility-daily"
  },
  {
    id: "utility-luck",
    slug: "utility/Luck",
    title: "福利抽奖系统",
    category: "经济与福利",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "🎲",
    parent: "utility-daily"
  },
  {
    id: "utility-checkin",
    slug: "utility/CheckIn",
    title: "日常签到福利",
    category: "经济与福利",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "📅",
    parent: "utility-daily"
  },
  {
    id: "utility-warp",
    slug: "utility/Warp",
    title: "地标传送系统",
    category: "经济与福利",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "📍",
    parent: "utility-trading-parent"
  },
  {
    id: "utility-support",
    slug: "utility/Support",
    title: "服务反馈中心",
    category: "经济与福利",
    lastUpdated: "2026-03-09",
    content: "",
    icon: "☎️"
  },
  {
    id: "announcement",
    slug: "announcement",
    title: "公告与服务器指南",
    category: "新手指南",
    lastUpdated: "2026-02-10",
    content: "",
  },
  {
    id: "server-matrix",
    slug: "server-matrix",
    title: "服务器矩阵",
    category: "新手指南",
    lastUpdated: "2026-02-10",
    content: "",
  },
  {
    id: "intro",
    slug: "intro",
    title: "入门必看",
    category: "新手指南",
    lastUpdated: "2026-02-10",
    content: "",
  },
  {
    id: "join",
    slug: "join",
    title: "加入教程",
    category: "新手指南",
    lastUpdated: "2026-02-10",
    content: "",
    parent: "intro",
  },
  {
    id: "rules",
    slug: "rules",
    title: "服务器规范",
    category: "新手指南",
    lastUpdated: "2026-02-10",
    content: "",
    parent: "intro",
  },
  {
    id: "faq",
    slug: "faq",
    title: "常见问题 FAQ",
    category: "新手指南",
    lastUpdated: "2026-02-10",
    content: "",
    parent: "intro",
  },
  {
    id: "commands",
    slug: "commands",
    title: "游戏机制",
    category: "核心系统",
    lastUpdated: "2026-02-10",
    content: "",
  },
  {
    id: "residence",
    slug: "residence",
    title: "领地系统",
    category: "核心系统",
    lastUpdated: "2026-02-10",
    content: "",
    parent: "commands",
  },
  {
    id: "economy",
    slug: "economy",
    title: "经济与贸易",
    category: "核心系统",
    lastUpdated: "2026-02-10",
    content: "",
    parent: "commands",
  },
  {
    id: "enchantments_guide",
    slug: "enchantments_guide",
    title: "附魔功能指南",
    category: "核心系统",
    lastUpdated: "2026-03-07",
    content: "",
    icon: "✨",
    parent: "commands",
  },
  {
    id: "redstone",
    slug: "redstone",
    title: "红石限制说明",
    category: "核心系统",
    lastUpdated: "2026-02-10",
    content: "",
    parent: "commands",
  },
  {
    id: "customization",
    slug: "customization",
    title: "皮肤与披风",
    category: "社区与个性化",
    lastUpdated: "2026-02-10",
    content: "",
    parent: "social-identity-parent",
  },
  {
    id: "guide-install",
    slug: "guide-install",
    title: "安装与配置",
    category: "保姆级教程",
    lastUpdated: "2026-02-10",
    content: "",
    parent: "guide-survival",
  },
  {
    id: "guide-launcher",
    slug: "guide-launcher",
    title: "启动器指南",
    category: "保姆级教程",
    lastUpdated: "2026-02-10",
    content: "",
    parent: "guide-survival",
  },
  {
    id: "guide-features",
    slug: "guide-features",
    title: "特色玩法探索",
    category: "保姆级教程",
    lastUpdated: "2026-02-10",
    content: "",
    parent: "guide-survival",
  },
  {
    id: "guide-survival",
    slug: "guide-survival",
    title: "新手之路",
    category: "保姆级教程",
    lastUpdated: "2026-02-10",
    content: "",
  },
  {
    id: "guide-no-brain",
    slug: "guide-no-brain",
    title: "无脑教程文档",
    category: "保姆级教程",
    lastUpdated: "2026-02-10",
    content: "",
    parent: "guide-survival",
  }
];
