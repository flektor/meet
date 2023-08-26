import { GroupOutput } from "../../types";
import { Store } from "../store";

export function setGroup(state: Store, group: GroupOutput) {
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

export function removeGroup(state: Store, GroupId: string) {
  return {
    groups: state.groups.filter(({ id }) => id !== GroupId),
  };
}

export default {
  setGroup,
  removeGroup,
};
