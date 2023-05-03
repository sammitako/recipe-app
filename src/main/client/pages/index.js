import Feed from "main/components/Feed";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

export default function Home({ children }) {
  return (
    <>
      <Head>
        <title>Recipe App</title>
      </Head>

      <main>
        <Toaster position="top-center" reverseOrder={false} />
        <Feed />
      </main>
    </>
  );
}
