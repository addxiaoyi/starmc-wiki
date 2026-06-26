import { MOCK_PAGES } from '../constants';
import { DOCS } from '../docs';

type Posting = { doc: number; tf: number };
type Index = Map<string, Posting[]>;

type DocRecord = {
  slug: string;
  title: string;
  content: string;
  plainText: string;
  pinyinTitle: string;
};

// 常用词汇拼音映射（Wiki 常用词）
const KNOWN_PHRASES: Record<string, string> = {
  '附魔': 'fumo', '入门': 'rumen', '新手': 'xinshou', '生存': 'shengcun',
  '教程': 'jiaocheng', '指南': 'zhinan', '规则': 'guize', '指令': 'zhiling',
  '经济': 'jingji', '领地': 'lingdi', '公会': 'gonghui', '婚姻': 'hunyin',
  '聊天': 'liaotian', '社区': 'shequ', '社交': 'shejiao', '表情': 'biaoqing',
  '动作': 'dongzuo', '互动': 'hudong', '红石': 'hongshi', '钓鱼': 'diaoyu',
  '任务': 'renwu', '传送': 'chuansong', '加入': 'jiaru', '玩法': 'wanfa',
  '帮助': 'bangzhu', '问题': 'wenti', '技巧': 'jiqiao', '攻略': 'gonglue',
  '设置': 'shezhi', '配置': 'peizhi', '安装': 'anzhuang', '启动': 'qidong',
  '客户端': 'kehuduan', '服务器': 'fuwuqi', '连接': 'lianjie', '地址': 'dizhi',
  'IP': 'ip', '端口': 'duankou', '版本': 'banben', '更新': 'gengxin',
  '公告': 'gonggao', '新闻': 'xinwen', '活动': 'huodong', '奖励': 'jiangli',
  '物品': 'wupin', '材料': 'cailiao', '合成': 'hecheng', '配方': 'peifang',
  '附魔书': 'fumofu', '附魔台': 'fumotai', '附魔徽章': 'fumojiangzhang',
  '服务器矩阵': 'fuwuqijuzhen', '核心规则': 'hexinguize',
};

// 汉字转拼音首字母
const toPinyinInitials = (text: string): string => {
  const pyMap: Record<string, string> = {
    '附':'f','魔':'m','书':'s','入':'r','门':'m','新':'x','手':'s',
    '生':'s','存':'c','教':'j','程':'c','指':'z','南':'n','规':'g',
    '则':'z','令':'l','经':'j','济':'j','领':'l','地':'d','公':'g',
    '会':'h','结':'j','婚':'h','姻':'y','聊':'l','天':'t','社':'s',
    '区':'q','交':'j','表':'b','情':'q','动':'d','作':'z','互':'h',
    '红':'h','石':'s','钓':'d','鱼':'y','农':'n','业':'y','任':'r',
    '务':'w','传':'c','送':'s','加':'j','连':'l','接':'j','玩':'w',
    '法':'f','内':'n','容':'r','帮':'b','助':'z','问':'w','题':'t',
    '答':'d','案':'a','方':'f','法':'f','技':'j','巧':'q','攻':'g',
    '略':'l','设':'s','置':'z','配':'p','置':'z','安':'a','装':'z',
    '启':'q','动':'d','客':'k','户':'h','端':'d','器':'q','版':'b',
    '本':'b','更':'g','新':'x','公':'g','告':'g','新':'x','闻':'w',
    '活':'h','动':'d','奖':'j','励':'l','物':'w','品':'p','材':'c',
    '料':'l','合':'h','成':'c','配':'p','方':'f','台':'t','徽':'h',
    '章':'z','矩':'j','阵':'z','核':'h','心':'x','党':'d','派':'p',
    '物':'w','业':'y','战':'z','队':'dui','贸':'m','易':'y','币':'b',
    '金':'j','银':'yin','铜':'tong','铁':'t','木':'m','石':'s','钻':'z',
    '领':'l','主':'z','地':'d','权':'q','地':'d','块':'k','区':'q',
    '边':'b','界':'j','生':'s','态':'t','环':'h','境':'j','资':'z',
    '源':'y','矿':'k','洞':'d','森':'s','林':'l','平':'p','原':'y',
    '山':'s','脉':'m','海':'h','岸':'an','岛':'dao','村':'c',
  };
  return text.split('').map(c => pyMap[c] || c).join('');
};

// 构建文档记录
const docs: DocRecord[] = MOCK_PAGES.map(p => {
  const doc = DOCS.find(d => d.slug === p.slug);
  const content = doc ? doc.content : '';
  return {
    slug: p.slug,
    title: p.title,
    content,
    plainText: `${p.title}\n${content}`,
    pinyinTitle: toPinyinInitials(p.title),
  };
});
const N = docs.length;

// 分词器
const tokenize = (text: string) => {
  const lower = text.toLowerCase();
  const words = lower.match(/[a-z0-9]+/g) ?? [];
  const chars = Array.from(lower.replace(/[\s\p{P}\p{S}]/gu, ''));
  const cn = chars.filter(ch => /[一-鿿]/.test(ch));
  const bigrams = chars.map((_, i, arr) => arr.slice(i, i + 2).join('')).filter(s => s.length === 2);
  const trigrams = chars.map((_, i, arr) => arr.slice(i, i + 3).join('')).filter(s => s.length === 3);
  return [...words, ...cn, ...bigrams, ...trigrams];
};

