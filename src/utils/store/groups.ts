import { LngLat } from "~/components/Map";
import { getGroupOutput, getUserGroupsOutput, Group } from "../../types";
import { Store } from "../store";

export function setGroups(state: Store, groups: getUserGroupsOutput) {
  const groupIdsToAdd = groups.map(({ id }) => id);
  const restGroups = state.groups.filter(({ id }) =>
    !groupIdsToAdd.includes(id)
  );

  const channelIdsToAdd = groups.filter(({ id }) =>
    !state.pusherSubscriptions.includes(id)
  ).map(({ id }) => id);

  for (const group of groups) {
    if (!state.pusherSubscriptions.includes(group.channelId)) {
      channelIdsToAdd.push(group.channelId);
    }
  }
  const pusherSubscriptions = channelIdsToAdd
    ? [...state.pusherSubscriptions, ...channelIdsToAdd]
    : state.pusherSubscriptions;

  return ({
    groups: [...restGroups, ...groups],
    pusherSubscriptions,
  });
}

export function setGroup(state: Store, group: getGroupOutput | Group) {
  const { channel, users, ...rest } = group as getGroupOutput;
  const restGroups = state.groups.filter(({ id }) => id !== group.id);

  const pusherSubscriptions =
    state.pusherSubscriptions.includes(group.channelId)
      ? state.pusherSubscriptions
      : [...state.pusherSubscriptions, group.channelId];

  if (!channel || !users) {
    return { groups: [...restGroups, rest], pusherSubscriptions };
  }

  const userIds = users.map(({ id }) => id);
  const restChannels = state.channels.filter(({ id }) => id !== channel.id);
  const restUsers = state.users.filter(({ id }) => !userIds.includes(id));

  return ({
    channels: [...restChannels, channel],
    groups: [...restGroups, rest],
    users: [...restUsers, ...users],
    pusherSubscriptions,
  });
}

export function updateGroupLocation(
  state: Store,
  groupId: string,
  lngLat: LngLat,
) {
  const groupToUpdate = state.groups.find(({ id }) => id == groupId);

  if (!groupToUpdate) {
    return state;
  }
  groupToUpdate.locationPin = lngLat.toString();
  return {
    groups: state.groups.map((group) =>
      group.id === groupId ? groupToUpdate : group
    ),
  };
}

export function removeGroup(state: Store, GroupId: string) {
  return {
    groups: state.groups.filter(({ id }) => id !== GroupId),
  };
}

export default {
  setGroup,
  removeGroup,
};
