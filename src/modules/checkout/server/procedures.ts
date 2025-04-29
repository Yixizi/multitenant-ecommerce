import { Media, Tenant } from "@/payload-types";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";

import { z } from "zod";
import { CheckoutMetadata, ProductMetadata } from "../types";
import { stripe } from "@/lib/stripe";
import { generateTenantURL } from "@/lib/utils";

export const checkoutRouter = createTRPCRouter({
  verify: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.findByID({
      collection: "users",
      id: ctx.session.user.id,
      depth: 0, //id
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "未找到用户" });
    }

    const tenantId = user.tenants?.[0]?.tenant as string;

    const tenant = await ctx.db.findByID({
      collection: "tenants",
      id: tenantId,
    });

    if (!tenant) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "租户未找到",
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: tenant.stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
      type: "account_onboarding",
    });

    if (!accountLink.url) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "创建验证链接失败",
      });
    }
    return { url: accountLink.url };
  }),
  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
        tenantSlug: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.db.find({
        collection: "products",
        depth: 2,
        where: {
          and: [
            {
              id: {
                in: input.productIds,
              },
            },
            {
              "tenant.slug": {
                equals: input.tenantSlug,
              },
            },
            {
              isArchived: {
                not_equals: true,
              },
            },
          ],
        },
      });

      if (products.totalDocs !== input.productIds.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "有产品未找到" });
      }
      const tenantsData = await ctx.db.find({
        collection: "tenants",
        limit: 1,
        pagination: false,
        where: {
          slug: {
            equals: input.tenantSlug,
          },
        },
      });

      const tenant = tenantsData.docs[0];
      if (!tenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "租户未找到",
        });
      }

      if (!tenant.stripeDetailsSubmitted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "租户未被允许售卖产品",
        });
      }
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products.docs.map((product) => {
          return {
            quantity: 1,
            price_data: {
              unit_amount: product.price * 100,
              currency: "cny",
              product_data: {
                name: product.name,
                metadata: {
                  stripeAccountId: tenant.stripeAccountId,
                  id: product.id,
                  name: product.name,
                  price: product.price,
                } as ProductMetadata,
              },
            },
          };
        });

      const totalAmount = products.docs.reduce(
        (acc, item) => acc + item.price * 100,
        0,
      );

      const platformFeePercent = Math.trunc(totalAmount / 100);

      const domain = generateTenantURL(input.tenantSlug);

      // if (process.env.NODE_ENV === "development") {
      //   domain = `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}`;
      // } else {
      //   domain = `${input.tenantSlug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
      // }

      const checkout = await stripe.checkout.sessions.create(
        {
          customer_email: ctx.session.user.email,
          success_url: `${domain}/checkout?success=true`,
          cancel_url: `${domain}/checkout?cancel=false `,
          mode: "payment",
          payment_method_types: ["card"],
          line_items: lineItems,
          invoice_creation: {
            enabled: true,
          },
          metadata: {
            userId: ctx.session.user.id,
          } as CheckoutMetadata,
          payment_intent_data: {
            application_fee_amount: platformFeePercent,
          },
        },
        {
          stripeAccount: tenant.stripeAccountId,
        },
      );

      if (!checkout.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "创建付款失败",
        });
      }

      return { url: checkout.url };
    }),
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "products",
        depth: 2,
        where: {
          and: [
            {
              id: {
                in: input.ids,
              },
            },
            {
              isArchived: {
                not_equals: true,
              },
            },
          ],
        },
      });

      if (data.totalDocs !== input.ids.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "产品未找到" });
      }

      const totalPrice = data.docs.reduce((acc, product) => {
        const price = Number(product.price);

        return acc + (isNaN(price) ? 0 : price);
      }, 0);

      return {
        ...data,
        totalPrice: totalPrice,
        docs: data.docs.map((item) => ({
          ...item,
          image: item.image as Media | null,
          tenant: item.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
