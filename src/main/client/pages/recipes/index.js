import { Box, Container, Typography } from "@mui/material";
import Layout from "main/components/Layout";
import MyPostList from "main/components/MyPostList";
import PostList from "main/components/PostList";
import SearchBar from "main/components/SearchBar";
import React from "react";

const index = () => {
  return (
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
          <SearchBar />
        </Box>
        <MyPostList />
      </Container>
    </Layout>
  );
};

export default index;
