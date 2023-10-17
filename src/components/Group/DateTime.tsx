import React from "react";
import { getTime } from "../../utils";

export type DateTypeProps = {
  startsAt: Date;
  endsAt: Date | null;
};

export default function DateTime({ startsAt, endsAt }: DateTypeProps) {
  if (!endsAt) {
    return (
      <>
        <p className="flex">
          <span className="text-gray-400 mr-2">
            Date:
          </span>
          {startsAt.toDateString()}
        </p>

        <p className="flex">
          <span className="text-gray-400 mr-2">
            Time:
          </span>
          {getTime(startsAt)}
        </p>
      </>
    );
  }

  return (
    <>
      <span className="text-sm text-gray-400 mr-2">
        from
      </span>
      <p className="flex">
        <span className="text-gray-400 mr-2">
          Date:
        </span>
        {startsAt.toDateString()}
      </p>

      <p className="flex">
        <span className="text-gray-400 mr-2">
          Time:
        </span>
        {getTime(startsAt)}
      </p>

      <span className="text-sm text-gray-400 mr-2">
        to
      </span>
      <p className="flex">
        <span className="text-gray-400 mr-2">
          Date:
        </span>
        {endsAt.toDateString()}
      </p>

      <p className="flex">
        <span className="text-gray-400 mr-2">
          Time:
        </span>
        {getTime(endsAt)}
      </p>
    </>
  );
}
