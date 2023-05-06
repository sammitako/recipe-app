import Profile from "main/components/Profile";
import React from "react";
import { Toaster } from "react-hot-toast";

const index = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Profile />
    </>
  );
};

export default index;
