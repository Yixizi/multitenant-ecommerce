"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
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

const SignUpView = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const register = useMutation(
    trpc.auth.register.mutationOptions({
      onError: (error) => {
        toast.error(`创建失败 :${error.message}`);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        router.push("/");
      },
    }),
  );

  const form = useForm<z.infer<typeof registerSchema>>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "asd@gmail.com",
      password: "123456",
      username: "demo",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {

    register.mutate(values);
  };

  const username = form.watch("username");
  const usernameErrors = form.formState.errors.username;
  const showPreview = username && !usernameErrors;
  return (
    <div className=" grid grid-cols-1 lg:grid-cols-5">
      <div className=" bg-[#f4f4f0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" flex flex-col gap-8 p-4 lg:px-16"
          >
            <div className=" flex items-center justify-between mb-8">
              <Link  href={"/"}>
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
                <Link  href={"/sign-in"}>
                  登录
                </Link>
              </Button>
            </div>

            <h1 className=" text-4xl font-medium">欢迎来到 {webSiteName}</h1>

            <FormField
              name="username"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className=" text-base">用户名</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription
                      className={cn("hidden", showPreview && "block")}
                    >
                      你的商品将在{username}.shop.yixizi.cn
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

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
              disabled={register.isPending}
              type="submit"
              size={"lg"}
              variant={"elevated"}
              className=" bg-black text-white hover:bg-pink-400 hover:text-primary"
            >
              创建账户
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

export default SignUpView;
