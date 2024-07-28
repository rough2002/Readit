import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./loginForm";
import SignupForm from "./signup";

function AuthTab() {
  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="w-full">
        <TabsTrigger value="login" className="w-1/2">
          Login
        </TabsTrigger>
        <TabsTrigger value="signup" className="w-1/2">
          Sign Up
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
      <TabsContent value="signup">
        <SignupForm />
      </TabsContent>
    </Tabs>
  );
}

export default AuthTab;
