import { type FormEvent, MouseEvent, useRef, useState } from "react";
import { z } from "zod";
import { api } from "../../utils/api";
import Spinner from "../Spinner";
import CloseIcon from "../icons/Close";
import MarkerIcon from "../icons/Marker";
import { useStore } from "~/utils/store";
import { addGroupInput } from "~/types";
import Map, { LngLat } from "../Map";
import useScreenSize from "~/hooks/useScreenSize";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import PublicGroupInput from "./PublicGroupInput";
import TitleInput, { capitalizeFirstCharacter } from "./TitleInput";

type CreateGroupDialogProps = {
  onNewGroup: () => void;
  onClose: () => void;
  activitySlug: string;
  activityId: string;
};
type DateTimeInput = {
  date: string; // "YYYY-MM-DD" format
  time: string; // "HH:MM" format
};

function getDateTime({ date, time }: DateTimeInput): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  if (!year || !month) {
    return new Date();
  }
  return new Date(year, month - 1, day, hours, minutes);
}

function CreateGroupDialog(
  { onNewGroup, onClose, activitySlug, activityId }: CreateGroupDialogProps,
) {
  const store = useStore();
  const [isWaitingForServer, setIsWaitingForServer] = useState(false);
  const [isGroupAlreadyExist, setIsGroupAlreadyExist] = useState(false);
  const [showMarker, setShowMarker] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const screenSize = useScreenSize();
  const mapWidth = screenSize === "sm"
    ? "86vw"
    : screenSize === "md"
    ? "75vw"
    : screenSize === "lg"
    ? "40vw"
    : "30vw";
  const mapHeight = mapWidth;
  const berlinLngLat: LngLat = [13.404954, 52.520008];

  function onCancel(event?: MouseEvent<HTMLDialogElement>) {
    if (!event || event.target === dialogRef.current) {
      onClose();
    }
  }

  const { mutate: addGroup } = api.groups.addGroup.useMutation({
    onError: (error) => {
      if (error.message.includes("Unique constraint failed on the fields:")) {
        setIsGroupAlreadyExist(true);
        return;
      }
      console.log(error.data?.zodError);
    },

    onSuccess: (group) => {
      if (formRef.current) {
        formRef.current.reset();
      }
      store.setGroup({
        ...group,
        viewersIds: [],
        membersIds: [],
        users: [],
        activitySlug: activitySlug,
        title: group.title,
        slug: group.slug,
        channel: {
          createdAt: new Date(),
          description: "",
          id: "temp",
          messages: [],
          title: group.title,
          usersIds: [],
        },
      });

      onNewGroup();
    },

    onSettled: () => setIsWaitingForServer(false),
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsWaitingForServer(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));

    const startsAt = getDateTime({
      date: data.startingDate as string,
      time: data.startingTime as string,
    });

    const endsAt = data.isEndingTimeEnabled === "on"
      ? getDateTime({
        date: (data.endingDate || data.startingDate) as string,
        time: (data.endingTime || data.startingTime) as string,
      })
      : data.isEndingDateEnabled === "on"
      ? new Date(data.endingDate as string)
      : undefined;

    const locationPin = (data.marker as string)?.substring(
      1,
      data.marker!.length - 2,
    );

    const groupData: z.infer<typeof addGroupInput> = {
      activityId,
      activitySlug,
      description: data.description as string,
      title: data.title as string,
      locationTitle: data.locationTitle as string || "Berlin",
      locationPin,
      minParticipants: 2,
      maxParticipants: Number(data.participants) || 2,
      private: Boolean(data.isPrivate) || false,
      startsAt,
      endsAt,
    };

    // if (data.locationPin) {
    //   data.locationPin = data.locationPin as string;
    // }

    // if (groupData.endsAt) {
    //   groupData.endsAt = groupData.endsAt;
    // }

    try {
      const group = addGroupInput.parse(groupData);
      group.description = capitalizeFirstCharacter(group.description);
      console.log({ group, data });
      addGroup(group);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error);
      }
    }
  }

  return (
    <dialog
      open
      className=" text-white max-w-[100vw] h-[100vh] fixed left-0 top-0 w-full outline-none flex items-center justify-center bg-black/20 backdrop-blur-sm z-10"
      onMouseDown={onCancel}
      ref={dialogRef}
    >
      <div className="max-w-[95vw] max-h-[92vh] flex-col justfy-center rounded-2xl bg-gradient-to-br from-[#472872] to-[#232338] border-2 border-primary relative overflow-hidden">
        <div className="w-full flex justify-between items-center">
          <h2 className="w-full flex justify-center p-2 text-2xl font-bold pl-12">
            New Group
          </h2>
          <CloseIcon
            className="m-2 fill-primary cursor-pointer hover:fill-white"
            onClick={onCancel}
          />
        </div>
        <hr className="h-[3px] border-0 bg-gradient-to-r from-#0000000 via-primary to-#0000000" />

        <form
          onSubmit={onSubmit}
          className="z-50 flex flex-col gap-2 rounded-xl p-3 md:p-5 overflow-y-auto max-h-[94.5vh]"
        >
          <div className="w-full flex flex-col md:flex-row gap-5 justify-center items-start">
            <div className="w-full flex flex-col gap-4">
              {/**/}
              <TitleInput
                isGroupAlreadyExist={isGroupAlreadyExist}
                setIsGroupAlreadyExist={setIsGroupAlreadyExist}
                activitySlug={activitySlug}
              />

              <label htmlFor="description" className="text-xl">
                Description
                <span className="text-gray-400 text-sm ml-1">(Optional)</span>
              </label>

              <textarea
                name="description"
                className="p-2 w-full rounded-lg bg-gradient-to-b from-[#25213C] to-[#1b1b2e] overflow-y-auto overflow-x-hidden"
                rows={2}
                placeholder="Give a short description about your group"
              />

              <PublicGroupInput />

              <div className="flex justify-between items-center gap-5">
                <label className="text-xl">
                  How many participants?
                </label>

                <input
                  name="participants"
                  className="p-2 w-24 h-fit rounded-lg text-lg bg-gradient-to-b from-[#25213C] to-[#1b1b2e] overflow-y-auto overflow-x-hidden"
                  placeholder="2"
                  type="number"
                  min={2}
                />
              </div>

              <label className="text-xl">
                When would you like to schedule it?
              </label>
              <DatePicker />

              <TimePicker />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xl pt-2 whitespace-nowrap">
                In which place?
              </label>

              <div className="w-full flex justify-center items-center -mt-1 md:mt-0 md:mb-4">
                <label className="text-xl">
                  Location
                </label>
                <input
                  name="locationTitle"
                  type="text"
                  placeholder="City"
                  className="w-full mx-4 p-2 rounded-lg bg-gradient-to-br from-[#25213C] to-[#1b1b2e] w-4/5 text-gray-300"
                  required
                  value="Berlin"
                  disabled
                />

                <button
                  onClick={() => setShowMarker(!showMarker)}
                  type="button"
                  className="group flex justify-between transition items-center hover:text-primary font-semibold gap-2 rounded-lg bg-gradient-to-b from-[#25213C] to-[#1b1b2e] hver:bg-gradient-to-b hover:from-[#2c2747] hover:to-[#1b1b2e] p-1 px-2"
                >
                  Pin
                  <MarkerIcon className="fill-white stroke-white group-hover:fill-primary group-hover:stroke-primary" />
                </button>
              </div>

              <Map
                initViewLngLat={berlinLngLat}
                width={mapWidth}
                height={mapHeight}
                showMarker={showMarker}
              />
            </div>
          </div>

          <div className="flex justify-end mt-2 mb-20 md:mb-0">
            <button
              disabled={isWaitingForServer}
              type="submit"
              className={`rounded-full px-4 py-2 w-36 font-semibold no-underline transition border-2 border-primary bg-black/20 disabled:opacity-50 ${
                !isWaitingForServer &&
                "hover:bg-black/5 hover:border-white hover:text-white"
              }`}
            >
              {isWaitingForServer ? <Spinner /> : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default CreateGroupDialog;
