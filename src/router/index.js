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
    meta: { role: "*" },
    component: () => import("../views/Profile.vue"),
  },
  // ADM
  {
    path: "/school-editor",
    component: () => import("../views/SchoolEditor.vue"),
    meta: { role: "ADM" },
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
    path: "/sessions-teacher",
    name: "sessions-teacher",
    meta: { role: "TEA" },
    component: () => import("../views/SessionsTeacher.vue"),
  },
  {
    path: "/courses-editor",
    name: "courses-editor",
    meta: { role: "TEA" },
    component: () => import("../views/CoursesEditor.vue"),
  },
  {
    path: "/session-editor/:session_id",
    meta: { role: "TEA" },
    component: () => import("../views/SessionEditor.vue"),
    children: [
      {
        path: "",
        name: "session-editor-learn",
        component: () => import("../components/Materials/index"),
      },
      {
        path: "tasks",
        name: "session-editor-tasks",
        component: () =>
          import("../components/SessionEditor/TasksEditor/index"),
      },
      {
        path: "events",
        name: "session-editor-events",
        component: () => import("../components/SessionEditor/EventsEditor"),
      },
      {
        path: "evaluations",
        name: "session-editor-evaluations",
        component: () =>
          import("../components/SessionEditor/EvaluationsEditor/index"),
      },
      {
        path: "students",
        name: "session-editor-students",
        component: () => import("../components/SessionEditor/Students"),
      },
    ],
  },
  {
    path: "/course-editor/:course_id",
    meta: { role: "TEA" },
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
    meta: { role: "TEA" },
    component: () => import("../views/MaterialEditor.vue"),
  },
  // STU
  {
    path: "/sessions-student",
    name: "sessions-student",
    meta: { role: "STU" },
    component: () => import("../views/SessionsStudent.vue"),
  },
  {
    path: "/session/:session_id",
    component: () => import("../views/Session.vue"),
    meta: { role: "STU" },
    children: [
      {
        path: "",
        name: "session-learn",
        component: () => import("../components/Materials/index"),
      },
      {
        path: "tasks",
        name: "session-tasks",
        component: () => import("../components/Session/Tasks"),
      },
      {
        path: "events",
        name: "session-events",
        component: () => import("../components/Session/Events"),
      },
      {
        path: "evaluations",
        name: "session-evaluations",
        component: () => import("../components/Session/Evaluations/index"),
      },
      {
        path: "students",
        name: "session-students",
        component: () => import("../components/Session/Students"),
      },
    ],
  },
  {
    path: "/events",
    name: "events",
    meta: { role: "STU" },
    component: () => import("../views/Events.vue"),
  },
  {
    path: "/task/:task_id",
    name: "task",
    meta: { role: "STU" },
    component: () => import("../views/Task.vue"),
  },
  {
    path: "/tasks",
    name: "tasks",
    meta: { role: "STU" },
    component: () => import("../views/Tasks.vue"),
  },
  // DIR
  {
    path: "/director-courses",
    name: "director-courses",
    meta: { role: "DIR" },
    component: () => import("../views/DirectorCourses.vue"),
  },
  {
    path: "/director-students",
    name: "director-students",
    meta: { role: "DIR" },
    component: () => import("../views/DirectorStudents.vue"),
  },
  {
    path: "/director-session/:session_id",
    component: () => import("../views/DirectorSession.vue"),
    meta: { role: "DIR" },
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
    path: "/parent-courses",
    name: "parent-courses",
    meta: { role: "PAR" },
    component: () => import("../views/ParentCourses.vue"),
  },
  {
    path: "/parent-students",
    name: "parent-students",
    meta: { role: "PAR" },
    component: () => import("../views/ParentStudents.vue"),
  },
  {
    path: "/parent-session/:session_id",
    component: () => import("../views/ParentSession.vue"),
    meta: { role: "PAR" },
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
    TEA: "sessions-teacher",
    STU: "sessions-student",
    DIR: "director-courses",
    PAR: "parent-courses",
  };

  // if route auth required
  let route = to.matched.find(({ meta }) => meta.role);
  if (route) {
    if (user) {
      let role = route.meta.role;
      if (role === "*" || role === user.role) next();
      else next("/home");
    } else next("/home");
  } else if (user) next(`/${redirects[user.role]}`);
  else next();
});

export default router;
