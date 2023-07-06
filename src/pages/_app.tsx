import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { PusherProvider } from "~/utils/PusherProvider";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import "~/components/DotsLoader/index.css";
import "tw-elements/dist/css/tw-elements.min.css";
import "mapbox-gl/dist/mapbox-gl.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const userId = session?.user?.id || "";

  return (
    <SessionProvider session={session}>
      <PusherProvider>
        <Component {...pageProps} />
      </PusherProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
