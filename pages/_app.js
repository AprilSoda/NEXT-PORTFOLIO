import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import Layout from '../components/Layout';
import '../styles/globals.scss'
import { AnimatePresence } from 'framer-motion'
import CustomCursor from '../components/CustomCursor'
import ShaderBackground from '../components/ShaderBackground'
import FilmGrain from '../components/FilmGrain'
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
  '/': { en: 'Kim Tae Kyun — VFX Artist & Filmmaker', ko: '김태균 — VFX 아티스트 · 영화 만드는 사람' },
  '/works': { en: 'Work — Kim Tae Kyun', ko: '작업 — 김태균' },
  '/journal': { en: 'Journal — Kim Tae Kyun', ko: '저널 — 김태균' },
  '/about': { en: 'About — Kim Tae Kyun', ko: '소개 — 김태균' },
  '/contact': { en: 'Contact — Kim Tae Kyun', ko: '연락 — 김태균' },
}

function MyApp({ Component, pageProps, router }) {
  const nextRouter = useRouter();
  const lenisRef = useRef(null);

  // Reference-style smooth (inertia) scrolling, gated by reduced-motion.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
    lenisRef.current = lenis;
    // Drive Lenis from GSAP's ticker so scrolling and GSAP animations (cursor,
    // parallax) share one frame loop instead of two competing rAF loops
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Re-measure when the page height changes (images/fonts loading, route
    // changes) so the scroll limit always matches the real content height —
    // otherwise Lenis keeps its initial (too-short) measurement and can't reach
    // the bottom of long pages.
    let resizeRaf;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => lenis.resize());
    });
    ro.observe(document.body);

    // Burst-remeasure after fonts/images settle (the ResizeObserver alone can
    // miss late font-swap reflows, leaving the scroll limit short of the bottom).
    const bumpTimers = [60, 200, 500, 1000, 1800].map((d) => setTimeout(() => lenis.resize(), d));
    const onLoad = () => lenis.resize();
    window.addEventListener("load", onLoad);

    return () => {
      gsap.ticker.remove(tick);
      cancelAnimationFrame(resizeRaf);
      bumpTimers.forEach(clearTimeout);
      window.removeEventListener("load", onLoad);
      ro.disconnect();
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
      // new page just rendered — re-measure the smooth-scroll height as its
      // content (images/fonts) settles so you can always scroll to the bottom.
      [60, 200, 500, 1000].forEach((d) => setTimeout(() => lenisRef.current?.resize(), d));
    };

    // Track page views on route change
    nextRouter.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      nextRouter.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [nextRouter.events]);

  const locale = nextRouter.locale === 'ko' ? 'ko' : 'en'
  const pageTitle = (PAGE_TITLES[nextRouter.pathname] || PAGE_TITLES['/'])[locale]
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
        <FilmGrain />
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