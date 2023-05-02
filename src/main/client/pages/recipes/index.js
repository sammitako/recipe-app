import { Box, Container } from "@mui/material";
import CreateButton from "main/components/CreateButton";
import Layout from "main/components/Layout";
import PostList from "main/components/PostList";
import SearchBar from "main/components/SearchBar";
import React from "react";

const index = () => {
  return (
    <Layout>
      <Container>
        <Box sx={{ maxWidth: "sm", width: "100%", margin: "0 auto", mb: 10 }}>
          <SearchBar />
        </Box>
        <PostList />
      </Container>
    </Layout>
  );
};

export default index;
