import { Box, Container, Typography } from "@mui/material";
import axios from "axios";
import { useAtom } from "jotai";
import Layout from "main/components/Layout";
import MyPostList from "main/components/MyPostList";
import SearchBar from "main/components/SearchBar";
import { currentUserJotai, postListJotai } from "main/libs/jotai";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const MyRecipes = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useAtom(postListJotai);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentUser, setCurrentUser] = useAtom(currentUserJotai);
  const [hasCurrentUserPosts, setHasCurrentUserPosts] = useState(false);

  const fetchPostList = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_API_URL + "/posts"
      );
      setPosts(response.data);
      const currentUserPosts = response.data.filter(
        (post) => post.userId === currentUser.userId
      );
      setHasCurrentUserPosts(currentUserPosts.length > 0);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session && session.user) {
      fetchPostList();
    }
  }, [session]);

  useEffect(() => {
    console.log(session);
    fetchPostList();
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Layout>
        <Container sx={{ mt: 20 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", mb: -15 }}
          >
            My Recipes
          </Typography>
          <Box sx={{ maxWidth: "sm", width: "100%", margin: "0 auto", mb: 10 }}>
            <SearchBar
              setSearchKeyword={setSearchKeyword}
              setSearchResults={setSearchResults}
            />
          </Box>
          <Box color="text.secondary" sx={{ pb: 3, ml: 5 }}>
            <Typography>
              Result:{" "}
              {searchKeyword.length === 0
                ? posts.filter((post) => post.userId === currentUser.userId)
                    ?.length
                : searchResults?.filter(
                    (result) => result.userId === currentUser.userId
                  )?.length}
            </Typography>
          </Box>
          {!hasCurrentUserPosts ? (
            <Typography variant="h6" textAlign="center" mt={3}>
              You haven&apos;t shared any recipes.
            </Typography>
          ) : searchKeyword && searchResults.length === 0 ? (
            <Typography variant="h6" textAlign="center" mt={3}>
              No recipe post related to &quot;{searchKeyword}&quot;
            </Typography>
          ) : searchKeyword &&
            searchResults?.filter(
              (result) => result.userId === currentUser.userId
            )?.length === 0 ? (
            <Typography variant="h6" textAlign="center" mt={3}>
              No recipe post related to &quot;{searchKeyword}&quot;
            </Typography>
          ) : (
            <MyPostList
              searchResults={searchResults}
              isLoading={isLoading}
              posts={posts}
            />
          )}
        </Container>
      </Layout>
    </>
  );
};

export default MyRecipes;
