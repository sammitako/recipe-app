import { Grid, Box } from "@mui/material";
import PostCard from "./PostCard";
import { useEffect, useState } from "react";
import axios from "axios";

const PostList = () => {
  // Assuming posts is an array of your 20 PostCard data
  const dummy = Array(20).fill({});
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPostList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_API_URL + "/posts"
      );
      setPosts(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPostList();
  }, []);

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Grid
        container
        rowSpacing={3}
        columnSpacing={{ xs: 2, sm: 3 }}
        justifyContent="center"
      >
        {dummy?.map((post, index) => (
          <Grid item key={index}>
            <PostCard />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PostList;
