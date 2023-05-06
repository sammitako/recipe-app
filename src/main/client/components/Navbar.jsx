import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Login from "./Login";
import Image from "next/image";
import Loader from "./Loader";

const navItems = [
  { name: "My Profile", link: "/profile" },
  { name: "My Recipe", link: "/recipes" },
  { name: "Logout" },
];

function Navbar() {
  const { data: session, status } = useSession();

  return status === "loading" ? (
    <Loader />
  ) : (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Link
            href="/"
            style={{
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
            passHref
          >
            <Image
              style={{ borderRadius: "30%" }}
              height="40"
              width="40"
              layout="fixed"
              src={session?.user?.image}
              alt="user-image"
            />
          </Link>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
            <Link
              href="/"
              style={{
                fontWeight: 700,
                color: "#fff",
                textDecoration: "none",
              }}
              passHref
            >
              {session?.user?.name}
            </Link>
          </Typography>

          <Box sx={{ justifyContent: "" }}>
            {session ? (
              <>
                <Link href="/profile" passHref>
                  <Button sx={{ color: "#fff" }}>My Profile</Button>
                </Link>
                <Link href="/recipes" passHref>
                  <Button sx={{ color: "#fff" }}>My Recipes</Button>
                </Link>
                <Link href="/" passHref>
                  <Button
                    sx={{ color: "#fff" }}
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Logout
                  </Button>
                </Link>
              </>
            ) : (
              <Login />
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export default Navbar;
