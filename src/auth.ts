import NextAuth, { CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import { supabase } from "./app/_lib/supabase";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .limit(1);

        if (error) {
          throw new CredentialsSignin("Internal error , please try again");
        }

        if (!data) {
          // No user found with the provided email
          throw new CredentialsSignin("Account does not exist");
        }

        const isValidPassword = await compare(password, data[0].password);

        if (!isValidPassword) {
          throw new CredentialsSignin("Email or password is wrong");
        }

        return {
          email: data[0].email,
          username: data[0].username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
});
