import React from "react";
import { ChannelMessage } from "../../types";
import { useStore } from "~/utils/store";
import UserMenu from "./UserMenu";
import { SessionContextValue } from "next-auth/react";

export type ChatMessageProps = {
  message: ChannelMessage;
  currentUsername: string;
  session: SessionContextValue;
  groupId?: string;
};

function ChatMessage(
  { message, groupId, currentUsername, session }: ChatMessageProps,
) {
  const store = useStore();
  const sender = store.users.find(({ id }) => id === message.sentBy);
  const isCurrentUser = sender?.name === currentUsername;
  const senderName = sender?.name?.split(" ")[0] || "user";
  const isMember = sender &&
      store.groups.find(({ id }) => id === groupId)?.membersIds?.includes(
        sender.id,
      ) || false;

  return (
    <div
      className={`flex ${
        isCurrentUser ? "justify-end" : "justify-start"
      } scroll-mb-32`}
    >
      <div
        className={`flex  ${!isCurrentUser && "flex-row-reverse"}`}
      >
        <i className="pl-3 text-xs text-[#cc66ff] flex items-end pr-4 pb-3 whitespace-nowrap ">
          {message.sentAt.toLocaleTimeString()}
        </i>

        <div
          className={`w-fit mt-2 mb-1 mr-1 rounded-lg p-1 pl-2 pr-3 text-white break-words border border-white/20 ${
            isCurrentUser ? "bg-white/10" : "bg-white/5"
          }`}
        >
          <div className="flex items-center">
            {sender && sender.image && (
              <img
                src={sender?.image}
                width={32}
                height={32}
                className="rounded-full m-1 mr-2"
              />
            )}

            <span className="text-white/60">{senderName}</span>

            {!isCurrentUser && (
              <UserMenu
                session={session}
                userId={message.sentBy}
                isMember={isMember}
              />
            )}
          </div>

          <p className="whitespace-normal break-words pl-1">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
