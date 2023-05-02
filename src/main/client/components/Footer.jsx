import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        borderTop: "1px solid #ddd",
        mt: 20,
        p: 3,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {year} JUBANG. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
