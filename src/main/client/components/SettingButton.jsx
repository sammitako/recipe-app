import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import UpdateButton from "./UpdateButton";

const SettingButton = ({ postId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    setUpdateModalOpen(true);
  };
  return (
    <>
      <IconButton
        aria-label="settings"
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
      {updateModalOpen && (
        <UpdateButton
          postId={postId}
          updateModalOpen={updateModalOpen}
          setUpdateModalOpen={setUpdateModalOpen}
          setAnchorEl={setAnchorEl}
        />
      )}
    </>
  );
};

export default SettingButton;
