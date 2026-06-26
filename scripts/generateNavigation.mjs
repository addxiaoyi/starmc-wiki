/**
 * 构建脚本：生成侧边栏导航
 * 运行: node scripts/generateNavigation.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'public/content/wiki');
const OUTPUT_FILE = path.join(ROOT, 'src/generated/navigation.json');

// 确保输出目录存在
const outDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 解析 Markdown 元数据
const parseMeta = (content) => {
  const match = content.match(/<!--([\s\S]*?)-->/);
  if (!match) return {};

  const meta = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      const k = key.trim().toUpperCase();
      const v = rest.join(':').trim();
      if (k === 'TITLE') meta.title = v;
      if (k === 'CATEGORY') meta.category = v;
      if (k === 'ORDER') meta.order = parseInt(v, 10);
      if (k === 'ICON') meta.icon = v;
      if (k === 'PARENT') meta.parent = v;
    }
  });

  return meta;
};

// 扫描文档目录（使用完整路径避免重复）
const scanDocs = (dir, basePath = '') => {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;

    const fullPath = path.join(dir, entry.name);
    const relPath = basePath ? `${basePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      results.push(...scanDocs(fullPath, relPath));
    } else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const meta = parseMeta(content);

      // 提取 H1 标题
      let title = meta.title;
      if (!title) {
        const h1 = content.match(/^#\s+(.+)$/m);
        title = h1 ? h1[1].trim() : entry.name.replace(/\.md$/i, '');
      }

      // 使用完整路径作为唯一标识（避免 core/WorldLimits 和 gameplay/WorldLimits 冲突）
      const uniqueId = relPath.replace(/\.md$/i, '');

      results.push({
        slug: uniqueId,
        title,
        category: meta.category || basePath.split('/')[0] || '其他',
        order: meta.order ?? 999,
        icon: meta.icon,
        parent: meta.parent,
      });
    }
  }

  return results;
};

// 预定义的分类映射
const CATEGORY_MAP = {
  // 首页
  'index': '首页',

  // 新手入门
  'announcement': '新手入门',
  'faq': '新手入门',
  'intro': '新手入门',
  'join': '新手入门',
  'rules': '新手入门',

  // 核心系统
  'core': '核心系统',
  'core/ResourceLoading': '核心系统',
  'core/WorldLimits': '核心系统',
  'core/CrossPlatform': '核心系统',

  // 基础功能
  'commands': '基础功能',
  'economie': '基础功能', // 注意拼写
  'economy': '基础功能',
  'redstone': '基础功能',
  'residence': '基础功能',
  'server-matrix': '基础功能',

  // 附魔
  'enchantments': '附魔分类',
  'enchantments_guide': '附魔分类',
  'enchant-beginners': '附魔分类',
  'enchant-faq': '附魔分类',
  'enchant-sources': '附魔分类',
  'enchant-curses': '附魔分类',
  'enchant-playstyles': '附魔分类',
  'enchant-combos': '附魔分类',
  'enchant-tradeoffs': '附魔分类',
  'enchant-conflicts': '附魔分类',
  'enchant-commands': '附魔分类',

  // 生存与玩法
  'gameplay': '生存与玩法',
  'gameplay/Farming': '生存与玩法',
  'gameplay/Fishing': '生存与玩法',
  'gameplay/Skills': '生存与玩法',
  'gameplay/Guilds': '生存与玩法',
  'gameplay/Transportation': '生存与玩法',

  // 社区与个性化
  'social': '社区与个性化',
  'social/Identity': '社区与个性化',
  'social/Expression': '社区与个性化',
  'social/Interaction': '社区与个性化',
  'social/ChatEnhance': '社区与个性化',
  'social/Marriage': '社区与个性化',

  // 经济与福利
  'utility': '经济与福利',
  'utility/Trading': '经济与福利',
  'utility/Warp': '经济与福利',
  'utility/Quests': '经济与福利',
  'utility/Luck': '经济与福利',
  'utility/CheckIn': '经济与福利',
  'utility/Support': '经济与福利',

  // 保姆级教程
  'guide': '保姆级教程',
  'guide-survival': '保姆级教程',
  'guide-install': '保姆级教程',
  'guide-launcher': '保姆级教程',
  'guide-features': '保姆级教程',
  'guide-no-brain': '保姆级教程',

  // 其他
  'contributors': '其他',
  'customization': '其他',
};

// 预定义的父子关系
const PARENT_MAP = {
  'core/ResourceLoading': 'core',
  'core/WorldLimits': 'core',
  'core/CrossPlatform': 'core',

  'gameplay/Farming': 'gameplay',
  'gameplay/Fishing': 'gameplay',
  'gameplay/Skills': 'gameplay',
  'gameplay/Guilds': 'gameplay',
  'gameplay/Transportation': 'gameplay',

  'social/Identity': 'social',
  'social/Expression': 'social',
  'social/Interaction': 'social',
  'social/ChatEnhance': 'social',
  'social/Marriage': 'social',

  'utility/Trading': 'utility',
  'utility/Warp': 'utility',
  'utility/Quests': 'utility',
  'utility/Luck': 'utility',
  'utility/CheckIn': 'utility',
  'utility/Support': 'utility',

  'join': 'intro',
  'rules': 'intro',
};

// 预定义的分类顺序
const CATEGORY_ORDER = [
  '首页',
  '新手入门',
  '核心系统',
  '基础功能',
  '附魔分类',
  '生存与玩法',
  '社区与个性化',
  '经济与福利',
  '保姆级教程',
  '其他',
];

// 分类别名映射
const CATEGORY_ALIAS = {
  'Player Guide': '保姆级教程',
  '玩家教程': '保姆级教程',
  'Guide': '保姆级教程',
  '教程': '保姆级教程',
  'core': '核心系统',
  'gameplay': '生存与玩法',
  'social': '社区与个性化',
  'utility': '经济与福利',
  'enchantments': '附魔分类',
  'Guide': '保姆级教程',
};

// 生成导航树
const generateNavTree = (docs) => {
  // 首先处理分类映射
  for (const doc of docs) {
    // 应用预定义的分类映射（优先匹配完整 slug）
    if (CATEGORY_MAP[doc.slug]) {
      doc.category = CATEGORY_MAP[doc.slug];
    } else if (CATEGORY_MAP[doc.slug.split('/')[0]]) {
      doc.category = CATEGORY_MAP[doc.slug.split('/')[0]];
    } else if (CATEGORY_ALIAS[doc.category]) {
      doc.category = CATEGORY_ALIAS[doc.category];
    }

    // 跳过 gameplay/WorldLimits（与 core/WorldLimits 重复）
    if (doc.slug === 'gameplay/WorldLimits') {
      doc._skip = true;
    }

    // 应用预定义的父子关系
    if (PARENT_MAP[doc.slug]) {
      doc.parent = PARENT_MAP[doc.slug];
    }
  }

  // 过滤掉跳过的文档
  const filteredDocs = docs.filter(d => !d._skip);

  // 按分类分组
  const byCategory = {};
  for (const doc of filteredDocs) {
    if (!byCategory[doc.category]) {
      byCategory[doc.category] = [];
    }
    byCategory[doc.category].push(doc);
  }

  // 生成导航
  const navigation = [];

  // 按预定义顺序处理分类
  const categories = Object.keys(byCategory).sort((a, b) => {
    const aIdx = CATEGORY_ORDER.indexOf(a);
    const bIdx = CATEGORY_ORDER.indexOf(b);
    if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });

  for (const cat of categories) {
    const items = byCategory[cat];
    const navItems = [];
    const slugToItem = {};

    // 按 slug 长度排序（短的先处理，作为父节点）
    const sortedItems = [...items].sort((a, b) => a.slug.split('/').length - b.slug.split('/').length);

    for (const item of sortedItems) {
      const navItem = {
        title: item.title,
        path: `/wiki/${item.slug}`,
      };
      if (item.icon) navItem.icon = item.icon;

      slugToItem[item.slug] = navItem;

      // 检查是否有父节点
      if (item.parent && slugToItem[item.parent]) {
        const parent = slugToItem[item.parent];
        if (!parent.items) parent.items = [];
        parent.items.push(navItem);
        continue;
      }

      // 检查是否有子节点
      const children = items.filter(c =>
        c.slug.startsWith(item.slug + '/') &&
        c.slug.split('/').length === item.slug.split('/').length + 1
      );

      if (children.length > 0) {
        navItem.items = children.map(c => {
          const childNav = {
            title: c.title,
            path: `/wiki/${c.slug}`,
          };
          if (c.icon) childNav.icon = c.icon;
          slugToItem[c.slug] = childNav;
          return childNav;
        });
      }

      // 添加到列表（去重）
      if (!navItems.some(i => i.path === navItem.path)) {
        navItems.push(navItem);
      }
    }

    if (navItems.length > 0) {
      navigation.push({
        title: cat,
        items: navItems,
      });
    }
  }

  return navigation;
};

// 主流程
console.log('📚 生成侧边栏导航...');

const docs = scanDocs(DOCS_DIR);
console.log(`   找到 ${docs.length} 个文档`);

const navigation = generateNavTree(docs);

// 打印分类统计
const categoryCount = {};
for (const section of navigation) {
  categoryCount[section.title] = section.items.length;
}
console.log('\n📊 分类统计:');
for (const [cat, count] of Object.entries(categoryCount)) {
  console.log(`   ${cat}: ${count} 项`);
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(navigation, null, 2));
console.log(`\n   输出: ${OUTPUT_FILE}`);

console.log('\n✅ 完成！');
