const youtube = "https://www.youtube.com";
const channel = youtube + "/@" + (process.env.NEXT_PUBLIC_YT_HANDLE || "DeepDrinks");
const playlistId = process.env.NEXT_PUBLIC_PLAYLIST_ID || "PLLZG9iqwGS3M0_VyN7aGNEpsk9kWI7Zhg";

export const SITE = {
  title: "Deep Drinks Podcast",
  description: "David McDonald talks religion, philosophy, science and human rights with scholars, creators and people who have lived the story.",
  url: "https://www.deepdrinks.com",
  logo: "/images/logo.png",
  youtubeChannel: channel,
  playlist: youtube + "/playlist?list=" + encodeURIComponent(playlistId),
  clips: youtube + "/@DeepDrinksClips/videos",
  email: "david@deepdrinks.com",
  socials: {
    youtube: channel,
    spotify: "https://open.spotify.com/show/4TjeHzFi4JqcHZ06zx4aHK",
    apple: "https://podcasts.apple.com/us/podcast/deep-drinks/id1633403813",
    hub: "https://posty.bio/@deepdrinks",
    patreon: "https://www.patreon.com/c/DeepDrinks",
    members: youtube + "/channel/UCB9JcmYVd-oHcZyCNraCiug/join",
    paypal: "https://paypal.me/davidmcdonald89",
    coffee: "https://buymeacoffee.com/davidmcdonald",
  },
};
