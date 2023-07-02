import Pusher, { type Channel, type PresenceChannel } from "pusher-js";
import { createStore } from "zustand";
import { env } from "../env.mjs";

export interface PusherProps {
  slug: string;
  userId: string;
}

export interface PusherState {
  pusherClient: Pusher;
  channel: Channel;
  presenceChannel: PresenceChannel;
  members: Map<string, unknown>;
}

export const createPusherStore = ({ slug, userId }: PusherProps) => {
  let pusherClient: Pusher;
  if (Pusher.instances.length) {
    pusherClient = Pusher.instances[0] as Pusher;
    pusherClient.connect();
  } else {
    pusherClient = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: "/api/pusher/auth-channel",
      auth: {
        headers: { user_id: userId },
      },
    });

    // pusherClient = new Pusher(pusher_key, {
    //   wsHost: pusher_server_host,
    //   wsPort: pusher_server_port,
    //   enabledTransports: pusher_server_tls ? ["ws", "wss"] : ["ws"],
    //   forceTLS: pusher_server_tls,
    //   cluster: pusher_server_cluster,
    //   disableStats: true,
    //   authEndpoint: "/api/pusher/auth-channel",
    //   auth: {
    //     headers: { user_id: randomUserId },
    //   },
    // });

    const channel = pusherClient.subscribe(slug);

    const presenceChannel = pusherClient.subscribe(
      `presence-${slug}`,
    ) as PresenceChannel;

    const store = createStore<PusherState>(() => {
      return {
        pusherClient,
        channel,
        presenceChannel,
        members: new Map(),
      };
    });

    // Update helper that sets 'members' to contents of presence channel's current members
    const updateMembers = () => {
      store.setState(() => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        members: new Map(Object.entries(presenceChannel.members.members)),
      }));
    };

    // Bind all "present users changed" events to trigger updateMembers
    presenceChannel.bind("pusher:subscription_succeeded", updateMembers);
    presenceChannel.bind("pusher:member_added", updateMembers);
    presenceChannel.bind("pusher:member_removed", updateMembers);

    return store;
  }
};

export type PusherStore = ReturnType<typeof createPusherStore>;
export type PusherProviderProps = React.PropsWithChildren<PusherProps>;
