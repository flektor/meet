import { type FunctionComponent, useState } from "react";
import FavoriteButton from "../FavoriteButton";
import Toast from "../InvitationToast";
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

  // function getUserNameById(userId: string) {
  //   return activity?.channel.users.find((user) => user.userId === userId)
  //     ?.name || "user";
  // }

  const [toasts, setToasts] = useState<
    { message: string; icon?: string }[]
  >(
    [],
  );

  function onFoundUserForRegisteredActivity(activityId: string) {
    setToasts((
      prev,
    ) => [...prev, { message: `user invites to join ${activityId}` }]);
  }

  function removeToast(index: number) {
    setToasts((prev) => [...(prev.filter((t, i) => i !== index))]);
  }

  function onAcceptInvitation(index: number) {
    removeToast(index);
  }

  function onDeclineInvitation(index: number) {
    removeToast(index);
  }

  return (
    <section>
      <ul className="fixed top-20 right-3 z-20 flex flex-col gap-2">
        {toasts.map(({ message }, index) => (
          <li key={index}>
            <Toast
              message={message}
              onAccept={() => onAcceptInvitation(index)}
              onDecline={() => onDeclineInvitation(index)}
              onDie={() => removeToast(index)}
            />
          </li>
        ))}
      </ul>
      {
        /* <div className="flex flex-col items-center pb-10">
        <h2 className="p-4 text-white text-2xl font-bold">Activities</h2>
        <hr className="w-40 h-px border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />
      </div> */
      }
      <ul className="mt-16 grid grid-stretch grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2 md:gap-8">
        {isLoading
          ? (
            <div className="mt-48">
              <Spinner />
            </div>
          )
          : error
          ? <div className="text-white 2xl mt-48">There was an error.</div>
          : activities.length === 0 && (
            <div className="text-white 2xl mt-48">There are no activities.</div>
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

                  <div className="flex items-center">
                    <FavoriteButton
                      activityId={id}
                      className="mt-1"
                    />
                    <RegisterButton
                      activityId={id}
                      className="mt-1"
                      onPusherMessage={onFoundUserForRegisteredActivity}
                    />
                  </div>

                  <footer className="absolute bottom-2.5 right-4 pr-0.5 z-0">
                    {isRegistered && (
                      <DotsLoader className="fill-[#33BBFF] max-h-3" />
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
