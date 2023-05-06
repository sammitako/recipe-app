import NextAuth from "next-auth/next";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      const { email, name, image } = user;
      const firstName = name.split(" ")[0];
      const lastName = name.split(" ")[1];

      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/createUser",
          {
            email: email,
            firstName: firstName,
            lastName: lastName,
          }
        );

        if (response.status === 200) {
          console.log("User created successfully");
          return true;
        } else {
          console.log("Error creating user");
          return false;
        }
      } catch (error) {
        console.log("Error creating user:", error);
        return false;
      }
    },
  },
};
export default NextAuth(authOptions);
