import React from "react";
import Svg from "../Svg";

export default function SearchBar(
  { toggleSearchDialog }: { toggleSearchDialog: boolean },
) {
  return (
    <>
      <button
        type="button"
        aria-label="Search"
        className="hidden md:block float-right flex w-64 min-w-1/4 cursor-text items-center justify-between rounded-lg text-sm font-medium border border-white/40 hover:border-white/60 hover:bg-white/5 text-white/80 px-4 mr-2"
        onClick={() => toggleSearchDialog}
      >
        <div className="float-left flex items-center justify-center gap-1 lg:gap-3">
          <Svg className="transition stroke-white/80">
            <path
              transform="scale(.8) translate(0 3)"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
            </path>
          </Svg>
          <span>Search</span>
        </div>
      </button>
    </>
  );
}
