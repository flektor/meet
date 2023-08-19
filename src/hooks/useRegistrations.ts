import { useEffect, useState } from "react";
import { useStore } from "../utils/store";

export default function useRegistrations() {
  const store = useStore();

  function getRegistrations() {
    return store.activities.filter(({ isRegistered }) => isRegistered);
  }

  const [registrations, setRegistrations] = useState(getRegistrations());

  useEffect(() => setRegistrations(getRegistrations()), [store.activities]);

  return registrations;
}