// 模糊匹配 (Levenshtein)
const levenshtein = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
};

const fuzzyScore = (query: string, target: string): number => {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return 1.0;
  if (t.startsWith(q)) return 0.9;
  const maxLen = Math.max(q.length, t.length);
  const dist = levenshtein(q, t);
  const score = 1 - dist / maxLen;
  if (dist <= 2 && score >= 0.5) return score * 0.7;
  return 0;
};

// 构建索引
const buildIndex = (): { index: Index; df: Map<string, number>; len: number[] } => {
  const index: Index = new Map();
  const df: Map<string, number> = new Map();
  const len: number[] = [];

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const textToIndex = `${doc.title} ${doc.content} ${doc.pinyinTitle}`;
    const tokens = tokenize(textToIndex);
    len[i] = tokens.length;
    const counts: Map<string, number> = new Map();
    for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
    for (const [t, tf] of counts) {
      const postings = index.get(t) ?? [];
      postings.push({ doc: i, tf });
      index.set(t, postings);
      df.set(t, (df.get(t) ?? 0) + 1);
    }
  }
  return { index, df, len };
};

const { index: idx, df, len } = buildIndex();
const avgdl = len.reduce((a, b) => a + b, 0) / Math.max(1, N);
const idf = (t: string) => Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
const bm25 = (tf: number, dlen: number, k1 = 1.2, b = 0.75) => {
  const denom = tf + k1 * (1 - b + b * dlen / Math.max(1, avgdl));
  return tf * (k1 + 1) / Math.max(1e-9, denom);
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, s => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[s] as string));

const uniqueTerms = (terms: string[]) => [...new Set(terms.map(t => t.trim().toLowerCase()).filter(Boolean))];

const highlight = (content: string, query: string) => {
  const cleanTerms = uniqueTerms(tokenize(query));
  const lower = content.toLowerCase();
  let bestPos = -1, bestLen = 0;
  for (const term of cleanTerms) {
    const pos = lower.indexOf(term);
    if (pos >= 0 && (bestPos < 0 || term.length > bestLen || (term.length === bestLen && pos < bestPos))) {
      bestPos = pos;
      bestLen = term.length;
    }
  }
  const anchor = bestPos >= 0 ? bestPos : 0;
  const start = Math.max(0, anchor - 120);
  const end = Math.min(content.length, anchor + Math.max(240, bestLen + 180));
  const snippet = content.slice(start, end);
  let html = escapeHtml(snippet);
  const sortedTerms = [...cleanTerms].sort((a, b) => b.length - a.length);
  const dedupedTerms = sortedTerms.filter((t, _, arr) => !arr.some((u) => u !== t && u.includes(t)));
  for (const term of dedupedTerms) {
    html = html.replace(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), m => `<mark>${m}</mark>`);
  }
  return html;
};

export type SearchResult = { slug: string; title: string; score: number; snippet: string; hitCount: number };

export const search = (query: string, page = 1, pageSize = 20): { results: SearchResult[]; total: number } => {
  const normalized = query.trim().toLowerCase();
  const terms = uniqueTerms(tokenize(normalized));
  if (normalized.length === 0) return { results: [], total: 0 };

  const scores: Map<number, number> = new Map();
  const hitCounts: Map<number, number> = new Map();

  // 拼音首字母
  const pinyinQuery = toPinyinInitials(normalized);

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const haystack = doc.plainText.toLowerCase();
    let hits = 0;

    // 1. 精确匹配 (最高优先级)
    if (haystack.includes(normalized)) {
      scores.set(i, (scores.get(i) ?? 0) + 1000 + normalized.length * 8);
      hits += 3;
    }

    // 2. 拼音首字母匹配
    if (pinyinQuery && doc.pinyinTitle.includes(pinyinQuery)) {
      scores.set(i, (scores.get(i) ?? 0) + 600);
      hits += 2;
    }

    // 3. 分词匹配
    for (const term of terms) {
      if (haystack.includes(term)) {
        const bonus = term.length === 1 ? 6 : term.length * 4;
        scores.set(i, (scores.get(i) ?? 0) + 18 + bonus);
        hits += 1;
      }
    }

    // 4. 模糊匹配 (标题)
    const fuzzyTitleScore = fuzzyScore(normalized, doc.title);
    if (fuzzyTitleScore > 0) {
      scores.set(i, (scores.get(i) ?? 0) + fuzzyTitleScore * 200);
    }

    if (hits > 0) hitCounts.set(i, hits);
  }

  // 5. BM25 评分
  for (const t of terms) {
    const postings = idx.get(t);
    if (!postings) continue;
    const w = idf(t);
    for (const { doc, tf } of postings) {
      scores.set(doc, (scores.get(doc) ?? 0) + bm25(tf, len[doc]) * w);
    }
  }

  const ranked = [...scores.entries()]
    .sort((a, b) => {
      const hitDiff = (hitCounts.get(b[0]) ?? 0) - (hitCounts.get(a[0]) ?? 0);
      if (hitDiff !== 0) return hitDiff;
      return b[1] - a[1];
    })
    .map(([i, score]) => {
      const d = docs[i];
      return { slug: d.slug, title: d.title, score, snippet: highlight(d.content || d.title, normalized), hitCount: hitCounts.get(i) ?? 0 };
    });

  const total = ranked.length;
  const start = (page - 1) * pageSize;
  return { results: ranked.slice(start, start + pageSize), total };
};
