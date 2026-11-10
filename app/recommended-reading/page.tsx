import type { Metadata } from "next";
import { reading } from "@/data/resources";
import CollectionPage from "@/components/CollectionPage";

export const metadata: Metadata = { title: reading.title, description: reading.intro, alternates: { canonical: "/recommended-reading" } };

export default function RecommendedReading() {
  return <CollectionPage collection={reading} books />;
}
