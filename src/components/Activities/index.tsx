import { type FunctionComponent, useState } from "react";
import FavoriteButton from "../FavoriteButton";
import Link from "next/link";
import RegisterButton from "../RegisterButton";
import { useStore } from "~/utils/store";

const Activities: FunctionComponent = () => {
  // function getUserNameById(userId: string) {
  //   return activity?.channel.users.find((user) => user.userId === userId)
  //     ?.name || "user";
  // }

  const store = useStore();

  const [toasts, setToasts] = useState<
    { message: string; icon?: string }[]
  >([]);

  function onFoundUserForRegisteredActivity(activityId: string) {
    setToasts((
      prev,
    ) => [...prev, { message: `user invites to join ${activityId}` }]);
  }

  return (
    <section>
      {
        /* <div className="flex flex-col items-center pb-10">
        <h2 className="p-4 text-white text-2xl font-bold">Activities</h2>
        <hr className="w-40 h-px border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />
      </div> */
      }
      <ul className="mt-6 grid grid-stretch grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2">
        {store.activities.map(
          ({ id, slug, title, isRegistered }) => {
            return (
              <li
                key={slug}
                className="relative flex items center max-w-xs w-fit h-12 pb-1 rounded-xl bg-white/10 pl-3 pr-1.5 text-white"
              >
                <div className="flex items-center justify-between gap-4">
                  <Link
                    className={`text-2xl hover:underline ${
                      isRegistered ? "text-[#33BBFF]" : "text-white"
                    }`}
                    href={`/activities/${slug}`}
                  >
                    {title}
                  </Link>

                  <div className="flex items-center">
                    <FavoriteButton
                      activityId={id}
                      className="mt-1"
                    />
                    <RegisterButton
                      activityId={id}
                      activitySlug={slug}
                      className="mt-1"
                    />
                  </div>
                </div>
              </li>
            );
          },
        )}
      </ul>
    </section>
  );
};

export default Activities;
