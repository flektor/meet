import { useEffect, useState } from "react";
import { useStore } from "../utils/store";
import { api } from "../utils/api";
import { getActivitiesOutput } from "~/types";

export default function useActivities() {
  const store = useStore();
  const [activities, setActivities] = useState<getActivitiesOutput>([]);

  const { data, error, isLoading } = api.activities.getActivities.useQuery();

  useEffect(() => {
    if (data) {
      store.setActivities(data);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setActivities(store.activities);
    }
  }, [store.activities]);

  return { activities, error, isLoading };
}
