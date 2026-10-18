import Link from "next/link";
import Transition from "../components/Transition";
import Footer from "../components/Footer";
import { aiPolicy } from "../content/site";
import { useT } from "../lib/i18n";
import { formatDate } from "../lib/dates";

// How generative AI is used in the work — the page every AI disclosure links to
export default function AiPage() {
    const { t, pick, locale } = useT();
    const { intro, uses, limits, labels, updated } = aiPolicy;

    return (
        <Transition>
            <div className="ai-page ds-container">
                <header className="ai-page__head">
                    <p className="u-mono reveal">{t("ai.page.eyebrow")}</p>
                    <h1 className="reveal reveal--slide" style={{ "--d": "0.1s" }}>{t("ai.page.title")}</h1>
                    <p className="ai-page__intro reveal" style={{ "--d": "0.2s" }}>{pick(intro)}</p>
                </header>

                {[uses, limits].map((group) => (
                    <section key={pick(group.title)} className="ai-page__group">
                        <h2 className="u-mono">{pick(group.title)}</h2>
                        <ul>
                            {group.items.map((item) => <li key={item.en}>{pick(item)}</li>)}
                        </ul>
                    </section>
                ))}

                <section className="ai-page__group">
                    <h2 className="u-mono">{pick(labels.title)}</h2>
                    <p>{pick(labels.body)}</p>
                </section>

                <p className="ai-page__updated u-mono">
                    {t("ai.page.updated")} <time dateTime={updated}>{formatDate(updated, locale, { year: "numeric", month: "long", day: "numeric" })}</time>
                    {" · "}
                    <Link href="/works">{t("work.back")}</Link>
                </p>
            </div>
            <Footer />
        </Transition>
    );
}
