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
import { topFilms } from "../libs/data";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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

export default function CreateButton() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState([]);
  const classes = useStyles();

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
    setOpen(false);
  };

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
            autoFocus
            margin="dense"
            id="name"
            label="Dish Name"
            fullWidth
            variant="outlined"
          />

          <Autocomplete
            sx={{ mb: 2 }}
            disablePortal
            fullWidth
            id="combo-box-demo"
            options={topFilms.map((option) => option.title)}
            renderInput={(params) => <TextField {...params} label="Category" />}
          />
          <Autocomplete
            sx={{ mb: 2.5 }}
            multiple
            id="tags-filled"
            options={topFilms.map((option) => option.title)}
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
                placeholder="ingredient"
              />
            )}
          />
          <TextField
            fullWidth
            id="outlined-multiline-flexible"
            label="Recipe"
            placeholder="Share your method"
            multiline
            rows={10}
          />
          <section className="container">
            <div
              style={{ cursor: "pointer" }}
              {...getRootProps({ className: classes.dropzone })}
            >
              <input {...getInputProps()} />
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Post</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
