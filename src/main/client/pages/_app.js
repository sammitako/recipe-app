import "main/styles/globals.css";
import { SessionProvider } from "next-auth/react";

function App({ session, Component, pageProps }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default App;
