import React, { Children, createContext, useEffect, useState } from "react";
import { createPusherStore, PusherProps, PusherStore } from "./pusherStore";
import { useSession } from "next-auth/react";

/**
 * This provider is the thing you mount in the app to "give access to Pusher"
 */
type PusherProviderProps = React.PropsWithChildren;

export const PusherContext = createContext<PusherStore | null>(null);

export const PusherProvider = (
  { children }: PusherProviderProps,
) => {
  const [store, setStore] = useState<PusherStore>();
  const session = useSession();

  useEffect(() => {
    if (!session || !session.data) {
      return;
    }

    const userId = session.data?.user.id;
    const newStore = createPusherStore({ slug: `user-${userId}`, userId });
    console.log({ userId });
    if (!newStore) {
      return;
    }
    setStore(newStore);

    return () => {
      const pusher = newStore.getState().pusherClient;
      console.log("disconnecting pusher:", pusher);
      console.log(
        "(Expect a warning in terminal after this, React Dev Mode and all)",
      );
      pusher.disconnect();
    };
  }, [session]);

  return (
    <>
      {session && store
        ? (
          <PusherContext.Provider value={store}>
            {children}
          </PusherContext.Provider>
        )
        : children}
    </>
  );
};
