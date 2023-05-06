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
import { postListJotai } from "main/libs/jotai";
import { useSession } from "next-auth/react";

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

const initialPostState = {
  userId: "",
  userFirstName: "",
  userLastName: "",
  title: "",
  category: "",
  ingredients: [],
  content: "",
  coverImgUrl: "",
  createdAt: "",
};

export default function CreateButton() {
  const { data: session, status } = useSession();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postList, setPostList] = useAtom(postListJotai);
  const [file, setFile] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [post, setPost] = useState(initialPostState);
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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
    setPost(initialPostState);
    setFile([]); // Reset the file as well
    setOpen(false);
  };

  const handleChange = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
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

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_API_URL +
          `/userByEmail/${session.user.email}`
      );
      if (response.status === 200) {
        const user = response.data;
        setUserId(user.id);
        setFirstName(user.firstName);
        setLastName(user.lastName);
      } else {
        console.log("Error finding user");
      }
    } catch (error) {
      console.log("Error finding user:", error);
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

  const createPost = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const coverImgUrl = await uploadImageToCloudinary(file);
    const updatedPost = {
      ...post,
      userId,
      userFirstName: firstName,
      userLastName: lastName,
      coverImgUrl,
      createdAt: moment().toISOString(),
    };

    try {
      toast.promise(saveSettings(isLoading), {
        loading: "Saving...",
        success: <b>Recipe shared successfully!</b>,
        error: <b>Failed to post.</b>,
      });
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_API_URL + "/createPost",
        updatedPost,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPostList((prevPosts) => [response.data, ...prevPosts]);
      // toast.success("Thanks for sharing!");
      handleClose(); // Reset the input fields
    } catch (error) {
      if (error.response) {
        toast.error("Posting didn't work.");
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
    setIsLoading(false);
    setOpen(false);
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => URL.revokeObjectURL(file.preview);
  }, [file]);
  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);
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
      <Button
        variant="text"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
        sx={{ height: 50 }}
        fullWidth
      >
        Share your recipe
      </Button>
      <Dialog open={open} onClose={handleClose}>
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
            value={post.title}
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
            value={post.category}
            onChange={(event, newValue) => {
              setPost((prevState) => ({
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
            value={post.ingredients}
            onChange={(event, newValue) => {
              setPost((prevState) => ({
                ...prevState,
                ingredients: newValue,
              }));
            }}
            options={ingredientList.map((incredient) => incredient)}
            // defaultValue={[topFilms[13].title]}
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
            value={post.content}
            onChange={(e) => handleChange(e)}
          />
          <section className="container">
            <div
              style={{ cursor: "pointer" }}
              {...getRootProps({ className: classes.dropzone })}
            >
              <input
                name="coverImgUrl"
                value={post.coverImgUrl}
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
          {!isLoading && <Button onClick={handleClose}>Cancel</Button>}
          <Button disabled={isLoading} onClick={createPost}>
            {!isLoading ? "POST" : "POSTING"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
