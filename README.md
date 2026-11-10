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

The homepage contains the latest interviews, clips, Shorts and About section. The old `/about` address redirects to `/#about`. Support, contact, recommended reading, equipment and the disclaimer each have a direct route.

## YouTube

The server checks the [full episode playlist](https://www.youtube.com/playlist?list=PLLZG9iqwGS3M0_VyN7aGNEpsk9kWI7Zhg), the main channel’s [videos](https://www.youtube.com/@DeepDrinks/videos) and [streams](https://www.youtube.com/@DeepDrinks/streams), the [clips channel](https://www.youtube.com/@DeepDrinksClips/videos) and the main channel’s [Shorts](https://www.youtube.com/@DeepDrinks/shorts). Numbered show uploads can appear before they are added to the playlist. Public video IDs are deduplicated and sorted by publication time. Upcoming streams and members-only items are filtered. An active public broadcast takes priority.

Each listing is cached on the server for five minutes and refreshed on demand. An open, visible homepage requests fresh data every five minutes and on return after that interval. The site uses the public channel and watch pages with an Atom fallback. YouTube can change either interface. The checked-in snapshot in `data/youtube.json` and the recent local thumbnails provide an initial fallback during an upstream outage. Snapshot dates were checked against public watch pages on 10 November 2026. Dates display in Brisbane time.

## Contact and affiliate pages

The contact form submits to FormSubmit for david@deepdrinks.com. FormSubmit can require a one-time activation email to that inbox on first use. To verify inbox delivery, submit the published form and complete the provider’s verification if prompted. [Provider documentation](https://formsubmit.co/)

The product selections in `data/resources.ts` mirror the two Amazon lists linked from [David’s Posty page](https://posty.bio/@deepdrinks). They display directly on the site and include the original US affiliate tag and a disclosure. Update the local list when the Amazon selections change. The complete collection buttons always open the original lists.

## Hosting

This checkout is for local design review. When the design is approved, the intended migration destination is David McDonald’s personal Cloudflare account. The preview uses no hosting credentials.
