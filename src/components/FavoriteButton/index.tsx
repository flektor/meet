import React from "react";
import Svg from "../Svg";
import { useStore } from "~/utils/store";
import { useSession } from "next-auth/react";
import { api } from "../../utils/api";

export type FavoriteButtonProps = {
  activityId: string;
  className?: string;
};

const FavoriteButton = (
  { activityId, className = "" }: FavoriteButtonProps,
) => {
  const store = useStore();
  const session = useSession();

  const { mutate: addToFavorites } = api.favorites.addToFavorites.useMutation();
  const { mutate: removeFromFavorites } = api.favorites.removeFromFavorites
    .useMutation();

  const activityOverview = store.activities.find(({ id }) => id === activityId);
  const isFavorite = activityOverview?.isFavorite ?? false;
  const favoritesCount = activityOverview?.favoritesCount ?? 0;

  function toggleFavorite() {
    if (session.status !== "authenticated") {
      store.setShowLoginMessageDialog(true);
      return;
    }

    if (isFavorite) {
      store.removeFromFavorites(activityId);
      removeFromFavorites({ activityId });
      return;
    }

    addToFavorites({ activityId });
    store.addToFavorites(activityId);
  }

  const style = isFavorite
    ? "fill-[#cc66ff] stroke-[#cc66ff] hover:fill-white hover:stroke-white"
    : "fill-[#0000000] stroke-[#cc66ff] hover:fill-white/10 hover:stroke-white";

  return (
    <>
      <span className="min-w-[.6em] pt-1 mr-2 ml-2 text-[#cc66ff]">
        {favoritesCount > 0 && favoritesCount}
      </span>
      <Svg
        className={`select-none cursor-pointer transition ${className} ${style}`}
        onClick={() => {
          toggleFavorite();
        }}
      >
        <path d="M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.743 9.0466 20.0978 6.92607L19.7885 6.52734C17.8203 3.99058 13.8696 4.41601 12.4867 7.31365C12.2913 7.72296 11.7087 7.72296 11.5133 7.31365C10.1304 4.41601 6.17972 3.99058 4.21154 6.52735L3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z" />
      </Svg>
    </>
  );
};

export default FavoriteButton;
