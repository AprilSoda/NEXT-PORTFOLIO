import { useMemo, useState } from "react";
import Link from "next/link";
import { getDatabase, JOURNAL_DB } from "../../lib/notion";
import { toJournalSummary } from "../../lib/summaries";
import Transition from "../../components/Transition";
import Footer from "../../components/Footer";
import { useT } from "../../lib/i18n";
import { SITE_URL } from "../../components/Layout";

const databaseId_blog = JOURNAL_DB;

const Journal = ({ entries }) => {
  const { t, locale } = useT();
  const [category, setCategory] = useState(null);

  const categories = useMemo(
    () => [...new Set(entries.flatMap((e) => e.categories))].sort(),
    [entries]
  );

  // Newest first, grouped by year
  const groups = useMemo(() => {
    const visible = category ? entries.filter((e) => e.categories.includes(category)) : entries;
    const byYear = new Map();
    for (const entry of visible) {
      const year = entry.date ? new Date(entry.date).getFullYear() : "—";
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year).push(entry);
    }
    return [...byYear.entries()];
  }, [entries, category]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", { month: "short", day: "numeric" });

  return (
    <Transition>
      <div className="journal-page ds-container">
        <header className="journal-head">
          <h1 className="journal-head__title reveal reveal--slide">{t("journal.title")}</h1>
          <p className="journal-head__sub">
            {t("journal.sub")} · <a href={`${SITE_URL}/feed.xml`} className="journal-head__rss u-mono">RSS</a>
          </p>
        </header>

        {categories.length > 0 && (
          <div className="journal-filter u-mono">
            <button className={!category ? "active" : undefined} onClick={() => setCategory(null)}>
              {t("journal.all")}
            </button>
            {categories.map((c) => (
              <button key={c} className={category === c ? "active" : undefined} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
        )}

        {groups.map(([year, items]) => (
          <section key={year} className="journal-year">
            <h2 className="journal-year__label u-mono">{year}</h2>
            <ul className="journal-list">
              {items.map((e) => (
                <li key={e.id}>
                  <Link href={`/journal/${e.slug}`} className="journal-list__item">
                    <span className="journal-list__title">{e.title}</span>
                    <span className="journal-list__meta u-mono">
                      {[e.categories.join(", "), e.date && formatDate(e.date)].filter(Boolean).join(" · ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <Footer />
    </Transition>
  );
};

export default Journal;

export const getStaticProps = async () => {
  const blogs = await getDatabase(databaseId_blog);
  return {
    props: {
      entries: blogs.map(toJournalSummary),
    },
    revalidate: 86400, // R2 urls are permanent; journal rarely changes — refresh daily
  };
};
