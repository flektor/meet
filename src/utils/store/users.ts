import type { Store } from "../store";
import type { User } from "../../types";

export function setUsers(state: Store, users: User[]) {
  const userIds = users.map(({ id }) => id);
  return ({
    users: [
      ...state.users.filter(({ id }) => !userIds.includes(id)),
      ...users,
    ],
  });
}

export function removeUsers(state: Store, users: User[]) {
  const userIds = users.map(({ id }) => id);
  return ({
    users: state.users.filter(({ id }) => !userIds.includes(id)),
  });
}

export default {
  setUsers,
  removeUsers,
};
