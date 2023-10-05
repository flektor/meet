import React, { useState } from "react";

export default function TimePicker() {
  const date = new Date();
  const defaultTime = `${date.getHours()}:${date.getMinutes()}`;
  const [enableEndingTime, setEnableEndingTime] = useState(false);

  return (
    <div className="w-full flex flex-col justify-between items-center gap-2">
      <div className="w-full flex justify-between items-center">
        <label className="text-white text-lg whitespace-nowrap">
          Time
        </label>

        <div className="w-full flex gap-2 justify-end items-center">
          <label className="text-md">
            from
          </label>
          <input
            type="time"
            name="startingTime"
            defaultValue={defaultTime}
            required
            className="w-40 bg-gradient-to-b from-[#25213C] to-[#1b1b2e] p-2 rounded-lg"
          />
        </div>
      </div>

      <div className="w-full flex justify-end items-center gap-2 ">
        <span className="ml-3 text-sm font-medium text-gray-200">
          {enableEndingTime ? "On" : "Off"}
        </span>
        <label className="mr-5 relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="isEndingTimeEnabled"
            className="sr-only peer"
            onChange={() => setEnableEndingTime(!enableEndingTime)}
          />
          <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
        </label>

        <label className="text-md">
          to
        </label>

        <input
          disabled={!enableEndingTime}
          type="time"
          name="endingTime"
          required
          className="w-40 bg-gradient-to-b from-[#25213C] to-[#1b1b2e] p-2 rounded-lg"
        />
      </div>
    </div>
  );
}
