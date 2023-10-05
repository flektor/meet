import React, { ChangeEvent, useState } from "react";
import GroupAlreadyExistsDialog from "./GroupAlreadyExistsDialog";
import { createSlug } from "~/utils";

export function capitalizeFirstCharacter(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() +
    (text.length > 1 ? text.substring(1) : "");
}

function formatTitle(title: string): string {
  return capitalizeFirstCharacter(trim(title));
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

type TitleInputProps = {
  activitySlug: string;
  isGroupAlreadyExist: boolean;
  setIsGroupAlreadyExist: (isTrue: boolean) => void;
};

export default function TitleInput(
  { activitySlug, isGroupAlreadyExist, setIsGroupAlreadyExist }:
    TitleInputProps,
) {
  const [title, setTitle] = useState("");

  function onTitleChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    const text = event.target.value;

    if (text.length < title.length) {
      return setTitle(formatTitle(text));
    }

    const character = text.charAt(text.length - 1).toLowerCase();

    if (!character.match(/^[A-Za-z ]+$/)) {
      return;
    }
    if (isGroupAlreadyExist) {
      setIsGroupAlreadyExist(false);
    }
    setTitle(formatTitle(title + character));
  }

  return (
    <>
      <label htmlFor="title" className="text-xl">
        Title
      </label>

      <input
        name="title"
        type="text"
        placeholder="Give a title"
        className={`w-full p-2 rounded-lg bg-gradient-to-br from-[#25213C] to-[#1b1b2e] ${
          isGroupAlreadyExist && "text-orange-300"
        }`}
        required
        value={title}
        onChange={onTitleChangeHandler}
      />
      {isGroupAlreadyExist && (
        <GroupAlreadyExistsDialog
          groupSlug={createSlug(title)}
          activitySlug={activitySlug}
        />
      )}
    </>
  );
}
