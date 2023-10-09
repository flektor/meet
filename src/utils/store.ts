import { create } from "zustand";
import { removeActivity, setActivities, setActivity } from "./store/activities";
import { removeUsers, setUsers } from "./store/users";
import { removeGroup, setGroup, updateGroupLocation } from "./store/groups";
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
  getGroupOutput,
  Group,
  ToastProps,
  User,
} from "~/types";
import { SessionContextValue } from "next-auth/react";
import { LngLat } from "~/components/Map";

export type Store = {
  activities: Activity[];
  groups: Group[];
  toasts: ToastProps[];
  userIsViewingPage: string | null;
  pusherSubscriptions: string[];
  channels: Channel[];
  users: User[];
  session: SessionContextValue | null;
  fetchedActivitiesTimestamp: number | false;

  setSession: (session: SessionContextValue) => void;

  setChannel: (channel: Channel) => void;
  removeChannel: (channelId: string) => void;

  addMessage: (channelId: string, message: ChannelMessage) => void;

  setActivities: (activities: getActivitiesOutput) => void;
  setActivity: (activity: getActivityOutput) => void;
  removeActivity: (activityId: string) => void;

  setGroup: (group: getGroupOutput) => void;
  removeGroup: (groupId: string) => void;
  updateGroupLocation: (
    groupId: string,
    lngLat: LngLat,
  ) => void;

  addToFavorites: (activityId: string) => void;
  removeFromFavorites: (activityId: string) => void;

  addToast: (toast: ToastProps) => void;
  removeToast: (toastId: string) => void;
  addToasts: (toast: ToastProps[]) => void;

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
  fetchedActivitiesTimestamp: false,
  session: null,

  setSession: (session: SessionContextValue) => set({ session }),

  setUsers: (users: User[]) => set((state) => setUsers(state, users)),

  removeUsers: (users: User[]) => set((state) => removeUsers(state, users)),

  setActivities: (activities: getActivitiesOutput) =>
    set(() => setActivities(activities)),

  setActivity: (activity: getActivityOutput) =>
    set((state) => setActivity(state, activity)),

  updateGroupLocation: (groupId: string, lngLat: LngLat) =>
    set((state) => updateGroupLocation(state, groupId, lngLat)),

  removeActivity: (activityId: string) =>
    set((state) => removeActivity(state, activityId)),

  setGroup: (group: getGroupOutput) => set((state) => setGroup(state, group)),

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

  addToast: (toast: ToastProps) =>
    set((state) => ({ toasts: [...state.toasts, { ...toast }] })),

  addToasts: (toasts: ToastProps[]) =>
    set((state) => ({ toasts: [...state.toasts, ...toasts] })),
}));
