import React, { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Transition from "../../components/Transition";
import Footer from "../../components/Footer";

import { getDatabase, getPage, getBlocks } from "../../lib/notion";
import styles from "./post.module.css";
import { databaseId } from "./index.js";

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
                    <Image
                        src={src}
                        alt={caption || 'Work image'}
                        width={800}
                        height={600}
                        style={{ borderRadius: '18px', marginTop: '25px', width: '100%', height: 'auto' }}
                    />
                    {caption && <figcaption>{caption}</figcaption>}
                </figure>
            );
        case "embed":
            const embed =
                value.url
            return (
                <figure>
                    <Image
                        src={embed}
                        alt="Embedded content"
                        width={800}
                        height={600}
                        style={{ borderRadius: '18px', marginTop: '25px', width: '100%', height: 'auto' }}
                    />
                </figure>
            );
        case "link_preview":
            const link_preview = value.url;
            return (
                <figure>
                    <Image
                        src={link_preview}
                        alt="Link preview"
                        width={800}
                        height={600}
                        style={{ borderRadius: '18px', marginTop: '25px', width: '100%', height: 'auto' }}
                    />
                </figure>
            );
        case "video":
            const video =
                value.type === "external" ? value.external.url : value.file.url;

            // Convert YouTube URL to embed format
            const getYouTubeEmbedUrl = (url) => {
                if (!url) return url;

                // Check if it's already an embed URL
                if (url.includes('youtube.com/embed/')) return url;

                // Extract video ID from various YouTube URL formats
                let videoId = null;

                // Format: https://www.youtube.com/watch?v=VIDEO_ID
                if (url.includes('youtube.com/watch?v=')) {
                    videoId = url.split('watch?v=')[1]?.split('&')[0];
                }
                // Format: https://youtu.be/VIDEO_ID
                else if (url.includes('youtu.be/')) {
                    videoId = url.split('youtu.be/')[1]?.split('?')[0];
                }

                // Return embed URL if video ID found, otherwise return original URL
                return videoId
                    ? `https://www.youtube.com/embed/${videoId}`
                    : url;
            };

            const embedUrl = value.type === "external" ? getYouTubeEmbedUrl(video) : video;

            return value.type === "external" ? (
                <div style={{ width: "100%", padding: "62% 0 0 0", position: "relative", overflow: "hidden" }}>
                    <iframe
                        src={embedUrl + "?autoplay=1&controls=0&mute=1&enablejsapi=1"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "115%",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            objectFit: "cover",
                            objectPosition: "center",
                            border: "0",
                            outline: "unset",
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
                <a href={href} target="_brank" className={styles.bookmark}>
                    {href}
                </a>
            );
        default:
            return `❌ Unsupported block (${type === "unsupported" ? "unsupported by Notion API" : type
                })`;
    }
};


//Master index
export default function Post({ page, blocks }) {
    const router = useRouter();
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // 이미지 URL들을 상태로 관리
    const imageUrls = blocks
        .filter(block => block.type === 'image')
        .map(block => {
            const imageBlock = block.image;
            return imageBlock.type === 'external'
                ? imageBlock.external?.url
                : imageBlock.file?.url;
        })
        .filter(url => url); // undefined 값 제거

    // Cover 이미지가 있는 경우 추가 (external 또는 file 타입 모두 처리)
    const coverUrl = page.cover?.external?.url || page.cover?.file?.url;
    if (coverUrl) {
        imageUrls.push(coverUrl);
    }


    // 이미지 로드 상태를 추적하는 상태
    const [imageLoadStatus, setImageLoadStatus] = useState(
        imageUrls.reduce((status, url) => ({ ...status, [url]: false }), {})
    );

    // 이미지가 로드될 때마다 해당 이미지의 로드 상태를 업데이트
    const handleImageLoad = url => {
        setImageLoadStatus(prevStatus => ({ ...prevStatus, [url]: true }));
    };

    useEffect(() => {
        // 모든 이미지의 로드 상태가 '로드 완료' 상태인지 확인
        const allImagesLoaded = Object.values(imageLoadStatus).every(status => status);
        setImagesLoaded(allImagesLoaded);
    }, [imageLoadStatus]);




    function formatDate(inputDate) {
        const [month, year] = new Date(inputDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit' }).split('/');
        return `${month}. ${year}`;
    }

    if (!page || !blocks) {
        return <div />;
    }
    return (
        <>
            {imageUrls.map((url, index) => (
                <Image
                    key={index}
                    src={url}
                    alt="Preload image"
                    width={1}
                    height={1}
                    style={{ display: 'none' }}
                    onLoad={() => handleImageLoad(url)}
                />
            ))}
            {/* {!imagesLoaded ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: "white", color: "black" }}>
                    <p>Loading...</p>
                </div>
            ) : ( */}
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
                            <Image
                                src={page.cover?.external?.url || page.cover?.file?.url || '/placeholder.jpg'}
                                alt={page.properties.title.title[0].plain_text}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                            />
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
                                    {formatDate(page.properties.date.date.start)}{" "}
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
                        <a className="go_back" onClick={() => router.back()}>
                            ← ALL PROJECTS
                        </a>
                    </div>
                </article>
                <Footer />
            </Transition>
            {/* )} */}
        </>
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
        revalidate: 300, // Revalidate every 5 minutes
    };
};
