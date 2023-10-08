import { type FunctionComponent } from "react";
import Toast from "../Toast/InvitationToast";
import React from "react";
import { useStore } from "../../utils/store";

const Toasts: FunctionComponent = () => {
  const store = useStore();

  return (
    <ul className="fixed top-20 right-3 z-20 flex flex-col gap-2">
      {store.toasts.map(({ displayMessage, pusherMessage, icon, ...rest }) => (
        <li key={rest.id}>
          <Toast {...rest} message={displayMessage} />
        </li>
      ))}
    </ul>
  );
};

export default Toasts;
