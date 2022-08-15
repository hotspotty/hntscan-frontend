import AppProvider from "context";
import DefaultLayout from "layouts/default";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import "styles/globals.css";
import initGa from "utils/ga";
import initHotjar from "utils/hotjar";
import useMount from "utils/useMount";

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  useMount(() => {
    initGa(process.env.NEXT_PUBLIC_GA4_ID);
    initHotjar(process.env.NEXT_PUBLIC_HJID, process.env.NEXT_PUBLIC_HJSV);
  });

  return (
    <AppProvider>
      <DefaultLayout>
        <NextNProgress
          color="#9333EA"
          startPosition={0.4}
          stopDelayMs={200}
          height={2}
          showOnShallow={true}
          options={{ easing: "ease", speed: 500 }}
        />

        <Component {...pageProps} />
      </DefaultLayout>
    </AppProvider>
  );
};

export default MyApp;
