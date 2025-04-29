"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { webSiteName } from "@/contants";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const SignInView = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const login = useMutation(
    trpc.auth.login.mutationOptions({
      onError: (error) => {
        toast.error(`创建失败 :${error.message}`);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        router.push("/");
      },
    }),
  );

  const form = useForm<z.infer<typeof loginSchema>>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "asd@gmail.com",
      password: "123456",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {

    login.mutate(values);
  };

  return (
    <div className=" grid grid-cols-1 lg:grid-cols-5">
      <div className=" bg-[#f4f4f0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" flex flex-col gap-8 p-4 lg:px-16"
          >
            <div className=" flex items-center justify-between mb-8">
              <Link href={"/"}>
                <span
                  className={cn("text-2xl font-semibold", poppins.className)}
                >
                  {webSiteName}
                </span>
              </Link>

              <Button
                asChild
                className="border-0 underline text-base "
                size={"sm"}
                variant={"ghost"}
              >
                <Link prefetch href={"/sign-up"}>
                  注册
                </Link>
              </Button>
            </div>

            <h1 className=" text-4xl font-medium">欢迎来到 {webSiteName}</h1>

            <FormField
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className=" text-base">邮箱</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className=" text-base">密码</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button
              disabled={login.isPending}
              type="submit"
              size={"lg"}
              variant={"elevated"}
              className=" bg-black text-white hover:bg-pink-400 hover:text-primary"
            >
              登录账户
            </Button>
          </form>
        </Form>
      </div>
      <div
        className="  h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: 'url("/auth-bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};

export default SignInView;
