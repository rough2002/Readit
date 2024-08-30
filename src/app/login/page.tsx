import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/loginForm';

async function Page() {
  const session = await auth();
  if (session?.user) redirect('/');
  return (
    <div className="flex flex-col justify-center items-center h-[100vh] space-y-10">
      <div className="w-[400px] mx-auto">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <LoginForm />
      </div>
      <form action="" className="w-[400px]">
        <Button
          type="submit"
          variant={'outline'}
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
