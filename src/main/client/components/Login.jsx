import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { signIn, useSession } from "next-auth/react";
import Loader from "./Loader";
import { useAtom } from "jotai";
import { currentUserJotai } from "main/libs/jotai";

const Login = () => {
  const { data: session, status } = useSession();
  const [userCreationAttempted, setUserCreationAttempted] = useState(false);
  const [currentUser, setCurrentUser] = useAtom(currentUserJotai);
  const handleSignInWithGoogle = () => {
    signIn("google");
  };

  const handleSignInWithFacebook = () => {
    signIn("facebook");
  };

  const checkUserAndCreate = async () => {
    return new Promise(async (resolve) => {
      const { email, name, image } = session?.user;
      const firstName = name?.split(" ")[0];
      const lastName = name?.split(" ")[1];
      try {
        const existingUser = await axios.get(
          process.env.NEXT_PUBLIC_BASE_API_URL + `/userByEmail/${email}`
        );

        if (existingUser.status === 200 || existingUser.status === 201) {
          console.log("User already exists");

          // Update the user's profileImgUrl if it has changed
          if (existingUser.data.profileImgUrl !== image) {
            try {
              await axios.patch(
                process.env.NEXT_PUBLIC_BASE_API_URL +
                  `/updateUser/${existingUser.data.userId}`,
                { profileImgUrl: image }
              );
              console.log("User profileImgUrl updated successfully");
            } catch (updateError) {
              console.log("Error updating user profileImgUrl:", updateError);
            }
          }
        } else {
          console.log("Error finding user");
        }
      } catch (error) {
        // Create user
        if (error.response && error.response.status === 404) {
          try {
            const response = await axios.post(
              process.env.NEXT_PUBLIC_BASE_API_URL + "/createUser",
              {
                email: email,
                firstName: firstName,
                lastName: lastName,
                profileImgUrl: image, // Pass the user image URL when creating a new user
              }
            );
            if (response.status === 200 || response.status === 201) {
              console.log("User created successfully");
            } else {
              console.log("Error creating user");
            }
          } catch (creationError) {
            console.log("Error creating user:", creationError);
          }
        } else {
          console.log("Error creating or finding user:", error);
        }
      }
      setUserCreationAttempted(true);
      resolve();
    });
  };

  useEffect(() => {
    if (session && session?.user && !userCreationAttempted) {
      checkUserAndCreate().then(() => {
        console.log("Creating user page");
      });
    }
  }, [session, userCreationAttempted]);

  return status === "loading" ? (
    <Loader />
  ) : (
    <Grid
      container
      sx={{
        flexGrow: 1,
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f1f1f1",
      }}
    >
      <Card sx={{ minWidth: 275, backgroundColor: "#ffffff" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: 10,
          }}
        >
          <Typography
            variant="h5"
            component="h5"
            sx={{ textAlign: "center", mt: 3, mb: 1 }}
          >
            Sing in
          </Typography>
          <Typography
            sx={{ fontSize: 14, mb: 3 }}
            color="textSecondary"
            gutterBottom
          >
            We&apos;re sharing amazing recipes, join us!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            startIcon={<GoogleIcon />}
            onClick={handleSignInWithGoogle}
          >
            Sign in with Google
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 3 }}
            startIcon={<FacebookIcon />}
            onClick={handleSignInWithFacebook}
          >
            Sign in with Facebook
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Login;
