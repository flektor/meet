import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/dist/client/router";
import { getActivityOutput } from "../types";
import { useStore } from "~/utils/store";

export default function useActivityViewer(activity: getActivityOutput) {
  const router = useRouter();
  const store = useStore();
  const addToViewers = api.activityViewer.add.useMutation();
  const removeFromViewers = api.activityViewer.remove.useMutation();

  const { data: viewers, refetch: refetchViewers } = api.activityViewer
    .getActivityViewers
    .useQuery({ activityId: activity ? activity.id : "" }, {
      enabled: !!activity,
    });

  useEffect(() => {
    const handleRouteChange = () => {
      if (activity) {
        removeFromViewers.mutate({
          activityId: activity.id,
          activitySlug: activity.slug,
        });
        store.userIsViewingPage = null;
      }
    };

    if (activity && !store.userIsViewingPage) {
      addToViewers.mutate({
        activityId: activity.id,
        activitySlug: activity.slug,
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

  return { viewers, refetchViewers };
}
