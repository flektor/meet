import { activitiesRouter } from "~/server/api/routers/activities";
import { favoritesRouter } from "~/server/api/routers/favorites";
import { createTRPCRouter } from "~/server/api/trpc";
import { registrationsRouter } from "~/server/api/routers/registrations";
import { chatRouter } from "./routers/chat";
import { activityViewerRouter } from "./routers/activityViewer";
import { groupViewerRouter } from "./routers/groupViewer";
import { groupsRouter } from "./routers/groups";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  activities: activitiesRouter,
  favorites: favoritesRouter,
  registrations: registrationsRouter,
  chat: chatRouter,
  activityViewer: activityViewerRouter,
  groupViewer: groupViewerRouter,
  groups: groupsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
