import React from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Nav() {
  const router = useRouter();
  const pathnameParts = router.pathname.split("/");
  const route = pathnameParts[pathnameParts.length - 1];
  const session = useSession();

  return (
    <>
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

          <SearchBar />
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
