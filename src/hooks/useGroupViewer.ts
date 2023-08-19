import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/dist/client/router";
import { getGroupOutput } from "../types";

export default function useGroupViewer(group: getGroupOutput) {
  const router = useRouter();

  const addToViewers = api.groupViewer.add.useMutation();

  const removeFromViewers = api.groupViewer.remove.useMutation();

  const [addedToViewers, setAddedToViewers] = useState(false);

  const { data: viewers, refetch: refetchViewers } = api.groupViewer
    .getGroupViewers.useQuery({
      groupId: group ? group.id : "",
    }, { enabled: !!group });

  useEffect(() => {
    const handleRouteChange = () => {
      if (group) {
        removeFromViewers.mutate({ groupId: group.id });
      }
    };

    if (group && !addedToViewers) {
      addToViewers.mutate({ groupId: group.id });
      setAddedToViewers(true);
    }

    router.events.on("beforeHistoryChange", handleRouteChange);
    window.addEventListener("beforeunload", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
      router.events.off("beforeHistoryChange", handleRouteChange);
    };
  }, [group, addedToViewers]);

  return { viewers, refetchViewers };
}
