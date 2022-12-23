import React, { Fragment, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Transition from "../../components/Transition";
import Footer from "../../components/Footer";

import { getDatabase, getPage, getBlocks } from "../../lib/notion";
import styles from "./post.module.css";
import { databaseId } from "./index.js";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

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
                    {value.text.length === 0 ? (
                        <br />
                    ) : (
                        <Text text={value.text} />
                    )}
                </p>
            );
        case "heading_1":
            return (
                <h1>
                    <Text text={value.text} />
                </h1>
            );
        case "heading_2":
            return (
                <h2>
                    <Text text={value.text} />
                </h2>
            );
        case "heading_3":
            return (
                <h3>
                    <Text text={value.text} />
                </h3>
            );
        case "bulleted_list_item":
        case "numbered_list_item":
            return (
                <li>
                    <Text text={value.text} />
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
                        <Text text={value.text} />
                    </label>
                </div>
            );
        case "toggle":
            return (
                <details>
                    <summary>
                        <Text text={value.text} />
                    </summary>
                    {value.children?.map((block) => (
                        <Fragment key={block.id}>{renderBlock(block)}</Fragment>
                    ))}
                </details>
            );
        case "child_page":
            return <p>{value.title}</p>;
        case "image":
            const src =
                value.type === "external" ? value.external.url : value.file.url;
            const caption = value.caption ? value.caption[0]?.plain_text : "";
            return (
                <figure>
                    <img src={src} alt={caption} />
                    {caption && <figcaption>{caption}</figcaption>}
                </figure>
            );
        case "video":
            const video =
                value.type === "external" ? value.external.url : value.file.url;
            return value.type === "external" ? (
                <div style={{ padding: "54.06% 0 0 0", position: "relative" }}>
                    <iframe
                        src={video}
                        frameBorder="0"
                        sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin allow-storage-access-by-user-activation"
                        allowFullScreen=""
                        style={{
                            position: "absolute",
                            left: "0",
                            top: "0",
                            width: "100%",
                            height: "100%",
                            pointerEvents: "auto",
                            backgroundColor: "black",
                        }}
                    />
                </div>
            ) : (
                <video
                    controls
                    autoPlay
                    name="media"
                    loop
                    muted
                    style={{ width: "100%" }}
                >
                    <source src={video} />
                </video>
            );
        case "divider":
            return <hr key={id} />;
        case "quote":
            return <blockquote key={id}>{value.text[0].plain_text}</blockquote>;
        case "code":
            return (
                <pre className={styles.pre}>
                    <code className={styles.code_block} key={id}>
                        {value.text[0].plain_text}
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
                        <Link href={src_file} passHref>
                            {lastElementInArray.split("?")[0]}
                        </Link>
                    </div>
                    {caption_file && <figcaption>{caption_file}</figcaption>}
                </figure>
            );
        case "bookmark":
            const href = value.url;
            return (
                <a href={href} target="_brank" className={styles.bookmark}>
                    {href}
                </a>
            );
        default:
            return `❌ Unsupported block (${
                type === "unsupported" ? "unsupported by Notion API" : type
            })`;
    }
};

export default function Post({ page, blocks }) {
    const router = useRouter();

    const slides = page.properties.photo.files.map((data) => {
        return data;
    });
    const slidea = slides.map((data) => {
        return data.external.url;
    });

    if (!page || !blocks) {
        return <div />;
    }
    return (
        <Transition>
            <Head>
                <title>
                    {"Kim Tae Kyun - " + page.properties.title.title[0].plain_text}
                </title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="w_title_container">
                <div className="w_title">
                    <div className="thumb">
                        <img src={page.cover.external.url} />
                    </div>
                    <div className="title">
                        <h1> {page.properties.title.title[0].plain_text} </h1>
                    </div>
                </div>
            </div>
            <article className="container">
                <div className="content">
                    <div className="info">
                        <div className="flexin b6 onoffb"> INFO </div>
                        <div className="flexin sort">
                            <div className="b6"> SORT </div>
                            <div className="b3">
                                {" "}
                                {page.properties.sort.select.name}{" "}
                            </div>
                        </div>
                        <div className="flexin date">
                            <div className="b6"> DATE </div>
                            <div className="b3">
                                {" "}
                                {page.properties.date.date.start}{" "}
                            </div>
                        </div>
                        <div className="flexin Client">
                            <div className="b6"> CLIENT </div>
                            <div className="b3">
                                {" "}
                                {page.properties.client.select.name}{" "}
                            </div>
                        </div>
                    </div>
                    <section className="block">
                        {blocks.map((block) => (
                            <Fragment key={block.id}>
                                {renderBlock(block)}
                            </Fragment>
                        ))}
                    </section>
                    <a className={styles.back} onClick={() => router.back()}>
                        ← GO BACK
                    </a>
                </div>
            </article>
            <Footer/>
        </Transition>
    );
}

export const getStaticPaths = async () => {
    const database = await getDatabase(databaseId);
    return {
        paths: database.map((page) => ({ params: { id: page.id } })),
        fallback: false,
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
    return {
        props: {
            page,
            blocks: blocksWithChildren,
        },
        revalidate: 1000,
    };
};
