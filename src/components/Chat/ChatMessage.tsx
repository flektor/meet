import React from "react";
import { ChannelMessage } from "../../types";
import { useStore } from "~/utils/store";
import UserMenu from "./UserMenu";
import { SessionContextValue } from "next-auth/react";
import { getTime } from "~/utils";
import Like from "../icons/Like";

export type ChatMessageProps = {
  message: ChannelMessage;
  currentUsername: string;
  session: SessionContextValue;
  groupId?: string;
  firstItem?: boolean;
  lastItem?: boolean;
  showName?: boolean;
  showTime?: boolean;
  showDate?: boolean;
  showImage?: boolean;
};

function ChatMessage(
  {
    message,
    groupId,
    currentUsername,
    session,
    showName,
    showTime,
    showImage,
    showDate,
    firstItem,
    lastItem,
  }: ChatMessageProps,
) {
  const store = useStore(({ users, groups }) => ({ users, groups }));
  const sender = store.users.find(({ id }) => id === message.sentBy);
  const isCurrentUser = sender?.name === currentUsername;
  const senderName = sender?.name?.split(" ")[0] || "user";
  const isMember = sender &&
      store.groups.find(({ id }) => id === groupId)?.membersIds?.includes(
        sender.id,
      ) || false;

  const contentClassName = getContentClassName(
    isCurrentUser,
    firstItem,
    lastItem,
  );

  const flexFloat = `flex ${isCurrentUser ? "justify-end" : "justify-start"}`;

  const ContentElement = (
    <div className={flexFloat}>
      {message.content === ":like:"
        ? (
          <Like
            className="fill-primary w-[38px] h-[38px] mt-1 -mb-1 -ml-1.5"
            onClick={() => {}}
          />
        )
        : (
          <div className={contentClassName}>
            <p className="whitespace-normal break-words pl-1">
              {message.content}
            </p>
          </div>
        )}
    </div>
  ) || null;

  const ImageElement = sender?.image && (
        <img
          src={sender?.image}
          width={32}
          height={32}
          className="rounded-full"
        />
      ) || null;

  const TimeElement = (
    <i className="text-xs text-primary whitespace-nowrap pb-1">
      {getTime(message.sentAt)}
    </i>
  ) || null;

  const NameElement = (
    <div
      className={`absolute -top-[32px] flex items-center mr-1  ${
        isCurrentUser && "right-0"
      }`}
    >
      {!isCurrentUser && (
        <UserMenu
          session={session}
          userId={message.sentBy}
          isMember={isMember}
        />
      )}
      <span className="text-white/60">{senderName}</span>
    </div>
  );

  return (
    <>
      {showDate &&
        (
          <>
            <span className="w-full flex justify-center text-primary text-sm mt-5">
              {message.sentAt.toDateString()}
            </span>
            <hr className="h-px ml-2 mr-2 border-0 bg-gradient-to-r from-#0000000 via-primary to-#0000000 mb-8" />
          </>
        )}

      <div
        className={`${flexFloat} scroll-mb-32} ${
          showTime && "mb-3"
        } scroll-m-24`}
      >
        <div className={`flex ${!isCurrentUser && "flex-row-reverse"}`}>
          {lastItem &&
            (
              <div
                className={`flex w-48 items-end mx-2 gap-2 ${
                  isCurrentUser && "flex-row-reverse"
                }`}
              >
                {showImage && ImageElement}
                {showTime && TimeElement}
              </div>
            )}

          <div
            className={`relative flex flex-col justify-end ${
              showName && "mt-10"
            }`}
          >
            {showName && NameElement}
            {ContentElement}
          </div>
        </div>
      </div>
    </>
  );
}

function getContentClassName(
  isCurrentUser: boolean,
  firstItem?: boolean,
  lastItem?: boolean,
) {
  let className =
    "mt-0.5 px-1 pr-2 py-1 text-white break-words border border-white/20 rounded-xl ";

  className += isCurrentUser ? "bg-white/10 " : "bg-white/5 ";

  if (firstItem && lastItem) {
    return className;
  }

  if (firstItem) {
    return className += isCurrentUser ? "rounded-br" : "rounded-bl";
  }

  if (lastItem) {
    return className += isCurrentUser ? "rounded-tr" : "rounded-tl";
  }
  // middle
  return className += isCurrentUser ? "rounded-r" : "rounded-l";
}

export default ChatMessage;
