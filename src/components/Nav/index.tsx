import Link from "next/link";
import React from "react";
import Svg from "../Svg";
import { useRouter } from "next/router";

export default function Nav() {
  const router = useRouter();
  const pathnameParts = router.pathname.split("/");
  const route = pathnameParts[pathnameParts.length - 1];
  return (
    <nav className="fixed left-0 top-0 w-full flex items-center justify-center">
      <div className="flex items-center justify-between w-full max-w-7xl">
        <div className="flex items-center justify-center transition duration-1000 m-3">
          <Link
            href="/"
            className="text-[#cc66ff] text-5xl font-extrabold tracking-tight -mt-2 ml-2 mr-10"
          >
            meet
          </Link>

          <Link
            href="/activities"
            className={`hidden md:inline-block text-white hover:text-white pt-1 mr-4 ${
              route === "activities" && "underline"
            }`}
          >
            Activities
          </Link>
          <Link
            href="/favorites"
            className={`hidden md:inline-block text-white hover:text-white pt-1 mr-4 ${
              route === "favorites" && "underline"
            }`}
          >
            Favorites
          </Link>
          <Link
            href="/schedule"
            className={`hidden md:inline-block text-white hover:text-white pt-1 ${
              route === "schedule" && "underline"
            }`}
          >
            Schedule
          </Link>
        </div>

        <button
          type="button"
          aria-label="Search"
          className="hidden md:inline-block float-right flex w-1/4 cursor-text items-center justify-between rounded-lg text-sm font-medium border border-white/40 hover:border-white/60 hover:bg-white/5 text-white/80 px-4 py-2 mr-2"
        >
          <div className="float-left flex items-center justify-center gap-1 lg:gap-3">
            <Svg className="transition stroke-white/80">
              <path
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

        <Link
          href="#"
          className="md:hidden text-sm px-4 py-2 leading-none border rounded text-white hover:text-teal-500 hover:bg-white"
        >
          Menu
        </Link>
      </div>
    </nav>
  );
}
