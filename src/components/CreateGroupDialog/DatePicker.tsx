import React, { useState } from "react";

export default function DatePicker() {
  const date = new Date();
  const defaultDate = date.toJSON().slice(0, 10);
  date.setFullYear(date.getFullYear() + 1);
  const maxDate = date.toJSON().slice(0, 10);

  const [enableEndingDate, setEnableEndingDate] = useState(false);

  return (
    <div className="w-full flex flex-col justify-between items-center gap-2">
      <div className="w-full flex justify-between items-center">
        <label className="text-white text-lg whitespace-nowrap">
          Date
        </label>

        <div className="w-full flex gap-2 justify-end items-center">
          <label className="text-md">
            from
          </label>
          <input
            type="date"
            name="startingDate"
            pattern="\d{2}-\d{2}-\d{4}"
            defaultValue={defaultDate}
            min={defaultDate}
            max={maxDate}
            className="w-40 bg-gradient-to-b from-[#25213C] to-[#1b1b2e] p-2 rounded-lg"
          />
        </div>
      </div>

      <div className="w-full flex justify-end items-center gap-2">
        <span className="ml-3 text-sm font-medium text-gray-200">
          {enableEndingDate ? "On" : "Off"}
        </span>
        <label className="mr-5 relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="isEndingDatenabled"
            className="sr-only peer"
            onChange={() => setEnableEndingDate(!enableEndingDate)}
          />
          <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
        </label>

        <label className="text-md">
          to
        </label>
        <input
          disabled={!enableEndingDate}
          type="date"
          name="endingDate"
          pattern="\d{2}-\d{2}-\d{4}"
          defaultValue={""}
          min={defaultDate}
          max={maxDate}
          className="w-40 bg-gradient-to-b from-[#25213C] to-[#1b1b2e] p-2 rounded-lg"
        />
      </div>
    </div>
  );
}
