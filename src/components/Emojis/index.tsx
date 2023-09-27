import React from "react";
import emojis from "./emojis.json";

export default function Emojis(
  { onSelect }: { onSelect: (emoji: string) => void },
) {
  return (
    <ul className="flex flex-wrap justify-start items-center text-white">
      {emojis.map((emoji) => (
        <li
          className="cursor-pointer text-2xl w-10 h-10 flex justify-center items-center"
          key={emoji}
          onClick={() => onSelect(emoji)}
        >
          {emoji}
        </li>
      ))}
    </ul>
  );
}
