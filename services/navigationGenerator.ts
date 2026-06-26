import fs from 'fs';
import path from 'path';

interface DocMeta {
  title?: string;
  category?: string;
  order?: number;
}

interface DocEntry {
  slug: string;
  title: string;
  category: string;
  order: number;
}

// 解析 Markdown 文件的元数据
const parseDocMeta = (content: string): DocMeta => {
  const metaMatch = content.match(/<!--([\s\S]*?)-->/);
  if (!metaMatch) return {};

  const meta: DocMeta = {};
  metaMatch[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      const k = key.trim().toUpperCase();
      const v = rest.join(':').trim();
      if (k === 'TITLE') meta.title = v;
      if (k === 'CATEGORY') meta.category = v;
      if (k === 'ORDER') meta.order = parseInt(v, 10);
    }
  });

  return meta;
};

// 扫描目录生成文档列表
export const scanWikiDocs = (dirPath: string): DocEntry[] => {
  const docs: DocEntry[] = [];

  const scanDir = (dir: string, prefix: string = '') => {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    // 按文件名排序
    entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;

      if (entry.isDirectory()) {
        scanDir(path.join(dir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name);
      } else if (entry.name.endsWith('.md')) {
        const slug = (prefix ? `${prefix}/` : '') + entry.name.replace(/\.md$/i, '');
        const content = fs.readFileSync(path.join(dir, entry.name), 'utf-8');
        const meta = parseDocMeta(content);

        // 提取标题（如果没有在元数据中指定）
        let title = meta.title || slug.split('/').pop() || slug;
        if (!meta.title) {
          const h1Match = content.match(/^#\s+(.+)$/m);
          if (h1Match) title = h1Match[1].trim();
        }

        docs.push({
          slug,
          title,
          category: meta.category || prefix.split('/')[0] || '未分类',
          order: meta.order || 999,
        });
      }
    }
  };

  scanDir(dirPath);
  return docs.sort((a, b) => a.order - b.order);
};

// 根据文档列表生成导航结构
export const generateNavigation = (docs: DocEntry[]): Record<string, NavItem[]> => {
  const sections: Record<string, NavItem[]> = {};

  // 按分类分组
  for (const doc of docs) {
    const category = doc.category;
    if (!sections[category]) {
      sections[category] = [];
    }

    // 处理子页面（slug 包含 / 的为子页面）
    const parts = doc.slug.split('/');
    const parentSlug = parts.length > 1 ? parts.slice(0, -1).join('/') : null;

    const navItem: NavItem = {
      title: doc.title,
      path: `/wiki/${doc.slug}`,
    };

    if (parentSlug) {
      // 找到或创建父分组
      const parentTitle = docs.find(d => d.slug === parentSlug)?.title || parentSlug;
      let parent = sections[category]?.find(item => item.title === parentTitle);

      if (!parent) {
        parent = {
          title: parentTitle,
          items: [],
        };
        sections[category].push(parent);
      }

      if (!parent.items) parent.items = [];
      parent.items.push(navItem);
    } else {
      sections[category].push(navItem);
    }
  }

  return sections;
};

// 导出类型
interface NavItem {
  title: string;
  path?: string;
  icon?: string;
  items?: NavItem[];
}

export { NavItem };
