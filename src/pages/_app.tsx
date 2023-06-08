import "../styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import Head from "next/head";
const MyApp: AppType = ({ Component, pageProps }) => {
  const description = "Lets find the cutest pokemon";
  const title = "Cutest Pokemon";
  const imageMetaURL = "https://pokemon-larasify.vercel.app/favicon.svg";


  return (
    <>
      <Head>
        <title>title</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.svg" />


        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageMetaURL} />
        <meta name="twitter:image" content={imageMetaURL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#000000" />


        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon.svg"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon.svg"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon.svg"
        />
        <link rel="manifest" href="/site.webmanifest?v=2" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="apple-mobile-web-app-title"
          content="Cutest Pokemon"
        />
        <meta
          name="application-name"
          content="Cutest Pokemon"
        />

      </Head>
      <Component {...pageProps} />
    </>
  );
};
export default trpc.withTRPC(MyApp);
