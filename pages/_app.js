import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Lenis from 'lenis';
import Layout from '../components/Layout';
import '../styles/globals.scss'
import { AnimatePresence } from 'framer-motion'
import CustomCursor from '../components/CustomCursor'
import ShaderBackground from '../components/ShaderBackground'
import MouseContextProvider from "../components/MouseContext";
import Script from 'next/script';
import Head from 'next/head';
import localFont from 'next/font/local'
import { JetBrains_Mono } from 'next/font/google'
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}

const helveticaNowDisplay = localFont({
  src: [
    { path: '../styles/font/HelveticaNowDisplay-Light.woff', weight: '400', style: 'normal' },
    { path: '../styles/font/HelveticaNowDisplay-Regular.woff', weight: '500', style: 'normal' },
    { path: '../styles/font/HelveticaNowDisplay-Medium.woff', weight: '600', style: 'normal' },
    { path: '../styles/font/HelveticaNowDisplay-Bold.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-helvetica-now-display',
  display: 'swap',
})

const canyon = localFont({
  src: [
    { path: '../styles/font/Canyon-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-canyon',
  display: 'swap',
})

const customFont = localFont({
  src: [
    { path: '../styles/font/ProFontWindows.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-custom',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const PAGE_TITLES = {
  '/': 'Kim Tae Kyun — VFX Generalist',
  '/works': 'Works — Kim Tae Kyun',
  '/blogs': 'Blog — Kim Tae Kyun',
  '/about': 'About — Kim Tae Kyun',
  '/contact': 'Contact — Kim Tae Kyun',
}

function MyApp({ Component, pageProps, router }) {
  const nextRouter = useRouter();
  const lenisRef = useRef(null);

  // Reference-style smooth (inertia) scrolling, gated by reduced-motion.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    let raf;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    // Google Analytics pageview tracking
    const handleRouteChange = (url) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || 'G-MQNWFS6P74', {
          page_path: url,
        });
      }
    };

    // Track page views on route change
    nextRouter.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      nextRouter.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [nextRouter.events]);

  const pageTitle = PAGE_TITLES[nextRouter.pathname] || 'Kim Tae Kyun — VFX Generalist'
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || 'G-MQNWFS6P74'}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || 'G-MQNWFS6P74'}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <div className={`${helveticaNowDisplay.variable} ${canyon.variable} ${customFont.variable} ${jetbrainsMono.variable}`}>
        <ShaderBackground />
        <MouseContextProvider>
          <CustomCursor />
          <Layout router={router} >
            <AnimatePresence
              mode='wait'
              initial={true}
              onExitComplete={() => {
                if (typeof window !== 'undefined') {
                  if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
                  else window.scrollTo({ top: 0 })
                }
              }}
            >
              <Component {...pageProps} key={router.asPath} />
            </AnimatePresence>
          </Layout>
        </MouseContextProvider>
      </div>
    </>
  );
}

export default MyApp