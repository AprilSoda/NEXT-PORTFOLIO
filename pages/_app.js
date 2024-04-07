
import Layout from '../components/Layout';
import '../styles/globals.scss'
import { AnimatePresence } from 'framer-motion'
import CustomCursor from '../components/CustomCursor'
import MouseContextProvider from "../components/MouseContext";
import Script from 'next/script';
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}



function MyApp({ Component, pageProps, router }) {

  return (
    <>
      <MouseContextProvider>
        <CustomCursor />
        <Layout router={router} >
          <AnimatePresence
            exitBeforeEnter={true}
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
    </>

  );
}

export default MyApp