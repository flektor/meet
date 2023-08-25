import React, { useEffect, useRef } from "react";
import { Channel } from "~/types";
import { useSession } from "next-auth/react";
import Spinner from "../Spinner";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useStore } from "~/utils/store";
import { getUserNameById } from "~/utils";

export type ChatProps = {
  isLoading: boolean;
  channelId: string;
};

function Chat({ isLoading, channelId }: ChatProps) {
  const { data: session } = useSession();
  const messagesListRef = useRef<HTMLDivElement>(null);
  const store = useStore();
  const channel = store.channels.find(({ id }) => id === channelId);

  // console.log(channelId, store.channels, channel);

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

  if (!session || !session.user?.id) {
    return <span className="text-white text-2xl">Sign in to see the chat</span>;
  }

  const username = session.user.name || "you";
  console.log({ username });

  return (
    <section
      aria-label="chat"
      className="w-full md:w-3/6 lg:w-2/3  "
    >
      <div className="flex justify-center w-full">
        <h2 className="text-2xl text-white/50">Chat</h2>
      </div>

      <hr className="h-px ml-2 mr-2 border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />

      <div
        id="message-scroll-container"
        className="h-2/6 w-full md:w-[50vw] max-h-[50vh] overflow-y-auto	overflow-x-hidden rounded-t-xl scrollbar-thin scrollbar-thumb-[#cc66ff] scrollbar-track-gray-100"
      >
        <div
          ref={messagesListRef}
          aria-label="messages"
          className="w-full min-h-[20vh] bg-black/20 p-2 mx-auto "
        >
          {isLoading && <Spinner />}

          {channel?.messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              currentUsername={username}
            />
          ))}
        </div>
      </div>
      <hr className="h-px border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />

      {channel && <ChatInput channel={channel} />}
    </section>
  );
}
export default Chat;
