import Head from 'next/head'
import Header from '../components/Header'
import Arrow from '../components/Arrow'

const Layout = ({ children, router }) => {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="Tae Kyun's homepage" />
                <meta name="author" content="Kim Tae Kyun" />
                <link rel="apple-touch-icon" href="apple-touch-icon.png" />
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
                <meta name="twitter:title" content="Kim Tae Kyun" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@Kyuon" />
                <meta name="twitter:creator" content="@Kyuon" />
                <meta name="twitter:image" content="https://www.kimtaekyun.dev/card.png" />
                <meta property="og:site_name" content="Kim Tae Kyun" />
                <meta name="og:title" content="Kim Tae Kyun" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.kimtaekyun.dev/card.png" />
                <title>Kim Tae Kyun - Homepage</title>
            </Head>


            <Header />

            <section className="Container">
                {children}
            </section>

            <Arrow />
        </>
    )
}

export default Layout