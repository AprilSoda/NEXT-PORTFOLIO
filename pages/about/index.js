import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Transition from "../../components/Transition";
import Footer from "../../components/Footer";
import CreditList from "../../components/CreditList";
import { about, identity } from "../../content/site";
import { useT } from "../../lib/i18n";

const reveal = {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10% 0px" },
    transition: { duration: 1, ease: [0.19, 1, 0.22, 1] },
};

const About = () => {
    const { t, pick } = useT();

    return (
        <Transition>
            <div className="about-page ds-container">
                <section className="about-hero">
                    <div className="about-hero__text">
                        <p className="about-label u-mono">{t("about.eyebrow")}</p>
                        <h1 className="about-hero__name">{pick(identity.name)}</h1>
                        <p className="about-hero__role">{pick(identity.role)}</p>
                        <p className="about-hero__contact u-mono">
                            <a href="mailto:hello@kimtaekyun.dev">hello@kimtaekyun.dev</a>
                            <span>{pick(identity.location)} (UTC+9)</span>
                        </p>
                    </div>
                    <div className="about-hero__portrait">
                        <Image src="/about-1.webp" alt={pick(identity.name)} fill priority sizes="(max-width: 768px) 100vw, 40vw" style={{ objectFit: "cover" }} />
                    </div>
                </section>

                <motion.section className="about-manifesto" {...reveal}>
                    {about.manifesto.map((p, i) => (
                        <p key={i}>{pick(p)}</p>
                    ))}
                </motion.section>

                <motion.section className="about-block" {...reveal}>
                    <h2 className="about-label u-mono">{t("about.now")}</h2>
                    <p className="about-block__text">{pick(about.now)}</p>
                </motion.section>

                <motion.section className="about-block" {...reveal}>
                    <h2 className="about-label u-mono">{t("about.approach")}</h2>
                    <ol className="about-approach">
                        {about.approach.map((step, i) => (
                            <li key={i}>
                                <span className="about-approach__index u-mono">{String(i + 1).padStart(2, "0")}</span>
                                <h3>{pick(step.title)}</h3>
                                <p>{pick(step.text)}</p>
                            </li>
                        ))}
                    </ol>
                </motion.section>

                <motion.section className="about-block" {...reveal}>
                    <h2 className="about-label u-mono">{t("about.practice")}</h2>
                    <ul className="about-practice">
                        {about.practice.map((item, i) => (
                            <li key={i}>{pick(item)}</li>
                        ))}
                    </ul>
                </motion.section>

                <motion.section className="about-block" {...reveal}>
                    <h2 className="about-label u-mono">{t("home.credits")}</h2>
                    <CreditList />
                </motion.section>

                <motion.section className="about-block" {...reveal}>
                    <h2 className="about-label u-mono">{t("about.tools")}</h2>
                    <p className="about-tools">{about.tools.join(" · ")}</p>
                </motion.section>

                <motion.section className="about-block" {...reveal}>
                    <h2 className="about-label u-mono">{t("about.colophon")}</h2>
                    <p className="about-tools">{pick(about.colophon)} <Link href="/ai">{t("ai.page.link")}</Link></p>
                </motion.section>

                <motion.section className="about-block about-links" {...reveal}>
                    <Link href="/contact" className="u-mono">{t("home.contactCta")} →</Link>
                    <a href="/cv.pdf" download className="u-mono">{t("about.cv")} ↓</a>
                </motion.section>
            </div>
            <Footer />
        </Transition>
    );
};

export default About;
