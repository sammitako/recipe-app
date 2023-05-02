import Feed from "main/components/Feed";
import Head from "next/head";

export default function Home({ children }) {
  return (
    <>
      <Head>
        <title>Recipe App</title>
      </Head>

      <main>
        <Feed />
      </main>
    </>
  );
}
