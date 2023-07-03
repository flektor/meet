import { useEffect, useState } from "react";
import { useStore } from "../utils/store";
import { api } from "../utils/api";

export default function useActivity(slug: string) {
  const store = useStore();

  const { data, isLoading, error, refetch } = api.activities.getActivity
    .useQuery({
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

    setActivity(data);
  }, [store.activities, data]);

  return { activity, error, isLoading, refetch };
}
