import { Box, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import CreateButton from "./CreateButton";
import PostList from "./PostList";
import Layout from "./Layout";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useAtom } from "jotai";
import { currentUserJotai } from "main/libs/jotai";

const Feed = () => {
  const { data: session, status } = useSession();
  const [userCreationAttempted, setUserCreationAttempted] = useState(false);

  const checkUserAndCreate = async () => {
    return new Promise(async (resolve) => {
      const { email, name, image } = session?.user;
      const firstName = name?.split(" ")[0];
      const lastName = name?.split(" ")[1];
      try {
        const existingUser = await axios.get(
          process.env.NEXT_PUBLIC_BASE_API_URL + `/userByEmail/${email}`
        );

        if (existingUser.status === 200 || existingUser.status === 201) {
          console.log("User already exists");

          // Update the user's profileImgUrl if it has changed
          if (existingUser.data.profileImgUrl !== image) {
            try {
              await axios.patch(
                process.env.NEXT_PUBLIC_BASE_API_URL +
                  `/updateUser/${existingUser.data.userId}`,
                { profileImgUrl: image }
              );
              console.log("User profileImgUrl updated successfully");
            } catch (updateError) {
              console.log("Error updating user profileImgUrl:", updateError);
            }
          }
        } else {
          console.log("Error finding user");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          try {
            const response = await axios.post(
              process.env.NEXT_PUBLIC_BASE_API_URL + "/createUser",
              {
                email: email,
                firstName: firstName,
                lastName: lastName,
                profileImgUrl: image, // Pass the user image URL when creating a new user
              }
            );

            if (response.status === 200 || response.status === 201) {
              console.log("User created successfully");
            } else {
              console.log("Error creating user");
            }
          } catch (creationError) {
            console.log("Error creating user:", creationError);
          }
        } else {
          console.log("Error creating or finding user:", error);
        }
      }
      setUserCreationAttempted(true);
      resolve();
    });
  };

  useEffect(() => {
    if (session && session?.user && !userCreationAttempted) {
      checkUserAndCreate().then(() => {
        console.log("Creating user page");
      });
    }
  }, [session, userCreationAttempted]);

  return (
    <Layout>
      <Container>
        <Box sx={{ maxWidth: "sm", width: "100%", margin: "0 auto" }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", mt: 20, mb: -15 }}
          >
            What&apos;s your dinner plan?
          </Typography>
          <SearchBar />
          <CreateButton />
        </Box>
        <PostList />
      </Container>
    </Layout>
  );
};

export default Feed;
