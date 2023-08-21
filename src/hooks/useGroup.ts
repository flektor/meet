import { useEffect, useState } from "react";
import { useStore } from "../utils/store";
import { api } from "../utils/api";
import useGroupViewer from "./useGroupViewer";

export default function useGroup(activitySlug: string, groupSlug: string) {
  const store = useStore();

  const { data, isLoading, error, refetch } = api.groups.getGroup
    .useQuery({ slug: groupSlug }, { enabled: !!groupSlug });

  const [group, setGroup] = useState(data);
  const { viewers } = useGroupViewer(activitySlug, group);

  useEffect(() => {
    if (!data) {
      return;
    }

    const isStored = store.groups.some(({ id }) => id === data.id);

    if (isStored) {
      store.updateGroup(data);
      return;
    }

    store.addGroup(data);
  }, [data]);

  useEffect(() => {
    if (!data) {
      return;
    }

    setGroup(data);
  }, [store.groups, data]);

  return { group, viewers, error, isLoading, refetch };
}
