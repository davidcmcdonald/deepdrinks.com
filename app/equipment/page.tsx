import type { Metadata } from "next";
import { equipment } from "@/data/resources";
import CollectionPage from "@/components/CollectionPage";

export const metadata: Metadata = { title: equipment.title, description: equipment.intro, alternates: { canonical: "/equipment" } };

export default function Equipment() {
  return <CollectionPage collection={equipment} />;
}
