import { type NextPage } from "next";
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import LeaveIcon from "~/components/icons/Leave";
import FavoriteButton from "~/components/FavoriteButton";
import useActivity from "~/hooks/useActivity";
import Nav from "~/components/Nav";
import RegisterButton from "~/components/RegisterButton";
const Activity: NextPage = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const { activity, error, isLoading } = useActivity(slug);

  return (
    <>
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Nav />

        {isLoading && <Spinner />}

        {error && <div className="text-white 2xl">There was an error.</div>}

        {activity && (
          <div className="flex flex-col items-center justify-center pt-32">
            <header className="w-full flex items-center justify-center">
              <button
                className="inline-block"
                onClick={() => router.back()}
              >
                <LeaveIcon />
              </button>
              <span className=" mr-2 ml-2 text-white text-3xl">
                {activity.title}
              </span>

              <FavoriteButton
                activityId={activity.id}
                className="mt-1"
              />
            </header>

            <RegisterButton
              activityId={activity.id}
              showText={true}
              className="m-5"
            />

            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
              <div className="text-white/50">
                Description:
                <p className="text-white text-2xl">{activity.description}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Activity;
