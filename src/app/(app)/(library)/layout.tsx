import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await caller.auth.session();

  if (!session.user) {
    redirect("/sign-in");
  }
  return <div> {children}</div>;
}
