import { pageMetadata } from "@/lib/metadata";
import { equipment } from "@/data/resources";
import CollectionPage from "@/components/CollectionPage";

export const metadata = pageMetadata("/equipment");

export default function Equipment() {
  return <CollectionPage collection={equipment} />;
}
