import { MOCK_PAGES } from '../constants';
import { DOCS } from '../docs';

type Posting = { doc: number; tf: number };
type Index = Map<string, Posting[]>;

type DocRecord = {
  slug: string;
  title: string;
  content: string;
  plainText: string;
};

const docs: DocRecord[] = MOCK_PAGES.map(p => {
  const doc = DOCS.find(d => d.slug === p.slug);
  const content = doc ? doc.content : '';
  return {
    slug: p.slug,
    title: p.title,
    content,
    plainText: `${p.title}\n${content}`,
  };
});
const N = docs.length;

const tokenize = (text: string) => {
  const lower = text.toLowerCase();
  const words = lower.match(/[a-z0-9]+/g) ?? [];
  const chars = Array.from(lower.replace(/[\s\p{P}\p{S}]/gu, ''));
  const cn = chars.filter(ch => /[\u4e00-\u9fff]/.test(ch));
  const bigrams = chars
    .map((_, i, arr) => arr.slice(i, i + 2).join(''))
    .filter(s => s.length === 2);
  const trigrams = chars
    .map((_, i, arr) => arr.slice(i, i + 3).join(''))
    .filter(s => s.length === 3);
  return [...words, ...cn, ...bigrams, ...trigrams];
};

const buildIndex = (): { index: Index; df: Map<string, number>; len: number[] } => {
  const index: Index = new Map();
  const df: Map<string, number> = new Map();
  const len: number[] = [];
  for (let i = 0; i < docs.length; i++) {
    const tokens = tokenize(docs[i].title + ' ' + docs[i].content);
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

const { index, df, len } = buildIndex();
const avgdl = len.reduce((a, b) => a + b, 0) / Math.max(1, N);

const idf = (t: string) => Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));

const bm25 = (tf: number, dlen: number, k1 = 1.2, b = 0.75) => {
  const denom = tf + k1 * (1 - b + b * dlen / Math.max(1, avgdl));
  return tf * (k1 + 1) / Math.max(1e-9, denom);
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, s => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[s] as string));

const uniqueTerms = (terms: string[]) => [...new Set(terms.map(t => t.trim().toLowerCase()).filter(Boolean))];

const highlight = (content: string, query: string) => {
  const cleanTerms = uniqueTerms(tokenize(query));
  const lower = content.toLowerCase();

  let bestPos = -1;
  let bestLen = 0;
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

  for (const term of [...cleanTerms].sort((a, b) => b.length - a.length)) {
    html = html.replace(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), m => `<mark>${m}</mark>`);
  }

  return html;
};

export type SearchResult = { slug: string; title: string; score: number; snippet: string };

export const search = (query: string, page = 1, pageSize = 20): { results: SearchResult[]; total: number } => {
  const normalized = query.trim().toLowerCase();
  const terms = uniqueTerms(tokenize(normalized));
  if (normalized.length === 0) return { results: [], total: 0 };

  const scores: Map<number, number> = new Map();

  for (let i = 0; i < docs.length; i++) {
    const haystack = docs[i].plainText.toLowerCase();
    if (haystack.includes(normalized)) {
      scores.set(i, (scores.get(i) ?? 0) + 1000 + normalized.length * 8);
    }

    for (const term of terms) {
      if (haystack.includes(term)) {
        const bonus = term.length === 1 ? 6 : term.length * 4;
        scores.set(i, (scores.get(i) ?? 0) + 18 + bonus);
      }
    }
  }

  for (const t of terms) {
    const postings = index.get(t);
    if (!postings) continue;
    const w = idf(t);
    for (const { doc, tf } of postings) {
      const s = bm25(tf, len[doc]) * w;
      scores.set(doc, (scores.get(doc) ?? 0) + s);
    }
  }

  const ranked = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([i, score]) => {
      const d = docs[i];
      return { slug: d.slug, title: d.title, score, snippet: highlight(d.content || d.title, normalized) };
    });

  const total = ranked.length;
  const start = (page - 1) * pageSize;
  const results = ranked.slice(start, start + pageSize);
  return { results, total };
};
