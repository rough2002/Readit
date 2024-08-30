"use client";
import { signOutAction } from "@/app/_lib/actions";
import { Button } from "./ui/button";
function Logout() {
  return <Button onClick={() => signOutAction()}>Logout</Button>;
}

export default Logout;
