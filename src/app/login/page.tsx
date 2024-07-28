import AuthTab from "@/components/auth/authTab";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function Page() {
  const session = await auth();
  console.log(session);
  if (session) redirect("/");
  return (
    <div className="flex flex-col justify-center items-center h-[100vh] space-y-10">
      <AuthTab />
      <form action="" className="w-[400px]">
        <Button
          type="submit"
          variant={"outline"}
          className="flex items-center space-x-3 w-full"
        >
          <FcGoogle />
          <span>Sign in with google</span>
        </Button>
      </form>
    </div>
  );
}

export default Page;
