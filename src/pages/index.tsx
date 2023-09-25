import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import Activities from "~/components/Activities";
import Nav from "~/components/Nav";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";
import { useStore } from "~/utils/store";

const Home: NextPage = () => {
  const store = useStore();
  const { data, error, isLoading } = api.activities.getActivities.useQuery();

  useEffect(() => {
    if (data) {
      console.log(data);
      store.setActivities(data);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="mt-10 container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Nav />
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            {"Let's"} <span className="text-[#cc66ff]">meet</span> outside
          </h1>

          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
          {isLoading
            ? (
              <div className="mt-48">
                <Spinner />
              </div>
            )
            : error
            ? <div className="text-white 2xl mt-48">There was an error.</div>
            : data.length === 0 && (
              <div className="text-white 2xl mt-48">
                Be the first to create an activity!
              </div>
            )}

          <Activities />
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {session && <span>Logged in as {session.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={session ? () => void signOut() : () => void signIn()}
      >
        {session ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
