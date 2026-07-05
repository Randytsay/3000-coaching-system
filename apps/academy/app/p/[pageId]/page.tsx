import { notFound } from "next/navigation";
import { AcademyNotionPage } from "../../../components/notion-page";
import { getPageRecordMap, getRendererPageTitle } from "../../../lib/notion";

export const revalidate = 300;

export default async function AcademySubPage({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;

  try {
    const recordMap = await getPageRecordMap(pageId);
    const title = getRendererPageTitle(recordMap);

    return (
      <main className="academy-shell academy-detail-shell">
        <section className="detail-hero">
          <a className="detail-back" href="/">← 回到五力教練學院</a>
          <p className="eyebrow">教練實作指南</p>
          <h1>{title}</h1>
        </section>

        <AcademyNotionPage pageId={pageId} recordMap={recordMap} />
      </main>
    );
  } catch {
    notFound();
  }
}
