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
  const [firstName, setFirstName] = useState(currentUser?.firstName || "");
  const [lastName, setLastName] = useState(currentUser?.lastName || "");

  const handleSaveButtonClick = async (e) => {
    e.preventDefault();
    const updates = {
      firstName: firstName,
      lastName: lastName,
      profileImgUrl: currentUser.profileImgUrl,
    };
    await handleUpdateUser(updates);
  };

  const handleUpdateUser = async (updates) => {
    setIsLoading(true);
    try {
      const response = await axios.patch(
        process.env.NEXT_PUBLIC_BASE_API_URL +
          `/updateUserNames/${currentUser.userId}`,
        updates
      );
      if (response.status === 200) {
        toast.success("Successfully updated!");
        console.log("User updated successfully");

        // Update the currentUser atom with the updated values
        setCurrentUser((prevUser) => {
          const newUser = { ...prevUser };
          if (updates.hasOwnProperty("firstName")) {
            newUser.firstName = updates.firstName;
          }
          if (updates.hasOwnProperty("lastName")) {
            newUser.lastName = updates.lastName;
          }
          if (updates.hasOwnProperty("profileImgUrl")) {
            newUser.profileImgUrl = updates.profileImgUrl;
          }
          return newUser;
        });
        // Update user details in the posts
        await axios.patch(
          process.env.NEXT_PUBLIC_BASE_API_URL +
            `/updatePostsUserDetails/${currentUser.userId}`,
          updates
        );
      } else {
        console.log("Error updating user");
      }
    } catch (error) {
      console.log("Error updating user:", error);
    } finally {
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
