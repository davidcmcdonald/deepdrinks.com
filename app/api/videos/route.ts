import { refreshFeeds, REFRESH_MS, videoLibrary, type FeedState } from "@/lib/youtube";
import { savedLibrary } from "@/lib/video-snapshot";

// The static build emits a fallback. Cloudflare routes this path to the feed Worker.
let previous: FeedState | undefined;
let pending: Promise<FeedState> | undefined;

export async function GET() {
  if (process.env.NODE_ENV !== "development") return Response.json(savedLibrary());
  if (!previous || Date.now() - previous.checkedAt >= REFRESH_MS) {
    pending ??= refreshFeeds(previous, process.env.YOUTUBE_API_KEY).finally(() => { pending = undefined; });
    previous = await pending;
  }
  return Response.json(videoLibrary(previous), { headers: { "Cache-Control": "no-store" } });
}
