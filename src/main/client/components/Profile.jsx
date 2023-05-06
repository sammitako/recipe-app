import { Box, Button, Container, Typography, TextField } from "@mui/material";
import Layout from "main/components/Layout";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { data: session, status } = useSession();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_API_URL +
          `/userByEmail/${session.user.email}`
      );
      if (response.status === 200) {
        const user = response.data;
        setFirstName(user.firstName);
        setLastName(user.lastName);
      } else {
        console.log("Error finding user");
      }
    } catch (error) {
      console.log("Error finding user:", error);
    }
  };

  const updateUser = async (e, id, firstName, lastName) => {
    e.preventDefault();
    setIsLoading(true);
    setFirstName(firstName);
    setLastName(lastName);
    try {
      setTimeout(async () => {
        const response = await axios.put(
          process.env.NEXT_PUBLIC_BASE_API_URL + "/updateUser",
          {
            id,
            email: session.user.email,
            firstName,
            lastName,
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

  const handleSaveButtonClick = async (e) => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_API_URL +
          `/userByEmail/${session.user.email}`
      );
      if (response.status === 200) {
        const user = response.data;
        updateUser(e, user.id, firstName, lastName);
      } else {
        console.log("Error finding user");
      }
    } catch (error) {
      console.log("Error finding user:", error);
    }
  };

  useEffect(() => {
    if (session && session.user) {
      fetchUserData();
    }
  }, [session]);

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
