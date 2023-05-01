import Navbar from "main/components/Navbar";
import PostList from "main/components/PostList";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Recipe App</title>
      </Head>
      <Navbar />
      <main>
        <PostList />
      </main>
    </>
  );
}
