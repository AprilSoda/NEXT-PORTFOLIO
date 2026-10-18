import Head from 'next/head'
import Header from '../components/Header'
import Arrow from '../components/Arrow'
import { useRouter } from 'next/router'
import { useT } from '../lib/i18n'

export const SITE_URL = 'https://www.kimtaekyun.dev'

// Absolute URL of the current page in a given locale (en lives at the root)
const localeUrl = (locale, path) => `${SITE_URL}${locale === 'en' ? '' : `/${locale}`}${path === '/' ? '' : path}`

const Layout = ({ children }) => {
    const { asPath, pathname, locale = 'en', locales = ['en', 'ko'] } = useRouter()
    const { t } = useT()
    const path = asPath.split(/[?#]/)[0] || '/'
    // A 404 has no canonical page or language versions to point at
    const isError = pathname === '/404' || pathname === '/_error'
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content={t('meta.description')} key="description" />
                {isError ? <meta name="robots" content="noindex" /> : <>
                    <link rel="canonical" href={localeUrl(locale, path)} key="canonical" />
                    {locales.map((l) => (
                        <link key={`alt-${l}`} rel="alternate" hrefLang={l} href={localeUrl(l, path)} />
                    ))}
                    <link rel="alternate" hrefLang="x-default" href={localeUrl('en', path)} key="alt-default" />
                </>}
                <link rel="alternate" type="application/rss+xml" title="Kim Tae Kyun — Journal" href={`${SITE_URL}/feed.xml`} />
                <meta property="og:locale" content={locale === 'ko' ? 'ko_KR' : 'en_US'} />
                <meta property="og:locale:alternate" content={locale === 'ko' ? 'en_US' : 'ko_KR'} />
                <meta property="og:url" content={localeUrl(locale, path)} />
                <meta property="og:description" content={t('meta.description')} key="og:description" />
                <meta name="author" content="Kim Tae Kyun" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
                <meta name="twitter:title" content="Kim Tae Kyun" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="https://www.kimtaekyun.dev/og.jpg" key="twitter:image" />
                <meta property="og:site_name" content="Kim Tae Kyun" />
                <meta property="og:title" content="Kim Tae Kyun" key="og:title" />
                <meta property="og:type" content="website" key="og:type" />
                <meta property="og:image" content="https://www.kimtaekyun.dev/og.jpg" key="og:image" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
            </Head>


            <a href="#main" className="skip-link">{t('a11y.skip')}</a>
            <Header />

            <section className="Container" id="main" tabIndex={-1}>
                {children}
            </section>

            <Arrow />
        </>
    )
}

export default Layout

// JSON-LD for a <script> tag: escaping "<" keeps Notion text like "</script>"
// from closing the tag early
export const jsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c')

// Generated share card (pages/api/og.js) for pages without a permanent cover
export const ogCard = ({ title, kicker = '', meta = '' }) =>
    `${SITE_URL}/api/og?${new URLSearchParams({ title, kicker, meta })}`
