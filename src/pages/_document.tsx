import Document, { Head, Html, Main, NextScript } from "next/document";

const MyDocument: React.FC<Document> = () => {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#9334e9" />
      </Head>
      <body className="bg-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
