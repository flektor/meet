import { create } from "zustand";
import type {
  Activity,
  Channel,
  ChannelMessage,
  getActivitiesOutput,
  getActivityOutput,
  Group,
  GroupOutput,
  Toast,
} from "~/types";
import { renameChannelUsers, renameMessageUser } from ".";

type Store = {
  activities: Activity[];
  groups: Group[];
  toasts: Toast[];
  userIsViewingPage: string | null;
  pusherSubscriptions: string[];
  channels: Channel[];
  setChannel: (channel: Channel) => void;
  removeChannel: (channelId: string) => void;

  addMessage: (channelId: string, message: ChannelMessage) => void;

  setActivities: (activities: getActivitiesOutput) => void;
  setActivity: (activity: getActivityOutput) => void;
  removeActivity: (activityId: string) => void;

  setGroup: (group: GroupOutput) => void;
  removeGroup: (groupId: string) => void;

  addToFavorites: (activityId: string) => void;
  removeFromFavorites: (activityId: string) => void;

  addToast: (toast: Toast) => void;
  removeToast: (toastId: string) => void;
  addToasts: (toast: Toast[]) => void;

  addToRegistrations: (activityId: string) => void;
  removeFromRegistrations: (activityId: string) => void;
  addViewer: (channelId: string) => void;
  removeViewer: (channelId: string) => void;

  pusherSubscribe: (channelId: string) => void;
  pusherUnsubscribe: (channelId: string) => void;
};

