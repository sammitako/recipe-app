import { Box, Container, Typography } from "@mui/material";
import React from "react";
import SearchBar from "./SearchBar";
import CreateButton from "./CreateButton";
import PostList from "./PostList";
import Layout from "./Layout";

const Feed = () => {
  return (
    <Layout>
      <Container>
        <Box sx={{ maxWidth: "sm", width: "100%", margin: "0 auto" }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", mt: 20, mb: -15 }}
          >
            Search any recipes
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
