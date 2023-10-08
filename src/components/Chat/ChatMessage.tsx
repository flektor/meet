import React, { useState } from "react";
import { ChannelMessage } from "../../types";
import { useStore } from "~/utils/store";
import PersonPlus from "~/components/icons/PersonPlus";

export type ChatMessageProps = {
  message: ChannelMessage;
  currentUsername: string;
};

function ChatMessage({ message, currentUsername }: ChatMessageProps) {
  const sender = useStore().users.find(({ id }) => id === message.sentBy);
  const isCurrentUser = sender?.name === currentUsername;
  // const float = isCurrentUser ? "justify-self-end" : "justify-self-start";
  const senderName = sender?.name?.split(" ")[0] || "user";

  const [showMenu, setShowMenu] = useState(false);

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
            {!isCurrentUser &&
              (
                <div className="relative group">
                  <button
                    className="text-white group-hover:text-gray-400 focus:outline-none"
                    onBlur={() => setShowMenu(false)}
                  >
                    <PersonPlus
                      viewBox="0 0 16 16"
                      className="w-[24px] h-[24px] fill-white/60  mt-2 ml-2 hover:fill-primary"
                      onClick={() => setShowMenu(!showMenu)}
                    />
                  </button>

                  {showMenu && (
                    <div
                      onClick={() => setShowMenu(false)}
                    >
                      <div className="absolute left-0 flex flex-col text-center rounded-md bg-[#2e026d] text-white border border-primary drop-shadow-2xl z-10">
                        {
                          /* <button className="p2 hover:bg-white/10 hover:bg-primary px-3 py-1">
                          Follow
                        </button> */
                        }
                        <button className="hover:bg-white/10 px-3 py-2 whitespace-nowrap">
                          Invite to group
                        </button>

                        <button className="hover:bg-white/10 px-3 py-2 whitespace-nowrap">
                          Suggest to group
                        </button>

                        <button className="hover:bg-white/10 px-3 py-2 whitespace-nowrap">
                          Create new group
                        </button>

                        <button className="hover:bg-white/10 px-3 py-2 whitespace-nowrap">
                          Report user
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>

          <p className="whitespace-normal break-words pl-1">
            {message.content}
          </p>
        </div>
      </div>
      {
        /* {!isCurrentUser &&
        (
          <i className="pl-3 text-xs text-primary flex justify-start items-end pb-2 w-full">
            {message.sentAt.toLocaleTimeString()}
          </i>
        )} */
      }
    </div>
  );
}

export default ChatMessage;
