import { type inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import { type AppRouter } from "./server/api/root";

export type RouterOutput = inferRouterOutputs<AppRouter>;

export type getActivitiesOutput = RouterOutput["activities"]["getActivities"];
export type addActivityOutput = RouterOutput["activities"]["addActivity"];
export type getActivityOutput = RouterOutput["activities"]["getActivity"];

export const addActivityInput = z.object({
  title: z.string().trim(),
  description: z.string(),
});

export type AddActivityValidator = z.infer<typeof addActivityInput>;

export type addToFavoritesOutput = RouterOutput["favorites"]["addToFavorites"];
export type removeFromFavoritesOutput =
  RouterOutput["favorites"]["removeFromFavorites"];

export type addToRegistrationsOutput = RouterOutput["registrations"]["add"];
export type removeFromRegistratiosOutput =
  RouterOutput["registrations"]["remove"];
