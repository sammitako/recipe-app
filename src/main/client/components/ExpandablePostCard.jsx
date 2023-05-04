import React, { useState } from "react";
import PostCard from "./PostCard";

const ExpandablePostCard = ({
  post,
  style,
  expandedPost,
  handleExpandClick,
}) => {
  const expanded = expandedPost === post.id;

  return (
    <PostCard
      post={post}
      style={style}
      expanded={expanded}
      handleExpandClick={() => handleExpandClick(post.id)}
    />
  );
};

export default ExpandablePostCard;
