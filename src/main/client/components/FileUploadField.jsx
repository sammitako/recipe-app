import { Button } from "@mui/material";
import { useField } from "formik";

const FileUploadField = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    helpers.setValue(file);
  };

  return (
    <>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
        {...field}
      />
      <label htmlFor="raised-button-file">
        <Button component="span" variant="outlined">
          {label}
        </Button>
      </label>
      {meta.touched && meta.error ? (
        <div style={{ color: "red", marginTop: "5px" }}>{meta.error}</div>
      ) : null}
    </>
  );
};
export default FileUploadField;
