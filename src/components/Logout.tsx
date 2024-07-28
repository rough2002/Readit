"use client";
import { signOut } from "@/auth";
import { Button } from "./ui/button";
function Logout() {
  const logout = async () => {
    await signOut();
  };
  return <Button onClick={logout}>Logout</Button>;
}

export default Logout;
