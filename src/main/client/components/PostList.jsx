import { Grid, Box } from "@mui/material";
import PostCard from "./PostCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "@mui/system";
import { Blocks } from "react-loader-spinner";
import ExpandablePostCard from "./ExpandablePostCard";
import { useAtom } from "jotai";
import { isLoadingImageJotai, postListJotai } from "main/libs/jotai";

const StyledGridItem = styled(Grid)(({ theme }) => ({
  display: "flex",
}));

const PostList = () => {
  const [posts, setPosts] = useAtom(postListJotai);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState(null);

  const handleExpandClick = (id) => {
    setExpandedPost(expandedPost === id ? null : id);
  };

  const fetchPostList = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_API_URL + "/posts"
      );
      setPosts(response.data);
      console.log(response.data);
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
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {!isLoading ? (
        <Grid
          container
          rowSpacing={3}
          columnSpacing={{ xs: 2, sm: 3 }}
          justifyContent="flex-start"
        >
          {posts?.map((post, index) => (
            <StyledGridItem item key={post.id}>
              <ExpandablePostCard
                post={post}
                style={{ height: "100%" }}
                expandedPost={expandedPost}
                handleExpandClick={handleExpandClick}
              />
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
