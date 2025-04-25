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
