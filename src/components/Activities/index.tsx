import { type FunctionComponent } from "react";
import FavoriteButton from "../FavoriteButton";
import Link from "next/link";
import useActivities from "~/hooks/useActivities";
import Spinner from "../Spinner";
import { env } from "process";
import RegisterButton from "../RegisterButton";
import DotsLoader from "../DotsLoader";
const Activities: FunctionComponent = () => {
  const { activities, isLoading, error } = useActivities();

  if (error && env.NODE_ENV === "development") {
    console.error(error);
  }

  return (
    <section>
      <div className="flex flex-col items-center pb-10">
        <h2 className="p-4 text-white text-2xl font-bold">Activities</h2>
        <hr className="w-40 h-px border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />
      </div>
      <ul className="grid grid-stretch grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2 md:gap-8">
        {isLoading && <Spinner />}

        {error && <div className="text-white 2xl">There was an error.</div>}

        {activities.length === 0 && (
          <div className="text-white 2xl">There are no activities.</div>
        )}

        {activities.map(
          ({ id, slug, title, isRegistered }) => {
            return (
              <li
                key={slug}
                className="max-w-xs min-w-xs rounded-xl bg-white/10 p-4 text-white relative"
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

                  <div className="flex items-center text-[#cc66ff]">
                    <FavoriteButton
                      activityId={id}
                      className="mt-1"
                    />
                    <RegisterButton
                      activityId={id}
                      className="mt-1 group-hover:fill-white"
                    />
                  </div>

                  <footer className="absolute bottom-2.5 right-4 pr-0.5">
                    {isRegistered && (
                      <DotsLoader className="fill-[#33BBFF] h-3" />
                    )}
                  </footer>
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
