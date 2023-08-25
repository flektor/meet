import { Channel, ChannelMessage } from "~/types";

export function createSlug(title: string): string {
  return title.toLowerCase().replaceAll(" ", "_");
}

export function getUserNameById(channel: Channel | undefined, userId: string) {
  console.log({ userId });

  if (!channel || userId === "user") {
    return "user";
  }
  return channel.users.find((user) => user.userId === userId)?.name || "user";
}

export function renameMessageUser(channel: Channel, message: ChannelMessage) {
  message.sentBy = getUserNameById(channel, message.sentBy);
  return message;
}

export function renameChannelUsers(channel: Channel): Channel {
  channel.messages = channel.messages.map((message) => {
    message.sentBy = getUserNameById(channel, message.sentBy);
    return message;
  });
  return channel;
}
