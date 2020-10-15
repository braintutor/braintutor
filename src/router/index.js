/* eslint-disable */
import Vue from "vue";
import VueRouter from "vue-router";

import store from "../store";
import { getUser } from "@/services/userService";
import { onRouterChange } from "../knowledge";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/login/:school_url",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  // *
  {
    path: "/profile",
    name: "profile",
    meta: { roles: ["ADM", "TEA", "STU", "DIR", "PAR"] },
    component: () => import("../views/Profile.vue"),
  },
  {
    path: "/events",
    name: "events",
    meta: { roles: ["TEA", "STU"] },
    component: () => import("../views/Events.vue"),
  },
  // ADM
  {
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
        path: "courses",
        name: "school-editor-courses",
        component: () => import("../components/SchoolEditor/CoursesEditor"),
      },
      {
        path: "classrooms",
        name: "school-editor-classrooms",
        component: () => import("../components/SchoolEditor/ClassroomsEditor"),
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
        path: "parents",
        name: "school-editor-parents",
        component: () => import("../components/SchoolEditor/ParentsEditor"),
      },
    ],
  },
  // TEA
  {
    path: "/teacher-sessions",
    name: "teacher-sessions",
    meta: { roles: ["TEA"] },
    component: () => import("../views/TeacherSessions.vue"),
  },
  {
    path: "/courses-editor",
    name: "courses-editor",
    meta: { roles: ["TEA"] },
    component: () => import("../views/CoursesEditor.vue"),
  },
  {
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
    ],
  },
  {
    path: "/course-editor/:course_id",
    meta: { roles: ["TEA"] },
    component: () => import("../views/CourseEditor.vue"),
    children: [
      {
        path: "",
        name: "course-editor",
        component: () => import("../components/CourseEditor/MaterialsEditor"),
      },
      {
        path: "knowledge",
        name: "course-editor-knowledge",
        component: () => import("../components/globals/KnowledgeEditor"),
      },
      {
        path: "preview",
        name: "course-editor-preview",
        component: () => import("../components/CourseEditor/MaterialsPreview"),
      },
    ],
  },
  {
    path: "/material-editor/:material_id",
    name: "material-editor",
    meta: { roles: ["TEA"] },
    component: () => import("../views/MaterialEditor.vue"),
  },
  // STU
  {
    path: "/student-sessions",
    name: "student-sessions",
    meta: { roles: ["STU"] },
    component: () => import("../views/StudentSessions.vue"),
  },
  {
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
  },
  {
    path: "/task/:task_id",
    name: "task",
    meta: { roles: ["STU"] },
    component: () => import("../views/Task.vue"),
  },
  {
    path: "/tasks",
    name: "tasks",
    meta: { roles: ["STU"] },
    component: () => import("../views/Tasks.vue"),
  },
  // DIR
  {
    path: "/director-sessions",
    name: "director-sessions",
    meta: { roles: ["DIR"] },
    component: () => import("../views/DirectorSessions.vue"),
  },
  {
    path: "/director-students",
    name: "director-students",
    meta: { roles: ["DIR"] },
    component: () => import("../views/DirectorStudents.vue"),
  },
  {
    path: "/director-session/:session_id",
    component: () => import("../views/DirectorSession.vue"),
    meta: { roles: ["DIR"] },
    children: [
      {
        path: "",
        name: "director-session-events",
        component: () => import("../components/DirectorSession/Events"),
      },
      {
        path: "tasks",
        name: "director-session-tasks",
        component: () => import("../components/DirectorSession/Tasks"),
      },
      {
        path: "evaluations",
        name: "director-session-evaluations",
        component: () =>
          import("../components/DirectorSession/Evaluations/index"),
      },
      {
        path: "students",
        name: "director-session-students",
        component: () => import("../components/DirectorSession/Students"),
      },
    ],
  },
  // PAR
  {
    path: "/parent-sessions",
    name: "parent-sessions",
    meta: { roles: ["PAR"] },
    component: () => import("../views/ParentSessions.vue"),
  },
  {
    path: "/parent-students",
    name: "parent-students",
    meta: { roles: ["PAR"] },
    component: () => import("../views/ParentStudents.vue"),
  },
  {
    path: "/parent-session/:session_id",
    component: () => import("../views/ParentSession.vue"),
    meta: { roles: ["PAR"] },
    children: [
      {
        path: "",
        name: "parent-session-events",
        component: () => import("../components/ParentSession/Events"),
      },
      {
        path: "tasks",
        name: "parent-session-tasks",
        component: () => import("../components/ParentSession/Tasks"),
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
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach(async (to, from, next) => {
  // GET USER
  let user = null;
  let token = localStorage.getItem("token");
  if (token) {
    store.state.loading_user = true;
    try {
      user = await getUser();
      user.name = user.last_name + ", " + user.first_name;
      store.commit("setUser", user);
    } catch (error) {
      localStorage.removeItem("token");
      store.commit("setUser", null);
    }
    store.state.loading_user = false;
  }

  // CHANGE CHATBOT KNOWLEDGE
  onRouterChange(to.fullPath.split("/")[1]);

  // ROUTER AUTHORIZATION
  let redirects = {
    ADM: "school-editor",
    TEA: "teacher-sessions",
    STU: "student-sessions",
    DIR: "director-sessions",
    PAR: "parent-sessions",
  };

  // if route auth required
  let route = to.matched.find(({ meta }) => meta.roles);
  if (route) {
    if (user) {
      let roles = route.meta.roles;
      if (roles.includes(user.role)) next();
      else next("/");
    } else next("/");
  } else if (user) next(`/${redirects[user.role]}`);
  else next();
});

export default router;
