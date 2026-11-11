import FeedRefresh, { ArchiveVideos } from "@/components/FeedRefresh";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, pageSchema } from "@/lib/metadata";
import { savedLibrary, snapshotVideos } from "@/lib/video-snapshot";

export const metadata = pageMetadata("/episodes");

export default function Episodes() {
  return <section className="shell inner-page episodes-section episode-archive" aria-labelledby="archive-heading">
    <JsonLd json={pageSchema("/episodes", "CollectionPage")} />
    <a className="back-link" href="/#episodes">Deep Drinks <span aria-hidden="true">/</span></a>
    <div className="section-heading">
      <div><h1 id="archive-heading">All episodes<span className="heading-period">.</span></h1>
        <p>Full-length interviews and panels, newest first.</p></div>
    </div>
    <FeedRefresh initial={savedLibrary()}><ArchiveVideos catalog={snapshotVideos.episodes} /></FeedRefresh>
  </section>;
}
