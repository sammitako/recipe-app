import { Grid, Box } from "@mui/material";
import PostCard from "./PostCard";

const PostList = () => {
  // Assuming posts is an array of your 20 PostCard data
  const posts = Array(20).fill({}); // replace this with actual data

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Grid
        container
        rowSpacing={3}
        columnSpacing={{ xs: 2, sm: 3 }}
        justifyContent="center"
      >
        {posts.map((post, index) => (
          <Grid item key={index}>
            <PostCard />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PostList;
