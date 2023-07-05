import { create } from "zustand";
import type {
  getActivitiesOutput,
  getActivityOutput,
  getGroupOutput,
  GroupOverview,
  GroupsOverview,
} from "~/types";

type Store = {
  activities: NonNullable<getActivitiesOutput>;
  groups: NonNullable<getGroupOutput>[];
  groupsOverview: GroupsOverview;
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

  addToRegistrations: (activityId: string) => void;
  removeFromRegistrations: (activityId: string) => void;
};

export const useStore = create<Store>((set) => ({
  activities: [],
  groups: [],
  groupsOverview: [],
  channels: [],

  setActivities: (activities: NonNullable<getActivitiesOutput>) =>
    set({ activities }),

  addActivity: (activity: NonNullable<getActivityOutput>) =>
    set((state) => ({
      ...state,
      activities: [...state.activities, {
        ...activity,
      }],
    })),

  updateActivity: (activity: NonNullable<getActivityOutput>) => {
    set((state) => {
      return {
        ...state,
        activities: state.activities.map((prevActivity) => {
          if (prevActivity.id === activity.id) {
            return {
              ...activity,
            };
          }
          return prevActivity;
        }),
      };
    });
  },

  removeActivity: (activityId: string) =>
    set((state) => ({
      ...state,
      activities: state.activities.filter(({ id }) => id !== activityId),
    })),

  setGroupsOverview: (groups: GroupsOverview) =>
    set({ groupsOverview: groups }),

  addGroup: (group: NonNullable<getGroupOutput>) =>
    set((state) => ({
      ...state,
      groups: [...state.groups, {
        ...group,
      }],
    })),

  addGroupOverview: (group: GroupOverview) =>
    set((state) => ({
      ...state,
      groupsOverview: [...state.groupsOverview, {
        ...group,
      }],
    })),

  removeGroupOverview: (group: GroupOverview) =>
    set((state) => ({
      ...state,
      groupsOverview: [...state.groupsOverview, {
        ...group,
      }],
    })),

  updateGroup: (group: NonNullable<getGroupOutput>) => {
    set((state) => {
      return {
        ...state,
        groups: state.groups.map((prevGroups) => {
          if (prevGroups.id === group.id) {
            return {
              ...group,
            };
          }
          return prevGroups;
        }),
      };
    });
  },

  removeGroup: (GroupId: string) =>
    set((state) => ({
      ...state,
      groups: state.groups.filter(({ id }) => id !== GroupId),
    })),

  addToFavorites: (activityId: string) =>
    set((state) => ({
      ...state,
      activities: state.activities.map((activity) => {
        if (activity.id === activityId) {
          return {
            ...activity,
            isFavorite: true,
            favoritesCount: ++activity.favoritesCount,
          };
        }
        return activity;
      }),
    })),

  removeFromFavorites: (activityId: string) =>
    set((state) => ({
      ...state,
      activities: state.activities.map((activity) => {
        if (activity.id === activityId) {
          return {
            ...activity,
            isFavorite: false,
            favoritesCount: --activity.favoritesCount,
          };
        }
        return activity;
      }),
    })),

  addToRegistrations: (activityId: string) =>
    set((state) => ({
      ...state,
      activities: state.activities.map((activity) => {
        if (activity.id === activityId) {
          return {
            ...activity,
            isRegistered: true,
            registrationsCount: ++activity.registrationsCount,
          };
        }
        return activity;
      }),
    })),

  removeFromRegistrations: (activityId: string) =>
    set((state) => ({
      ...state,
      activities: state.activities.map((activity) => {
        if (activity.id === activityId) {
          return {
            ...activity,
            isRegistered: false,
            registrationsCount: --activity.registrationsCount,
          };
        }
        return activity;
      }),
    })),
}));
