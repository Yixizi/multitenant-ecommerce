import Stripe from "stripe";

export type ProductMetadata = {
  stripeAccountId: string;
  id: string;
  name: string;
  price: number;
  currency: string;
};

export type CheckoutMetadata = {
  userId: string;
};

  export type expandLineItem = Stripe.LineItem & {
    price: Stripe.Price & {
      product: Stripe.Product & {
        metadata: ProductMetadata;
      };
    };
  };
