import { useEffect, useState } from "react";
import { useStore } from "../utils/store";
import { api } from "../utils/api";
import useRegistrations from "./useRegistrations";

export default function useChannels() {
  const registeredActivities = useRegistrations();

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

  return { channels, error, isLoading };
}
