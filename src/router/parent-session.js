const routes =   {
  path: "/parent-session/:session_id",
  component: () => import("../views/ParentSession.vue"),
  meta: { roles: ["PAR"] },
  children: [
    {
      path: "",
      name: "parent-session-learn",
      component: () => import("../components/Materials/index"),
    },
    {
      path: "events",
      name: "parent-session-events",
      component: () => import("../components/ParentSession/Events"),
    },
    {
      path: "tasks",
      name: "parent-session-tasks",
      component: () => import("../components/ParentSession/Tasks/index"),
    },
    {
      path: "evaluations",
      name: "parent-session-evaluations",
      component: () =>
        import("../components/ParentSession/Evaluations/index"),
    },
    {
      path: "students",
      name: "parent-session-students",
      component: () => import("../components/ParentSession/Students"),
    },
  ],
}
export default routes