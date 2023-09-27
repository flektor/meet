import React, { type FormEvent, useRef } from "react";
import { z } from "zod";
import { api } from "../../utils/api";
import { Channel, sendMessageInput } from "../../types";
import { useStore } from "~/utils/store";
import Send from "~/components/icons/Send";

type ChatInputProps = {
  channel: Channel;
};

function ChatInput({ channel }: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const store = useStore();

  const { mutate: sendMessage } = api.chat.sendMessage.useMutation({
    onError: (error) => console.log(error),
    onSuccess: (message) => {
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
      className="flex w-full gap-4 rounded-b-xl bg-white/10 p-4 text-white"
      ref={formRef}
    >
      <textarea
        name="content"
        aria-label="message content input"
        className="w-full p-2 rounded-lg text-lg bg-gradient-to-b from-[#25213C] to-[#1b1b2e]"
        rows={1}
        required
      />
      <div className="flex justify-center items-center">
        <Send
          className="cursor-pointer fill-[#cc66ff] hover:fill-white"
          onClick={() => formRef.current?.requestSubmit()}
        />
      </div>
    </form>
  );
}

export default ChatInput;
