import React, { type FormEvent, useRef } from "react";
import { z } from "zod";
import { api } from "../../utils/api";
import { Channel, sendMessageInput } from "../../types";
import { useStore } from "~/utils/store";

type ChatInputProps = {
  channel: Channel;
};

function ChatInput({ channel }: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const store = useStore();

  const { mutate: sendMessage } = api.chat.sendMessage.useMutation({
    onError: (error) => console.log(error),
    onSuccess: (message) => {
      console.log(message);
      store.addMessage(channel.id, message);
      formRef.current?.reset();
    },
  });

  function onSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data = {
        channelId: channel.id,
        content:
          Object.fromEntries(new FormData(event.currentTarget))["content"],
      };

      const message = sendMessageInput.parse(data);
      sendMessage(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error);
      }
    }
  }

  return (
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
  );
}

export default ChatInput;
