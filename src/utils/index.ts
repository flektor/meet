import { Channel } from "~/types";

export function createSlug(title: string): string {
  return title.toLowerCase().replaceAll(" ", "_");
}

export function getUserNameById(channel: Channel, userId: string) {
  return channel.users.find((user) => user.userId === userId)?.name || "user";
}
