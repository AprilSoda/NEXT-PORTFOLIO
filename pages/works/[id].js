import React, { Fragment } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Transition from "../../components/Transition";
import Footer from "../../components/Footer";

import { getDatabase, getPage, getBlocks } from "../../lib/notion";
import styles from "./post.module.css";
import { databaseId } from "./index.js";
import VideoEmbed from "../../components/VideoEmbed";
import CompareSlider from "../../components/CompareSlider";
import HoverPreview from "../../components/HoverPreview";
import ScreenXStage from "../../components/ScreenXStage";
import { embedSrc, parseVideoUrl } from "../../lib/video";
import { useT } from "../../lib/i18n";
import { yearOf } from "../../lib/dates";
import { SITE_URL, jsonLd, ogCard } from "../../components/Layout";
import { toWorkSummary } from "../../lib/summaries";

export const Text = ({ text }) => {
    if (!text) {
        return null;
    }
    return text.map((value) => {
        const {
            annotations: {
                bold,
                code,
                color,
                italic,
                strikethrough,
                underline,
            },
            text,
        } = value;
        return (
            <span
                key={value}
                className={[
                    bold ? styles.bold : "",
                    code ? styles.code : "",
                    italic ? styles.italic : "",
                    strikethrough ? styles.strikethrough : "",
                    underline ? styles.underline : "",
                ].join(" ")}
                style={color !== "default" ? { color } : {}}
            >
                {text.link ? (
                    <a href={text.link.url}>{text.content}</a>
                ) : (
                    text.content
                )}
            </span>
        );
    });
};

const renderNestedList = (block) => {
    const { type } = block;
    const value = block[type];
    if (!value) return null;

    const isNumberedList = value.children[0].type === "numbered_list_item";

    if (isNumberedList) {
        return <ol>{value.children.map((block) => renderBlock(block))}</ol>;
    }
    return <ul>{value.children.map((block) => renderBlock(block))}</ul>;
};

const renderBlock = (block) => {
    const { type, id } = block;
    const value = block[type];

    switch (type) {
        case "paragraph":
            return (
                <p>
                    {value.rich_text.length === 0 ? (
                        <br />
                    ) : (
                        <Text text={value.rich_text} />
                    )}
                </p>
            );
        case "heading_1":
            return (
                <h1>
                    <Text text={value.rich_text} />
                </h1>
            );
        case "heading_2":
            return (
                <h2>
                    <Text text={value.rich_text} />
                </h2>
            );
        case "heading_3":
            return (
                <h3>
                    <Text text={value.rich_text} />
                </h3>
            );
        case "bulleted_list_item":
        case "numbered_list_item":
            return (
                <li>
                    <Text text={value.rich_text} />
                    {!!value.children && renderNestedList(block)}
                </li>
            );
        case "to_do":
            return (
                <div>
                    <label htmlFor={id}>
                        <input
                            type="checkbox"
                            id={id}
                            defaultChecked={value.checked}
                        />{" "}
                        <Text text={value.rich_text} />
                    </label>
                </div>
            );
        case "toggle":
            return (
                <details>
                    <summary>
                        <Text text={value.rich_text} />
                    </summary>
                    {value.children?.map((block) => (
                        <Fragment key={block.id}>{renderBlock(block)}</Fragment>
                    ))}
                </details>
            );
        case "child_page":
            return <p>{value.title}</p>;
        case "image":
            const src = value.type === "external" ? value.external.url : value.file.url;
            const caption = value.caption ? value.caption[0]?.plain_text : "";
            return (
                <figure>
                    <Image
                        src={src}
                        alt={caption || 'Work image'}
                        width={1300}
                        height={900}
                        sizes="(max-width: 1100px) 100vw, 1080px"
                        style={{ borderRadius: '36px', marginTop: '25px', width: '100%', height: 'auto' }}
                    />
                    {caption && <figcaption>{caption}</figcaption>}
                </figure>
            );
        case "embed":
        case "link_preview": {
            // Video links get a player; anything else becomes a plain link
            if (parseVideoUrl(value.url)) return <VideoEmbed key={id} url={value.url} />;
            return (
                <a key={id} href={value.url} target="_blank" rel="noopener noreferrer" className={styles.bookmark}>
                    {value.url}
                </a>
            );
        }
        case "video": {
            const video = value.type === "external" ? value.external.url : value.file.url;
            return <VideoEmbed key={id} url={video} />;
        }
        case "divider":
            return <hr key={id} />;
        case "quote":
            return <blockquote key={id}>{value.rich_text[0].plain_text}</blockquote>;
        case "code":
            return (
                <pre className={styles.pre}>
                    <code className={styles.code_block} key={id}>
                        {value.rich_text[0].plain_text}
                    </code>
                </pre>
            );
        case "file":
            const src_file =
                value.type === "external" ? value.external.url : value.file.url;
            const splitSourceArray = src_file.split("/");
            const lastElementInArray =
                splitSourceArray[splitSourceArray.length - 1];
            const caption_file = value.caption
                ? value.caption[0]?.plain_text
                : "";
            return (
                <figure>
                    <div className={styles.file}>
                        📎{" "}
                        <Link href={src_file}>
                            View Project
                        </Link>
                    </div>
                    {caption_file && <figcaption>{caption_file}</figcaption>}
                </figure>
            );
        case "bookmark":
            const href = value.url;
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" className={styles.bookmark}>
                    {href}
                </a>
            );
        default:
            return `❌ Unsupported block (${type === "unsupported" ? "unsupported by Notion API" : type
                })`;
    }
};


