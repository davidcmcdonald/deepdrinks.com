# Deep Drinks Podcast

A local redesign of [the Deep Drinks website](https://www.deepdrinks.com/), built on the existing Next.js App Router project. The [design audit](DESIGN-AUDIT.md) records the reference sites and the decisions taken from each.

## Run the local preview

From this checkout, run:

```powershell
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3125
```

Open [the local preview](http://127.0.0.1:3125/). The production build is `npm run build`.

## Pages

The homepage contains the latest episodes, landscape clips and the About section. The About menu links to that section and to `/about/david`, where David’s biography and two embedded interviews live. The biography currently uses placeholder copy. The headshot gallery at `/about/david/headshots` includes four original JPEG downloads. The old `/about` address redirects to `/#about`.

## YouTube

The server checks the [full episode playlist](https://www.youtube.com/playlist?list=PLLZG9iqwGS3M0_VyN7aGNEpsk9kWI7Zhg), the main channel’s [videos](https://www.youtube.com/@DeepDrinks/videos) and [streams](https://www.youtube.com/@DeepDrinks/streams), and the [clips channel’s Videos tab](https://www.youtube.com/@DeepDrinksClips/videos). Numbered show uploads can appear before they are added to the playlist. Public video IDs are deduplicated and sorted by publication time. Upcoming streams, Shorts and members-only items are filtered. An active public broadcast takes priority.

Each listing is cached on the server for five minutes and refreshed on demand. An open, visible homepage requests fresh data every five minutes and on return after that interval. Episodes use public channel and watch pages with an Atom fallback. Clips use the Videos tab and fall back to verified saved clips if YouTube does not expose the tab. Channel-wide feeds can mix in Shorts. The checked-in snapshot in `data/youtube.json` and the recent local thumbnails provide an initial fallback during an upstream outage. Snapshot dates were checked against public watch pages on 10 November 2026. Dates display in Brisbane time.

## Contact and affiliate pages

The contact form submits to FormSubmit for david@deepdrinks.com. FormSubmit can require a one-time activation email to that inbox on first use. To verify inbox delivery, submit the published form and complete the provider’s verification if prompted. [Provider documentation](https://formsubmit.co/)

The reading and equipment pages use the two public Amazon lists linked from [David’s Posty page](https://posty.bio/@deepdrinks). Each card loads its artwork directly from Amazon and uses the product’s original tagged link. On 10 November 2026, Amazon displayed 178 in the reading-list heading and returned 172 linked products across all nine pages. The equipment list returned 11 of 11.

To update the saved list order, products, links and artwork, run `python scripts/refresh_catalog.py` from this checkout with Python 3.9+, `requests` and `beautifulsoup4`. The script refreshes `data/amazon.json` after both lists finish and preserves edited titles and bylines for existing items.

## Hosting

This checkout is for local design review. When the design is approved, the intended migration destination is David McDonald’s personal Cloudflare account. The preview uses no hosting credentials.
