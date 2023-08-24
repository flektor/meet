import React from "react";
import { ChannelMessage } from "../../types";

export type ChatMessageProps = {
  message: ChannelMessage;
  currentUsername: string;
};

function ChatMessage({ message, currentUsername }: ChatMessageProps) {
  const msg_clr = message.sentBy === currentUsername ? "#cc66ff" : "red-300";
  const float = message.sentBy === currentUsername
    ? "justify-self-end"
    : "justify-self-start";

  return (
    <div
      className={`m-2 rounded-lg bg-${msg_clr} p-4 text-white w-fit break-words ${float} ${
        message.sentBy === currentUsername
          ? "ml-auto border border-white/20  bg-white/10"
          : "mr-auto border border-white/20  bg-white/5"
      }`}
    >
      <div className="flex items-center">
        <span className="text-white/60">{message.sentBy}</span>
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
