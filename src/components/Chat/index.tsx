import React, { useEffect, useRef } from "react";
import { SessionContextValue } from "next-auth/react";
import Spinner from "../Spinner";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useStore } from "~/utils/store";

export type ChatProps = {
  isLoading: boolean;
  channelId: string;
  groupId?: string;
  session: SessionContextValue;
};

function Chat({ isLoading, channelId, groupId, session }: ChatProps) {
  const messagesListRef = useRef<HTMLDivElement>(null);
  const store = useStore();
  const channel = store.channels.find(({ id }) => id === channelId);

  function scrollToBottom() {
    if (messagesListRef.current) {
      const lastMessage = messagesListRef.current.lastElementChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      }
    }
  }

  useEffect(() => {
    if (channel) {
      scrollToBottom();
    }
  }, [channel?.messages]);

  // if (!session || !session.user?.id) {
  //   return <span className="text-white text-2xl">Sign in to see the chat</span>;
  // }

  const username = session?.data?.user.name || "you";

  return (
    <section
      aria-label="chat"
      className="w-full md:w-3/6 lg:w-2/3 max-w-5xl "
    >
      {/* <hr className="h-px ml-2 mr-2 border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" /> */}

      <div
        ref={messagesListRef}
        aria-label="messages"
        className="w-full min-h-[calc(100vh-20px)] bg-black/20 p-1 pl-2 mb-20 mx-auto"
      >
        {isLoading && <Spinner />}

        {channel?.messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            currentUsername={username}
            session={session}
            groupId={groupId}
          />
        ))}
      </div>
      {channel &&
        (
          <div className="fixed bottom-0 w-full md:w-3/6 lg:w-2/3 max-w-5xl">
            <ChatInput channel={channel} />
          </div>
        )}
    </section>
  );
}
export default Chat;
