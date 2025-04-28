import { Button, Link } from "@payloadcms/ui";
export const StripeVerify = () => {
  return (
    <Link href={"/stripe-verify"}>
      <Button>验证账户</Button>
    </Link>
  );
};
