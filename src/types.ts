import { type inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import { type AppRouter } from "./server/api/root";

export type RouterOutput = inferRouterOutputs<AppRouter>;

export type getActivitiesOutput = RouterOutput["activities"]["getActivities"];
export type addActivityOutput = RouterOutput["activities"]["addActivity"];

export const createActivityInput = z.object({
  title: z.string().trim(),
  description: z.string(),
});

export const addActivityValidator = z.object({
  title: z.string(),
  description: z.string(),
});

export type AddActivityValidator = z.infer<typeof addActivityValidator>;

export type addToFavoritesOutput = RouterOutput["favorites"]["addToFavorites"];
export type removeFromFavoritesOutput =
  RouterOutput["favorites"]["removeFromFavorites"];
