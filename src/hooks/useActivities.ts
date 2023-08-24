import { useEffect, useState } from "react";
import { useStore } from "../utils/store";
import { api } from "../utils/api";

export default function useActivities() {
  const store = useStore();

  const [activities, setActivities] = useState(store.activities);
  const { data, error, isLoading } = api.activities.getActivities.useQuery();

  useEffect(() => {
    if (data) {
      store.setActivities(data);
    }
  }, [data]);

  useEffect(() => {
    setActivities(store.activities);
  }, [store.activities]);

  return { activities, error, isLoading };
}
