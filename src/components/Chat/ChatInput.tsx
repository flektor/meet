import React, {
  ChangeEvent,
  type FormEvent,
  KeyboardEvent,
  useRef,
  useState,
} from "react";
import { z } from "zod";
import { api } from "../../utils/api";
import { Channel, sendMessageInput } from "../../types";
import { useStore } from "~/utils/store";
import Send from "~/components/icons/Send";
import Like from "~/components/icons/Like";
import Emojis from "~/components/Emojis";

type ChatInputProps = {
  channel: Channel;
  isLoggedIn: boolean;
};

function ChatInput({ channel, isLoggedIn }: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  function onKeyDownHandler(
    event: KeyboardEvent<HTMLTextAreaElement | HTMLDialogElement>,
  ) {
    if (
      event.key !== "Enter" || event.shiftKey || event.ctrlKey || event.altKey
    ) {
      return;
    }

    if (!isLoggedIn) {
      return store.setShowLoginMessageDialog(true);
    }

    submitMessage();
  }

  function submitMessage() {
    if (!textareaRef.current || textareaRef.current.value.trim() === "") {
      return;
    }

    formRef.current?.requestSubmit();
    if (showEmojis) {
      setShowEmojis(false);
    }
    setShowSendButton(false);
  }

  function sendLike() {
    if (!formRef.current || !textareaRef.current) {
      return;
    }
    if (showSendButton || textareaRef.current.value.trim() !== "") {
      return;
    }
    textareaRef.current.value = ":like:";
    formRef.current.requestSubmit();
  }

  const [showEmojis, setShowEmojis] = useState(false);

  const [showSendButton, setShowSendButton] = useState(false);

  function onChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (event.target.value.trim() === "") {
      event.target.value = "";
      return setShowSendButton(false);
    }
    return setShowSendButton(true);
  }

  function onSelectEmojiHandler(emoji: string) {
    if (!textareaRef.current) {
      return;
    }
    const text = textareaRef.current.value;
    const index = textareaRef.current.selectionStart;
    textareaRef.current.value = text.substring(0, index) + emoji +
      text.substring(index + 1);
    textareaRef.current.focus();
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex w-full gap-4 bg-[#2E2E42] p-4 text-white"
      ref={formRef}
    >
      <span
        className="flex items-center cursor-pointer -m-3 text-3xl text-[#cc66ff] hover:text-white"
        onClick={() => setShowEmojis(!showEmojis)}
      >
        ☺️
      </span>

      <dialog
        open={showEmojis}
        className="w-2/3 max-h-48 h-48 overflow-y-auto -mt-56 scroll-auto rounded-md border-[#cc66ff] border p-1 bg-gradient-to-b from-[#25213C] to-[#1b1b2e] shadow-lg shadow-white"
        onKeyDown={onKeyDownHandler}
      >
        <Emojis onSelect={onSelectEmojiHandler} />
      </dialog>

      <textarea
        ref={textareaRef}
        name="content"
        aria-label="message content input"
        className="w-full resize-none p-2 rounded-lg text-lg bg-gradient-to-b from-[#25213C] to-[#1b1b2e]"
        rows={1}
        required
        onChange={onChange}
        onKeyDown={onKeyDownHandler}
      />
      <div className=" max-h-96 flex justify-center items-center -m-2 -ml-3">
        {showSendButton
          ? (
            <Send
              className="cursor-pointer fill-[#cc66ff] hover:fill-white"
              onClick={submitMessage}
            />
          )
          : (
            <Like
              className="cursor-pointer fill-[#cc66ff] hover:fill-white"
              onClick={sendLike}
            />
          )}
      </div>
    </form>
  );
}

export default ChatInput;
