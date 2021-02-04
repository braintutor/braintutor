const routes =  {
    path: "/teacher-session/:session_id",
    meta: { roles: ["TEA"] },
    component: () => import("../views/TeacherSession.vue"),
    children: [
      {
        path: "",
        name: "teacher-session-learn",
        component: () => import("../components/Materials/index"),
      },
      {
        path: "tasks",
        name: "teacher-session-tasks",
        component: () =>
          import("../components/TeacherSession/TasksEditor/index"),
      },
      {
        path: "events",
        name: "teacher-session-events",
        component: () => import("../components/TeacherSession/EventsEditor"),
      },
      {
        path: "evaluations",
        name: "teacher-session-evaluations",
        component: () =>
          import("../components/TeacherSession/EvaluationsEditor/index"),
      },
      {
        path: "messages",
        name: "teacher-session-messages",
        component: () =>
          import("../components/TeacherSession/Messages"),
      },
      {
        path: "students",
        name: "teacher-session-students",
        component: () => import("../components/TeacherSession/Students"),
      },
      {
        path: "files",
        name: "teacher-session-files",
        component: () => import("../components/TeacherSession/Files"),
      },
      {
        path:"assistance",
        name:"teacher-session-assistance",
        component: () => import("../components/TeacherSession/Assistance"),
      }
    ],
  }
  
export default routes;