import React from "react";
import { signIn } from "next-auth/react";

export default function LoginMessageDialog(
  { onCancel }: { onCancel: () => void },
) {
  return (
    <dialog
      open
      className="fixed left-0 top-0 h-full w-full overflow-y-auto overflow-x-hidden outline-none flex justify-center items-center bg-black/40"
    >
      <div className="flex-col justfy-center m-5 p-10 rounded-lg bg-gradient-to-br from-[#2b1747] to-[#232338] text-white border-2 border-[#cc66ff]">
        <header className="text-center text-2xl">Authantication Message</header>
        <hr className="h-px mt-2 border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />
        <p className="h-20 flex justify-center items-center">
          You need to sign in order to proceed with this action
        </p>
        <footer className="flex justify-around">
          <button
            type="submit"
            className="rounded-full px-10 py-3 font-semibold text-white no-underline transition border-2 border-[#cc66ff] bg-black/20 disabled:opacity-50 hover:bg-black/5 hover:border-white hover:text-white"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full px-10 py-3 font-semibold text-white no-underline transition border-2 border-[#cc66ff] bg-black/20 disabled:opacity-50 hover:bg-black/5 hover:border-white hover:text-white"
            onClick={() => void signIn()}
          >
            Sign in
          </button>
        </footer>
      </div>
    </dialog>
  );
}
