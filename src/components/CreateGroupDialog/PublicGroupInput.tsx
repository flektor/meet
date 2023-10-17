import { useState } from "react";

export default function PublicGroupInput() {
  const [isPublic, setIsPublic] = useState(true);

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex justify-between items-center gap-4">
        <label
          htmlFor="description"
          className={`${isPublic ? "text-white" : "text-gray-400"} text-xl`}
        >
          Public
        </label>

        <label className="mr-5 relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            className="sr-only peer"
            name="isPublic"
            onChange={() => setIsPublic(!isPublic)}
          />
          <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#cc66ff]" />
        </label>
      </div>

      <span className="w-full text-end text-sm ml-1">
        {isPublic ? "Everyone can join." : "Others can join upon approval."}
      </span>
    </div>
  );
}
