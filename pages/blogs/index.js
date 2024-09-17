import React, { useEffect, useState, useRef, useContext } from "react";
import { getDatabase } from "../../lib/notion";
import Transition from "../../components/Transition";
import PageAside from "../../components/PageAside";
import PageCard from "../../components/PageCard";
import gsap from "gsap";
import Footer from "../../components/Footer";


const databaseId_blog = process.env.NOTION_DATABASE_ID2;

export default function Blogs({ blogs }) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");


  // Animation refs
  const devimg = useRef(null);
  const title = useRef(null);
  const sub = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(devimg.current, { duration: 1, opacity: 0, ease: "power2.out" });
      gsap.from(title.current, { duration: 1, y: "30vh", ease: "expo.out" });
      gsap.from(sub.current, { duration: 1, y: "10vh", ease: "expo.out" });
    }, [devimg, title, sub]);
    return () => ctx.revert();
  }, []);

  return (
    <Transition>
      <section>
        <div
          className="dev-title"
          ref={devimg}
          style={{ backgroundImage: "url(/DevLog.webp)" }}
        >
          <div className="title">
            <div>
              <h1 ref={title}> VFX DEV LOG </h1>
            </div>
            <div>
              <h6 ref={sub}> My research blog Filmmaking & VFX </h6>
            </div>
          </div>
        </div>
      </section>

      <section className="content-comp" id="card-layout">
        <div className="content-warpper">
          <PageAside
            blogs={blogs}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
          <PageCard
            blogs={blogs}
            selectedCategory={selectedCategory}
          />
        </div>
      </section>

      <Footer />
    </Transition>
  );
}

export const getStaticProps = async () => {
  const blogs = await getDatabase(databaseId_blog);
  return {
    props: {
      blogs,
    },
    revalidate: 1,
  };
};
