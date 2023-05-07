import { Box, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import CreateButton from "./CreateButton";
import PostList from "./PostList";
import Layout from "./Layout";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useAtom } from "jotai";
import { currentUserJotai, postListJotai } from "main/libs/jotai";

const Feed = () => {
  const [posts, setPosts] = useAtom(postListJotai);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { data: session, status } = useSession();
  const [userCreationAttempted, setUserCreationAttempted] = useState(false);
  const [currentUser, setCurrentUser] = useAtom(currentUserJotai);

  const fetchPostList = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_API_URL + "/posts"
      );
      setPosts(response.data);
      console.log("Fetched posts:", response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePostsBackendUserDetails = async (userId, profileImgUrl) => {
    try {
      const response = await axios.patch(
        process.env.NEXT_PUBLIC_BASE_API_URL +
          `/updatePostsUserDetails/${userId}`,
        {
          profileImgUrl,
        }
      );

      if (response.status === 200) {
        console.log("Posts user details updated successfully in backend");
      } else {
        console.log("Error updating posts user details in backend");
      }
    } catch (error) {
      console.log("Error updating posts user details in backend:", error);
    }
  };

  const checkUserAndCreate = async () => {
    return new Promise(async (resolve) => {
      const { email, name, image } = session?.user;
      const firstName = name?.split(" ")[0];
      const lastName = name?.split(" ")[1];
      try {
        const existingUser = await axios.get(
          process.env.NEXT_PUBLIC_BASE_API_URL + `/userByEmail/${email}`
        );
        console.log("ExistingUser:>> ", existingUser);
        if (existingUser.status === 200 || existingUser.status === 201) {
          console.log("User already exists");
          console.log("Image from session:", image);
          console.log(
            "Image from existing user:",
            existingUser.data.profileImgUrl
          );
          // Set the updated user data for the currentUser state
          setCurrentUser({
            userId: existingUser.data.id,
            firstName: existingUser.data.firstName,
            lastName: existingUser.data.lastName,
            profileImgUrl: existingUser.data.profileImgUrl || image,
          });

          // Update the user's profileImgUrl if it has changed and existingUser does not have a profileImgUrl
          if (
            existingUser.data.profileImgUrl !== image &&
            !existingUser.data.profileImgUrl &&
            image
          ) {
            try {
              const updateResponse = await axios.patch(
                process.env.NEXT_PUBLIC_BASE_API_URL +
                  `/updateUserProfileImgUrl/${existingUser?.data?.id}`, // userId -> id
                { profileImgUrl: image }
              );

              console.log("Update response:", updateResponse);
              if (updateResponse.status === 200) {
                setCurrentUser((prevUser) => ({
                  ...prevUser,
                  profileImgUrl: image,
                }));
                console.log("User profileImgUrl updated successfully");
                // Update the user details in the posts collection in the backend
                updatePostsBackendUserDetails(
                  existingUser.data.id,
                  existingUser.data.firstName,
                  existingUser.data.lastName,
                  image
                );
              } else {
                console.log("Error updating user profileImgUrl");
              }
            } catch (updateError) {
              console.log("Error updating user profileImgUrl:", updateError);
            }
          }
        } else {
          console.log("Error finding user");
        }
      } catch (error) {
        // Create user
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

  const updatePostsUserDetails = (
    userId,
    firstName,
    lastName,
    profileImgUrl
  ) => {
    const updatedPosts = posts.map((post) => {
      if (post.userId === userId) {
        return {
          ...post,
          userFirstName: firstName,
          userLastName: lastName,
          userProfileImgUrl: profileImgUrl,
        };
      }
      return post;
    });

    setPosts(updatedPosts);
  };

  useEffect(() => {
    if (session && session?.user && !userCreationAttempted) {
      checkUserAndCreate().then(() => {
        console.log("Creating user page");
      });
    }
  }, [session, userCreationAttempted]);

  useEffect(() => {
    fetchPostList();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      updatePostsUserDetails(
        currentUser.userId,
        currentUser.firstName,
        currentUser.lastName,
        currentUser.profileImgUrl
      );
    }
  }, [currentUser]);

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
          <SearchBar
            setSearchKeyword={setSearchKeyword}
            setSearchResults={setSearchResults}
          />
          <CreateButton />
        </Box>
        <Box color="text.secondary" sx={{ pb: 3, ml: 5 }}>
          <Typography>
            Result:{" "}
            {searchKeyword.length === 0 ? posts?.length : searchResults?.length}
          </Typography>
        </Box>
        {searchKeyword && searchResults.length === 0 ? (
          <Typography variant="h6" textAlign="center" mt={3}>
            No recipe post related to &quot;{searchKeyword}&quot;
          </Typography>
        ) : !searchKeyword && posts.length === 0 ? (
          <Typography variant="h6" textAlign="center" mt={3}>
            No recipe post. Let us shared from you first.
          </Typography>
        ) : (
          <PostList
            posts={posts}
            searchResults={searchResults}
            isLoading={isLoading}
          />
        )}
      </Container>
    </Layout>
  );
};

export default Feed;
