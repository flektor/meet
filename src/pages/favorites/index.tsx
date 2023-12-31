import React, { useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Spinner from "~/components/Spinner";
import FavoritesPageNav from "../../components/Nav/FavoritesPageNav";
import RegisterButton from "~/components/RegisterButton";
import FavoriteButton from "~/components/FavoriteButton";
import Link from "next/link";
import Toasts from "~/components/Toasts";
import { useStore } from "~/utils/store";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Favorites: NextPage = () => {
  const store = useStore();
  const favorites = store.activities.filter((activity) => activity.isFavorite);
  const session = useSession();
  const router = useRouter();

  const { data, error, isLoading } = api.activities.getActivities
    .useQuery(undefined, {
      enabled: !!session.data && store.fetchedActivitiesTimestamp === false,
    });

  useEffect(() => {
    if (data && store.fetchedActivitiesTimestamp === false) {
      store.setActivities(data);
    }
  }, [data]);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FavoritesPageNav session={session} />
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Toasts />

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

          <ul className="mt-32 grid grid-stretch grid-cols-1 gap-3 lg:grid-cols-3 sm:grid-cols-2 md:gap-4">
            {favorites.map(
              ({ id, slug, title, isRegistered }) => {
                return (
                  <li
                    key={slug}
                    className="relative flex items center w-full max-w-xs w-fit h-12 pb-1 rounded-xl bg-white/10 pl-3 pr-1.5 text-white"
                  >
                    <div className="w-full flex items-center justify-between ">
                      <Link
                        className={`text-2xl hover:underline ${
                          isRegistered ? "text-[#33BBFF]" : "text-white"
                        }`}
                        href={`/activities/${slug}`}
                      >
                        {title}
                      </Link>

                      <div className="flex justify-end  items-center">
                        <FavoriteButton
                          activityId={id}
                          className="mt-1"
                        />
                        <RegisterButton
                          activityId={id}
                          className="mt-1"
                          activitySlug={slug}
                        />
                      </div>
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
