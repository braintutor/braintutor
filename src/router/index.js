/* eslint-disable */
import Vue from "vue";
import VueRouter from "vue-router";

import store from "../store";
import { getUser } from "@/services/userService";
import { onRouterChange } from "../knowledge";
import routesAdmin from "./admin";
import routesStudentSession from "./student-session";
import routesTeacherSession from "./teacher-session";
import routesParentChild from "./parent-child";
import routesDirectorSession from "./director-session";
import routesCourseMaterialEditor from "./course-material-editor";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/schools",
    name: "schools",
    component: () => import("../views/Schools.vue"),
  },
  {
    path: "/login/:school_url",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/reset-password",
    component: () => import("../views/ResetPassword.vue"),
  },
  {
    path: "/new-password/:token",
    component: ()=> import ("../views/NewPassword.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    meta: { roles: ["ADM", "TEA", "STU", "DIR", "PAR"] },
    component: () => import("../views/Profile.vue"),
  },
  {
    path: "/events",
    name: "events",
    meta: { roles: ["TEA", "STU", "PAR"] },
    component: () => import("../views/Events.vue"),
  },
  {
    path: "/schedule",
    name: "schedule",
    meta: { roles: ["TEA", "STU"] },
    component: () => import("../views/Events2.vue"),
  },
  {
    path: "/teacher-sessions",
    name: "teacher-sessions",
    meta: { roles: ["TEA"] },
    component: () => import("../views/TeacherSessions.vue"),
  },
  {
    path: "/teacher-materials",
    name: "teacher-materials",
    meta: { roles: ["TEA"] },
    component: () => import("../views/TeacherMaterials.vue"),
  },
  {
    path: "/student-sessions",
    name: "student-sessions",
    meta: { roles: ["STU"] },
    component: () => import("../views/StudentSessions.vue"),
  },
  {
    path: "/director-sessions",
    name: "director-sessions",
    meta: { roles: ["DIR"] },
    component: () => import("../views/DirectorSessions.vue"),
  },

  {
    path:"/assistance/:class_id",
    name:"teacher-session-assistance",
    meta: { roles: ["TEA"] },
    component: () => import("../components/TeacherSession/Assistance"),
  },
  routesTeacherSession,
  routesStudentSession,
  routesDirectorSession,
  routesParentChild,
  {
    path: "/courses-editor",
    name: "courses-editor",
    meta: { roles: ["TEA"] },
    component: () => import("../views/CoursesEditor.vue"),
  },
  ...routesCourseMaterialEditor,
  routesAdmin,
  {
    path: "/director-students",
    name: "director-students",
    meta: { roles: ["DIR"] },
    component: () => import("../views/DirectorStudents.vue"),
  },
  {
    path: "/parent-students",
    name: "parent-students",
    meta: { roles: ["PAR"] },
    component: () => import("../views/ParentStudents.vue"),
  },
  {
    path: "/director-reports",
    name: "director-reports",
    meta: { roles: ["DIR"] },
    component: () => import("../views/DirectorReports.vue"),
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
    PAR: "parent",
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
