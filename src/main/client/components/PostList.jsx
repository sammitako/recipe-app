import { Grid, Box } from "@mui/material";
import PostCard from "./PostCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "@mui/system";
import { Blocks } from "react-loader-spinner";

const StyledGridItem = styled(Grid)(({ theme }) => ({
  display: "flex",
}));

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostList();
  }, []);

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {!loading ? (
        <Grid
          container
          rowSpacing={3}
          columnSpacing={{ xs: 2, sm: 3 }}
          justifyContent="center"
        >
          {posts?.map((post, index) => (
            <StyledGridItem item key={post.id}>
              <PostCard post={post} style={{ height: "100%" }} />
            </StyledGridItem>
          ))}
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
