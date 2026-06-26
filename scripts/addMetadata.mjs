/**
 * 批量添加文档元数据
 * 运行: node scripts/addMetadata.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'public/content/wiki');

// 文档元数据配置
const DOC_CONFIG = {
  'index': { title: '舵星归途 Wiki', category: '首页', order: 1, icon: '🏠' },
  'announcement': { title: '更新日志', category: '新手入门', order: 10 },
  'commands': { title: '基础指令', category: '世界基础', order: 20 },
  'contributors': { title: '贡献者名单', category: '其他', order: 900 },
  'customization': { title: 'StarMC 皮肤与个性化指南', category: '其他', order: 910 },
  'core/CrossPlatform': { title: '跨平台连接指南', category: '核心系统', order: 31, icon: '📱' },
  'core/ResourceLoading': { title: '自定义资源加载', category: '核心系统', order: 32, icon: '🛠️' },
  'core/WorldLimits': { title: '世界边界与高度', category: '核心系统', order: 33, icon: '⛰️' },
  'economy': { title: '经济与贸易', category: '世界基础', order: 25 },
  'enchant-beginners': { title: '附魔新手入门', category: '附魔分类', order: 51 },
  'enchant-combos': { title: '附魔推荐搭配', category: '附魔分类', order: 58 },
  'enchant-commands': { title: '附魔指令与查找', category: '附魔分类', order: 59 },
  'enchant-conflicts': { title: '附魔冲突说明', category: '附魔分类', order: 57 },
  'enchant-curses': { title: '诅咒说明', category: '附魔分类', order: 56 },
  'enchant-faq': { title: '附魔 FAQ', category: '附魔分类', order: 54 },
  'enchant-playstyles': { title: '附魔玩法分类', category: '附魔分类', order: 55 },
  'enchant-sources': { title: '附魔获取途径', category: '附魔分类', order: 53 },
  'enchant-tradeoffs': { title: '冲突取舍建议', category: '附魔分类', order: 52 },
  'enchantments_guide': { title: '附魔功能指南', category: '附魔分类', order: 50 },
  'faq': { title: '常见问题 FAQ', category: '新手入门', order: 30 },
  'gameplay/Farming': { title: '农作物种植指南', category: '生存与玩法', order: 61, icon: '🌾' },
  'gameplay/Fishing': { title: '趣味垂钓系统', category: '生存与玩法', order: 62, icon: '🎣' },
  'gameplay/Guilds': { title: '公会与团队建设', category: '生存与玩法', order: 63, icon: '🛡️' },
  'gameplay/Skills': { title: '个人能力与属性', category: '生存与玩法', order: 64, icon: '✨' },
  'gameplay/Transportation': { title: '城市交通网络', category: '生存与玩法', order: 65, icon: '🚇' },
  'guide-features': { title: 'StarMC 特色玩法大搜罗', category: '保姆级教程', order: 82 },
  'guide-install': { title: '加入教程', category: '保姆级教程', order: 83 },
  'guide-launcher': { title: '启动器设置建议', category: '保姆级教程', order: 84 },
  'guide-no-brain': { title: '3 分钟入服指南', category: '保姆级教程', order: 81 },
  'guide-survival': { title: '入门必看', category: '保姆级教程', order: 80 },
  'intro': { title: '入门必看', category: '新手入门', order: 20 },
  'join': { title: '加入教程', category: '新手入门', order: 21, parent: 'intro' },
  'redstone': { title: '红石限制说明', category: '世界基础', order: 22 },
  'residence': { title: '领地系统', category: '世界基础', order: 23 },
  'rules': { title: '服务器规范', category: '新手入门', order: 22, parent: 'intro' },
  'server-matrix': { title: '服务器分区概览', category: '世界基础', order: 24 },
  'social/ChatEnhance': { title: '聊天增强功能', category: '社区与个性化', order: 72, icon: '💬' },
  'social/Expression': { title: '互动表情与图片', category: '社区与个性化', order: 73, icon: '😄' },
  'social/Identity': { title: '个性化标识系统', category: '社区与个性化', order: 70, icon: '🏷️' },
  'social/Interaction': { title: '动作与肢体交互', category: '社区与个性化', order: 74, icon: '🛋️' },
  'social/Marriage': { title: '伴侣与婚姻系统', category: '社区与个性化', order: 75, icon: '❤️' },
  'utility/CheckIn': { title: '日常签到福利', category: '经济与福利', order: 76, icon: '📝' },
  'utility/Luck': { title: '福利抽奖系统', category: '经济与福利', order: 77, icon: '🎰' },
  'utility/Quests': { title: '每日挑战任务', category: '经济与福利', order: 71, icon: '📅' },
  'utility/Support': { title: '服务反馈中心', category: '经济与福利', order: 78, icon: '🎫' },
  'utility/Trading': { title: '自助贸易商店', category: '经济与福利', order: 72, icon: '💰' },
  'utility/Warp': { title: '地标传送系统', category: '经济与福利', order: 73, icon: '📍' },
};

const DOC_ORDER = [
  'index', 'announcement', 'faq', 'intro', 'join', 'rules',
  'commands', 'economy', 'redstone', 'residence', 'server-matrix',
];

// 生成元数据注释
const generateMetaComment = (config) => {
  const lines = ['<!--'];
  lines.push(` TITLE: ${config.title}`);
  lines.push(` CATEGORY: ${config.category}`);
  if (config.order) lines.push(` ORDER: ${config.order}`);
  if (config.parent) lines.push(` PARENT: ${config.parent}`);
  if (config.icon) lines.push(` ICON: ${config.icon}`);
  lines.push(` LAST_UPDATED: ${new Date().toISOString().split('T')[0]}`);
  lines.push('-->');
  return lines.join('\n');
};

// 处理单个文件
const processFile = (filePath, slug) => {
  const config = DOC_CONFIG[slug];
  if (!config) return false;

  let content = fs.readFileSync(filePath, 'utf-8');

  // 检查是否已有元数据
  if (content.includes('<!--')) {
    const existingMeta = content.match(/<!--([\s\S]*?)-->/);
    if (existingMeta) {
      // 已有元数据，检查是否需要更新
      const hasCategory = existingMeta[1].includes('CATEGORY:');
      const hasOrder = existingMeta[1].includes('ORDER:');

      if (hasCategory && hasOrder) {
        console.log(`   ⏭️  跳过 (已有完整元数据): ${slug}`);
        return 'skipped';
      }

      // 更新现有元数据
      let newMeta = existingMeta[1];

      // 更新或添加 CATEGORY
      if (newMeta.includes('CATEGORY:')) {
        newMeta = newMeta.replace(/CATEGORY:.*/g, `CATEGORY: ${config.category}`);
      } else {
        newMeta += `\n CATEGORY: ${config.category}`;
      }

      // 更新或添加 ORDER
      if (config.order) {
        if (newMeta.includes('ORDER:')) {
          newMeta = newMeta.replace(/ORDER:.*/g, `ORDER: ${config.order}`);
        } else {
          newMeta += `\n ORDER: ${config.order}`;
        }
      }

      // 更新或添加 ICON
      if (config.icon) {
        if (newMeta.includes('ICON:')) {
          newMeta = newMeta.replace(/ICON:.*/g, `ICON: ${config.icon}`);
        } else {
          newMeta += `\n ICON: ${config.icon}`;
        }
      }

      content = content.replace(existingMeta[0], newMeta.endsWith('-->') ? `-->\n<!--\n${newMeta}` : `-->\n<!--\n${newMeta}\n-->`);
      content = content.replace(/^-->\n<!--\n/, '<!--\n').replace(/\n-->\n<!--\n/, '\n<!--\n').replace(/-->\n<!--\n-->\n<!--\n/, '-->\n<!--\n');

      // 简化：直接替换整个元数据块
      const newComment = generateMetaComment(config);
      content = content.replace(/<!--[\s\S]*?-->/, newComment);

      fs.writeFileSync(filePath, content);
      console.log(`   🔄 更新: ${slug}`);
      return 'updated';
    }
  }

  // 添加新元数据
  const metaComment = generateMetaComment(config);
  content = metaComment + '\n\n' + content;
  fs.writeFileSync(filePath, content);
  console.log(`   ✨ 添加: ${slug}`);
  return 'added';
};

// 扫描并处理文件
const processDir = (dir, basePath = '') => {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;

    const fullPath = path.join(dir, entry.name);
    const relPath = basePath ? `${basePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      processDir(fullPath, relPath);
    } else if (entry.name.endsWith('.md')) {
      const slug = relPath.replace(/\.md$/i, '');
      processFile(fullPath, slug);
    }
  }
};

// 主流程
console.log('📝 添加文档元数据...\n');

processDir(DOCS_DIR);

console.log('\n✅ 完成！');
