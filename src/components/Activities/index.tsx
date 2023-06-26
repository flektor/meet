import React, { type FunctionComponent } from "react";
import { useStore } from "../../utils/store";

export const Activities: FunctionComponent = () => {
  const store = useStore();

  if (store.activities.length === 0) {
    return "There are no activities.";
  }

  return (
    <section>
      <div className="flex flex-col items-center pb-10">
        <h2 className="p-4 text-white text-2xl font-bold">Activities</h2>
        <hr className="w-40 h-px border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />
      </div>
      <ul className="grid grid-stretch grid-cols-1 gap-4 md:grid-cols-3 sm:grid-cols-2 md:gap-8">
        {store.activities.map(({ title }) => {
          return (
            <li
              key={title}
              className="flex max-w-xs gap-4 rounded-xl bg-white/10 p-4 text-white"
            >
              <h2 className="text-3x1">{title}</h2>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
