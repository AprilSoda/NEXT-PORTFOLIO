
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { NotionAPI } from "notion-client";

import { getDatabase, JOURNAL_DB } from "../../lib/notion";
import { createSlug, findBlogBySlug } from "../../lib/slugify";
import Transition from "../../components/Transition";
import Footer from "../../components/Footer";
import BlogNavigation from "../../components/BlogNavigation";
import Head from "next/head";
import { useT } from "../../lib/i18n";
import { formatDate } from "../../lib/dates";
import { toJournalSummary } from "../../lib/summaries";
import { SITE_URL, jsonLd, ogCard } from "../../components/Layout";


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


// The blog pages are published to web (public), so no auth is needed — and the
// old token_v2 expires, which actually made loadPageChunk return 403. Notion now
// 403s the unofficial API unless the request carries a browser-like User-Agent,
// so we set one here; that (not a token) is what fixes the blog 404s.
const notion = new NotionAPI({
  ofetchOptions: {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  },
});


// Master Index
const Blog = ({ blog_id, prevPost, nextPost, entry, readingMinutes }) => {
  const router = useRouter();
  const { t, locale } = useT();

  // Show loading state when Next.js is generating the page on-demand
  if (router.isFallback) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  const keys = Object.keys(blog_id?.block || {})
  const block = blog_id?.block?.[keys[0]]?.value

  const isBlogPost =
    block?.type === 'page' && block?.parent_table === 'collection'

  const showTableOfContents = !!isBlogPost
  const minTableOfContentsItems = 3
  const longDate = formatDate(entry?.date, locale, { year: "numeric", month: "long", day: "numeric" })
  const card = entry?.title ? ogCard({ title: entry.title, kicker: t("journal.title"), meta: longDate }) : null


  return (
    <>
      <Head>
        <title>{`${entry?.title || "Journal"} — ${locale === "ko" ? "김태균" : "Kim Tae Kyun"}`}</title>
        {entry?.title && <meta property="og:title" content={entry.title} key="og:title" />}
        <meta property="og:type" content="article" key="og:type" />
        {card && <meta property="og:image" content={card} key="og:image" />}
        {card && <meta name="twitter:image" content={card} key="twitter:image" />}
        {entry && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLd({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: entry.title,
                datePublished: entry.date,
                ...(entry.lastEdited && { dateModified: entry.lastEdited }),
                author: { "@type": "Person", name: "Kim Tae Kyun", url: SITE_URL },
                keywords: entry.categories.join(", "),
                mainEntityOfPage: `${SITE_URL}/journal/${entry.slug}`,
              }),
            }}
          />
        )}
      </Head>
      <Transition>
        {entry && (
          <p className="journal-entry-meta u-mono">
            {[
              entry.categories.join(", "),
              longDate,
              readingMinutes && t("journal.minutes").replace("{n}", readingMinutes),
            ].filter(Boolean).join(" · ")}
          </p>
        )}
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
            <Link className="go_back" href="/journal">{t("journal.back")}</Link>
          </div>
        </section>

        <Footer />
      </Transition>
    </>
  );
};

export default Blog;

export const getStaticPaths = async ({ locales = ["en"] }) => {
  // Mock mode has no real Notion pages to render — build them on demand instead
  if (process.env.NOTION_MOCK === "1") return { paths: [], fallback: 'blocking' };
  const databaseId_blog = JOURNAL_DB;
  const blogs = await getDatabase(databaseId_blog);
  const paths = blogs.map((blog) => {
    const title = blog.properties.title.title[0]?.plain_text || '';
    const slug = createSlug(title, blog.id);
    return locales.map((locale) => ({ params: { id: slug }, locale }));
  }).flat();
  return { paths, fallback: 'blocking' };
};

export const getStaticProps = async ({ params }) => {
  const databaseId_blog = JOURNAL_DB;
  const blogs = await getDatabase(databaseId_blog);

  // Find blog by slug
  const currentBlog = findBlogBySlug(blogs, params.id);

  if (!currentBlog) {
    console.error(`Blog not found for slug: ${params.id}`);
    console.error(`Available blogs:`, blogs.map(b => ({
      title: b.properties.title.title[0]?.plain_text,
      slug: createSlug(b.properties.title.title[0]?.plain_text || '', b.id)
    })));
    // Revalidate so a 404 for a not-yet-published entry doesn't stick in the cache
    return {
      notFound: true,
      revalidate: 300,
    };
  }

  try {
    const recordMap = await notion.getPage(currentBlog.id);

    const currentIndex = blogs.findIndex(blog => blog.id === currentBlog.id);
    const prevPost = currentIndex > 0 ? blogs[currentIndex - 1] : null;
    const nextPost = currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null;

    // Rough reading time: Hangul by characters, Latin by words
    const text = Object.values(recordMap.block || {})
      .map((b) => (b.value?.properties?.title || []).map((seg) => seg[0]).join(""))
      .join(" ");
    const hangul = (text.match(/[\uac00-\ud7a3]/g) || []).length;
    const words = (text.replace(/[\uac00-\ud7a3]/g, " ").match(/[A-Za-z0-9]+/g) || []).length;
    const readingMinutes = Math.max(1, Math.round(hangul / 500 + words / 230));

    return {
      props: {
        blog_id: recordMap,
        prevPost,
        nextPost,
        entry: { ...toJournalSummary(currentBlog), lastEdited: currentBlog.last_edited_time || null },
        readingMinutes,
      },
      revalidate: 86400, // images are permanent R2 urls now; blog rarely changes — refresh daily
    };
  } catch (error) {
    const blogTitle = currentBlog.properties.title.title[0]?.plain_text || 'Unknown';
    console.error(`Error fetching blog "${blogTitle}" (${currentBlog.id}):`, error.message);
    console.error(`Slug: ${params.id}`);
    // Retry soon: a one-off fetch failure shouldn't 404 the entry for a day
    return {
      notFound: true,
      revalidate: 300,
    };
  }
}