import { Grid, Box } from "@mui/material";
import PostCard from "./PostCard";
import { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { Blocks } from "react-loader-spinner";

const PostList = ({ posts, searchResults, isLoading }) => {
  const [expandedPost, setExpandedPost] = useState(null);
  const displayedPosts = searchResults?.length > 0 ? searchResults : posts;

  const handleExpandClick = (id, event) => {
    setExpandedPost(expandedPost === id ? null : id);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {!isLoading ? (
        <Grid
          container
          rowSpacing={3}
          columnSpacing={{ xs: 2, sm: 3 }}
          justifyContent="center"
          item
        >
          {/* posts -> displayedPosts */}
          {displayedPosts?.map((post, index) => {
            // console.log(post.id);
            return (
              <Grid item key={post.id}>
                <PostCard
                  post={post}
                  expanded={expandedPost === post.id}
                  handleExpandClick={() => handleExpandClick(post.id)}
                />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Blocks
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
        />
      )}
    </Box>
  );
};

export default PostList;
