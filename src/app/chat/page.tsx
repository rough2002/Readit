import Chat from "@/components/chat/Chat";
import { auth } from "@/auth";
import { fetchUserById } from "@/lib/actions";
// import { fetchRecipientId } from "@/app/lib/actions"; // Assuming you have an action to fetch the recipientId based on chatId

async function Page() {
  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    return <div>Please log in to view the chat.</div>;
  }

  return <Chat currentUserId={currentUserId} />;
}

export default Page;
