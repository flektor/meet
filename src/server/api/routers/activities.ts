import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { addActivityValidator } from "~/types";

export const activitiesRouter = createTRPCRouter({
  getActivities: protectedProcedure
    .query(({ ctx }) => ctx.prisma.activity.findMany({})),

  addActivity: protectedProcedure
    .input(addActivityValidator)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.activity.create({ data: input });
    }),
});
