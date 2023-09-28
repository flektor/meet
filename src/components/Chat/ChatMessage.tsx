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
  const float = isCurrentUser ? "justify-self-end" : "justify-self-start";
  const senderName = sender?.name?.split(" ")[0] || "user";
  return (
    <div
      className={`max-w-[80%] w-fit mt-2 mb-1 mr-1 rounded-lg p-1 pl-2 pr-3 text-white break-words ${float} ${
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
            className="rounded-full m-1 mr-2"
          >
          </img>
        )}
        <span className="text-white/60">{senderName}</span>
        <i className="pl-3 text-xs text-[#cc66ff]">
          {message.sentAt.toLocaleTimeString()}
        </i>
      </div>
      <p className="whitespace-normal break-words pl-1">
        {message.content}
      </p>
    </div>
  );
}

export default ChatMessage;
