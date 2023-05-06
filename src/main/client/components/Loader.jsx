import { Grid } from "@mui/material";
import React from "react";
import { Blocks } from "react-loader-spinner";

const Loader = () => {
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
        backgroundColor: "#f1f1f1",
      }}
    >
      <Blocks
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
      />
    </Grid>
  );
};

export default Loader;
