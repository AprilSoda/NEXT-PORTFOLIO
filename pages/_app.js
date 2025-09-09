
import Layout from '../components/Layout';
import '../styles/globals.scss'
import { AnimatePresence } from 'framer-motion'
import CustomCursor from '../components/CustomCursor'
import MouseContextProvider from "../components/MouseContext";
import Script from 'next/script';
import localFont from 'next/font/local'
import { Roboto, Exo } from 'next/font/google'
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}

const helveticaNowDisplay = localFont({
  src: [
    { path: '../styles/font/HelveticaNowDisplay-Hairline.woff', weight: '100', style: 'normal' },
    { path: '../styles/font/HelveticaNowDisplay-Thin.woff', weight: '200', style: 'normal' },
    { path: '../styles/font/HelveticaNowDisplay-ExtLt.woff', weight: '300', style: 'normal' },
    { path: '../styles/font/HelveticaNowDisplay-Light.woff', weight: '400', style: 'normal' },
    { path: '../styles/font/HelveticaNowDisplay-Regular.woff', weight: '500', style: 'normal' },
    { path: '../styles/font/HelveticaNowDisplay-Medium.woff', weight: '600', style: 'normal' },
    { path: '../styles/font/HelveticaNowDisplay-Bold.woff', weight: '700', style: 'normal' },
    { path: '../styles/font/HelveticaNowDisplay-ExtraBold.woff', weight: '800', style: 'normal' },
    { path: '../styles/font/HelveticaNowDisplay-Black.woff', weight: '900', style: 'normal' },
    { path: '../styles/font/HelveticaNowDisplay-HairlineI.woff', weight: '100', style: 'italic' },
    { path: '../styles/font/HelveticaNowDisplay-ThinIta.woff', weight: '200', style: 'italic' },
    { path: '../styles/font/HelveticaNowDisplay-ExtLtIta.woff', weight: '300', style: 'italic' },
    { path: '../styles/font/HelveticaNowDisplay-LightIta.woff', weight: '400', style: 'italic' },
    { path: '../styles/font/HelveticaNowDisplay-RegIta.woff', weight: '500', style: 'italic' },
    { path: '../styles/font/HelveticaNowDisplay-MedIta.woff', weight: '600', style: 'italic' },
    { path: '../styles/font/HelveticaNowDisplay-BoldIta.woff', weight: '700', style: 'italic' },
    { path: '../styles/font/HelveticaNowDisplay-BlackIta.woff', weight: '900', style: 'italic' },
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

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

const exo = Exo({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-exo',
  display: 'swap',
})

function MyApp({ Component, pageProps, router }) {

  return (
    <div className={`${helveticaNowDisplay.variable} ${canyon.variable} ${customFont.variable} ${roboto.variable} ${exo.variable}`}>
      <MouseContextProvider>
        <CustomCursor />
        <Layout router={router} >
          <AnimatePresence
            mode='wait'
            initial={true}
            onExitComplete={() => {
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0 })
              }
            }}
          >
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </Layout>
      </MouseContextProvider>
    </div>

  );
}

export default MyApp