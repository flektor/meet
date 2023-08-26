import { create } from "zustand";
import { removeActivity, setActivities, setActivity } from "./store/activities";
import { removeUsers, setUsers } from "./store/users";
import { removeGroup, setGroup } from "./store/groups";
import { addToFavorites, removeFromFavorites } from "./store/favorites";
import { addViewer, removeViewer } from "./store/viewer";
import { addMessage, removeChannel, setChannel } from "./store/channels";
import {
  addToRegistrations,
  removeFromRegistrations,
} from "./store/registrations";
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

export type Store = {
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

  setUsers: (users: User[]) => set((state) => setUsers(state, users)),

  removeUsers: (users: User[]) => set((state) => removeUsers(state, users)),

  setActivities: (activities: getActivitiesOutput) =>
    set(() => setActivities(activities)),

  setActivity: (activity: getActivityOutput) =>
    set((state) => setActivity(state, activity)),

  removeActivity: (activityId: string) =>
    set((state) => removeActivity(state, activityId)),

  setGroup: (group: GroupOutput) => set((state) => setGroup(state, group)),

  removeGroup: (groupId: string) => set((state) => removeGroup(state, groupId)),

  addToFavorites: (activityId: string) =>
    set((state) => addToFavorites(state, activityId)),

  removeFromFavorites: (activityId: string) =>
    set((state) => removeFromFavorites(state, activityId)),

  addToRegistrations: (activityId: string) =>
    set((state) => addToRegistrations(state, activityId)),

  removeFromRegistrations: (activityId: string) =>
    set((state) => removeFromRegistrations(state, activityId)),

  addViewer: (channelId: string) => set((state) => addViewer(state, channelId)),

  removeViewer: (channelId: string) =>
    set((state) => removeViewer(state, channelId)),

  setChannel: (channel: Channel) => set((state) => setChannel(state, channel)),

  removeChannel: (channelId: string) =>
    set((state) => removeChannel(state, channelId)),

  addMessage: (channelId: string, message: ChannelMessage) => {
    set((state) => addMessage(state, channelId, message));
  },

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

  removeToast: (toastId: string) =>
    set((state) => ({
      toasts: state.toasts.filter(({ id }) => id !== toastId),
    })),

  addToast: (toast: Toast) =>
    set((state) => ({ toasts: [...state.toasts, { ...toast }] })),

  addToasts: (toasts: Toast[]) =>
    set((state) => ({ toasts: [...state.toasts, ...toasts] })),
}));
