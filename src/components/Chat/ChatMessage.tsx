import React from "react";
import { ChannelMessage } from "../../types";
import { useStore } from "~/utils/store";
import { useSession } from "next-auth/react";

function ChatMessage({ message }: { message: ChannelMessage }) {
  const currentUserName = useSession().data?.user.name;
  const sender = useStore().users.find(({ id }) => id === message.sentBy);
  const isCurrentUser = message.sentBy === currentUserName;

  const msg_clr = isCurrentUser ? "#cc66ff" : "red-300";
  const float = isCurrentUser ? "justify-self-end" : "justify-self-start";

  return (
    <div
      className={`m-2 rounded-lg bg-${msg_clr} p-4 text-white w-fit break-words ${float} ${
        isCurrentUser
          ? "ml-auto border border-white/20  bg-white/10"
          : "mr-auto border border-white/20  bg-white/5"
      }`}
    >
      <div className="flex items-center">
        <span className="text-white/60">
          {sender ? sender.name : isCurrentUser ? "you" : "user"}
        </span>
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
