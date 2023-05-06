import { Box, Button, Container, Typography, TextField } from "@mui/material";
import Layout from "main/components/Layout";
import { useSession } from "next-auth/react";
import React from "react";
import { Blocks } from "react-loader-spinner";
import Loader from "./Loader";

const Profile = () => {
  const { data: session, status } = useSession();

  console.log(session?.user?.name.split(" ")[0]);
  return status === "loading" ? (
    <Loader />
  ) : (
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
            p: 5,
          }}
        >
          <TextField
            fullWidth
            disabled
            variant="standard"
            id="outlined-helperText"
            label="Email"
            defaultValue={session?.user?.email}
          />
          <TextField
            fullWidth
            variant="standard"
            id="outlined-helperText"
            label="First Name"
            defaultValue={session?.user.name.split(" ")[0]}
          />
          <TextField
            fullWidth
            variant="standard"
            id="outlined-helperText"
            label="Last Name"
            defaultValue={session?.user.name.split(" ")[1]}
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

export default Profile;
