import { useEffect, useState } from "react";
import { useStore } from "../utils/store";
import { api } from "../utils/api";
import useGroupViewer from "./useGroupViewer";

export default function useGroup(activitySlug: string, groupSlug: string) {
  const store = useStore();

  const { data, isLoading, error, refetch } = api.groups.getGroup
    .useQuery({ activitySlug, slug: groupSlug }, { enabled: !!groupSlug });

  const [group, setGroup] = useState(
    store.groups.find(({ activitySlug: activitySlug2, slug: groupSlug2 }) =>
      activitySlug === activitySlug2 && groupSlug2 === groupSlug
    ) || data,
  );

  useGroupViewer(data);

  useEffect(() => {
    if (data) {
      store.setGroup(data);
    }
  }, [data]);

  useEffect(() => {
    const group =
      store.groups.find(({ activitySlug: activitySlug2, slug: groupSlug2 }) =>
        activitySlug === activitySlug2 && groupSlug2 === groupSlug
      ) || data;

    setGroup(group);
  }, [store.groups]);

  return { group, error, isLoading, refetch };
}
