// import { getPayload } from "payload";
// import config from "@payload-config";

// const seed = async () => {
//   const payload = await getPayload({ config });

//   //   // —— 一、Seed Tags —— （如果 tags 也开启多租户，同样需要带 tenant）
//   //   const tagNames = ["热门", "新品", "促销", "限量"];
//   //   for (const name of tagNames) {
//   //     await payload.create({
//   //       collection: "tags",
//   //       data: {
//   //         name,
//   //         products: [],
//   //         tenant: adminTenant.id,   // ← 若 tags 集合也启用了多租户，需加这行
//   //       },
//   //     });
//   //   }

//   // —— 二、Seed Products ——（必须带 tenant）
// //   const aaa = await payload.find({
// //     collection: "categories",
// //     depth: 2,
// //   });

// //   console.log(aaa.docs.map(i=>i.subcategories.docs));
//   //   const products = [
//   //     { name: "示例 A", description: "简介 A", price: 100, content: "内容 A" },
//   //     { name: "示例 B", description: "简介 B", price: 200, content: "内容 B" },
//   //   ];

//   //   for (const prod of products) {
//   //     await payload.create({
//   //       collection: "products",
//   //       data: {
//   //         ...prod,
//   //         tenant: "680e418914d009fddf359c93", // ← 这里关联租户
//   //       },
//   //     });
//   //   }
// };

// seed()
//   .then(() => {
//     console.log("Seeding 完成");
//     process.exit(0);
//   })
//   .catch((err) => {
//     console.error("Seeding 错误：", err);
//     process.exit(1);
//   });
