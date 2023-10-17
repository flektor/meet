import { Store } from "../store";

export function addToRegistrations(state: Store, activityId: string) {
  const activity = state.activities.find(({ id }) => activityId === id);
  if (!activity) {
    return state;
  }
  return {
    activities: state.activities.map((activity) =>
      activity.id !== activityId ? activity : ({
        ...activity,
        isRegistered: true,
        registrationsCount: activity.registrationsCount + 1,
      })
    ),

    pusherSubscriptions: state.pusherSubscriptions.includes(activity.channelId)
      ? state.pusherSubscriptions
      : [...state.pusherSubscriptions, activity.channelId],
  };
}

export function removeFromRegistrations(state: Store, activityId: string) {
  const activity = state.activities.find(({ id }) => activityId === id);
  if (!activity) {
    return state;
  }

  return {
    activities: state.activities.map((
      activity,
    ) => (activity.id !== activityId ? activity : ({
      ...activity,
      isRegistered: false,
      registrationsCount: activity.registrationsCount - 1,
    }))),

    pusherSubscriptions: state.pusherSubscriptions.includes(activity.channelId)
      ? state.pusherSubscriptions.filter((id) => id === activity.channelId)
      : state.pusherSubscriptions,
  };
}

export default {
  addToRegistrations,
  removeFromRegistrations,
};
