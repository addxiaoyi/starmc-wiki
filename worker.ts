export interface Env {
  ASSETS: Fetcher;
}

const isAssetRequest = (url: URL) => {
  return /\.[a-zA-Z0-9]+$/.test(url.pathname);
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (isAssetRequest(url)) {
      return env.ASSETS.fetch(request);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(indexUrl.toString(), request));
  },
};
