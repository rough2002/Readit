import ChatList from "@/components/chat/ChatList";
import { Suspense } from "react";
import { ChatStoreProvider } from "@/providers/chat-store-provider"; // Import the provider

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChatStoreProvider>
      {" "}
      {/* Wrap with ChatStoreProvider */}
      <div className="flex h-screen w-full">
        {/* Left side: Chat list */}
        <div className="w-2/3">{children}</div>
        <div className="w-1/3 border-gray-200">
          <Suspense fallback={<p>Loading chats ....</p>}>
            <ChatList />
          </Suspense>
        </div>
      </div>
    </ChatStoreProvider>
  );
}

export default Layout;
