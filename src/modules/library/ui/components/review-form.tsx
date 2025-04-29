import StarPicker from "@/components/star-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ReviewsGetOneOutput } from "@/modules/reviews/types";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ReviewFormProps {
  productId: string;
  initialData?: ReviewsGetOneOutput;
}

const formSchema = z.object({
  rating: z.number().min(1, { message: "星级是必须的" }).max(5),
  description: z.string().min(1, { message: "描述是必须的" }),
});

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, initialData }) => {
  const [isPreview, setIsPreview] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createReview = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryFilter({
            productId,
          }),
        );
        setIsPreview(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
  const updateReview = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryFilter({
            productId,
          }),
        );
        setIsPreview(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData?.rating ?? 0,
      description: initialData?.description ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {

    if (initialData) {
      updateReview.mutate({
        reviewId: initialData.id,
        rating: values.rating,
        description: values.description,
      });
    } else {
      createReview.mutate({
        productId,
        rating: values.rating,
        description: values.description,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col gap-y-4"
      >
        <p className=" font-medium">
          {isPreview ? "您的评分星级:" : "喜欢它?给它星星"}
        </p>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="请留下你的回复"
                  disabled={isPreview}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StarPicker
                  value={field.value}
                  onChange={field.onChange}
                  disable={isPreview}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isPreview && (
          <Button
            variant={"elevated"}
            type="submit"
            size={"lg"}
            disabled={createReview.isPending || updateReview.isPending}
            className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
          >
            {isPreview ? "更新回复" : "添加回复"}
          </Button>
        )}
      </form>
      {isPreview && (
        <Button
          onClick={() => setIsPreview(false)}
          size={"lg"}
          variant={"elevated"}
          className="w-fit mt-4"
        >
          退出
        </Button>
      )}
    </Form>
  );
};

export default ReviewForm;

export const ReviewFormSkeleton = () => {
  return (
    <form className=" flex flex-col gap-y-4">
      <p className=" font-medium">喜欢它?给它星星</p>

      <Textarea placeholder="请留下你的回复" disabled />

      <StarPicker disable />

      <Button
        variant={"elevated"}
        type="button"
        size={"lg"}
        disabled
        className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
      >
        添加回复
      </Button>
    </form>
  );
};
