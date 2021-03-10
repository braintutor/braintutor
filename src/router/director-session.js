const routes = {
  path: "/director-session/:session_id",
  component: () => import("../views/DirectorSession.vue"),
  meta: { roles: ["DIR"] },
  children: [
    {
      path: "",
      name: "director-session-learn",
      component: () => import("../components/Materials/index"),
    },
    {
      path: "",
      name: "director-session-events",
      component: () => import("../components/DirectorSession/Events"),
    },
    {
      path: "tasks",
      name: "director-session-tasks",
      component: () =>
        import("../components/DirectorSession/Evaluations/Evaluations"),
    },
    {
      path: "evaluations",
      name: "director-session-evaluations",
      component: () =>
        import("../components/DirectorSession/Evaluations/Evaluations"),
    },
    {
      path: "results",
      name: "director-session-results",
      component: () => import("../components/DirectorSession/Results/Results")
    },
    {
      path: "students",
      name: "director-session-students",
      component: () => import("../components/DirectorSession/Students"),
    },
  ],
}
export default routes