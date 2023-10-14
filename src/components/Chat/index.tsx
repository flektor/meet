import React, { useEffect, useRef } from "react";
import { SessionContextValue } from "next-auth/react";
import Spinner from "../Spinner";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useStore } from "~/utils/store";
import { ChannelMessage } from "~/types";
import { getTime } from "~/utils";

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
    if (!messagesListRef.current?.lastElementChild) {
      return;
    }

    messagesListRef.current.lastElementChild.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }

  useEffect(() => {
    if (channel) {
      scrollToBottom();
    }
  }, [channel?.messages]);

  const username = session?.data?.user.name || "you";

  const messages = channel ? groupMessages(channel.messages) : [];

  return (
    <section
      aria-label="chat"
      className="w-full lg:w-2/3 max-w-5xl "
    >
      {/* <hr className="h-px ml-2 mr-2 border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" /> */}

      <div
        ref={messagesListRef}
        aria-label="messages"
        className="w-full min-h-[calc(100vh-20px)] bg-black/20 p-1 pl-2 mb-20 mx-auto"
      >
        {isLoading && <Spinner />}

        {messages.map((wrapper, index) => (
          <ChatMessage
            key={index}
            currentUsername={username}
            session={session}
            groupId={groupId}
            {...wrapper}
          />
        ))}
      </div>
      {channel &&
        (
          <div className="fixed bottom-0 w-full lg:w-2/3 max-w-5xl">
            <ChatInput channel={channel} isLoggedIn={!!session.data} />
          </div>
        )}
    </section>
  );
}
export default Chat;

function groupMessages(messages: ChannelMessage[]) {
  let prevMessage: ChannelMessage | undefined;
  let nextMessage: ChannelMessage | undefined;
  let currMessage: ChannelMessage;
  let timeNotAsBefore: boolean = false;
  let timeNotAsNext: boolean = false;
  let currTime: string;
  const groupedMessages: ChatGroupedMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    currMessage = messages[i] as ChannelMessage;
    prevMessage = messages[i - 1];
    nextMessage = messages[i + 1];
    currTime = getTime(currMessage.sentAt);
    timeNotAsBefore = !(prevMessage &&
        prevMessage.sentBy === currMessage.sentBy &&
        getTime(prevMessage.sentAt) === currTime || false);

    timeNotAsNext = !(nextMessage &&
        nextMessage.sentBy === currMessage.sentBy &&
        getTime(nextMessage.sentAt) === currTime || false);

    groupedMessages.push({
      message: currMessage,
      firstItem: timeNotAsBefore || prevMessage?.content === ":like:",
      lastItem: timeNotAsNext || nextMessage?.content === ":like:",
      showName: currMessage.sentBy !== prevMessage?.sentBy,
      showImage: !nextMessage || currMessage.sentBy !== nextMessage.sentBy,
      showTime: timeNotAsNext,
    });
  }
  return groupedMessages;
}

type ChatGroupedMessage = {
  message: ChannelMessage;
  firstItem?: boolean;
  lastItem?: boolean;
  showName?: boolean;
  showImage?: boolean;
  showTime?: boolean;
};
