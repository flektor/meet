import { LngLat } from "~/components/Map";
import { getGroupOutput } from "../../types";
import { Store } from "../store";

export function setGroup(state: Store, group: getGroupOutput) {
  const { channel, users, ...rest } = group;
  const userIds = users.map(({ id }) => id);
  const restGroups = state.groups.filter(({ id }) => id !== group.id);
  const restChannels = state.channels.filter(({ id }) => id !== channel.id);
  const restUsers = state.users.filter(({ id }) => !userIds.includes(id));
  return ({
    channels: [...restChannels, channel],
    groups: [...restGroups, rest],
    users: [...restUsers, ...users],
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
