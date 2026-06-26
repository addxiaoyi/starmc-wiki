
export interface WikiPage {
  id: string;
  slug: string;
  title: string;
  category: string;
  content: string;
  lastUpdated: string;
  tags?: string[];
  icon?: string;
  parent?: string; // 父页面 slug
}

export interface NavItem {
  title: string;
  path?: string;
  icon?: string;
  items?: NavItem[];
}

export interface SearchResult {
  slug: string;
  title: string;
  score: number;
  snippet: string;
  hitCount: number;
}

// WikiPage 页面元数据（从 Markdown 注释解析）
export interface PageMetadata {
  title?: string;
  category?: string;
  lastUpdated?: string;
  parent?: string;
  icon?: string;
}

// 目录树节点（用于侧边栏）
export interface TocItem {
  level: number;
  text: string;
  id: string;
}

// 文档贡献提交
export interface DocSubmission {
  id: number;
  filename: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}
