import { useEffect, useState } from "react";
import { useStore } from "../utils/store";
import { api } from "../utils/api";

export default function useGroup(slug: string) {
  const store = useStore();

  const { data, isLoading, error, refetch } = api.groups.getGroup
    .useQuery({
      slug,
    }, { enabled: !!slug });

  const [group, setGroup] = useState(data);

  useEffect(() => {
    if (!data) {
      return;
    }

    const isStored = store.groups.some(({ id }) => id === data.id);

    if (isStored) {
      store.updateGroup(data);
    } else {
      store.addGroup(data);
    }
  }, [data]);

  useEffect(() => {
    if (!data) {
      return;
    }

    setGroup(data);
  }, [store.groups, data]);

  return { group, error, isLoading, refetch };
}
