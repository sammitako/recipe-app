import { useAtom } from "jotai";
import { postListJotai } from "main/libs/jotai";

const useUpdatePostList = () => {
  const [postList, setPostList] = useAtom(postListJotai);

  const removePostById = (postId) => {
    const updatedPostList = postList.filter((post) => post.id !== postId);
    setPostList(updatedPostList);
  };

  return { removePostById };
};

export default useUpdatePostList;
