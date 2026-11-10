# Deep Drinks Podcast

A local redesign of [the Deep Drinks website](https://www.deepdrinks.com/), built on the existing Next.js App Router project. The [design audit](DESIGN-AUDIT.md) records the reference sites and the decisions taken from each.

## Run the local preview

From this checkout, run:

```powershell
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3125
```

Open [the local preview](http://127.0.0.1:3125/). Use Node 22.12 or newer for the Cloudflare tooling. The production build is `npm run build`.

## Pages

The homepage contains the latest episodes, landscape clips and the About section. The About menu links to that section and to `/about/david`, where David’s biography and two embedded interviews live. The headshot gallery at `/about/david/headshots` includes four original JPEG downloads. The old `/about` address redirects to `/#about`.

## YouTube

The homepage combines the [full episode playlist](https://www.youtube.com/playlist?list=PLLZG9iqwGS3M0_VyN7aGNEpsk9kWI7Zhg) with numbered releases on the main channel’s [Videos](https://www.youtube.com/@DeepDrinks/videos) and [Live](https://www.youtube.com/@DeepDrinks/streams) tabs. Clips come from the dedicated [Videos tab](https://www.youtube.com/@DeepDrinksClips/videos). The feed deduplicates video IDs, prioritizes a current public broadcast, and excludes upcoming streams, private videos, Shorts and listed members-only previews.

The static HTML contains a verified set of episodes and clips. The homepage fetches `/api/videos` on arrival and every five minutes while visible. Returning to a visible tab also triggers a check once that interval has elapsed. The Cloudflare Worker caches responses at the edge and shares one refresh across locations using a SQLite-backed Durable Object. Each source retains its last successful list through an upstream outage. A first visit during a complete outage uses the bundled `data/youtube.json` snapshot. Cached broadcasts lose their live badge when their source cannot be checked.

The keyless reader uses YouTube’s public tabs and playlist pages. If a public watch page is bot-gated, a verified public tab can still announce a new video with YouTube’s relative publication label. Exact publication dates display in Brisbane time when available. The official YouTube Data API is an independent source for hosts that consistently receive blocked public pages. Enable YouTube Data API v3 in a Google project and store its API-restricted key as the Worker secret `YOUTUBE_API_KEY`. For local Next development use `.env.local`. Wrangler reads `.dev.vars` for local Worker development. [YouTube Data API credentials](https://developers.google.com/youtube/v3/getting-started) · [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

## Contact and affiliate pages

The contact form submits to FormSubmit for david@deepdrinks.com. FormSubmit can require a one-time activation email to that inbox on first use. To verify inbox delivery, submit the published form and complete the provider’s verification if prompted. [Provider documentation](https://formsubmit.co/)

The reading and equipment pages use the two public Amazon lists linked from [David’s Posty page](https://posty.bio/@deepdrinks). Each card loads its artwork directly from Amazon and uses the product’s original tagged link. On 10 November 2026, Amazon displayed 178 in the reading-list heading and returned 172 linked products across all nine pages. The equipment list returned 11 of 11.

To update the saved list order, products, links and artwork, run `python scripts/refresh_catalog.py` from this checkout with Python 3.9+, `requests` and `beautifulsoup4`. The script refreshes `data/amazon.json` after both lists finish and preserves edited titles and bylines for existing items.

## Cloudflare hosting

The site runs as the `deepdrinks-com` Worker in David McDonald’s personal Cloudflare account. Next.js 14 exports the pages and artwork to `out/`. The Worker handles the video feed and the former `/about` URL. Wrangler creates the `VideoFeed` SQLite Durable Object binding on first deployment. Records are written only to this site’s Cloudflare storage. [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) · [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/get-started/)

From this checkout, build and check the deployment locally.

```powershell
npm ci
npm run build
npm run cf:check
npm run preview
```

The Worker preview defaults to [localhost on port 8787](http://127.0.0.1:8787/). Open [the local feed](http://127.0.0.1:8787/api/videos) to inspect the public IDs and the per-section `saved` fallback flags.

For Workers Builds, use `npm run build` as the build command and `npm run deploy` as the deploy command from the repository root. For a manual deploy, use `npx wrangler whoami` to verify David’s personal account, build, then run `npm run deploy`. Set `YOUTUBE_API_KEY` in that Worker’s settings or with `npx wrangler secret put YOUTUBE_API_KEY`. The workers.dev preview stays on its own hostname.

Attach the intended hostnames in Cloudflare when DNS is active. To preserve the canonical hostname, add a zone Single Redirect matching `http.host eq "deepdrinks.com"`, set the dynamic target to `concat("https://www.deepdrinks.com", http.request.uri.path)`, choose HTTP 308, and enable **Preserve query string**. The zone rule covers static assets as well as Worker routes. [Cloudflare Single Redirects](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/)
