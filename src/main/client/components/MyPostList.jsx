import { Grid, Box } from "@mui/material";
import PostCard from "./PostCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "@mui/system";
import { Blocks } from "react-loader-spinner";
import { useAtom } from "jotai";
import { currentUserJotai, postListJotai } from "main/libs/jotai";
import { useSession } from "next-auth/react";

const MyPostList = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useAtom(postListJotai);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState(null);
  const [currentUser, setCurrentUser] = useAtom(currentUserJotai);

  const handleExpandClick = (id, event) => {
    setExpandedPost(expandedPost === id ? null : id);
  };

  const fetchPostList = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_API_URL + "/posts"
      );
      setPosts(response.data);
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

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {!isLoading && currentUser.userId ? (
        <Grid
          container
          rowSpacing={3}
          columnSpacing={{ xs: 2, sm: 3 }}
          justifyContent="center"
          item
        >
          {posts
            ?.filter((post) => post.userId === currentUser.userId)
            .map((post, index) => {
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

export default MyPostList;
