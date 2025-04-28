import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .min(6, "邮箱字符数必须不小于6")
    .email({ message: "请输入正确邮箱" }),
  password: z.string().min(6, "用户名字符数必须不小于6"),
  username: z
    .string()
    .min(3, "用户名字符数必须大于3")
    .max(63, "用户名字符数必须小于63")
    .regex(/^(?!-).*(?<!-)$/, "不能以-为开头或者结尾")
    .regex(
      /^[a-zA-Z0-9-]+$/, // 确保只有字母、数字、点、短横线
      "只能包含字母、数字和短横线",
    )
    .refine((val) => !val.includes("--"), "用户名不能包含连续的--"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(6, "邮箱字符数必须不小于6")
    .email({ message: "请输入正确邮箱" }),
  password: z.string().min(6, "用户名字符数必须不小于6"),
});
