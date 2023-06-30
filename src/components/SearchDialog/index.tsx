import React, { type ChangeEventHandler, useRef } from "react";
import Svg from "../Svg";

export default function SearchDialog(
  { onCancel, onSearch }: { onCancel: () => void; onSearch: () => void },
) {
  const onSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    console.log({ search: event.target.value });
  };

  function onClose(event: any) {
    if (event.target === dialogRef.current) {
      onCancel();
    }
  }

  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <dialog
      open
      className="fixed left-0 top-0 h-full w-full overflow-y-auto overflow-x-hidden outline-none flex justify-center bg-black/20 backdrop-blur-sm z-10"
      onClick={onClose}
      ref={dialogRef}
    >
      <div className="z-50 flex-col justfy-center m-5 p-10 rounded-lg bg-gradient-to-br from-[#2b1747] to-[#232338] text-white border border-[#cc66ff]">
        <label className="relative block right">
          <Svg className="pointer-events-none w-8 h-8 absolute top-1/2 transform -translate-y-1/2 left-1 transition stroke-white/80 ml-3">
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
            </path>
          </Svg>
          <input
            name="title"
            className="hidden md:inline-block w-full p-2  pl-14 rounded-lg text-2xl text-white bg-gradient-to-br from-[#2b1747] to-[#232338] border border-white/40 "
            placeholder="Search for activities"
            type="text"
            required
            onChange={onSearchChange}
            autoFocus
          />
        </label>

        <hr className="h-px mt-2 border-0 bg-[#cc66ff]" />

        <footer className="flex justify-around">
        </footer>
      </div>
    </dialog>
  );
}
