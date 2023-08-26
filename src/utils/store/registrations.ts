import { Store } from "../store";

export function addToRegistrations(state: Store, activityId: string) {
  return {
    activities: state.activities.map((activity) =>
      activity.id !== activityId ? activity : ({
        ...activity,
        isRegistered: true,
        registrationsCount: activity.registrationsCount + 1,
      })
    ),
  };
}

export function removeFromRegistrations(state: Store, activityId: string) {
  return {
    activities: state.activities.map((
      activity,
    ) => (activity.id !== activityId ? activity : ({
      ...activity,
      isRegistered: false,
      registrationsCount: activity.registrationsCount - 1,
    }))),
  };
}

export default {
  addToRegistrations,
  removeFromRegistrations,
};
