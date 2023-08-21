import { useEffect } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/dist/client/router";
import { getGroupOutput } from "../types";
import { useStore } from "~/utils/store";

export default function useGroupViewer(
  activitySlug: string,
  group: getGroupOutput,
) {
  const router = useRouter();
  const store = useStore();
  const addToViewers = api.groupViewer.add.useMutation();
  const removeFromViewers = api.groupViewer.remove.useMutation();

  const { data: viewers, refetch: refetchViewers } = api.groupViewer
    .getGroupViewers.useQuery({ groupId: group ? group.id : "" }, {
      enabled: !!group,
    });

  useEffect(() => {
    const handleRouteChange = () => {
      if (group) {
        removeFromViewers.mutate({
          activitySlug,
          groupSlug: group.slug,
          groupId: group.id,
        });
        store.userIsViewingPage = null;
      }
    };

    if (group && !store.userIsViewingPage) {
      addToViewers.mutate({
        activitySlug,
        groupSlug: group.slug,
        groupId: group.id,
      });
      store.userIsViewingPage = group.slug;
    }

    router.events.on("beforeHistoryChange", handleRouteChange);
    window.addEventListener("beforeunload", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
      router.events.off("beforeHistoryChange", handleRouteChange);
    };
  }, [group]);

  return { viewers, refetchViewers };
}
