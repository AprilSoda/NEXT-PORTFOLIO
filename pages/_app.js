
import Layout from '../components/Layout';
import Head from 'next/head';
import '../styles/globals.scss'
import { AnimatePresence } from 'framer-motion'
import CustomCursor from '../components/CustomCursor'
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}

function MyApp({ Component, pageProps, router }) {
  return (
  <>
    <CustomCursor />
    <Layout router={router} >
      <AnimatePresence
        exitBeforeEnter
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
  </>
    
    );
}

export default MyApp