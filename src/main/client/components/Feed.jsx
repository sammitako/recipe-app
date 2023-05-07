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

  useEffect(() => {
    fetchPostList();
  }, []);

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
