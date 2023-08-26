import { useEffect } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/dist/client/router";
import { Group } from "../types";
import { useStore } from "~/utils/store";

export default function useGroupViewers(group: Group | undefined) {
  const router = useRouter();
  const store = useStore();
  const addToViewers = api.groupViewer.add.useMutation();
  const removeFromViewers = api.groupViewer.remove.useMutation();

  useEffect(() => {
    const handleRouteChange = () => {
      if (group) {
        removeFromViewers.mutate({
          channelId: group.channelId,
          groupId: group.id,
        });
        store.userIsViewingPage = null;
      }
    };

    if (group && store.userIsViewingPage !== group.slug) {
      addToViewers.mutate({
        groupId: group.id,
        channelId: group.channelId,
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
}
