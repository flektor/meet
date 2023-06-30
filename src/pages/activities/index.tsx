import { type NextPage } from "next";
import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useStore } from "../../utils/store";
import { api } from "../../utils/api";
import Spinner from "../../components/Spinner";
import Nav from "../../components/Nav";
import Activities from "../../components/Activities";

const Activity: NextPage<{ isLoading: boolean }> = ({ isLoading }) => {
  const router = useRouter();
  const store = useStore();

  if (isLoading) {
    return <Spinner />;
  }

  if (!store.activities) {
    return "There are no available activities";
  }

  // if (activity) {
  //   if (store.activities.filter(({ id }) => id === activity.id)) {
  //     store.addActivity(activity);
  //   }
  // }
  // const slug = store.activities.filter(({ slug }) =>
  //   slug === router.query.activity
  // );

  return (
    <>
      <Head>
        <title>Meet</title>
        <meta name="description" content="Spiced Chicory Final Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Nav />

        <Activities />
      </main>
    </>
  );
};

export default Activity;
