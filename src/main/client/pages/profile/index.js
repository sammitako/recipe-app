import { Box, Button, Container, Typography, TextField } from "@mui/material";
import Layout from "main/components/Layout";
import React from "react";

const index = () => {
  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 20 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", mb: 5 }}
        >
          My Profile
        </Typography>
        <Box
          sx={{
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            bgcolor: "white",
            mb: 5,
            p: 5,
          }}
        >
          <TextField
            fullWidth
            disabled
            variant="standard"
            id="outlined-helperText"
            label="Email"
            defaultValue="Default Value"
          />
          <TextField
            fullWidth
            variant="standard"
            id="outlined-helperText"
            label="First Name"
            defaultValue="Default Value"
          />
          <TextField
            fullWidth
            variant="standard"
            id="outlined-helperText"
            label="Last Name"
            defaultValue="Default Value"
          />
          <Button
            variant="contained"
            sx={{ display: "flex", m: "0 auto", width: "20%", fontWeight: 700 }}
          >
            Save
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default index;
