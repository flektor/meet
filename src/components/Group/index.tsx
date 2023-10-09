import React, { useEffect, useState } from "react";
import { getGroupOutput, Group } from "../../types";
import { useStore } from "../../utils/store";
import Map, { LngLat } from "../Map";
import DateTime from "./DateTime";
import useScreenSize from "~/hooks/useScreenSize";
import { api } from "~/utils/api";

export type GroupInfoProps = {
  group: getGroupOutput;
};

export default function Group({ group }: GroupInfoProps) {
  const store = useStore();

  const screenSize = useScreenSize();
  const mapWidth = screenSize === "sm"
    ? "90vw"
    : screenSize === "md"
    ? "60vw"
    : "40vw";
  const mapHeight = mapWidth;

  const members = store.users.filter((user) =>
    group ? group.membersIds.includes(user.id) : []
  );

  // const [showMarker, setShowMarker] = useState(false);

  const updateLocation = api.location.updateGroupLocation.useMutation();

  const [locationPin, setLocationPin] = useState<LngLat>(
    JSON.parse(`[${group.locationPin}]`) ||
      [13.404954, 52.520008],
  );

  function onMarkerMoved(lngLat: LngLat) {
    updateLocation.mutate({
      groupId: group.id,
      lngLat,
    });
    setLocationPin(lngLat);
  }

  useEffect(() => {
    const storedGgroup = store.groups.find(({ id }) => id === group.id);
    if (!storedGgroup) {
      return;
    }
    const lngLat = JSON.parse(`[${storedGgroup.locationPin}]`);
    setLocationPin(lngLat);
  }, [store.groups]);

  return (
    <div className="flex flex-col justify-center items-start mt-3 mb-4 gap-3 text-white text-xl">
      {group.description &&
        (
          <p className="flex">
            <span className="text-gray-400 mr-2">About:</span>
            {group.description}
          </p>
        )}

      <p className="flex">
        <span className="text-gray-400 mr-2">
          Group:
        </span>
        {group.private ? "Private" : "Public"}
      </p>

      <p className="flex">
        <span className="text-gray-400 mr-2">
          Members:
        </span>
        {group.membersIds.length}/{group.maxParticipants}
      </p>

      <div className="max-h-48 rounded-md flex flex-wrap gap-2 overflow-y-auto">
        {members.map((member) => (
          <div key={member.name} className="text-white">
            <div className="flex items-center bg-black/10 p-2 pl-1 rounded-md">
              {member.image && (
                <img
                  src={member.image}
                  width={32}
                  height={32}
                  className="rounded-full m-1 mr-2"
                />
              )}

              <span className="text-white/60">
                {member.name?.split(" ")[0]}
              </span>

              {
                /* {!isCurrentUser && (
        <UserMenu
          session={session}
          userId={message.sentBy}
          isMember={isMember}
        />
      )}  */
              }
            </div>
          </div>
        ))}
      </div>

      <p className="flex">
        <span className="text-gray-400 mr-2 mt-3 md:mt-5">
          Schedule
        </span>
      </p>

      <DateTime startsAt={group.startsAt} endsAt={group.endsAt} />

      <span className="text-gray-400 mr-2 mt-3 md:mt-5">
        Location:{" "}
        <span className="text-white">
          {group.locationTitle}
        </span>
      </span>

      {
        /* <div className="w-full flex justify-between items-center">
        {group.locationTitle}

        <button
          onClick={() => setShowMarker(!showMarker)}
          type="button"
          className="group flex justify-between transition items-center text-primary hover:text-white font-semibold gap-2 rounded-lg bg-white/10 p-1 px-2"
        >
          Pin
          <MarkerIcon className="fill-primary stroke-primary group-hover:fill-white group-hover:stroke-white" />
        </button>
      </div> */
      }
      <Map
        width={mapWidth}
        height={mapHeight}
        initViewLngLat={locationPin}
        markerLngLat={locationPin}
        showMarker={true}
        onMarkerMoved={onMarkerMoved}
      />
    </div>
  );
}
