import React, { useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { gsap } from "gsap";
import { getDatabase, WORKS_DB } from "../../lib/notion";
import { toWorkSummary } from "../../lib/summaries";
import Transition from "../../components/Transition";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import HoverPreview from "../../components/HoverPreview";
import WorkBadges from "../../components/WorkBadges";
import useIsMobile from "../../components/useIsMobile";
import { MouseContext } from "../../components/MouseContext";
import { useT } from "../../lib/i18n";
export const databaseId = WORKS_DB;

const pad = (n) => String(n).padStart(2, "0");
const noop = () => () => {};
// true after hydration, false on the server — keeps the portal out of SSR markup
const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);

// Grid view: rows of two cinematic frames; hovering one widens it
function WorkGrid({ works }) {
    const { handleCursorChange } = useContext(MouseContext);
    const [hovered, setHovered] = useState(null);
    const rows = [];
    for (let i = 0; i < works.length; i += 2) rows.push(works.slice(i, i + 2));

    return (
        <div className="work-grid">
            {rows.map((row, ri) => (
                <div className="work-row" key={ri}>
                    {row.map((work, ci) => {
                        const index = ri * 2 + ci;
                        return (
                            <div key={work.id} className="work-card reveal" style={{ '--d': `${0.25 + index * 0.08}s`, '--reveal-y': '48px' }}>
                                <Link
                                    href={`/works/${work.id}`}
                                    onMouseEnter={() => { handleCursorChange("hover"); setHovered(work.id); }}
                                    onMouseLeave={() => { handleCursorChange("off"); setHovered(null); }}
                                    onFocus={() => setHovered(work.id)}
                                    onBlur={() => setHovered(null)}
                                >
                                    <div className="work-card__media">
                                        <Button type="pic">
                                            <HoverPreview
                                                cover={work.cover}
                                                preview={work.preview}
                                                alt={work.title}
                                                active={hovered === work.id}
                                                priority={index < 4}
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        </Button>
                                        <WorkBadges work={work} />
                                    </div>
                                    <div className="work-card__meta u-mono">
                                        <span className="work-card__index">{pad(index + 1)}</span>
                                        <span className="work-card__title">{work.title}</span>
                                        <span className="work-card__cat">{work.category}</span>
                                        <span className="work-card__year">{work.year}</span>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

// List view: one row per project; the hovered row's frame follows the cursor
function WorkList({ works }) {
    const [active, setActive] = useState(null);
    // The frame follows the pointer, so it only appears once there is one —
    // keyboard focus alone leaves it hidden instead of parked at (0, 0)
    const [pointer, setPointer] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.4 });
    const current = pointer ? works.find((w) => w.id === active) : null;
    const hydrated = useHydrated();

    return (
        <div
            className="work-list"
            onMouseMove={(e) => {
                if (!pointer) { x.jump(e.clientX); y.jump(e.clientY); sx.jump(e.clientX); sy.jump(e.clientY); setPointer(true); }
                x.set(e.clientX); y.set(e.clientY);
            }}
            onMouseLeave={() => { setActive(null); setPointer(false); }}
        >
            <ul>
                {works.map((work, i) => (
                    <li key={work.id}>
                        <Link
                            href={`/works/${work.id}`}
                            className="work-list__row"
                            onMouseEnter={() => setActive(work.id)}
                            onFocus={() => setActive(work.id)}
                            onBlur={() => setActive(null)}
                        >
                            <span className="work-list__index u-mono">{pad(i + 1)}</span>
                            <span className="work-list__title">{work.title}</span>
                            <span className="work-list__meta u-mono">
                                {[work.category, work.role, work.year].filter(Boolean).join(" · ")}
                            </span>
                            <WorkBadges work={work} />
                        </Link>
                    </li>
                ))}
            </ul>
            {/* Portaled to <body>: transformed ancestors would otherwise offset a fixed element */}
            {hydrated && createPortal(
            <AnimatePresence>
                {current && (
                    <motion.div
                        className="work-list__float"
                        style={{ x: sx, y: sy }}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
                        aria-hidden="true"
                    >
                        <HoverPreview key={current.id} cover={current.cover} preview={current.preview} alt="" active sizes="420px" />
                    </motion.div>
                )}
            </AnimatePresence>,
            document.body)}
        </div>
    );
}

const Works = ({ works }) => {
    const { t } = useT();
    const router = useRouter();
    const isMobile = useIsMobile();
    const view = router.query.view === "list" && !isMobile ? "list" : "grid";
    const gridRef = useRef(null);
    const headRef = useRef(null);

    // Keep the chosen view in the URL so it survives refresh and back navigation
    const setView = (next) =>
        router.replace({ pathname: router.pathname, query: next === "list" ? { view: "list" } : {} }, undefined, { shallow: true, scroll: false });

    // Mouse parallax — the grid drifts toward the cursor (layered: grid moves more
    // than the heading for depth). Desktop grid only, reduced-motion safe.
    useEffect(() => {
        if (isMobile || view !== "grid") return;
        if (typeof window === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const grid = gridRef.current;
        const head = headRef.current;
        if (!grid) return;
        const gx = gsap.quickTo(grid, "x", { duration: 0.7, ease: "power3.out" });
        const gy = gsap.quickTo(grid, "y", { duration: 0.7, ease: "power3.out" });
        const hx = head ? gsap.quickTo(head, "x", { duration: 0.9, ease: "power3.out" }) : null;
        const hy = head ? gsap.quickTo(head, "y", { duration: 0.9, ease: "power3.out" }) : null;
        const onMove = (e) => {
            const nx = (e.clientX / window.innerWidth - 0.5) * 2;  // -1..1
            const ny = (e.clientY / window.innerHeight - 0.5) * 2;
            gx(nx * 28); gy(ny * 20);
            if (hx) { hx(nx * 11); hy(ny * 8); }
        };
        window.addEventListener("mousemove", onMove);
        return () => {
            window.removeEventListener("mousemove", onMove);
            gsap.killTweensOf([grid, head].filter(Boolean));
            gsap.set([grid, head].filter(Boolean), { x: 0, y: 0 });
        };
    }, [isMobile, view]);

    return (
        <Transition>
            <section className="works">
                <div className="ds-container">
                    <div className="work-head" ref={headRef}>
                        <span className="work-head__eyebrow u-mono reveal" style={{ '--d': '0.1s' }}>
                            {t("work.eyebrow")} [ {pad(works.length)} ]
                        </span>
                        <h1 className="work-head__title">
                            <span className="reveal reveal--slide" style={{ '--d': '0.15s' }}>SELECTED</span>
                            <span className="reveal reveal--slide" style={{ '--d': '0.22s' }}>WORK</span>
                        </h1>
                        <p className="work-head__intro reveal" style={{ '--d': '0.3s' }}>
                            {t("work.intro")}
                        </p>
                    </div>

                    {!isMobile && (
                        <div className="work-view u-mono" role="group" aria-label={t("work.view")}>
                            {["grid", "list"].map((v) => (
                                <button key={v} aria-pressed={view === v} className={view === v ? "active" : undefined} onClick={() => setView(v)}>
                                    {t(`work.view.${v}`)}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="work-grid-wrap" ref={gridRef}>
                        {view === "list" ? <WorkList works={works} /> : <WorkGrid works={works} />}
                    </div>
                </div>
            </section>
            <Footer />
        </Transition>
    );
};

export const getStaticProps = async () => {
    const database = await getDatabase(databaseId);
    return {
        props: {
            works: database.map(toWorkSummary),
        },
        revalidate: 86400, // R2 urls are permanent; portfolio rarely changes — refresh daily
    };
};

export default Works;