const plain = (prop) => (prop?.rich_text || []).map((t) => t.plain_text).join("").trim();

//Master index
export default function Post({ page, blocks, heroVideo, nextWork }) {
    const router = useRouter();
    const { t, fmt, locale } = useT();

    // Show loading state when Next.js is generating the page on-demand
    if (router.isFallback) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!page || !blocks) {
        return <div />;
    }

    const props = page.properties;
    const title = props.title.title[0]?.plain_text || "";
    const year = yearOf(props.date?.date?.start);
    const format = props.format?.select?.name || props.sort?.select?.name || null;
    const summary = plain(locale === "ko" ? props.summary_ko : props.summary_en) || plain(props.summary_en);
    const making = props.making?.url || null;
    const before = props.before?.url || null;
    const after = props.after?.url || null;
    const aiUsage = props.ai_usage?.select?.name || null;
    const client = props.client?.select?.name;
    const meta = [
        ["work.role", plain(props.role)],
        // "PERSONAL PROJECT" in the client column just means there was no client
        ["work.client", client && client !== "PERSONAL PROJECT" ? client : null],
        ["work.format", fmt(format)],
        ["work.year", year],
        ["work.honor", plain(props.honor)],
        ["work.ai", aiUsage ? t(`ai.${aiUsage}`, aiUsage) : null],
    ].filter(([, value]) => value);
    const cover = page.cover?.external?.url || page.cover?.file?.url || null;
    // Covers uploaded to Notion are signed URLs that expire within hours, so
    // only external (R2) covers are used where crawlers keep the URL
    const shareImage = /^https?:\/\//.test(page.cover?.external?.url || "") ? page.cover.external.url : null;
    const cardImage = shareImage || ogCard({ title, kicker: fmt(format) || "", meta: [plain(props.role), year].filter(Boolean).join(" · ") });
    const status = props.status?.select?.name;
    const tools = (props.tools?.multi_select || []).map((o) => o.name);
    const models = (props.models?.multi_select || []).map((o) => o.name);
    // "Role: Name" per line → [role, name]
    const credits = plain(props.credits)
        .split("\n")
        .map((line) => line.split(/:(.+)/).map((part) => part?.trim()))
        .filter(([role, name]) => role && name);

    // Structured data: the film, plus the video when there is one, and where
    // the page sits in the site
    const pageUrl = `${SITE_URL}${locale === "ko" ? "/ko" : ""}/works/${page.id}`;
    const breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: t("work.eyebrow"), item: `${SITE_URL}${locale === "ko" ? "/ko" : ""}/works` },
            { "@type": "ListItem", position: 2, name: title, item: pageUrl },
        ],
    };
    const structuredData = {
        "@context": "https://schema.org",
        url: pageUrl,
        "@type": format === "Music Video" ? "MusicVideoObject" : "CreativeWork",
        name: title,
        ...(summary && { description: summary }),
        image: cardImage,
        ...(props.date?.date?.start && { dateCreated: props.date.date.start }),
        creator: { "@type": "Person", name: "Kim Tae Kyun", url: SITE_URL },
        ...(heroVideo && {
            video: {
                "@type": "VideoObject",
                name: title,
                description: summary || title,
                thumbnailUrl: cardImage,
                ...(props.date?.date?.start && { uploadDate: `${props.date.date.start.slice(0, 10)}T00:00:00+09:00` }),
                embedUrl: embedSrc(parseVideoUrl(heroVideo)),
            },
        }),
    };

    return (
            <Transition>
                <Head>
                    <title>{`${title} — ${locale === "ko" ? "김태균" : "Kim Tae Kyun"}`}</title>
                    {summary && <meta name="description" content={summary} key="description" />}
                    {summary && <meta property="og:description" content={summary} key="og:description" />}
                    <meta property="og:title" content={title} key="og:title" />
                    <meta property="og:image" content={cardImage} key="og:image" />
                    <meta name="twitter:image" content={cardImage} key="twitter:image" />
                    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
                    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }} />
                </Head>

                <section className="work-hero ds-container">
                    <p className="work-hero__eyebrow u-mono">
                        {[fmt(format), year].filter(Boolean).join(" · ")}
                        {status && status !== "Released" && <span className="work-badge work-badge--status">{t(`status.${status}`, status)}</span>}
                    </p>
                    <h1 className="work-hero__title">{title}</h1>
                    {summary && <p className="work-hero__summary">{summary}</p>}
                    <div className="work-hero__media">
                        {heroVideo ? (
                            <VideoEmbed url={heroVideo} title={title} />
                        ) : cover ? (
                            <div className="work-hero__cover">
                                <Image src={cover} alt={title} fill style={{ objectFit: 'cover' }} priority sizes="100vw" />
                            </div>
                        ) : null}
                    </div>
                    {meta.length > 0 && (
                        <dl className="work-hero__meta">
                            {meta.map(([key, value]) => (
                                <div key={key}>
                                    <dt className="u-mono">{t(key)}</dt>
                                    <dd>{value}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                    {/screenx/i.test(format || "") && <ScreenXStage image={cover} />}
                </section>

                <article className="container">
                    <div className="content">
                        <section className="block">
                            {blocks.map((block) => (
                                <Fragment key={block.id}>
                                    {renderBlock(block)}
                                </Fragment>
                            ))}
                        </section>
                        {(tools.length > 0 || models.length > 0 || aiUsage) && (
                            <section className="work-madewith">
                                <h2 className="u-mono">{t("work.madeWith")}</h2>
                                <dl>
                                    {tools.length > 0 && (<div><dt className="u-mono">{t("work.tools")}</dt><dd>{tools.join(" · ")}</dd></div>)}
                                    {models.length > 0 && (<div><dt className="u-mono">{t("work.models")}</dt><dd>{models.join(" · ")}</dd></div>)}
                                    {aiUsage && (<div><dt className="u-mono">{t("work.ai")}</dt><dd>{t(`ai.${aiUsage}`, aiUsage)}</dd></div>)}
                                </dl>
                                {models.length > 0 && <p className="work-madewith__note">{t("work.humanNote")}</p>}
                            </section>
                        )}
                        {credits.length > 0 && (
                            <section className="work-credits">
                                <h2 className="u-mono">{t("work.credits")}</h2>
                                <dl>
                                    {credits.map(([role, name], i) => (
                                        <div key={i}><dt>{role}</dt><dd>{name}</dd></div>
                                    ))}
                                </dl>
                            </section>
                        )}
                        {(making || (before && after)) && (
                            <details className="work-making">
                                <summary className="u-mono">{t("work.making")}</summary>
                                {before && after && <CompareSlider before={before} after={after} />}
                                {making && <VideoEmbed url={making} title={`${title} — making of`} />}
                            </details>
                        )}
                        <Link className="go_back u-mono" href="/works">
                            {t("work.back")}
                        </Link>
                    </div>
                </article>
                {nextWork && (
                    <Link href={`/works/${nextWork.id}`} className="next-work ds-container">
                        <span className="next-work__label u-mono">{t("work.next")}</span>
                        <span className="next-work__title">{nextWork.title}</span>
                        <span className="next-work__media">
                            <HoverPreview cover={nextWork.cover} preview={null} alt={nextWork.title} sizes="(max-width: 768px) 100vw, 40vw" />
                        </span>
                    </Link>
                )}
                <Footer />
            </Transition>
    );
}

export const getStaticPaths = async ({ locales = ["en"] }) => {
    const database = await getDatabase(databaseId);
    return {
        // Prebuild every locale — without `locale` only the default one is generated
        paths: database.flatMap((page) => locales.map((locale) => ({ params: { id: page.id }, locale }))),
        fallback: 'blocking',
    };
};

export const getStaticProps = async (context) => {
    const { id } = context.params;
    const page = await getPage(id);
    const blocks = await getBlocks(id);
    // Retrieve block children for nested blocks (one level deep), for example toggle blocks
    // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
    const childBlocks = await Promise.all(
        blocks
            .filter((block) => block.has_children)
            .map(async (block) => {
                return {
                    id: block.id,
                    children: await getBlocks(block.id),
                };
            })
    );
    const blocksWithChildren = blocks.map((block) => {
        // Add child blocks if the block should contain children but none exists
        if (block.has_children && !block[block.type].children) {
            block[block.type]["children"] = childBlocks.find(
                (x) => x.id === block.id
            )?.children;
        }
        return block;
    });
    // The finished film leads the page: use the `video` property, or promote
    // the first video in the page body so older entries get it too
    let heroVideo = parseVideoUrl(page.properties.video?.url) ? page.properties.video.url : null;
    let bodyBlocks = blocksWithChildren;
    if (!heroVideo) {
        const first = blocksWithChildren.find((block) => {
            const value = block[block.type];
            const url = block.type === "video" ? value?.external?.url || value?.file?.url : value?.url;
            return ["video", "embed"].includes(block.type) && parseVideoUrl(url);
        });
        if (first) {
            const value = first[first.type];
            heroVideo = first.type === "video" ? value.external?.url || value.file?.url : value.url;
            bodyBlocks = blocksWithChildren.filter((block) => block.id !== first.id);
        }
    }
    // Next project in the list order (wraps around), for the footer teaser
    const all = await getDatabase(databaseId).catch(() => []);
    const index = all.findIndex((p) => p.id === page.id);
    const nextWork = index >= 0 && all.length > 1 ? toWorkSummary(all[(index + 1) % all.length]) : null;

    return {
        props: {
            page,
            blocks: bodyBlocks,
            heroVideo,
            nextWork,
        },
        revalidate: 86400, // R2 urls are permanent; portfolio rarely changes — refresh daily
    };
};