export const useStore = create<Store>((set) => ({
  activities: [],
  groups: [],
  channels: [],
  toasts: [],
  pusherSubscriptions: [],
  userIsViewingPage: null,

  setActivities: (activities: getActivitiesOutput) => set({ activities }),

  setActivity: (activity: getActivityOutput) =>
    set((state) => {
      const { channel, groups, ...rest } = activity;
      const groupIdsToAdd = activity.groups.map(({ id }) => id);
      const restGroups = state.groups.filter(({ id }) =>
        !groupIdsToAdd.includes(id)
      );

      const channelIdsToAdd = activity.groups.map(({ id }) => id).concat(
        activity.channelId,
      );
      const restChannels = state.channels.filter(({ id }) =>
        !channelIdsToAdd.includes(id)
      );

      return ({
        activities: [
          ...state.activities.filter(({ id }) => id !== activity.id),
          rest,
        ],
        channels: [...restChannels, renameChannelUsers(channel)],
        groups: [
          ...restGroups,
          ...groups.map(
            (group) => ({ ...group, description: "" } as GroupOutput),
          ),
        ],
      });
    }),

  removeActivity: (activityId: string) =>
    set((state) => {
      const activity = state.activities.find(({ id }) => id === activityId);
      if (!activity) {
        return state;
      }
      const groupsToRemove = state.groups.filter(({ activityId: id }) =>
        id === activityId
      );
      const groupIdToRemove = groupsToRemove.map(({ id }) => id);
      const channelsIdsToRemove = [
        activity.channelId,
        ...groupsToRemove.map(({ channelId }) => channelId),
      ];

      return ({
        activities: state.activities.filter(({ id }) => id !== activityId),
        groups: state.groups.filter(({ id }) => !groupIdToRemove.includes(id)),
        channels: state.channels.filter(({ id }) =>
          !channelsIdsToRemove.includes(id)
        ),
      });
    }),

  setGroup: (group: GroupOutput) =>
    set((state) => {
      const { channel, ...rest } = group;
      return ({
        groups: !state.groups.some(({ id }) => id === group.id)
          ? [...state.groups, group]
          : state.groups.map((prev) =>
            prev.id === group.id ? ({ ...rest }) : prev
          ),
        channels: !state.channels.some(({ id }) => id === channel.id)
          ? [...state.channels, renameChannelUsers(channel)]
          : state.channels.map((prev) =>
            prev.id === group.id ? ({ ...renameChannelUsers(channel) }) : prev
          ),
      });
    }),

  removeGroup: (GroupId: string) =>
    set((state) => ({
      groups: state.groups.filter(({ id }) => id !== GroupId),
    })),

  addToFavorites: (activityId: string) =>
    set((state) => ({
      activities: state.activities.map((activity) =>
        activity.id !== activityId ? activity : ({
          ...activity,
          isFavorite: true,
          favoritesCount: activity.favoritesCount + 1,
        })
      ),
    })),

  removeFromFavorites: (activityId: string) =>
    set((state) => ({
      activities: state.activities.map((activity) =>
        activity.id !== activityId ? activity : ({
          ...activity,
          isFavorite: false,
          favoritesCount: activity.favoritesCount - 1,
        })
      ),
    })),

  addToRegistrations: (activityId: string) =>
    set((state) => ({
      activities: state.activities.map((activity) =>
        activity.id !== activityId ? activity : ({
          ...activity,
          isRegistered: true,
          registrationsCount: activity.registrationsCount + 1,
        })
      ),
    })),

  removeFromRegistrations: (activityId: string) =>
    set((state) => ({
      activities: state.activities.map((
        activity,
      ) => (activity.id !== activityId ? activity : ({
        ...activity,
        isRegistered: false,
        registrationsCount: activity.registrationsCount - 1,
      }))),
    })),

  removeToast: (toastId: string) =>
    set((state) => ({
      toasts: state.toasts.filter(({ id }) => id !== toastId),
    })),

  addToast: (toast: Toast) =>
    set((state) => ({ toasts: [...state.toasts, { ...toast }] })),

  addToasts: (toasts: Toast[]) =>
    set((state) => ({ toasts: [...state.toasts, ...toasts] })),

  addViewer: (channelId: string) =>
    set((state) => ({
      groups: state.groups.map((group) =>
        group.channelId !== channelId ? group : ({
          ...group,
          viewersCount: group.viewersCount + 1,
        })
      ),
      activities: state.activities.map((activity) =>
        activity.channelId !== channelId ? activity : ({
          ...activity,
          viewersCount: activity.viewersCount + 1,
        })
      ),
    })),

  removeViewer: (channelId: string) =>
    set((state) => ({
      groups: state.groups.map((group) =>
        group.channelId !== channelId ? group : ({
          ...group,
          viewersCount: group.viewersCount - 1,
        })
      ),
      activities: state.activities.map((activity) =>
        activity.channelId !== channelId ? activity : ({
          ...activity,
          viewersCount: activity.viewersCount - 1,
        })
      ),
    })),

  pusherSubscribe: (channelId: string) =>
    set((state) =>
      state.pusherSubscriptions.includes(channelId) ? state : ({
        pusherSubscriptions: [...state.pusherSubscriptions, channelId],
      })
    ),

  pusherUnsubscribe: (channelId: string) =>
    set((state) => ({
      pusherSubscriptions: state.pusherSubscriptions.includes(channelId)
        ? state.pusherSubscriptions
        : state.pusherSubscriptions.filter((id) => id !== channelId),
    })),

  setChannel: (channel: Channel) =>
    set((state) => ({
      channels: [
        ...state.channels.filter(({ id }) => id !== channel.id),
        renameChannelUsers(channel),
      ],
    })),

  removeChannel: (channelId: string) =>
    set((state) => ({
      channels: state.channels.filter(({ id }) => id !== channelId),
      pusherSubscriptions: state.pusherSubscriptions.includes(channelId)
        ? state.pusherSubscriptions
        : state.pusherSubscriptions.filter((id) => id !== channelId),
    })),

  addMessage: (channelId: string, message: ChannelMessage) => {
    set((state) => ({
      channels: state.channels.map((channel) =>
        channel.id !== channelId ? channel : {
          ...channel,
          messages: [
            ...channel.messages,
            renameMessageUser(channel, message),
          ],
        }
      ),
    }));
  },
}));
