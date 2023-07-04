import React, { useEffect, useState } from "react";

export default function InvitationToast(
  { duration, message, onDie, onAccept, onDecline }: {
    message: string;
    duration?: number;
    onDie: () => void;
    onAccept: () => void;
    onDecline: () => void;
  },
) {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    if (!showToast) {
      onDie();
    }
  }, [showToast]);

  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      setShowToast(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      id="toast-default"
      className="flex flex-col items-center max-w-xs pt-1.5 pb-1.5 pl-2 pr-2 text-gray-500 bg-white rounded-lg shadow  bg-gradient-to-b from-[#25213C] to-[#1b1b2e] border border-[#cc66ff] float-right"
      role="alert"
    >
      <h2 className="text-white">{message}</h2>
      <footer>
        <button
          onClick={onAccept}
          className="pr-1.5 pl-1.5 m-1 rounded-md border border-green-500 text-green-500 hover:bg-white/10 hover:text-green-400 hover:border-green-400"
        >
          Accept
        </button>
        <button
          onClick={onDecline}
          className="pr-1.5 pl-1.5 m-1 rounded-md border border-red-500 text-red-500 hover:bg-white/10 hover:text-red-400 hover:border-red-400"
        >
          Decline
        </button>
      </footer>
    </div>
  );
}
