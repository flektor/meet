import React, {
  type FormEvent,
  FunctionComponent,
  useEffect,
  useRef,
} from "react";
import { z } from "zod";
import { api } from "../../utils/api";
import { Channel, PusherMessage, sendMessageInput } from "~/types";
import { useSession } from "next-auth/react";
import useSubscribeToEvent from "~/hooks/useSubscribeToEvent";
import Spinner from "../Spinner";

export const Chat: FunctionComponent<
  {
    channel: NonNullable<Channel>;
    isLoading: boolean;
    update: (message: PusherMessage) => void;
  }
> = (
  { channel, isLoading, update },
) => {
  const { data: session } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const messagesListRef = useRef<HTMLUListElement>(null);

  function getUserNameById(userId: string) {
    return channel.users.find((user) => user.userId === userId)?.name || "user";
  }

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

  useEffect(() => scrollToBottom(), [channel.messages]);

  const { mutate: sendMessage } = api.chat.sendMessage.useMutation({
    onError: (error) => console.log(error),
    onSuccess: (message) => {
      message.sentBy = getUserNameById(message.sentBy);
      channel.messages.push(message);
      formRef.current?.reset();
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
        <ul
          ref={messagesListRef}
          aria-label="messages"
          className="w-full min-h-[20vh] bg-black/20 p-2 mx-auto "
        >
          {isLoading && <Spinner />}

          {channel.messages.map((message, index) => {
            const msg_clr = message.sentBy === username ? "#cc66ff" : "red-300";

            const float = message.sentBy === username
              ? "justify-self-end"
              : "justify-self-start";
            return (
              <li key={index}>
                <div
                  className={`m-2 rounded-lg bg-${msg_clr} p-4 text-white w-fit break-words ${float} ${
                    message.sentBy === username
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
              </li>
            );
          })}
        </ul>
      </div>
      <hr className="h-px border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />
      <form
        onSubmit={onSubmitHandler}
        className="flex w-full flex-col gap-4 rounded-b-xl bg-white/10 p-4 text-white"
        ref={formRef}
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
