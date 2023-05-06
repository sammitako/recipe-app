import { Box, Button, Container, Typography, TextField } from "@mui/material";
import Layout from "main/components/Layout";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import { toast } from "react-hot-toast";
import { currentUserJotai } from "main/libs/jotai";
import { useAtom } from "jotai";

const Profile = () => {
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useAtom(currentUserJotai);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState(currentUser?.firstName);
  const [lastName, setLastName] = useState(currentUser?.lastName);

  const handleSaveButtonClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setTimeout(async () => {
        const response = await axios.put(
          process.env.NEXT_PUBLIC_BASE_API_URL + "/updateUser",
          {
            id: currentUser.userId,
            email: session.user.email,
            firstName: firstName,
            lastName: lastName,
          }
        );
        if (response.status === 200) {
          toast.success("Successfully updated!");
          console.log("User updated successfully");
        } else {
          console.log("Error updating user");
        }
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.log("Error updating user:", error);
      setIsLoading(false);
    }
  };

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
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            fullWidth
            variant="standard"
            id="outlined-helperText"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Button
            disabled={isLoading}
            variant="contained"
            sx={{ display: "flex", m: "0 auto", width: "20%", fontWeight: 700 }}
            onClick={(e) => handleSaveButtonClick(e)}
          >
            {!isLoading ? "Save" : "SAVING"}
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default Profile;