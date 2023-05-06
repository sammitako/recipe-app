import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { signIn, useSession } from "next-auth/react";
import Loader from "./Loader";

const Login = () => {
  const { data: session, status } = useSession();
  const handleSignInWithGoogle = () => {
    signIn("google");
  };

  const handleSignInWithFacebook = () => {
    signIn("facebook");
  };

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
