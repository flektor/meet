import { create } from "zustand";
import type { getActivitiesOutput, getActivityOutput } from "~/types";

type Store = {
  activities: getActivitiesOutput;
  setActivities: (activities: getActivitiesOutput) => void;
  addActivity: (activity: getActivityOutput) => void;
  removeActivity: (activityId: string) => void;
  updateActivity: (activity: getActivityOutput) => void;

  addToFavorites: (activityId: string) => void;
  removeFromFavorites: (activityId: string) => void;

  addToRegistrations: (activityId: string) => void;
  removeFromRegistrations: (activityId: string) => void;
};

export const useStore = create<Store>((set) => ({
  activities: [],

  setActivities: (activities: getActivitiesOutput) =>
    set((state) => ({ ...state, activities })),

  addActivity: (activity: getActivityOutput) =>
    activity && set((state) => ({
      ...state,
      activities: [...state.activities, activity],
    })),

  updateActivity: (activity: getActivityOutput) => {
    activity && set((state) => {
      return {
        ...state,
        activities: state.activities.map((prevActivity) => {
          if (prevActivity.id === activity.id) {
            return activity;
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
