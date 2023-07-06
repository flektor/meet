import React, { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Spinner from "~/components/Spinner";
import Nav from "~/components/Nav";
import LeaveIcon from "~/components/icons/Leave";
import useActivities from "~/hooks/useActivities";
import RegisterButton from "~/components/RegisterButton";
import FavoriteButton from "~/components/FavoriteButton";
import Toast from "~/components/InvitationToast";
import Link from "next/link";
import DotsLoader from "~/components/DotsLoader";
import { useRouter } from "next/router";

const Favorites: NextPage = () => {
  const { data: session } = useSession();
  const { activities, isLoading, error } = useActivities();
  const favorites = activities.filter((activity) => activity.isFavorite);
  const router = useRouter();
  const [showLoginMessageDialog, setShowLoginMessageDialog] = useState(false);

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
    <>
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Nav />

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
        <header className="w-full flex items-center justify-center mb-6 p-1">
          <div className="mt-32 flex items-center">
            <button
              className=" inline-block"
              onClick={() => router.back()}
            >
              <LeaveIcon />
            </button>
            <span className=" mr-2 ml-2 text-white text-3xl">
              Favorites
            </span>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center">
          {isLoading
            ? (
              <div className="mt-48">
                <Spinner />
              </div>
            )
            : error
            ? <div className="text-white 2xl mt-48">There was an error.</div>
            : favorites.length === 0 && (
              <div className="text-white 2xl mt-48">
                Your favorites are empty..
              </div>
            )}
          <ul className="mt-32 grid grid-stretch grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2 md:gap-8">
            {favorites.map(
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
        </div>
      </main>
    </>
  );
};
export default Favorites;