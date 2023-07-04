import Link from "next/link";
import { useStore } from "~/utils/store";

// export type GroupProps = {
//   viewersCount: number;
//   id: string;
//   title: string;
//   activityId: string;
//   isMember: boolean;
//   slug: string;
//   activitySlug: string;
// };

const Groups = ({ activityId }: { activityId: string }) => {
  // const Groups = ({ groups }: { groups: GroupProps[] }) => {
  // if (groups.length === 0) return null;

  const store = useStore();

  const activity = store.groups.find(({ activityId: id }) => id === activityId);

  if (!activity) {
    return;
  }

  const groups = store.groups.filter(({ activityId: id }) => id === activityId)
    .map((group) => ({
      title: group.title,
      slug: group.slug,
      isMember: false,
      activitySlug: activity.slug,
    }));

  return (
    <section>
      <div className="flex flex-col items-center pb-10">
        <h2 className="p-4 text-white text-2xl font-bold">Activities</h2>
        <hr className="w-40 h-px border-0 bg-gradient-to-r from-#0000000 via-[#cc66ff] to-#0000000" />
      </div>
      <ul className="grid grid-stretch grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2 md:gap-8">
        {groups.map(
          ({ slug, activitySlug, title, isMember }) => {
            return (
              <li
                key={slug}
                className="max-w-xs min-w-xs rounded-xl bg-white/10 p-4 text-white relative"
              >
                <div className="flex items-center justify-between gap-4">
                  <Link
                    className={`text-2xl hover:underline ${
                      isMember ? "text-[#cc66ff]" : "text-white"
                    }`}
                    href={`/activities/${activitySlug}/${slug}`}
                  >
                    {title}
                  </Link>

                  {
                    /* <div className="flex items-center">
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
                  </footer> */
                  }
                </div>
              </li>
            );
          },
        )}
      </ul>
    </section>
  );
};

export default Groups;
