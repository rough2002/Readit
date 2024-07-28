"use server";
import { signIn, signOut } from "@/auth";
import { supabase } from "./supabase";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";

export const signUp = async (creds: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const { name, email, password, confirmPassword } = creds;

  if (!name || !email || !password || !confirmPassword) {
    throw new Error("Please Provide all fields");
  }

  const { data, error: selectError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .limit(1);

  // Hash the password
  const saltRounds = parseInt(
    (process.env.BCRYPT_SALT_ROUNDS as string) || "10"
  );
  const hashedPassword = await hash(password, saltRounds);

  if (selectError) {
    throw new Error("Internal error , please try again");
  }

  if (data.length) {
    throw new Error("User already exists");
  }

  // Insert new user
  const { data: data2, error: insertError } = await supabase
    .from("users")
    .insert([
      {
        username: name,
        email,
        password: hashedPassword,
      },
    ]);

  if (insertError) {
    throw new Error("Error during signup , please try again");
  }

  return { message: "Signup successfull" };
};

export const login = async (creds: { email: string; password: string }) => {
  try {
    const { email, password } = creds;

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/",
    });
  } catch (error) {
    const err = error as CredentialsSignin;
    return err.message;
  }
};

export const signinUsingGoogle = async () => {
  await signIn("google", { redirectTo: "/" });
};

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
