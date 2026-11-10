export type Pick = { asin: string; name: string; detail: string };

export type Collection = {
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  listId: string;
  listUrl: string;
  listLabel: string;
  items: Pick[];
};

// Selections and tracking IDs from David's Amazon lists linked at posty.bio/@deepdrinks.
export const reading: Collection = {
  title: "Recommended reading",
  intro: "Books from David’s reading list, including work by guests of the podcast. Explore faith, philosophy, ancient history and the experience of leaving a belief system.",
  image: "/images/studio-books.webp", imageAlt: "Bookshelves in the Deep Drinks studio",
  listId: "3B4JYUUKHIXCD", listUrl: "https://amzn.to/45LJxFT", listLabel: "Reading list",
  items: [
    { asin: "067429033X", name: "Religion as Make-Believe", detail: "Neil Van Leeuwen" },
    { asin: "1964487552", name: "Gospel of Lies", detail: "Promise Backlund" },
    { asin: "1137354135", name: "The Best Argument against God", detail: "Graham Oppy" },
    { asin: "B0CFJTH3VP", name: "A Well-Trained Wife", detail: "Tia Levings" },
    { asin: "0316564672", name: "God’s Ghostwriters", detail: "Candida Moss" },
    { asin: "B07DQV274T", name: "Pure", detail: "Linda Kay Klein" },
    { asin: "1108454720", name: "Atheism and Agnosticism", detail: "Graham Oppy" },
    { asin: "0367243946", name: "Is There a God?", detail: "Graham Oppy and Kenneth L. Pearce" },
    { asin: "0521863864", name: "Arguing About Gods", detail: "Graham Oppy" },
    { asin: "B0CKMV8N8V", name: "Jesus, Contradicted", detail: "Michael R. Licona" },
    { asin: "0062104551", name: "The Myth of Persecution", detail: "Candida Moss" },
    { asin: "0367872161", name: "Argonauts of the Desert", detail: "Philippe Wajdenbaum" },
    { asin: "1108730132", name: "Homer’s Odyssey and the Near East", detail: "Bruce Louden" },
    { asin: "B09K4L9ZRT", name: "The Good Kings", detail: "Kara Cooney" },
    { asin: "0415118646", name: "Miracles in Greco-Roman Antiquity", detail: "Wendy Cotter" },
    { asin: "0140455116", name: "The Republic", detail: "Plato" },
    { asin: "0367878364", name: "Plato and the Creation of the Hebrew Bible", detail: "Russell E. Gmirkin" },
    { asin: "1400031141", name: "The Landmark Herodotus", detail: "Edited by Robert B. Strassler" },
    { asin: "0062686755", name: "How the Bible Actually Works", detail: "Peter Enns" },
  ],
};

export const equipment: Collection = {
  title: "Equipment I use",
  intro: "The microphones, cameras, lights and editing gear in David’s podcast setup.",
  image: "/images/studio-microphone.webp", imageAlt: "The microphone and boom arm at David’s table",
  listId: "1WDTTQA3JAPVK", listUrl: "https://amzn.to/42vM2cy", listLabel: "Equipment list",
  items: [
    { asin: "B001IPUJJI", name: "RØDE Procaster", detail: "Dynamic broadcast microphone" },
    { asin: "B001D7UYBO", name: "RØDE PSA1", detail: "Studio microphone boom arm" },
    { asin: "B086653VSH", name: "Zoom H6 All Black", detail: "Portable audio recorder" },
    { asin: "B09JZT6YK5", name: "Sony Alpha 7 IV", detail: "Full-frame mirrorless camera" },
    { asin: "B09YYY6P98", name: "Sony FE 24–70mm F2.8 GM II", detail: "Standard zoom lens" },
    { asin: "B0C3DJBZQN", name: "Elgato Key Light", detail: "Studio lighting" },
    { asin: "B009S750LA", name: "VIVO dual-monitor desk mount", detail: "Monitor support" },
    { asin: "B07GXB3S7Z", name: "Philips Hue Play light bars", detail: "Pair of ambient lights" },
    { asin: "B09PGSZDHH", name: "Apple MacBook Pro 14-inch M1 Pro", detail: "Editing laptop · renewed listing" },
    { asin: "B01JNLUA5G", name: "Amazon Basics 10-foot XLR cable", detail: "Microphone cable" },
    { asin: "B07P6F84G6", name: "GoScope Alpha Pro case", detail: "Camera case" },
  ],
};

export function amazonLink(asin: string, listId: string) {
  const params = new URLSearchParams({
    linkCode: "spc", tag: "letsmakeagame-20", creativeASIN: asin,
    "asc_item-id": "amzn1.ideas." + listId, ref_: "aip_sf_list_spv_ofs_d_asin",
  });
  return "https://www.amazon.com/dp/" + asin + "?" + params;
}
