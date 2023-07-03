import { useContext } from "react";
import { PusherState } from "../utils/pusherStore";
import { useStore } from "zustand";
import { PusherContext } from "~/utils/PusherProvider";

export default function usePusherStore<T>(
  selector: (state: PusherState) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T | void {
  const store = useContext(PusherContext);
  if (!store) {
    return;
  }
  return useStore(store, selector, equalityFn);
}
