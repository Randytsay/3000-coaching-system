import { notFound } from "next/navigation";
import { AcademyNotionPage } from "../../../components/notion-page";
import { TrackLink } from "../../../components/track-link";
import { coachPages, compactPageId } from "../../../lib/coach-navigation";
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
    const currentCoachIndex = coachPages.findIndex((coach) => compactPageId(coach.pageId) === compactPageId(pageId));
    const previousCoach = currentCoachIndex >= 0 ? coachPages[(currentCoachIndex - 1 + coachPages.length) % coachPages.length] : null;
    const nextCoach = currentCoachIndex >= 0 ? coachPages[(currentCoachIndex + 1) % coachPages.length] : null;

    return (
      <main className="academy-shell academy-detail-shell">
        <section className="detail-hero">
          <a className="detail-back" href="/">← 回到五力教練學院</a>
          <p className="eyebrow">教練實作指南</p>
          <h1>{title}</h1>
        </section>

        {currentCoachIndex >= 0 ? <nav className="coach-switcher" aria-label="五力教練快速切換">
          <span className="coach-switcher-label">快速切換五力</span>
          <div>{coachPages.map((coach, index) => <TrackLink key={coach.pageId} href={`/p/${compactPageId(coach.pageId)}`} className={index === currentCoachIndex ? "is-current" : ""} aria-current={index === currentCoachIndex ? "page" : undefined} eventName="academy_coach_switch" eventData={{ from: title, to: coach.title }}><span>{coach.icon}</span>{coach.short}</TrackLink>)}</div>
        </nav> : null}

        <AcademyNotionPage pageId={pageId} recordMap={recordMap} />

        {previousCoach && nextCoach ? <nav className="coach-pager" aria-label="前後教練頁面">
          <TrackLink href={`/p/${compactPageId(previousCoach.pageId)}`} eventName="academy_coach_pager" eventData={{ direction: "previous", to: previousCoach.title }}><small>← 上一個教練</small><strong>{previousCoach.icon} {previousCoach.title}</strong></TrackLink>
          <TrackLink href={`/p/${compactPageId(nextCoach.pageId)}`} eventName="academy_coach_pager" eventData={{ direction: "next", to: nextCoach.title }}><small>下一個教練 →</small><strong>{nextCoach.icon} {nextCoach.title}</strong></TrackLink>
        </nav> : null}
      </main>
    );
  } catch {
    notFound();
  }
}
