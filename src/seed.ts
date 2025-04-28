import { getPayload } from "payload";
import config from "@payload-config";
import { stripe } from "./lib/stripe";

const categories = [
  {
    name: "全部",
    slug: "all",
  },
  {
    name: "商业与理财",
    color: "#FFB347",
    slug: "business-money",
    subcategories: [
      { name: "会计", slug: "accounting" },
      { name: "创业", slug: "entrepreneurship" },
      { name: "兼职与副业", slug: "gigs-side-projects" },
      { name: "投资", slug: "investing" },
      { name: "管理与领导", slug: "management-leadership" },
      { name: "市场营销", slug: "marketing-sales" },
      { name: "人脉、职业与工作", slug: "networking-careers-jobs" },
      { name: "个人理财", slug: "personal-finance" },
      { name: "房地产", slug: "real-estate" },
    ],
  },
  {
    name: "软件开发",
    color: "#7EC8E3",
    slug: "software-development",
    subcategories: [
      { name: "Web 开发", slug: "web-development" },
      { name: "移动开发", slug: "mobile-development" },
      { name: "游戏开发", slug: "game-development" },
      { name: "编程语言", slug: "programming-languages" },
      { name: "运维 (DevOps)", slug: "devops" },
    ],
  },
  {
    name: "写作与出版",
    color: "#D8B5FF",
    slug: "writing-publishing",
    subcategories: [
      { name: "小说", slug: "fiction" },
      { name: "非小说", slug: "non-fiction" },
      { name: "博客", slug: "blogging" },
      { name: "文案写作", slug: "copywriting" },
      { name: "自助出版", slug: "self-publishing" },
    ],
  },
  {
    name: "其他",
    slug: "other",
  },
  {
    name: "教育",
    color: "#FFE066",
    slug: "education",
    subcategories: [
      { name: "在线课程", slug: "online-courses" },
      { name: "辅导", slug: "tutoring" },
      { name: "考试准备", slug: "test-preparation" },
      { name: "语言学习", slug: "language-learning" },
    ],
  },
  {
    name: "自我提升",
    color: "#96E6B3",
    slug: "self-improvement",
    subcategories: [
      { name: "效率提升", slug: "productivity" },
      { name: "个人发展", slug: "personal-development" },
      { name: "正念", slug: "mindfulness" },
      { name: "职业成长", slug: "career-growth" },
    ],
  },
  {
    name: "健身与健康",
    color: "#FF9AA2",
    slug: "fitness-health",
    subcategories: [
      { name: "锻炼计划", slug: "workout-plans" },
      { name: "营养", slug: "nutrition" },
      { name: "心理健康", slug: "mental-health" },
      { name: "瑜伽", slug: "yoga" },
    ],
  },
  {
    name: "设计",
    color: "#B5B9FF",
    slug: "design",
    subcategories: [
      { name: "用户界面/用户体验", slug: "ui-ux" },
      { name: "图形设计", slug: "graphic-design" },
      { name: "3D 建模", slug: "3d-modeling" },
      { name: "排版", slug: "typography" },
    ],
  },
  {
    name: "绘画与素描",
    color: "#FFCAB0",
    slug: "drawing-painting",
    subcategories: [
      { name: "水彩", slug: "watercolor" },
      { name: "丙烯", slug: "acrylic" },
      { name: "油画", slug: "oil" },
      { name: "粉彩", slug: "pastel" },
      { name: "炭笔", slug: "charcoal" },
    ],
  },
  {
    name: "音乐",
    color: "#FFD700",
    slug: "music",
    subcategories: [
      { name: "歌曲创作", slug: "songwriting" },
      { name: "音乐制作", slug: "music-production" },
      { name: "音乐理论", slug: "music-theory" },
      { name: "音乐史", slug: "music-history" },
    ],
  },
  {
    name: "摄影",
    color: "#FF6B6B",
    slug: "photography",
    subcategories: [
      { name: "人像", slug: "portrait" },
      { name: "风景", slug: "landscape" },
      { name: "街头摄影", slug: "street-photography" },
      { name: "自然摄影", slug: "nature" },
      { name: "微距", slug: "macro" },
    ],
  },
];

const seed = async () => {
  const payload = await getPayload({
    config,
  });

  const adminAccount = await stripe.accounts.create({});

  const adminTenant = await payload.create({
    collection: "tenants",
    data: {
      name: "admin",
      slug: "admin",
      stripeAccountId: adminAccount.id,
    },
  });

  await payload.create({
    collection: "users",
    data: {
      email: "admin@demo.com",
      password: "admin@demo.com",
      roles: ["super-admin"],
      username: "admin",
      tenants: [
        {
          tenant: adminTenant.id,
        },
      ],
    },
  });

  for (const category of categories) {
    const parentCategory = await payload.create({
      collection: "categories",
      data: {
        name: category.name,
        slug: category.slug,
        color: category.color,
        parent: null,
      },
    });

    for (const subcategory of category.subcategories || []) {
      await payload.create({
        collection: "categories",
        data: {
          name: subcategory.name,
          slug: subcategory.slug,

          parent: parentCategory.id,
        },
      });
    }
  }
};

try {
  await seed();
  console.log("Seeding completed successfully");
  process.exit(0);
} catch (error) {
  console.log("Error during seeding :", error);
  process.exit(1);
}
