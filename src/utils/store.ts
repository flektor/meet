import { create } from "zustand";
import type {
  getActivitiesOutput,
  getActivityOutput,
  getGroupOutput,
  GroupOverview,
  GroupsOverview,
  Toast,
} from "~/types";

type Store = {
  activities: NonNullable<getActivitiesOutput>;
  groups: NonNullable<getGroupOutput>[];
  groupsOverview: GroupsOverview;
  toasts: Toast[];
  userIsViewingPage: string | null;
  setActivities: (activities: NonNullable<getActivitiesOutput>) => void;
  addActivity: (activity: NonNullable<getActivityOutput>) => void;
  removeActivity: (activityId: string) => void;
  updateActivity: (activity: NonNullable<getActivityOutput>) => void;

  addGroup: (group: NonNullable<getGroupOutput>) => void;
  removeGroup: (groupId: string) => void;
  updateGroup: (group: NonNullable<getGroupOutput>) => void;
  setGroupsOverview: (group: GroupsOverview) => void;
  addGroupOverview: (group: GroupOverview) => void;
  removeGroupOverview: (group: GroupOverview) => void;

  addToFavorites: (activityId: string) => void;
  removeFromFavorites: (activityId: string) => void;

  addToast: (toast: Toast) => void;
  removeToast: (toastId: string) => void;
  addToasts: (toast: Toast[]) => void;

  addToRegistrations: (activityId: string) => void;
  removeFromRegistrations: (activityId: string) => void;
};

export const useStore = create<Store>((set) => ({
  activities: [],
  groups: [],
  groupsOverview: [],
  channels: [],
  toasts: [],
  userIsViewingPage: null,

  setActivities: (activities: NonNullable<getActivitiesOutput>) =>
    set({ activities }),

  addActivity: (activity: NonNullable<getActivityOutput>) =>
    set((state) => ({
      activities: [...state.activities, { ...activity }],
    })),

  updateActivity: (activity: NonNullable<getActivityOutput>) => {
    set((state) => ({
      activities: state.activities.map((prev) =>
        prev.id === activity.id ? ({ ...activity }) : prev
      ),
    }));
  },

  removeActivity: (activityId: string) =>
    set((state) => ({
      activities: state.activities.filter(({ id }) => id !== activityId),
    })),

  setGroupsOverview: (groups: GroupsOverview) =>
    set({ groupsOverview: groups }),

  addGroup: (group: NonNullable<getGroupOutput>) =>
    set((state) => ({ groups: [...state.groups, { ...group }] })),

  addGroupOverview: (group: GroupOverview) =>
    set((state) => ({
      groupsOverview: [...state.groupsOverview, { ...group }],
    })),

  removeGroupOverview: (group: GroupOverview) =>
    set((state) => ({
      groupsOverview: [...state.groupsOverview, { ...group }],
    })),

  updateGroup: (group: NonNullable<getGroupOutput>) => {
    set((state) => ({
      groups: state.groups.map((prev) =>
        prev.id === group.id ? ({ ...group }) : prev
      ),
    }));
  },

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
}));
