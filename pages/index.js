import Hero from '../components/Hero'
import HomeSections from '../components/HomeSections'
import Footer from '../components/Footer'
import Transition from '../components/Transition'
import Head from 'next/head'
import { SITE_URL, jsonLd } from '../components/Layout'
import { identity, social } from '../content/site'
import { getDatabase, WORKS_DB, JOURNAL_DB } from '../lib/notion'
import { toWorkSummary, toJournalSummary } from '../lib/summaries'


// Structured data so search engines know who the site is about
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: identity.name.en,
  alternateName: identity.name.ko,
  jobTitle: identity.role.en,
  url: SITE_URL,
  email: 'mailto:hello@kimtaekyun.dev',
  address: { '@type': 'PostalAddress', addressLocality: 'Seoul', addressCountry: 'KR' },
  worksFor: { '@type': 'Organization', name: 'CJ OliveNetworks' },
  sameAs: social.map((s) => s.href),
}

export default function Home({ works, journal }) {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(personJsonLd) }}
        />
      </Head>
      <Transition>
        <Hero />
        <HomeSections works={works} journal={journal} />
        <Footer />
      </Transition>
    </>
  )
}

// During `next build` a Notion outage falls back to empty lists so the deploy
// still succeeds; during revalidation it throws, so Next keeps serving the last
// good page instead of caching an empty one for a day
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'
const orEmptyAtBuild = (promise) => (isBuild ? promise.catch(() => []) : promise)

export const getStaticProps = async () => {
  const [works, journal] = await Promise.all([
    orEmptyAtBuild(getDatabase(WORKS_DB)),
    orEmptyAtBuild(getDatabase(JOURNAL_DB)),
  ])
  return {
    props: {
      // Ticked "featured" entries lead; the newest work fills the rest
      works: [...works].sort((a, b) => Number(b.properties.featured?.checkbox || false) - Number(a.properties.featured?.checkbox || false)).slice(0, 4).map(toWorkSummary),
      journal: journal.slice(0, 3).map(toJournalSummary),
    },
    revalidate: 86400,
  }
}
