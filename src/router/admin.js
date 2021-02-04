const routes  = {
    path: "/school-editor",
    component: () => import("../views/SchoolEditor.vue"),
    meta: { roles: ["ADM"] },
    children: [
      {
        path: "",
        name: "school-editor",
        component: () => import("../components/SchoolEditor/SchoolSettings"),
      },
      {
        path: "teachers",
        name: "school-editor-teachers",
        component: () => import("../components/SchoolEditor/TeachersEditor"),
      },
      {
        path: "schedulers/:cycle_id",
        name: "school-editor-schedule",
        component: () => import("../components/SchoolEditor/SchoolSchedule"),
      },
      {
        path: "courses",
        name: "school-editor-courses",
        component: () => import("../components/SchoolEditor/CoursesEditor"),
      },
      {
        path: "grades",
        name: "school-editor-grades",
        component: () => import("../components/SchoolEditor/GradesEditor"),
      },
      {
        path: "students",
        name: "school-editor-students",
        component: () => import("../components/SchoolEditor/StudentsEditor"),
      },
      {
        path: "sessions",
        name: "school-editor-sessions",
        component: () => import("../components/SchoolEditor/SessionsEditor"),
      },
      {
        path: "director",
        name: "school-editor-director",
        component: () => import("../components/SchoolEditor/DirectorEditor"),
      },
      {
        path: "school-cycle",
        name: "school-editor-school-cycle",
        component: () => import("../components/SchoolEditor/SchoolCycleEditor"),
      },
      {
        path: "parents",
        name: "school-editor-parents",
        component: () => import("../components/SchoolEditor/ParentsEditor"),
      },
    ],
  }
export default routes