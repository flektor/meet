import type { Store } from "../store";
import type { getActivitiesOutput, getActivityOutput } from "../../types";

const dummyBaseGroup = {
  membersIds: [],
  viewersIds: [],
  description: "",
  createdAt: new Date(),
  createdBy: "",
};

export const setActivities = (activities: getActivitiesOutput) => ({
  activities,
});

export const setActivity = (state: Store, activity: getActivityOutput) => {
  const { channel, groups, users, ...rest } = activity;
  const groupIdsToAdd = activity.groups.map(({ id }) => id);
  const restGroups = state.groups.filter(({ id }) =>
    !groupIdsToAdd.includes(id)
  );

  const channelIdsToAdd = activity.groups.map(({ id }) => id).concat(
    activity.channelId,
  );
  const restChannels = state.channels.filter(({ id }) =>
    !channelIdsToAdd.includes(id)
  );

  const userIds = users.map(({ id }) => id);
  const restUsers = state.users.filter(({ id }) => !userIds.includes(id));

  return ({
    activities: [
      ...state.activities.filter(({ id }) => id !== activity.id),
      rest,
    ],
    channels: [...restChannels, channel],
    groups: [
      ...restGroups,
      ...groups.map((group) => ({ ...group, ...dummyBaseGroup })),
    ],
    users: [...restUsers, ...users],
  });
};

export const removeActivity = (state: Store, activityId: string) => {
  const activity = state.activities.find(({ id }) => id === activityId);
  if (!activity) {
    return state;
  }
  const groupsToRemove = state.groups.filter(({ activityId: id }) =>
    id === activityId
  );
  const groupIdToRemove = groupsToRemove.map(({ id }) => id);
  const channelsIdsToRemove = [
    activity.channelId,
    ...groupsToRemove.map(({ channelId }) => channelId),
  ];

  return ({
    activities: state.activities.filter(({ id }) => id !== activityId),
    groups: state.groups.filter(({ id }) => !groupIdToRemove.includes(id)),
    channels: state.channels.filter(({ id }) =>
      !channelsIdsToRemove.includes(id)
    ),
  });
};

export default {
  setActivities,
  setActivity,
  removeActivity,
};