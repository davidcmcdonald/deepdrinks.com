import { DurableObject } from "cloudflare:workers";
import { refreshFeeds, REFRESH_MS, videoLibrary } from "../lib/youtube";
import { savedLibrary } from "../lib/video-snapshot";

// A single object shares each refresh across all visitors and stores the last
// successful results for each YouTube tab independently of regional cache evictions.
export class VideoFeed extends DurableObject {
  async current() {
    const saved = await this.ctx.storage.get("feeds");
    if (saved && Date.now() - saved.checkedAt < REFRESH_MS) return saved;
    const state = await refreshFeeds(saved, this.env.YOUTUBE_API_KEY);
    await this.ctx.storage.put("feeds", state);
    return state;
  }

  async fetch() {
    this.pending ??= this.current().finally(() => { this.pending = undefined; });
    const state = await this.pending;
    const ttl = Math.max(1, Math.ceil((state.checkedAt + REFRESH_MS - Date.now()) / 1000));
    return Response.json(videoLibrary(state), { headers: { "Cache-Control": "public, max-age=" + ttl } });
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.hostname === "deepdrinks.com") {
      url.protocol = "https:";
      url.host = "www.deepdrinks.com";
      return Response.redirect(url, 308);
    }
    if (url.pathname === "/about" || url.pathname === "/about/") {
      url.pathname = "/";
      url.hash = "about";
      return Response.redirect(url, 308);
    }
    if (url.pathname !== "/api/videos" && url.pathname !== "/api/videos/") return env.ASSETS.fetch(request);
    if (request.method !== "GET" && request.method !== "HEAD") return new Response(null, { status: 405, headers: { Allow: "GET, HEAD" } });
    const cacheKey = new Request(new URL("/api/videos", url));
    const cache = caches.default;
    let response = await cache.match(cacheKey);
    if (!response) {
      try {
        const feed = env.VIDEO_FEED.getByName("public-youtube-v1");
        response = await feed.fetch(cacheKey);
        if (!response.ok) throw new Error("Feed response " + response.status);
      } catch (error) {
        console.error("Video feed unavailable", error.message);
        response = Response.json(savedLibrary(), { headers: { "Cache-Control": "public, max-age=30" } });
      }
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    }
    return request.method === "HEAD" ? new Response(null, response) : response;
  },
};
