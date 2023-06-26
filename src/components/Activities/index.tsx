import { type FunctionComponent, useState } from "react";
import { api } from "../../utils/api";
import LoginMessageDialog from "~/components/LoginMessageDialog";
import FavoriteButton from "../FavoriteButton";
import { useStore } from "~/utils/store";
import { useSession } from "next-auth/react";
import { Router } from "next/router";

export const Activities: FunctionComponent = () => {
  const store = useStore();
  const session = useSession();

  const { mutate: addToFavorites } = api.favorites.addToFavorites.useMutation();
  const { mutate: removeFromFavorites } = api.favorites.removeFromFavorites
    .useMutation();

  const [showLoginMessageDialog, setShowLoginMessageDialog] = useState(false);

  if (store.activities.length === 0) {
    return "There are no activities.";
  }

  function toggleFavorite(activityId: string) {
    if (session.status !== "authenticated") {
      setShowLoginMessageDialog(true);
      return;
    }

    const isFavorite = store.activities.some(({ id, isFavorite }) =>
      id === activityId && isFavorite
    );
    if (isFavorite) {
      store.removeFromFavorites(activityId);
      removeFromFavorites({ activityId });
      return;
    }

    addToFavorites({ activityId });
    store.addToFavorites(activityId);
  }

  return (
    <section>
      <div className="flex flex-col items-center pb-10">
        <h2 className="p-4 text-white text-2xl font-bold">Activities</h2>
        <hr className="w-40 h-px border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />
      </div>
      <ul className="grid grid-stretch grid-cols-1 gap-4 md:grid-cols-3 sm:grid-cols-2 md:gap-8">
        {store.activities.map(({ id, title, isFavorite, favoritesCount }) => {
          return (
            <li
              key={title}
              className="flex items-center justify-between max-w-xs gap-4 rounded-xl bg-white/10 p-4 text-white"
            >
              <h3 className="text-2xl">{title}</h3>

              <div className="flex items-center text-[#cc66ff]">
                <span className="pt-0.5 mr-2">
                  {favoritesCount > 0 && favoritesCount}
                </span>
                <FavoriteButton
                  id={id}
                  className="mt-1"
                  isChecked={isFavorite}
                  onClick={toggleFavorite}
                />
              </div>
            </li>
          );
        })}
      </ul>

      {showLoginMessageDialog && (
        <LoginMessageDialog
          onCancel={() => setShowLoginMessageDialog(false)}
        />
      )}
    </section>
  );
};
