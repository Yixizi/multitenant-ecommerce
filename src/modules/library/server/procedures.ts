import { Media, Tenant } from "@/payload-types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { z } from "zod";

import { DEFAULT_LIMIT } from "@/contants";
import { TRPCError } from "@trpc/server";

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.db.find({
        collection: "orders",
        pagination: false,
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });

      // console.log(JSON.stringify(data, null, 2));
      const order = ordersData.docs[0];

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "订单未找到",
        });
      }

      const product = await ctx.db.findByID({
        collection: "products",

        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "产品未找到",
        });
      }

      return product;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      }),
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.db.find({
        collection: "orders",
        depth: 0,
        page: input.cursor,
        limit: input.limit,
        where: {
          user: {
            equals: ctx.session.user.id,
          },
        },
      });

      // console.log(JSON.stringify(data, null, 2));
      const productIds = ordersData.docs.map((order) => order.product);

      const productsData = await ctx.db.find({
        collection: "products",
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const dataWithSummariedReviews = await Promise.all(
        productsData.docs.map(async (doc) => {
          const reviewsData = await ctx.db.find({
            collection: "reviews",
            pagination: false,
            where: {
              product: {
                equals: doc.id,
              },
            },
          });

          return {
            ...doc,
            reviewCount: reviewsData.totalDocs,
            reviewRating:
              reviewsData.docs.length === 0
                ? 0
                : Number(
                    Intl.NumberFormat("zh-CH", {
                      maximumFractionDigits: 1,
                      minimumFractionDigits: 1,
                    }).format(
                      reviewsData.docs.reduce(
                        (acc, review) => acc + review.rating,
                        0,
                      ) / reviewsData.totalDocs,
                    ),
                  ),
          };
        }),
      );

      return {
        ...productsData,
        docs: dataWithSummariedReviews.map((item) => ({
          ...item,
          image: item.image as Media | null,
          tenant: item.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
