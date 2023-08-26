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
  User,
} from "~/types";

const dummyBaseGroup = {
  membersIds: [],
  viewersIds: [],
  description: "",
  createdAt: new Date(),
  createdBy: "",
};

type Store = {
  activities: Activity[];
  groups: Group[];
  toasts: Toast[];
  userIsViewingPage: string | null;
  pusherSubscriptions: string[];
  channels: Channel[];
  users: User[];

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

  setUsers: (users: User[]) => void;
  removeUsers: (users: User[]) => void;
};

export const useStore = create<Store>((set) => ({
  activities: [],
  groups: [],
  channels: [],
  users: [],
  toasts: [],
  pusherSubscriptions: [],
  userIsViewingPage: null,

  setUsers(users: User[]) {
    const userIds = users.map(({ id }) => id);
    return set((state) => ({
      users: [
        ...state.users.filter(({ id }) => !userIds.includes(id)),
        ...users,
      ],
    }));
  },

  removeUsers(users: User[]) {
    const userIds = users.map(({ id }) => id);
    return set((state) => ({
      users: state.users.filter(({ id }) => !userIds.includes(id)),
    }));
  },

  setActivities: (activities: getActivitiesOutput) => set({ activities }),

  setActivity: (activity: getActivityOutput) =>
    set((state) => {
      const { channel, groups, users, ...rest } = activity;
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

      const userIds = users.map(({ id }) => id);
      const restUsers = state.users.filter(({ id }) => !userIds.includes(id));

      return ({
        activities: [
          ...state.activities.filter(({ id }) => id !== activity.id),
          rest,
        ],
        channels: [...restChannels, channel],
        groups: [
          ...restGroups,
          ...groups.map((group) => ({ ...group, ...dummyBaseGroup })),
        ],
        users: [...restUsers, ...users],
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
      const { channel, users, ...rest } = group;
      const userIds = users.map(({ id }) => id);
      const restGroups = state.groups.filter(({ id }) => id !== group.id);
      const restChannels = state.channels.filter(({ id }) => id !== channel.id);
      const restUsers = state.users.filter(({ id }) => !userIds.includes(id));
      console.log(channel.messages[channel.messages.length - 1]);
      return ({
        channels: [...restChannels, channel],
        groups: [...restGroups, rest],
        users: [...restUsers, ...users],
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
          viewersCount: group.viewersIds.length + 1,
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
        channel,
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
          messages: [...channel.messages, message],
        }
      ),
    }));
  },
}));
