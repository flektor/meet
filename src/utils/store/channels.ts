import { Channel, ChannelMessage } from "../../types";
import { Store } from "../store";

export function setChannel(state: Store, channel: Channel) {
  return {
    channels: [
      ...state.channels.filter(({ id }) => id !== channel.id),
      channel,
    ],
  };
}

export function removeChannel(state: Store, channelId: string) {
  return {
    channels: state.channels.filter(({ id }) => id !== channelId),
    pusherSubscriptions: state.pusherSubscriptions.includes(channelId)
      ? state.pusherSubscriptions
      : state.pusherSubscriptions.filter((id) => id !== channelId),
  };
}

export function addMessage(
  state: Store,
  channelId: string,
  message: ChannelMessage,
) {
  return {
    channels: state.channels.map((channel) =>
      channel.id !== channelId ? channel : {
        ...channel,
        messages: [...channel.messages, message],
      }
    ),
  };
}
export default {
  setChannel,
  removeChannel,
  addMessage,
};
