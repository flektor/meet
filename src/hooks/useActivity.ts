import { useEffect, useState } from "react";
import { useStore } from "../utils/store";
import { api } from "../utils/api";

export default function useActivity(slug: string) {
  const store = useStore();

  const { data, isLoading, error } = api.activities.getActivity.useQuery({
    slug,
  }, { enabled: !!slug });

  const [activity, setActivity] = useState(data);

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
  }, [data]);

  useEffect(() => {
    if (!data) {
      return;
    }
    const activity = store.activities.find(({ id }) => id === data.id);
    if (!activity) {
      return;
    }
    setActivity(activity);
  }, [store.activities, data]);

  return { activity, error, isLoading };
}
