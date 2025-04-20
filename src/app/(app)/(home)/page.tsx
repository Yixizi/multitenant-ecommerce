"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auth.session.queryOptions());
  return <div className=" break-all">{JSON.stringify(data?.user)}</div>;
};

export default Home;
