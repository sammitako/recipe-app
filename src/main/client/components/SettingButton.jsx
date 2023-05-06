import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem, Portal } from "@mui/material";
import UpdateButton from "./UpdateButton";
import DeleteButton from "./DeleteButton";

const SettingButton = ({ postId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    e?.stopPropagation();
    setAnchorEl(e?.currentTarget);
  };
  const handleClose = (e) => {
    e?.stopPropagation();
    setAnchorEl(null);
  };

  const handleEdit = (e) => {
    e?.stopPropagation();
    handleClose();
    setUpdateModalOpen(true);
  };

  const handleDelete = (e) => {
    e?.stopPropagation();
    handleClose();
    setDeleteModalOpen(true);
  };
  return (
    <>
      <IconButton
        aria-label="settings"
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e);
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={(e) => handleClose(e)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={(e) => handleEdit(e)}>Edit</MenuItem>
        <MenuItem onClick={(e) => handleDelete(e)}>Delete</MenuItem>
      </Menu>
      {updateModalOpen && (
        <Portal>
          <UpdateButton
            postId={postId}
            updateModalOpen={updateModalOpen}
            setUpdateModalOpen={setUpdateModalOpen}
            setAnchorEl={setAnchorEl}
          />
        </Portal>
      )}
      {deleteModalOpen && (
        <Portal>
          <DeleteButton
            postId={postId}
            deleteModalOpen={deleteModalOpen}
            setDeleteModalOpen={setDeleteModalOpen}
            setAnchorEl={setAnchorEl}
          />
        </Portal>
      )}
    </>
  );
};

export default SettingButton;
