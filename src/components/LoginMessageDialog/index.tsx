import React, { MouseEvent, useRef } from "react";
import { signIn } from "next-auth/react";
import CloseIcon from "~/components/icons/Close";
import { useStore } from "~/utils/store";

export default function LoginMessageDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { showDialog, setShowDialog } = useStore((state) => (
    {
      showDialog: state.showLoginMessageDialog,
      setShowDialog: state.setShowLoginMessageDialog,
    }
  ));

  function onClose(event?: MouseEvent<HTMLDialogElement>) {
    if (!event || event.target === dialogRef.current) {
      setShowDialog(false);
    }
  }

  if (!showDialog) {
    return null;
  }

  return (
    <dialog
      open
      ref={dialogRef}
      className="fixed left-0 top-0 h-full w-full  outline-none flex items-center justify-center bg-black/20 backdrop-blur-sm z-20"
      onMouseDown={onClose}
    >
      <div className="z-50 flex-col justfy-center m-5 p-4 rounded-lg bg-gradient-to-br from-[#2b1747] to-[#232338] text-white border-2 border-[#cc66ff]">
        <header className="text-center text-2xl flex">
          Authentication Message
          <CloseIcon
            className="top-4 right-4 fill-[#cc66ff] cursor-pointer hover:fill-white ml-2"
            onClick={onClose}
          />
        </header>
        <hr className="h-px mt-2 border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />
        <p className="h-20 flex justify-center items-center">
          You need to sign in order to continue
        </p>
        <footer className="flex justify-between">
          <button
            type="submit"
            className="rounded-full px-8 py-3 font-semibold text-white no-underline transition border-2 border-[#cc66ff] bg-black/20 disabled:opacity-50 hover:bg-black/5 hover:border-white hover:text-white"
            onClick={() => onClose()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full px-8 py-3 font-semibold text-white no-underline transition border-2 border-[#cc66ff] bg-black/20 disabled:opacity-50 hover:bg-black/5 hover:border-white hover:text-white"
            onClick={() => void signIn()}
          >
            Sign in
          </button>
        </footer>
      </div>
    </dialog>
  );
}
