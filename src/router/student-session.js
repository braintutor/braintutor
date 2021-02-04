const routes = {
    path: "/student-session/:session_id",
    component: () => import("../views/StudentSession.vue"),
    meta: { roles: ["STU"] },
    children: [
      {
        path: "",
        name: "student-session-learn",
        component: () => import("../components/Materials/index"),
      },
      {
        path: "tasks",
        name: "student-session-tasks",
        component: () => import("../components/StudentSession/Tasks"),
      },
      {
        path: "lessons",
        name: "student-session-lessons",
        component: () => import("../modules/SchoolClass/SchoolClass"),
      },
      {
        path: "events",
        name: "student-session-events",
        component: () => import("../components/StudentSession/Events"),
      },
      {
        path: "evaluations",
        name: "student-session-evaluations",
        component: () =>
          import("../components/StudentSession/Evaluations/index"),
      },
      {
        path: "messages",
        name: "student-session-messages",
        component: () =>
          import("../components/StudentSession/Messages"),
      },
      {
        path: "students",
        name: "student-session-students",
        component: () => import("../components/StudentSession/Students"),
      },
    ],
  }
  export default routes