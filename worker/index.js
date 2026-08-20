const BASE_PATH = "/games/Prisma-Abyss";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Canonicalize the game root to a trailing slash so relative PWA URLs,
    // Service Worker scope, and manifest start_url all resolve consistently.
    if (url.pathname === BASE_PATH) {
      const target = new URL(request.url);
      target.pathname = `${BASE_PATH}/`;
      return Response.redirect(target.toString(), 308);
    }

    // The public game root should show the title screen (main.html).
    // All other existing files are served asset-first by Cloudflare without
    // invoking this Worker because the build preserves the full URL prefix.
    if (url.pathname === `${BASE_PATH}/`) {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = `${BASE_PATH}/main.html`;
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    return new Response("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }
};
