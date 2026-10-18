import Document, { Html, Head, Main, NextScript } from 'next/document'

const PRETENDARD_CSS =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang={this.props.locale || "en"}>
        <Head>
          {/* Pretendard for Hangul — dynamic subset, so only the glyph ranges a page uses are downloaded */}
          <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
          {/* Attached by script so it never blocks the first paint (system Korean fonts cover until it loads) */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='${PRETENDARD_CSS}';document.head.appendChild(l)})()`,
            }}
          />
          <noscript>
            <link rel="stylesheet" href={PRETENDARD_CSS} />
          </noscript>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument