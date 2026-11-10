import catalog from "./amazon.json";

export type Pick = {
  asin: string;
  name: string;
  detail: string;
  image: string;
  url: string;
};

export type Collection = {
  title: string;
  intro: string;
  listUrl: string;
  items: Pick[];
};

export const reading: Collection = {
  title: "Recommended reading",
  intro: "Read work by guests of the podcast and other books David recommends on faith, philosophy and history.",
  listUrl: "https://amzn.to/45LJxFT", items: catalog.reading,
};

export const equipment: Collection = {
  title: "Equipment I use",
  intro: "The microphones, cameras, lights and editing gear in David’s podcast setup.",
  listUrl: "https://amzn.to/42vM2cy", items: catalog.equipment,
};
