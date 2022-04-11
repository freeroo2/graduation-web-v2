const Layout = () => import("/@/layout/index.vue");
const resultRouter = {
  path: "/result",
  component: Layout,
  redirect: "/result/success",
  meta: {
    title: "结果",
    rank: 50,
    showLink: false
  },
  children: [
    {
      path: "/result/success",
      name: "success",
      component: () => import("/@/views/result/success.vue"),
      meta: {
        title: "成功",
        showLink: false,
        rank: 51
      }
    },
    {
      path: "/result/fail",
      name: "fail",
      component: () => import("/@/views/result/fail.vue"),
      meta: {
        title: "失败",
        showLink: false,
        rank: 52
      }
    }
  ]
};
export default resultRouter;
