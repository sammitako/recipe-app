import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useState } from "react";
import { useAtom } from "jotai";
import { navbarIsLoggedInJotai, navbarTitleJotai } from "main/libs/jotai";

const navItems = [
  { name: "My Profile", link: "/profile" },
  { name: "My Recipe", link: "/recipes" },
  { name: "Logout" },
];

function Navbar() {
  const [title, setTitle] = useAtom(navbarTitleJotai);
  const [isLoggedIn, setIsLoggedIn] = useAtom(navbarIsLoggedInJotai);

  const handleLoginClick = () => {
    if (isLoggedIn) {
      setTitle("JUBANG");

      setIsLoggedIn(!isLoggedIn);
    } else {
      setTitle("SAM PARK");
      setIsLoggedIn(!isLoggedIn);
    }
    // logout logic
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link
                href="/"
                style={{
                  fontWeight: 700,
                  color: "#fff",
                  textDecoration: "none",
                }}
                passHref
              >
                {title}
              </Link>
            </Typography>

            <Box>
              {isLoggedIn ? (
                <>
                  <Link href="/profile" passHref>
                    <Button sx={{ color: "#fff" }}>My Profile</Button>
                  </Link>
                  <Link href="/recipes" passHref>
                    <Button sx={{ color: "#fff" }}>My Recipes</Button>
                  </Link>
                  <Link href="/" passHref>
                    <Button sx={{ color: "#fff" }} onClick={handleLoginClick}>
                      Logout
                    </Button>
                  </Link>
                </>
              ) : (
                <Button sx={{ color: "#fff" }} onClick={handleLoginClick}>
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
export default Navbar;
