import React from "react";
import { ChannelMessage } from "../../types";
import { useStore } from "~/utils/store";
export type ChatMessageProps = {
  message: ChannelMessage;
  currentUsername: string;
};

function ChatMessage({ message, currentUsername }: ChatMessageProps) {
  const sender = useStore().users.find(({ id }) => id === message.sentBy);
  const isCurrentUser = sender?.name === currentUsername;
  const msg_clr = isCurrentUser ? "#cc66ff" : "red-300";
  const float = isCurrentUser ? "justify-self-end" : "justify-self-start";
  const senderName = sender?.name?.split(" ")[0] || "user";
  return (
    <div
      className={`m-2 rounded-lg bg-${msg_clr} p-4 text-white w-fit break-words ${float} ${
        isCurrentUser
          ? "ml-auto border border-white/20  bg-white/10"
          : "mr-auto border border-white/20  bg-white/5"
      }`}
    >
      <div className="flex items-center">
        {sender && sender.image && (
          <img
            src={sender?.image}
            width={32}
            height={32}
            className="rounded-full m-1"
          >
          </img>
        )}
        <span className="text-white/60">{senderName}</span>
        <i className="pl-3 text-xs text-[#cc66ff]">
          {message.sentAt.toLocaleTimeString()}
        </i>
      </div>
      <p className="whitespace-normal break-words">
        {message.content}
      </p>
    </div>
  );
}

export default ChatMessage;
