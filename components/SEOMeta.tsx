import { useEffect } from 'react';

interface SEOMetaProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
}

const SITE_NAME = '舵星归途 StarMC Wiki';
const DEFAULT_DESCRIPTION = 'StarMC 服务器官方 Wiki 百科，收录服务器规则、入门指引和常用玩法内容。';
const BASE_URL = 'https://starmc.wiki';

export const SEOMeta: React.FC<SEOMetaProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = `${BASE_URL}/og-image.png`,
  type = 'website',
}) => {
  useEffect(() => {
    const fullTitle = title ? `${title} - ${SITE_NAME}` : SITE_NAME;
    const url = `${BASE_URL}${path}`;

    // 更新 document title
    document.title = fullTitle;

    // 更新或创建 meta 标签
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 基本 meta
    updateMeta('description', description);
    updateMeta('keywords', 'StarMC, Minecraft, Wiki, 服务器, 攻略, 教程');

    // Open Graph
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:url', url, true);
    updateMeta('og:type', type, true);
    updateMeta('og:site_name', SITE_NAME, true);
    updateMeta('og:image', image, true);

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // 清理
    return () => {
      // 恢复默认标题
      document.title = SITE_NAME;
    };
  }, [title, description, path, image, type]);

  return null;
};
