import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Sort, Where } from "payload";
import { z } from "zod";
import { sortValues } from "../search-params";
import { DEFAULT_LIMIT } from "@/contants";
import { headers as getHeaders } from "next/headers";
import { TRPCError } from "@trpc/server";

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();

      const session = await ctx.db.auth({ headers });

      const product = await ctx.db.findByID({
        collection: "products",
        id: input.id,
        depth: 2,
        select: {
          content: false,
        },
      });

      if (product.isArchived) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "产品未找到",
        });
      }

      let isPurchased = false;
      if (session.user) {
        const orderData = await ctx.db.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                product: {
                  equals: input.id,
                },
              },
              {
                user: {
                  equals: session.user,
                },
              },
            ],
          },
        });

        isPurchased = !!orderData.docs[0];
      }

      const reviews = await ctx.db.find({
        collection: "reviews",
        pagination: false,
        where: {
          product: {
            equals: input.id,
          },
        },
      });



      const reviewRating =
        reviews.docs.length > 0
          ? Number(
              Intl.NumberFormat("zh-CN", {
                maximumFractionDigits: 1,
                minimumFractionDigits: 1,
                useGrouping: false,
              }).format(
                reviews.docs.reduce((acc, review) => acc + review.rating, 0) /
                  reviews.totalDocs,
              ),
            )
          : 0;

      const ratingDistribution: Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      if (reviews.totalDocs > 0) {
        reviews.docs.forEach((review) => {
          const rating = review.rating;

          if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
          }
        });

        Object.keys(ratingDistribution).forEach((key) => {
          const rating = Number(key);
          const count = ratingDistribution[rating] || 0;

          ratingDistribution[rating] = Number(
            Intl.NumberFormat("zh-CN", {
              maximumFractionDigits: 1,
              useGrouping: false,
              minimumFractionDigits: 1,
            }).format((count / reviews.totalDocs) * 100),
          );
        });

      }

 
      return {
        ...product,
        isPurchased,
        image: product.image as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
        reviewRating,
        reviewCount: reviews.totalDocs,
        ratingDistribution,
      };
    }),
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        categorySlug: z.string().nullish(),
        minPrice: z.string().nullish(),
        maxPrice: z.string().nullish(),
        tags: z.array(z.string()).nullish(),
        sort: z.enum(sortValues).nullable().optional(),
        tenantSlug: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {
        isArchived: {
          not_equals: true,
        },
      };


      let sort: Sort = "-createdAt";

      if (input.sort === "curated") {
        sort = "-createdAt";
      }
      if (input.sort === "hot_and_new") {
        sort = "createdAt";
      }
      if (input.sort === "trending") {
        sort = "-createdAt";
      }


      if (input.minPrice && input.maxPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
        };
      }

      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
        };
      } else {
        //仅展示在个人商店
        where["isPrivate"] = { not_equals: true };
      }

      if (input.categorySlug) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.categorySlug,
            },
          },
        });



        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category),
          })),
        }));

        const subcategories = [];

        const parentCategory = formattedData[0];

        if (parentCategory) {
          subcategories.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug,
            ),
          );

          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategories],
          };
        }
      }

      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 2,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
        select: {
          content: false,
        },
      });
   

      const dataWithSummariedReviews = await Promise.all(
        data.docs.map(async (doc) => {
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
                    Intl.NumberFormat("zh-CN", {
                      maximumFractionDigits: 1,
                      useGrouping: false,
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
        ...data,
        docs: dataWithSummariedReviews.map((item) => ({
          ...item,
          image: item.image as Media | null,
          tenant: item.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
