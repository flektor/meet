import { type NextPage } from "next";
import React, {
  ChangeEvent,
  type FormEvent,
  MouseEvent,
  useRef,
  useState,
} from "react";
import { z } from "zod";
import { api } from "../../utils/api";
import { addActivityInput } from "../../types";
import Spinner from "../Spinner/";
import Link from "next/link";
import EnterIcon from "../icons/Enter";
import CloseIcon from "../icons/Close";
import AlarmIcon from "../icons/Alarm";
import { useStore } from "~/utils/store";
import { createSlug } from "~/utils";

function capitalizeFirstCharacter(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() +
    (text.length > 1 ? text.substring(1) : "");
}

type CreateActivityDialogProps = {
  onNewActivity: () => void;
  onClose: () => void;
};

const CreateActivityDialog: NextPage<CreateActivityDialogProps> = (
  { onNewActivity, onClose },
) => {
  const store = useStore();
  const [isWaitingForServer, setIsWaitingForServer] = useState(false);
  const [isActivityAlreadyExist, setIsActivityAlreadyExist] = useState(false);
  const [title, setTitle] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function onCancel(event?: MouseEvent<HTMLDialogElement>) {
    if (!event || event.target === dialogRef.current) {
      onClose();
    }
  }

  const { mutate } = api.activities.addActivity.useMutation({
    onError: (error) => {
      if (error.message.includes("Unique constraint failed on the fields:")) {
        setIsActivityAlreadyExist(true);
        setTitle((title) => title.trim());
        return;
      }
      console.log(error.data?.zodError);
    },

    onSuccess: (activity) => {
      if (formRef.current) {
        setTitle("");
        formRef.current.reset();
      }
      store.addActivity({
        ...activity,
        isFavorite: false,
        isRegistered: false,
        favoritesCount: 0,
        registrationsCount: 0,
      });
      onNewActivity();
    },

    onSettled: () => setIsWaitingForServer(false),
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsWaitingForServer(true);

    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const activity = addActivityInput.parse(data);
      activity.description = capitalizeFirstCharacter(activity.description);
      mutate(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error);
      }
    }
  }

  function onTitleChange(event: ChangeEvent<HTMLInputElement>) {
    const text = event.target.value;

    if (text.length < title.length) {
      return setTitle(formatTitle(text));
    }

    const character = text.charAt(text.length - 1).toLowerCase();

    if (!character.match(/^[A-Za-z ]+$/)) {
      return;
    }

    if (isActivityAlreadyExist) {
      setIsActivityAlreadyExist(false);
    }
    setTitle(formatTitle(title + character));
  }

  function formatTitle(title: string): string {
    return capitalizeFirstCharacter(trim(title));
  }

  return (
    <dialog
      open
      className="fixed left-0 top-0 h-full w-full  outline-none flex items-center justify-center bg-black/20 backdrop-blur-sm z-10"
      onMouseDown={onCancel}
      ref={dialogRef}
    >
      <div className="h-fit flex-col justfy-center rounded-lg bg-gradient-to-br from-[#2b1747] to-[#232338] text-white border-2 border-[#cc66ff] relative">
        <CloseIcon
          className="absolute top-4 right-4 fill-[#cc66ff] cursor-pointer hover:fill-white"
          onClick={onCancel}
        />

        <form
          onSubmit={onSubmit}
          className="z-50 max-w-md flex flex-col gap-4 rounded-xl bg-white/10 p-8 text-white"
        >
          <div className="flex justify-center">
            <h2 className="text-2xl font-bold">New Activity</h2>
          </div>
          <hr className="h-px border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />

          <label htmlFor="title" className="text-2xl">Title</label>
          <input
            name="title"
            type="text"
            className={`p-2 rounded-lg text-2xl bg-gradient-to-br from-[#2b1747] to-[#232338] ${
              isActivityAlreadyExist && "text-orange-300"
            }`}
            required
            value={title}
            onChange={onTitleChange}
          />

          {isActivityAlreadyExist && (
            <ActivityAlreadyExist slug={createSlug(title)} />
          )}

          <label htmlFor="description" className="text-2xl">
            Description
          </label>

          <textarea
            name="description"
            className="p-2 rounded-lg text-lg bg-gradient-to-b from-[#25213C] to-[#1b1b2e] overflow-y-auto overflow-x-hidden"
            rows={2}
            required
          />
          <div className="flex justify-center">
            <button
              disabled={isWaitingForServer}
              type="submit"
              className={`rounded-full px-10 py-3 font-semibold text-white no-underline transition border-2 border-[#cc66ff] bg-black/20 disabled:opacity-50 ${
                !isWaitingForServer &&
                "hover:bg-black/5 hover:border-white hover:text-white"
              }`}
            >
              {isWaitingForServer ? <Spinner /> : "Create Activity"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

function ActivityAlreadyExist({ slug }: { slug: string }) {
  return (
    <>
      <i className="flex items-center font-medium mt-2 text-sm text-orange-300">
        <AlarmIcon
          className="fill-orange-300 stroke-orange-300 w-6 h-6 mr-1"
          viewBox="0 0 24 24"
        />{" "}
        This activity already exists
      </i>
      <i className="flex font-medium ml-7 mb-4 text-sm text-[#e8c5fa]">
        Click
        <Link
          href={`/activities/${slug}`}
          className="flex justify-center ml-1 font-medium text-[#cc66ff] transition underline hover:text-white [&>svg]:hover:fill-white"
        >
          here
          <EnterIcon
            className="fill-[#cc66ff] w-6 h-6"
            viewBox="0 0 24 24"
          />
        </Link>
        to check it out..
      </i>
    </>
  );
}

function trim(title: string) {
  if (title === " ") {
    return "";
  }
  if (title.charAt(title.length - 1) === " ") {
    return title.trim() + " ";
  }
  return title.trim();
}

export default CreateActivityDialog;
