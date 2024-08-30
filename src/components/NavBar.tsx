import Link from "next/link";
import CreatePostButton from "@/components/post/CreatePostButton";
import Logout from "./Logout";
import { auth } from "@/auth";
//TODO : implement user icon

export default async function Navigation() {
  const session = await auth();

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        {/* <li>
          {session?.user?.image ? (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors flex items-center gap-4"
            >
              <img
                className="h-8 rounded-full"
                src={session.user.image}
                alt={session.user.name}
                referrerPolicy="no-referrer"
              />
              <span>Guest area</span>
            </Link>
          ) : (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors"
            >
              Guest area
            </Link>
          )}
        </li> */}
        {/* {session && ( */}
        <>
          <li>{session?.user && <CreatePostButton />}</li>
          {session?.user && (
            <li>
              <Logout />
            </li>
          )}
        </>
        {/* )} */}
      </ul>
    </nav>
  );
}
