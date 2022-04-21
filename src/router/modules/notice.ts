const Layout = () => import("/@/layout/index.vue");
const noticeRouter = {
  path: "/notice",
  component: Layout,
  redirect: "/notice/page",
  meta: {
    icon: "sound-outlined",
    title: "疫情通告",
    rank: 22
  },
  children: [
    {
      path: "/notice/page",
      name: "noticePage",
      component: () => import("/@/views/notice/page.vue"),
      meta: {
        title: "通告",
        rank: 24
      }
    },
    {
      //path: "/notice/detail/:id",
      path: "/notice/detail",
      name: "noticeDetail",
      component: () => import("/@/views/notice/detail.vue"),
      meta: {
        title: "通告详情",
        rank: 25,
        showLink: false,
        refreshRedirect: "/notice/page"
      }
    }
  ]
};
export default noticeRouter;
