# Deep Drinks website audit
10 November 2026

| Reference | What visitors can do | Deep Drinks design choice |
| --- | --- | --- |
| [Bart Ehrman](https://www.bartehrman.com/#articles) | Scan three recent articles by artwork, date and headline, then open the article archive. The homepage also introduces the host. | Give clips a dedicated three-card section, a link to the complete channel listing, and an About section on the homepage. |
| [On Being](https://onbeing.org/series/podcast/) | See who is speaking, what the conversation is about and when it appeared, with a Listen action beside the entry. | Pair each episode’s title with its guest where known, date, running time and direct watch link. The hero opens the latest episode in one click. |
| [The Bible for Normal People](https://thebiblefornormalpeople.com/) | Find books alongside the show and follow a separate path to membership. | Give the bookshelf and studio equipment their own pages, accessible from the menu and the host’s introduction. |
| [The Thinking Atheist](https://www.thethinkingatheist.com/support) | Compare the show’s support options on one page. | Present Patreon and YouTube memberships together, with a direct link to each platform’s current offer. |

## The Deep Drinks identity

The live site uses a white stacked wordmark, a system sans-serif stack, a near-black background (#0a0e13), dark card surfaces (#0f1520) and slate supporting text (#9aa7b2). The redesign keeps those assets and colours. The warm tones come from David’s supplied studio photograph and the show’s own episode artwork. [Existing site](https://www.deepdrinks.com/) · [Website source](https://github.com/davidcmcdonald/DeepDrinksWeb)

## Content and integrations

- Full interviews come from the show playlist and numbered episodes on the main channel’s Videos and Live tabs. Landscape clips and vertical Shorts have separate controls because they publish to different channels and have different viewing formats. [Full interviews](https://www.youtube.com/playlist?list=PLLZG9iqwGS3M0_VyN7aGNEpsk9kWI7Zhg) · [Landscape clips](https://www.youtube.com/@DeepDrinksClips/videos) · [Shorts](https://www.youtube.com/@DeepDrinks/shorts)
- The published link hub leads to Amazon US idea lists containing 19 books and 11 equipment items. Both storefront responses sent `X-Frame-Options: SAMEORIGIN`. The local site displays the selections natively, links each product with David’s existing Associates tag, and links each original list. [Deep Drinks links](https://posty.bio/@deepdrinks) · [Reading list](https://amzn.to/45LJxFT) · [Equipment list](https://amzn.to/42vM2cy) · [Associates participation requirements](https://affiliate-program.amazon.com/help/operating/policies)
- The TGS site submits a browser FormData payload to FormSubmit’s AJAX endpoint. Deep Drinks uses the same provider, recipient-specific endpoint, honeypot and return-email field. [TGS form script](https://www.tgslawnandgarden.com/script.js) · [FormSubmit AJAX](https://formsubmit.co/ajax-documentation)
