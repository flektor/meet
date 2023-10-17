import { Store } from "../store";

export function addToFavorites(state: Store, activityId: string) {
  return {
    activities: state.activities.map((activity) =>
      activity.id !== activityId ? activity : ({
        ...activity,
        isFavorite: true,
        favoritesCount: activity.favoritesCount + 1,
      })
    ),
  };
}

export function removeFromFavorites(state: Store, activityId: string) {
  return {
    activities: state.activities.map((activity) =>
      activity.id !== activityId ? activity : ({
        ...activity,
        isFavorite: false,
        favoritesCount: activity.favoritesCount - 1,
      })
    ),
  };
}
export default {
  addToFavorites,
  removeFromFavorites,
};
