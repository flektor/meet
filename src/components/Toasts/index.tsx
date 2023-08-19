import { type FunctionComponent } from "react";
import Toast from "../InvitationToast";
import React from "react";
import { useStore } from "../../utils/store";

const Toasts: FunctionComponent = () => {
  const store = useStore();

  function onAcceptInvitation(toastId: string) {
    store.removeToast(toastId);
  }

  function onDeclineInvitation(toastId: string) {
    store.removeToast(toastId);
  }

  return (
    <ul className="fixed top-20 right-3 z-20 flex flex-col gap-2">
      {store.toasts.map(({ message, id }) => (
        <li key={id}>
          <Toast
            message={message}
            onAccept={() => onAcceptInvitation(id)}
            onDecline={() => onDeclineInvitation(id)}
            onDie={() => store.removeToast(id)}
          />
        </li>
      ))}
    </ul>
  );
};

export default Toasts;
