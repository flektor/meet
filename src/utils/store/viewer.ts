import { Store } from "../store";

export function addViewer(state: Store, channelId: string) {
  return {
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
  };
}

export function removeViewer(state: Store, channelId: string) {
  return {
    groups: state.groups.map((group) =>
      group.channelId !== channelId ? group : ({
        ...group,
        viewersCount: group.viewersIds.length - 1,
      })
    ),
    activities: state.activities.map((activity) =>
      activity.channelId !== channelId ? activity : ({
        ...activity,
        viewersCount: activity.viewersCount - 1,
      })
    ),
  };
}

export default {
  addViewer,
  removeViewer,
};
