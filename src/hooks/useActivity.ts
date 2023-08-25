import { useEffect, useState } from "react";
import { useStore } from "../utils/store";
import { api } from "../utils/api";
import useActivityViewer from "./useActivityViewers";

export default function useActivity(slug: string) {
  const store = useStore();

  const { data, isLoading, error, refetch } = api.activities
    .getActivity
    .useQuery({
      slug,
    }, { enabled: !!slug });

  useActivityViewer(data);

  const initLocalState = {
    activity: store.activities.find(({ slug: slug1 }) => slug === slug1),
    groups: store.groups.filter(({ activitySlug: slug1 }) => slug === slug1),
  };

  const [localState, setLocalState] = useState(initLocalState);

  useEffect(() => {
    if (data) {
      store.setActivity(data);
    }
  }, [data]);

  useEffect(() => {
    const localState = {
      activity: store.activities.find(({ slug: slug1 }) => slug === slug1),
      groups: store.groups.filter(({ activitySlug: slug1 }) => slug === slug1),
    };

    setLocalState(localState);
  }, [store.activities, store.groups]);

  return { ...localState, error, isLoading, refetch };
}
