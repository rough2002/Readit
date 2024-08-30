import { auth } from '@/auth';
import SignupForm from '@/components/auth/signup';
import { redirect } from 'next/navigation';

async function Page() {
  const session = await auth();
  if (session?.user) redirect('/');
  return (
    <div className="w-[400px] mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <SignupForm />
    </div>
  );
}

export default Page;
