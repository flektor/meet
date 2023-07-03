import React, {
  type FormEvent,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { z } from "zod";
import { api } from "../../utils/api";
import { Channel, sendMessageInput, sendMessageOutput } from "~/types";
import { useSession } from "next-auth/react";
import useSubscribeToEvent from "~/hooks/useSubscribeToEvent";
import Spinner from "../Spinner";

export const Chat: FunctionComponent<
  {
    channel: NonNullable<Channel>;
    isLoading: boolean;
    update: (action: "message" | "viewer") => void;
  }
> = (
  { channel, isLoading, update },
) => {
  const { data: session } = useSession();

  function getUserNameById(userId: string) {
    return channel.users.find((user) => user.userId === userId)?.name || "user";
  }

  const { mutate: sendMessage } = api.chat.sendMessage.useMutation({
    onError: (error) => console.log(error),
    onSuccess: (message) => {
      message.sentBy = getUserNameById(message.sentBy);
      channel.messages.push(message);
    },
  });

  useSubscribeToEvent(channel.id, (action) => update(action as any));

  function onSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = {
      channelId: channel.id,
      receivers: channel.users.map(({ slug }) => slug),
      content: Object.fromEntries(new FormData(event.currentTarget))["content"],
    };

    try {
      const message = sendMessageInput.parse(data);
      sendMessage(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error);
      }
    }
  }

  if (!session || !session.user?.id) {
    return <span className="text-white text-2xl">Sign in to see the chat</span>;
  }

  const username = session.user.name;

  return (
    <section aria-label="chat" className="p-2 max-w-xl">
      <div className="flex justify-center">
        <h2 className="text-2xl text-white">Chat</h2>
      </div>
      <hr className="h-px border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />

      <ul aria-label="messages" className="flex-col">
        {isLoading && <Spinner />}

        {channel.messages.map((message, index) => {
          const msg_clr = message.sentBy === username ? "#cc66ff" : "red-300";
          const rct_clr = message.sentBy === username
            ? "[#25213C]"
            : "[#cc66ff]";

          const float = message.sentBy === username
            ? "justify-end"
            : "justify-start";
          return (
            <li
              key={index}
              className={`flex m-2 max-w-md flex-col gap-4 rounded-xl bg-${msg_clr} p-4 text-white ${float}`}
            >
              <i>
                <span>{message.sentBy}</span>{" "}
                <span className="text-[#cc66ff]">
                  {message.sentAt.toLocaleTimeString()}
                </span>
              </i>
              <p>{message.content}</p>
              <div className="flex justify-center gap-3">
                <button
                  className={`rounded-full p-1 w-10 h-10 font-semibold text-white no-underline transition border-2 border-${rct_clr} bg-black/20 hover:bg-black/10 hover:border-white hover:text-white`}
                >
                  👍
                </button>
                <button
                  className={`rounded-full p-1 w-10 h-10 font-semibold text-white no-underline transition border-2 border-${rct_clr} bg-black/20 hover:bg-black/10 hover:border-white hover:text-white`}
                >
                  👎
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <hr className="h-px border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />

      <form
        onSubmit={onSubmitHandler}
        className="flex max-w-md flex-col gap-4 rounded-xl bg-white/10 p-4 text-white"
      >
        <textarea
          name="content"
          aria-label="message content input"
          className="p-2 rounded-lg text-lg bg-gradient-to-b from-[#25213C] to-[#1b1b2e]"
          rows={2}
          required
        />
        <div className="flex justify-center">
          <button
            type="submit"
            className="rounded-full px-10 py-3 font-semibold text-white no-underline transition border-2 border-[#cc66ff] bg-black/20 hover:bg-black/5 hover:border-white hover:text-white"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
};
// 2e026d] to-[#15162c]">
