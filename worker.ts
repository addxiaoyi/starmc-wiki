export interface Env {
  ASSETS: Fetcher;
}

const ASSET_BASE = '/starmc-wiki-page/';

const toAssetRequest = (request: Request, pathname: string) => {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = pathname;
  return new Request(assetUrl.toString(), request);
};

const normalizePath = (pathname: string) => {
  if (pathname.startsWith(ASSET_BASE)) {
    return pathname.slice(ASSET_BASE.length - 1) || '/';
  }
  return pathname;
};

const isProbablyAsset = (pathname: string) => /\.[a-zA-Z0-9]+$/.test(pathname);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = normalizePath(url.pathname);

    if (isProbablyAsset(pathname)) {
      const response = await env.ASSETS.fetch(toAssetRequest(request, pathname));
      if (response.status !== 404) {
        return response;
      }
    }

    const assetResponse = await env.ASSETS.fetch(toAssetRequest(request, pathname));
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    return env.ASSETS.fetch(toAssetRequest(request, '/index.html'));
  },
};
