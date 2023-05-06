import { Grid } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-hot-toast";
import useUpdatePostList from "./hooks/useUpdatePostList";

const DeleteButton = ({
  postId,
  deleteModalOpen,
  setDeleteModalOpen,
  setAnchorEl,
}) => {
  const { removePostById } = useUpdatePostList();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPostClicked, setIsPostClicked] = useState(false); // to prevent user click outside of Dialog

  // const deletePost = async () => {
  //   setIsDeleting(true);
  //   setIsPostClicked(true);
  //   try {
  //     const response = await axios.delete(
  //       process.env.NEXT_PUBLIC_BASE_API_URL + `/deletePost/${postId}`
  //     );

  //     if (response.status === 200) {
  //       toast.success("Post deleted successfully");
  //       removePostById(postId); // Update post list after successful deletion
  //     } else {
  //       // Handle error while deleting the post
  //       toast.error("Error while deleting the post");
  //       console.error("Error while deleting the post");
  //     }
  //   } catch (error) {
  //     toast.error("Network error while deleting the post");
  //     console.error("Network error while deleting the post");
  //   }
  //   setIsDeleting(false);
  //   setIsPostClicked(false);
  // };
  const deletePost = () => {
    setIsDeleting(true);
    setIsPostClicked(true);

    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.delete(
          process.env.NEXT_PUBLIC_BASE_API_URL + `/deletePost/${postId}`
        );

        if (response.status === 200) {
          toast.success("Post deleted successfully");
          removePostById(postId); // Update post list after successful deletion
          resolve();
        } else {
          // Handle error while deleting the post
          toast.error("Error while deleting the post");
          console.error("Error while deleting the post");
          reject();
        }
      } catch (error) {
        toast.error("Network error while deleting the post");
        console.error("Network error while deleting the post");
        reject();
      } finally {
        setIsDeleting(false);
        setIsPostClicked(false);
      }
    });
  };
  const handleDelete = () => {
    handleClose();
    toast.promise(deletePost(), {
      loading: "Deleting...",
      success: "Post deleted successfully",
      error: "Error while deleting the post",
    });
  };

  const handleClose = () => {
    setDeleteModalOpen(false);
  };

  return (
    <Grid
      container
      sx={{
        width: "100%",
        flexGrow: 1,
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Dialog
        open={deleteModalOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you deleting your recipe?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            People have loved your recipe! Please think about it one more time.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default DeleteButton;
