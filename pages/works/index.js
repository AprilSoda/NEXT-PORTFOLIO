import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getDatabase, getFilterdDatabase } from "../../lib/notion";
import Transition from "../../components/Transition";
import Button from "../../components/Button";
import Footer from "../../components/Footer";
import MouseContextProvider, { MouseContext } from "../../components/MouseContext";
export const databaseId = process.env.NOTION_DATABASE_ID;

//Create Context
export const MovieContext = React.createContext();

const Works = ({ posts }) => {
    const { handleCursorChange } = useContext(MouseContext);
    const [selectedfilter, setSelectedfilter] = useState("ALL");
    const [filterdItems, setFilterdItems] = useState(posts);

    let filters = ["ALL", ...new Set(posts.map(post => post.properties.sort.select.name))];

    useEffect(() => {
    }, [selectedfilter]);

    //Amimation
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.2,
            },
        },
    };
    const item = {
        hidden: { opacity: 0, y: 100 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: [0.19, 1, 0.22, 1] },
        },
    };
    //Amimation End

    return (
        <Transition>
            <section className="works">
                <div className="work-container">
                    <div className="heading">
                        <div className="heading-h1">
                            <motion.h1
                                initial={{ opacity: 0, translateY: "10vh" }}
                                animate={{ opacity: 1, translateY: "0vh" }}
                                transition={{
                                    default: {
                                        duration: 1,
                                        ease: [0.19, 1, 0.22, 1],
                                    },
                                    delay: 0.3,
                                }}
                            >
                                {" "}
                                SELECTED{" "}
                            </motion.h1>
                            <motion.h1
                                initial={{ opacity: 0, translateY: "10vh" }}
                                animate={{ opacity: 1, translateY: "0vh" }}
                                transition={{
                                    default: {
                                        duration: 1,
                                        ease: [0.19, 1, 0.22, 1],
                                    },
                                    delay: 0.4,
                                }}
                            >
                                {" "}
                                WORKS{" "}
                            </motion.h1>
                        </div>
                        <motion.p
                            initial={{ opacity: 0, translateY: "5vh" }}
                            animate={{ opacity: 1, translateY: "0vh" }}
                            transition={{
                                default: {
                                    duration: 1,
                                    ease: [0.19, 1, 0.22, 1],
                                },
                                delay: 0.5,
                            }}
                        >
                            {" "}
                            I&apos;VE PUT TOGETHER A LIST OF MY FAVOURITE
                            PROJECTS I&apos;VE COMPLETED.
                            <br /> SOME WHEN I&apos;VE BEEN FREELACING OR FOR
                            OTHER AGENCIES.{" "}
                        </motion.p>
                    </div>
                </div>
                <div className="work-sort">
                    {filters.map((Filter, index) => (
                        <button
                            className={Filter === selectedfilter ? "filter_item active" : "filter_item"}
                            key={index}
                            onClick={() => setSelectedfilter(Filter)}>
                            {Filter}
                        </button>
                    ))}
                </div>
                <motion.ul
                    key={selectedfilter}
                    className="cards"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {filterdItems.map((post, index) => (
                        selectedfilter === "ALL" || post.properties.sort.select.name === selectedfilter ? (
                            <motion.li
                                key={selectedfilter + index} // key prop 변경
                                className="card__item"
                                variants={item}
                            >
                                {console.log(post.properties.sort.select.name)}
                                <Link href={`works/${post.id}`}>
                                    <a className="card__inner">
                                        <Button type="pic">
                                            <div
                                                className="thumb_title"
                                                onMouseEnter={() =>
                                                    handleCursorChange(true)
                                                }
                                                onMouseLeave={() =>
                                                    handleCursorChange(false)
                                                }
                                            >
                                                <h4 className="text">
                                                    {
                                                        post.properties.title
                                                            .title[0].plain_text
                                                    }
                                                </h4>
                                                <h6 className="sort">
                                                    {
                                                        post.properties.sort.select
                                                            .name
                                                    }
                                                </h6>
                                            </div>

                                            <div className="card-img">
                                                <Image
                                                    src={post.cover ? post.cover.external.url : null}
                                                    alt="Work Thumbnail"
                                                    layout="fill"
                                                    objectFit="cover"
                                                    priority="true"
                                                />
                                            </div>
                                        </Button>
                                    </a>
                                </Link>
                            </motion.li>
                        ) : null
                    ))}
                </motion.ul>
            </section>
            <Footer />
        </Transition>
    );
};

export const getStaticProps = async () => {
    const database = await getDatabase(databaseId);
    // console.log(database)
    return {
        props: {
            posts: database,
        },
        revalidate: 1,
    };
};

export default Works;
