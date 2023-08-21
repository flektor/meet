import { useEffect, useState } from "react";
import { useStore } from "../utils/store";
import { api } from "../utils/api";
import useActivityViewers from "./useActivityViewers";

export default function useActivity(slug: string) {
  const store = useStore();

  const { data, isLoading, error, refetch } = api.activities.getActivity
    .useQuery({
      slug,
    }, { enabled: !!slug });

  const [activity, setActivity] = useState(data);

  const { viewers } = useActivityViewers(activity);

  useEffect(() => {
    if (!data) {
      return;
    }

    const isStored = store.activities.some(({ id }) => id === data.id);

    if (isStored) {
      store.updateActivity(data);
    } else {
      store.addActivity(data);
    }
    store.setGroupsOverview(data.groups.map((group) => ({
      activitySlug: slug,
      slug: group.slug,
      title: group.title,
      viewersCount: group.viewersCount,
      isMember: false,
    })));
  }, [data]);

  useEffect(() => {
    if (!data) {
      return;
    }

    setActivity(data);
  }, [store.activities, data]);

  return { activity, viewers, error, isLoading, refetch };
}
