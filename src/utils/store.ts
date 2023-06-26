import { create } from "zustand";
import type { getActivitiesOutput } from "~/types";
import type { Activity } from "@prisma/client";

type Store = {
  activities: getActivitiesOutput;
  setActivities: (activities: getActivitiesOutput) => void;
  addActivity: (activity: Activity) => void;
  removeActivity: (activityId: string) => void;
};

export const useStore = create<Store>((set) => ({
  activities: [],

  setActivities: (activities: getActivitiesOutput) =>
    set((state) => ({ ...state, activities })),

  addActivity: (activity: Activity) =>
    set((state) => ({
      ...state,
      activities: [...state.activities, activity],
    })),

  removeActivity: (activityId: string) =>
    set((state) => ({
      ...state,
      activities: state.activities.filter(({ id }) => id !== activityId),
    })),
}));
