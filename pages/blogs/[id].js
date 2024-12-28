
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { NotionAPI } from "notion-client";

import { getDatabase } from "../../lib/notion";
import Transition from "../../components/Transition";
import Footer from "../../components/Footer";
import BlogNavigation from "../../components/BlogNavigation";
import Head from "next/head";


// notion-x 관련 스타일시트
import { NotionRenderer } from 'react-notion-x'
import 'react-notion-x/src/styles.css' // notion 테마 스타일링 (필수)
import 'prismjs/themes/prism-tomorrow.css' // 코드 하이라이트 스타일용 (선택)
import 'katex/dist/katex.min.css' // 공식등 수학적 기호 스타일용 (선택)
import dynamic from "next/dynamic";

// 동적 임포트
const Code = dynamic(() => import('react-notion-x/build/third-party/code').then((notion) => notion.Code), { ssr: false });
const Collection = dynamic(() => import('react-notion-x/build/third-party/collection').then((notion) => notion.Collection), { ssr: false });
const Equation = dynamic(() => import('react-notion-x/build/third-party/equation').then((notion) => notion.Equation), { ssr: false });
const Pdf = dynamic(() => import('react-notion-x/build/third-party/pdf').then((notion) => notion.Pdf), { ssr: false });
const Modal = dynamic(() => import('react-notion-x/build/third-party/modal').then((m) => m.Modal), { ssr: false });


// 이 토큰이 뭔지 알려면 -> https://github.com/NotionX/react-notion-x?tab=readme-ov-file#private-pages
const notion = new NotionAPI({
  activeUser: "016869ec-923f-4d79-b2b5-31f01fa5cd11",
  authToken: "v02%3Auser_token_or_cookies%3A-R71zlNOrF9GS1mViFQU36SEanWU8IT5WVTO4tiTWYVijxRaITbRf_jzPlmatkeblOtW7pgkhCpTY8_Y0uu_bf4yEU55Df7eLa4dVfJywVRIcVwhTwmOPBLHwW-obyUfCYFp",
});


// Master Index
export default function Blog({ blog_id, prevPost, nextPost }) {
  const router = useRouter();

  const keys = Object.keys(blog_id?.block || {})
  const block = blog_id?.block?.[keys[0]]?.value

  const isBlogPost =
    block?.type === 'page' && block?.parent_table === 'collection'

  const showTableOfContents = !!isBlogPost
  const minTableOfContentsItems = 3

  console.log(blog_id);

  return (
    <>
      <Head>
        <title> {blog_id?.title} </title>
      </Head>
      <Transition>
        <NotionRenderer
          disableHeader // notion 헤더 안보이도록
          components={{
            Code,
            Equation,
            Pdf,
            Modal,
            Collection: () => null,
            nextImage: Image, // Next 이미지 (optimization) 사용하고 싶을 경우 해당 컴포넌트 전달
            nextLink: Link, // Next 링크 사용하고 싶을 경우 해당 컴포넌트 전달
          }}
          recordMap={blog_id} // 블로그 데이터
          fullPage={true} // 전체 페이지 설정
          darkMode={true} // 다크모드 설정
          showCollectionViewDropdown={false}
          showTableOfContents={showTableOfContents}
          minTableOfContentsItems={minTableOfContentsItems}
        />
        <section className="blog-scroller">
          <div className="blog-selection">
            <BlogNavigation prevPost={prevPost} nextPost={nextPost} />
            <a className="go_back" onClick={() => router.push("/blogs")}> ← All blogs </a>
          </div>
        </section>

        <Footer />
      </Transition>
    </>
  );
}


export const getStaticPaths = async () => {
  const databaseId_blog = process.env.NOTION_DATABASE_ID2;
  const blogs = await getDatabase(databaseId_blog);
  const paths = blogs.map((blog) => ({
    params: { id: blog.id },
  }));
  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  const recordMap = await notion.getPage(params.id);

  const databaseId_blog = process.env.NOTION_DATABASE_ID2;
  const blogs = await getDatabase(databaseId_blog);

  const currentIndex = blogs.findIndex(blog => blog.id === params.id);
  const prevPost = currentIndex > 0 ? blogs[currentIndex - 1] : null;
  const nextPost = currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null;

  return {
    props: {
      blog_id: recordMap,
      prevPost,
      nextPost,
    },
  };
}