import Feed from "main/components/Feed";
import Login from "main/components/Login";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

export default function Home({ children, session }) {
  if (!session) return <Login />;
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

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
