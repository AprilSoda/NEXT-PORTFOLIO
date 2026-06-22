import React, { useContext, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { getDatabase } from "../../lib/notion";
import Transition from "../../components/Transition";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import useIsMobile from "../../components/useIsMobile";
import { MouseContext } from "../../components/MouseContext";
export const databaseId = process.env.NOTION_DATABASE_ID;

//Create Context
export const MovieContext = React.createContext();

const yearOf = (post) => {
    const d = post.properties?.date?.date?.start;
    return d ? new Date(d).getFullYear() : "";
};

const Works = ({ posts }) => {
    const { handleCursorChange } = useContext(MouseContext);
    const [selectedfilter, setSelectedfilter] = useState("ALL");
    const isMobile = useIsMobile();
    const gridRef = useRef(null);
    const headRef = useRef(null);

    // Mouse parallax — the whole works layout drifts toward the cursor (layered:
    // grid moves more than the heading for depth). Desktop only, reduced-motion safe.
    useEffect(() => {
        if (isMobile) return;
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
    }, [isMobile]);

    const filters = ["ALL", ...new Set(posts.map((post) => post.properties.sort.select.name))];
    const visible = posts.filter(
        (post) => selectedfilter === "ALL" || post.properties.sort.select.name === selectedfilter
    );
    // group into rows of 2 so a hovered card can expand and its pair contract
    const rows = [];
    for (let i = 0; i < visible.length; i += 2) rows.push(visible.slice(i, i + 2));

    //Animation
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { delayChildren: 0.15, staggerChildren: 0.08 },
        },
    };
    const item = {
        hidden: { opacity: 0, y: 60 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: [0.19, 1, 0.22, 1] },
        },
    };

    return (
        <Transition>
            <section className="works">
                <div className="ds-container">
                    <div className="work-head" ref={headRef}>
                        <motion.span
                            className="work-head__eyebrow u-mono"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            Selected Works — {String(posts.length).padStart(2, "0")}
                        </motion.span>
                        <h1 className="work-head__title">
                            <motion.span
                                initial={{ opacity: 0, y: "20%" }}
                                animate={{ opacity: 1, y: "0%" }}
                                transition={{ duration: 1, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
                            >
                                SELECTED
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: "20%" }}
                                animate={{ opacity: 1, y: "0%" }}
                                transition={{ duration: 1, ease: [0.19, 1, 0.22, 1], delay: 0.38 }}
                            >
                                WORKS
                            </motion.span>
                        </h1>
                        <motion.p
                            className="work-head__intro"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        >
                            A selection of my favourite projects — some made while freelancing,
                            others for studios I&apos;ve worked with.
                        </motion.p>
                    </div>

                    <div className="work-sort u-mono">
                        {filters.map((filter, index) => (
                            <button
                                className={filter === selectedfilter ? "filter_item active" : "filter_item"}
                                key={index}
                                onClick={() => setSelectedfilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="work-grid-wrap" ref={gridRef}>
                        <motion.div
                            key={selectedfilter}
                            className="work-grid"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            {rows.map((row, ri) => (
                                <motion.div className="work-row" variants={container} key={ri}>
                                    {row.map((post, ci) => {
                                        const index = ri * 2 + ci;
                                        return (
                                            <motion.div key={selectedfilter + post.id} className="work-card" variants={item}>
                                                <Link
                                                    href={`works/${post.id}`}
                                                    onMouseEnter={() => handleCursorChange("hover")}
                                                    onMouseLeave={() => handleCursorChange("off")}
                                                >
                                                    <div className="work-card__media">
                                                        <Button type="pic">
                                                            <Image
                                                                src={post.cover?.external?.url || post.cover?.file?.url || "/placeholder.jpg"}
                                                                alt={post.properties.title.title[0].plain_text}
                                                                fill
                                                                style={{ objectFit: "cover" }}
                                                                priority={index < 4}
                                                                loading={index < 4 ? "eager" : "lazy"}
                                                                sizes="(max-width: 768px) 60vw, 50vw"
                                                            />
                                                        </Button>
                                                    </div>
                                                    <div className="work-card__meta u-mono">
                                                        <span className="work-card__index">
                                                            {String(index + 1).padStart(2, "0")}
                                                        </span>
                                                        <span className="work-card__title">
                                                            {post.properties.title.title[0].plain_text}
                                                        </span>
                                                        <span className="work-card__cat">
                                                            {post.properties.sort.select.name}
                                                        </span>
                                                        <span className="work-card__year">{yearOf(post)}</span>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            ))}
                        </motion.div>
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
            posts: database,
        },
        revalidate: 86400, // R2 urls are permanent; portfolio rarely changes — refresh daily
    };
};

export default Works;
