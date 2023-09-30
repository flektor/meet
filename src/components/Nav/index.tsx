import Link from "next/link";
import React, { use, useState } from "react";
import Svg from "../Svg";
import { useRouter } from "next/router";
import SearchDialog from "../SearchDialog";
import { useSession } from "next-auth/react";

export default function Nav() {
  const router = useRouter();
  const pathnameParts = router.pathname.split("/");
  const route = pathnameParts[pathnameParts.length - 1];
  const session = useSession();
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  function onSearchComplete() {
  }

  function onSearchCancel() {
    setShowSearchDialog(false);
  }

  return (
    <>
      {showSearchDialog && (
        <SearchDialog onSearch={onSearchComplete} onCancel={onSearchCancel} />
      )}
      <div className="absolute w-full h-14 left-0 top-0 w-full bg-[#2e026d]" />
      <nav className="fixed left-0 top-0 w-full flex items-center justify-center bg-gradient-to-b from-[#25213C] to-[#1b1b2e] z-10  ">
        <div className="flex items-center justify-between w-full max-w-5xl">
          <div className="flex items-center justify-center transition duration-1000 m-3">
            <Link
              href="/"
              className="hidden md:block text-[#cc66ff] text-5xl font-extrabold tracking-tight -mt-3 ml-2  mr-10"
            >
              meet
            </Link>

            <Link
              href="/activities"
              className={`text-white hover:text-white pt-1 mr-4 ${
                route === "activities" && "underline"
              }`}
            >
              Activities
            </Link>

            {session.data &&
              (
                <Link
                  href="/favorites"
                  className={` text-white hover:text-white pt-1 mr-4 ${
                    route === "favorites" && "underline"
                  }`}
                >
                  Favorites
                </Link>
              )}
          </div>

          <button
            type="button"
            aria-label="Search"
            className="hidden md:inline-block float-right flex w-1/4 cursor-text items-center justify-between rounded-lg text-sm font-medium border border-white/40 hover:border-white/60 hover:bg-white/5 text-white/80 px-4 py-2 mr-2"
            onClick={() => setShowSearchDialog(true)}
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

          {
            /* <Link
            href="#"
            className="md:hidden text-sm px-4 py-2 leading-none border rounded text-white hover:text-teal-500 hover:bg-white"
          >
            Menu
          </Link> */
          }
        </div>
      </nav>
    </>
  );
}
