const routes = {
  path: "/parent",
  name: "parent",
  meta: { roles: ["PAR"] },
  component: () => import("../views/Parent.vue"),
  children: [
    {
      path: "child/:childId",
      name: "parent-child",
      component: () => import("../views/ParentChild.vue"),
      meta: { roles: ["PAR"] },
      children: [
        {
          path: "calendar",
          name: "parent-child-calendar",
          component: () => import("../views/Events.vue"),
        },
        {
          path: "",
          name: "parent-child-info",
          component: () => import("../views/StudentDetail.vue"),
        },
        {
          path: "courses",
          name: "parent-child-courses",
          component: () => import("../views/ParentSessions.vue"),
        },
      ],
    },
  ],
};
export default routes;
