import { pageMetadata } from "@/lib/metadata";
import { reading } from "@/data/resources";
import CollectionPage from "@/components/CollectionPage";

export const metadata = pageMetadata("/recommended-reading");

export default function RecommendedReading() {
  return <CollectionPage collection={reading} books />;
}
