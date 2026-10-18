import Hero from '../components/Hero'
import HomeSections from '../components/HomeSections'
import Footer from '../components/Footer'
import Transition from '../components/Transition'
import { getDatabase } from '../lib/notion'
import { toWorkSummary, toJournalSummary } from '../lib/summaries'


export default function Home({ works, journal }) {
  return (
    <>
      <Transition>
        <Hero />
        <HomeSections works={works} journal={journal} />
        <Footer />
      </Transition>
    </>
  )
}

export const getStaticProps = async () => {
  // A Notion outage shouldn't take the home page down — fall back to empty lists
  const [works, journal] = await Promise.all([
    getDatabase(process.env.NOTION_DATABASE_ID).catch(() => []),
    getDatabase(process.env.NOTION_DATABASE_ID2).catch(() => []),
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
