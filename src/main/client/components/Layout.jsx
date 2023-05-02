import React from "react";
import Navbar from "./Navbar";
import { Box } from "@mui/material";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f1f1f1",
      }}
    >
      <Navbar />
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
      <Footer />
    </Box>
  );
};

export default Layout;
