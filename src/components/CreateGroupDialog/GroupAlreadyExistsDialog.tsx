import React from "react";
import Link from "next/link";
import EnterIcon from "../icons/Enter";
import AlarmIcon from "../icons/Alarm";

type GroupAlreadyExistsDialogProps = {
  activitySlug: string;
  groupSlug: string;
};

export default function GroupAlreadyExistDialog(
  { activitySlug, groupSlug }: GroupAlreadyExistsDialogProps,
) {
  return (
    <>
      <i className="flex items-center font-medium mt-2 text-sm text-orange-300">
        <AlarmIcon
          className="fill-orange-300 stroke-orange-300 w-6 h-6 mr-1"
          viewBox="0 0 24 24"
        />{" "}
        This group already exists
      </i>
      <i className="flex font-medium ml-7 mb-4 text-sm text-[#e8c5fa]">
        Click
        <Link
          href={`/activities/${activitySlug}/${groupSlug}`}
          className="flex justify-center ml-1 font-medium text-[#cc66ff] transition underline hover:text-white [&>svg]:hover:fill-white"
        >
          here
          <EnterIcon
            className="fill-[#cc66ff] w-6 h-6"
            viewBox="0 0 24 24"
          />
        </Link>
        to check it out..
      </i>
    </>
  );
}
