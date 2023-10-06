import { useState } from "react";

export default function PublicGroupInput() {
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex justify-between items-center gap-4">
        <label
          htmlFor="description"
          className={`${isPrivate ? "text-gray-400" : "text-white"} text-xl`}
        >
          Public
        </label>

        <label className="mr-5 relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={!isPrivate}
            className="sr-only peer"
            name="isPrivate"
            onChange={() => setIsPrivate(!isPrivate)}
          />
          <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#cc66ff]" />
        </label>
      </div>

      <span className="w-full text-end text-sm ml-1">
        {isPrivate ? "Others can join upon approval." : "Everyone can join."}
      </span>
    </div>
  );
}
