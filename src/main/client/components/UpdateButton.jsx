import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { Autocomplete, Box, Chip } from "@mui/material";
import { ingredientList } from "../libs/ingredients";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import moment from "moment";
import { toast } from "react-hot-toast";
import { useAtom } from "jotai";
import { currentUserJotai, postListJotai } from "main/libs/jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const useStyles = makeStyles(() => ({
  dropzone: {
    border: "2px dotted rgba(0, 0, 0, .6)",
    padding: "20px",
    textAlign: "center",
    marginBottom: "10px",
    width: "100%",
    color: "#000000",
    opacity: 0.6,
    marginTop: 20,
  },
}));

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
  margin: "0 auto",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

export default function UpdateButton({
  updateModalOpen,
  setUpdateModalOpen,
  postId,
}) {
  const router = useRouter();
  const classes = useStyles();
  const [open, setOpen] = useState(updateModalOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [postList, setPostList] = useAtom(postListJotai);
  const [file, setFile] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [currentUser, setCurrentUser] = useAtom(currentUserJotai);
  const [currentPost, setCurrentPost] = useState({});
  const [updatedPost, setUpdatedPost] = useState({});
  const [isPostClicked, setIsPostClicked] = useState(false); // to prevent user click outside of Dialog

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(
        Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        })
      );
    },
  });

  const thumbs = file ? (
    <div style={thumb}>
      <div style={thumbInner}>
        <Image
          alt="cover"
          src={file.preview}
          style={img}
          width={500}
          height={500}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ) : null;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setFile([]); // Reset the file as well
    setUpdateModalOpen(false); // Change this line
  };
  const handleDialogClose = (event, reason) => {
    if (reason === "backdropClick" && (isLoading || isPostClicked)) {
      return;
    }
    handleClose();
  };
  const handleChange = (event) => {
    setUpdatedPost({ ...updatedPost, [event.target.name]: event.target.value });
  };

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_API_URL + "/categories"
      );
      setCategoryList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPostById = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_API_URL + "/post/" + postId
      );
      setCurrentPost(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error(error);
    }
  };

  const updatePost = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsPostClicked(true);

    const coverImgUrl = await uploadImageToCloudinary(file);
    const updatedPostData = {
      ...updatedPost,
      userId: currentUser.userId,
      userFirstName: currentUser.firstName,
      userLastName: currentUser.lastName,
      coverImgUrl,
      createdAt: moment().toISOString(),
    };

    toast.promise(
      axios.put(
        process.env.NEXT_PUBLIC_BASE_API_URL + "/updatePost/" + postId,
        updatedPostData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
      {
        loading: "Updating...",
        success: (response) => {
          setPostList((prevPosts) => {
            return prevPosts.map((post) =>
              post.id === response.data.id ? response.data : post
            );
          });
          handleClose();
          return "Successfully updated!";
        },
        error: (err) => {
          console.error(err);
          return "Updating didn't work.";
        },
      }
    );
    setIsLoading(false);
    setIsPostClicked(false);
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  useEffect(() => {
    if (updateModalOpen) {
      fetchPostById();
    }
  }, [updateModalOpen]);

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => URL.revokeObjectURL(file.preview);
  }, [file]);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        mt: 3,
        mb: 5,
      }}
    >
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Share my recipe</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            To share your recipe, you will need a cover photo. Please enter all
            the ingredients that would be used to make your dish.
          </DialogContentText>
          <TextField
            sx={{ mb: 2 }}
            required
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            fullWidth
            variant="outlined"
            name="title"
            value={updatedPost?.title}
            defaultValue={currentPost?.title}
            onChange={(e) => handleChange(e)}
          />

          <Autocomplete
            sx={{ mb: 2 }}
            required
            disablePortal
            fullWidth
            id="combo-box-demo"
            options={categoryList.map((category) => category)}
            renderInput={(params) => <TextField {...params} label="Category" />}
            name="category"
            value={updatedPost?.category}
            defaultValue={currentPost?.category}
            onChange={(event, newValue) => {
              setUpdatedPost((prevState) => ({
                ...prevState,
                category: newValue,
              }));
            }}
          />
          <Autocomplete
            sx={{ mb: 2.5 }}
            required
            multiple
            id="tags-filled"
            name="ingredients"
            value={updatedPost?.ingredients}
            onChange={(event, newValue) => {
              setUpdatedPost((prevState) => ({
                ...prevState,
                ingredients: newValue,
              }));
            }}
            options={ingredientList.map((incredient) => incredient)}
            defaultValue={currentPost?.ingredients}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={option}
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ingredients"
                placeholder="Ingredient"
              />
            )}
          />
          <TextField
            required
            fullWidth
            id="outlined-multiline-flexible"
            label="Recipe"
            placeholder="Share your method"
            multiline
            rows={10}
            name="content"
            value={updatedPost?.content}
            defaultValue={currentPost?.content}
            onChange={(e) => handleChange(e)}
          />
          <section className="container">
            <div
              style={{ cursor: "pointer" }}
              {...getRootProps({ className: classes.dropzone })}
            >
              <input
                name="coverImgUrl"
                value={updatedPost?.coverImgUrl}
                onChange={(e) => handleChange(e)}
                {...getInputProps()}
              />
              <p>
                Drag and drop a cover image file here, or click to select file
              </p>
              <CloudUploadIcon sx={{ fontSize: 40 }} />
            </div>
            <aside style={{ ...thumbsContainer, justifyContent: "center" }}>
              {file.preview ? thumbs : null}
            </aside>
          </section>
        </DialogContent>
        <DialogActions>
          {!isLoading && (
            <Button disabled={isLoading || isPostClicked} onClick={handleClose}>
              Cancel
            </Button>
          )}
          <Button disabled={isLoading} onClick={updatePost}>
            {!isLoading ? "UPDATE" : "UPDATING"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
