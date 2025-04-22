import { DEFAULT_LIMIT } from "@/contants";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { z } from "zod";

export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "tags",
        limit: input.limit,
        page: input.cursor,
      });

      return data;
    }),
});
