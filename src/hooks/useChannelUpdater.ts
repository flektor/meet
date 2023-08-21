import { useEffect, useState } from "react";
import {
  Channel,
  getActivityOutput,
  getActivityViewersOutput,
  getGroupOutput,
  getGroupViewers,
} from "../types";

export default function useChannelUpdater(
  channelId: string,
  activityOrGroup: getActivityOutput | getGroupOutput,
  viewers: getActivityViewersOutput | getGroupViewers | undefined,
) {
  // if (!viewers) {
  //   return { channel: null };
  // }

  const _initChannelData = {
    createdAt: new Date(),
    description: "",
    id: channelId,
    slug: channelId,
    messages: [],
    title: "",
    users: [],
    activitySlug: "",
  } as Channel;

  const [channel, setChannel] = useState<Channel>(_initChannelData);

  function getUserNameById(userId: string) {
    return activityOrGroup?.channel.users.find((user) => user.userId === userId)
      ?.name ||
      "user";
  }

  // function updateSenderNamesOnMessages(
  //   group: NonNullable<getGroupOutput | getActivityOutput>,
  // ) {
  //   const updatedMessages = group.channel.messages.map((message) => ({
  //     ...message,
  //     sentBy: getUserNameById(message.sentBy),
  //   }));

  //   setChannel({
  //     ...group.channel,
  //     messages: updatedMessages,
  //     activitySlug: group.,
  //   });
  // }

  useEffect(() => {
    if (!activityOrGroup) return;

    // updateSenderNamesOnMessages(activityOrGroup);

    if (!viewers) return;

    for (const viewer of viewers) {
      const index = activityOrGroup.channel.users.findIndex(({ userId }) =>
        viewer.userId === userId
      );
      if (index > -1) {
        activityOrGroup.channel.users[index] = viewer;
        continue;
      }
      activityOrGroup.channel.users.push(viewer);
      continue;
    }
  }, [channel, viewers]);

  return { channel };
}
