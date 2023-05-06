import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
// import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Chip, Skeleton } from "@mui/material";
// import Image from "mui-image";
import Image from "next/image";
import SettingButton from "./SettingButton";
import Moment from "react-moment";
import { useAtom } from "jotai";
import { currentUserJotai } from "main/libs/jotai";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const PostCard = ({ post, expanded, handleExpandClick }) => {
  const {
    id,
    userId,
    userFirstName,
    userLastName,
    profileImgUrl,
    createdAt,
    title,
    content,
    category,
    ingredients,
    coverImgUrl,
  } = post;
  const userFullName = userFirstName?.concat(" ", userLastName);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [currentUser, setCurrentUser] = useAtom(currentUserJotai);

  const handleImageLoad = () => {
    setIsLoadingImage(false);
  };

  return (
    <Card sx={{ maxWidth: 345, position: "relative" }}>
      <Box display="flex" flexDirection="column">
        <CardHeader
          sx={{ zIndex: 10 }}
          avatar={
            profileImgUrl ? (
              <Avatar
                src={profileImgUrl}
                alt={`${userFirstName} ${userLastName}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                  e.target.style.backgroundColor = red[500];
                }}
                aria-label="recipe"
              >
                {userFirstName && userFirstName[0]}
              </Avatar>
            ) : (
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {userFirstName && userFirstName[0]}
              </Avatar>
            )
          }
          action={
            currentUser?.userId === userId ? (
              <SettingButton postId={id} />
            ) : null
          }
          title={userFirstName ? userFullName : "Deleted User"}
          subheader={
            <Moment format="MMM D, YYYY" withTitle>
              {createdAt}
            </Moment>
          }
        />
        {isLoadingImage && (
          <Skeleton
            sx={{
              height: 200,
              width: 400,
              position: "absolute",
              top: 71,
              left: 0,
              zIndex: 1,
            }}
            animation="wave"
            variant="rectangular"
          />
        )}
        <div
          style={{
            width: 400,
            height: 200,
            backgroundSize: "cover",
            backgroundImage: `url(${coverImgUrl})`,
            backgroundPosition: "center",
            transition: "opacity 1s",
            opacity: isLoadingImage ? 0 : 1,
          }}
        />
        {coverImgUrl && (
          <Image
            width={400}
            height={200}
            src={coverImgUrl}
            alt="Cover Image"
            style={{ opacity: 0, position: "absolute", top: 0, left: 0 }}
            onLoad={handleImageLoad}
          />
        )}
        <CardContent style={{ minHeight: "100px" }}>
          <Typography variant="body1">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {ingredients?.join(", ")}
          </Typography>
        </CardContent>
        <CardActions disableSpacing={true}>
          <Chip label={category} variant="outlined" />
          <ExpandMore
            expand={expanded}
            onClick={(event) => {
              event.stopPropagation();
              handleExpandClick(post.id);
            }}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div style={{ position: "relative" }}>
          <CardContent>
            <Typography paragraph>Method:</Typography>
            <Typography paragraph>{content}</Typography>
          </CardContent>
        </div>
      </Collapse>
    </Card>
  );
};

export default PostCard;
