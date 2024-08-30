import { ReactNode } from 'react';
import { getUserProfileByUsername } from '@/lib/actions';
import Link from 'next/link';
import { auth } from '@/auth';

interface UserLayoutProps {
  children: ReactNode;
  params: { username: string };
}

export default async function UserLayout({
  children,
  params
}: UserLayoutProps) {
  const user = await getUserProfileByUsername(params.username);
  const session = await auth();
  const isOwnProfile = session?.user?.id === user.id;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center gap-6 border-b border-gray-200 pb-6">
        <img
          src={user.profile_picture || 'https://i.pravatar.cc/150?img=7'}
          alt="User Profile"
          className="w-32 h-32 rounded-full object-cover border border-gray-300 shadow-md"
        />
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">{user.username}</h1>
          <p className="text-lg text-gray-600">u/{user.username}</p>
          <p className="text-gray-700 mt-2">{user.bio || 'No bio available'}</p>
          <p className="text-gray-500 mt-2">Karma: {user.karma}</p>
        </div>
      </div>
      <div className="mt-8 flex space-x-4">
        <Link
          href={`/user/${params.username}/posts`}
          className="bg-gray-800 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition"
        >
          Posts
        </Link>
        {isOwnProfile && (
          <Link
            href={`/user/${params.username}/saved`}
            className="bg-gray-800 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition"
          >
            Saved
          </Link>
        )}
        {isOwnProfile && (
          <Link
            href={`/user/${params.username}/edit`}
            className="bg-teal-600 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-teal-500 transition"
          >
            Edit Profile
          </Link>
        )}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

/*
import { ReactNode } from 'react';
import { getUserProfileByUsername } from '@/lib/actions';
import Link from 'next/link';
import { auth } from '@/auth';

interface UserLayoutProps {
  params: { username: string };
}

export default async function Page({ params }: UserLayoutProps) {
  const user = await getUserProfileByUsername(params.username);
  const session = await auth();
  const isOwnProfile = session?.user?.id === user.id;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center gap-6 border-b border-gray-200 pb-6">
        <img
          src={user.profile_picture || 'https://i.pravatar.cc/150?img=7'}
          alt="User Profile"
          className="w-32 h-32 rounded-full object-cover border border-gray-300 shadow-md"
        />
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">{user.username}</h1>
          <p className="text-lg text-gray-600">u/{user.username}</p>
          <p className="text-gray-700 mt-2">{user.bio || 'No bio available'}</p>
          <p className="text-gray-500 mt-2">Karma: {user.karma}</p>
        </div>
      </div>
      <div className="mt-8 flex space-x-4">
        <Link
          href={`/user/${params.username}/posts`}
          className="bg-gray-800 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition"
        >
          Posts
        </Link>
        <Link
          href={`/user/${params.username}/comments`}
          className="bg-gray-800 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition"
        >
          Comments
        </Link>
        {isOwnProfile && (
          <Link
            href={`/user/${params.username}/saved`}
            className="bg-gray-800 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition"
          >
            Saved
          </Link>
        )}
        <Link
          href={`/user/${params.username}/edit`}
          className="bg-teal-600 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-teal-500 transition"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
}

*/
