import { Store } from "../store";
import { PusherLocationMessage } from "../../types";

export default function groupLocationUpdateHandler(
  sender: string,
  message: PusherLocationMessage,
  store: Store,
) {
  if (message.action !== "location_update") {
    return;
  }

  const group = store.groups.find(({ id }) => id == message.groupId);

  if (!group) {
    return;
  }
  store.updateGroupLocation(group.id, message.lngLat);
}
