import { useContext } from "react";
import { PusherState } from "../utils/pusher/pusherStore";
import { PusherContext } from "~/utils/pusher/PusherProvider";
import { useStore } from "zustand";

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
