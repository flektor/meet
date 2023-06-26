import { activitiesRouter } from "~/server/api/routers/activities";
import { favoritesRouter } from "~/server/api/routers/favorites";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  activities: activitiesRouter,
  favorites: favoritesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
