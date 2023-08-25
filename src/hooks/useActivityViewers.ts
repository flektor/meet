import { useEffect } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/dist/client/router";
import { Activity } from "../types";
import { useStore } from "~/utils/store";

export default function useActivityViewers(activity: Activity | undefined) {
  const router = useRouter();
  const store = useStore();
  const addToViewers = api.activityViewer.add.useMutation();
  const removeFromViewers = api.activityViewer.remove.useMutation();

  useEffect(() => {
    const handleRouteChange = () => {
      if (activity) {
        removeFromViewers.mutate({
          activityId: activity.id,
          channelId: activity.channelId,
        });
        store.userIsViewingPage = null;
      }
    };

    if (activity && !store.userIsViewingPage) {
      addToViewers.mutate({
        activityId: activity.id,
        channelId: activity.channelId,
      });
      store.userIsViewingPage = activity.slug;
    }

    router.events.on("beforeHistoryChange", handleRouteChange);
    window.addEventListener("beforeunload", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
      router.events.off("beforeHistoryChange", handleRouteChange);
    };
  }, [activity]);
}
