export interface Env {
  ASSETS: Fetcher;
}

const ASSET_BASE = '/starmc-wiki-page';

const toAssetPath = (pathname: string) => {
  if (pathname.startsWith(ASSET_BASE)) {
    const stripped = pathname.slice(ASSET_BASE.length) || '/';
    return stripped.startsWith('/') ? stripped : `/${stripped}`;
  }

  return pathname.startsWith('/') ? pathname : `/${pathname}`;
};

const isFileRequest = (pathname: string) => /\.[a-zA-Z0-9]+$/.test(pathname);

const fetchAsset = (request: Request, env: Env, pathname: string) => {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = pathname;
  return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const assetPath = toAssetPath(pathname);

    if (isFileRequest(pathname)) {
      const directAsset = await fetchAsset(request, env, assetPath);
      if (directAsset.status !== 404) {
        return directAsset;
      }
    }

    const pageAsset = await fetchAsset(request, env, assetPath);
    if (pageAsset.status !== 404) {
      return pageAsset;
    }

    return fetchAsset(request, env, '/index.html');
  },
};
