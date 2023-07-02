import { useEffect, useRef } from "react";
import usePusherStore from "./usePusherStore";

export default function useSubscribeToEvent<MessageType>(
  eventName: string,
  callback: (data: MessageType) => void,
) {
  const channel = usePusherStore((state) => state.channel);

  const stableCallback = useRef(callback);

  // Keep callback sync'd
  useEffect(() => {
    stableCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const reference = (data: MessageType) => {
      stableCallback.current(data);
    };
    channel.bind(eventName, reference);
    return () => {
      channel.unbind(eventName, reference);
    };
  }, [channel, eventName]);
}
