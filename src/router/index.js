/* eslint-disable */
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

import store from "../store";
import { redirect } from "@/services/router";
import { getUser } from "@/services/userService";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  // { path: '*', redirect: { name: 'home' } },
  {
    path: "/login/:school_url",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/school-editor",
    name: "school-editor",
    component: () => import("../views/SchoolEditor.vue"),
  },
  {
    path: "/director",
    component: () => import("../views/Director.vue"),
    children: [
      {
        path: "",
        name: "director",
        component: () => import("../components/Director/Classrooms/index"),
      },
      {
        path: "students",
        component: () => import("../components/Director/Students"),
      },
    ],
  },
  {
    path: "/sessions-student",
    name: "sessions-student",
    component: () => import("../views/SessionsStudent.vue"),
  },
  {
    path: "/sessions-teacher",
    name: "sessions-teacher",
    component: () => import("../views/SessionsTeacher.vue"),
  },
  {
    path: "/tasks",
    name: "tasks",
    component: () => import("../views/Tasks.vue"),
  },
  {
    path: "/events",
    name: "events",
    component: () => import("../views/Events.vue"),
  },
  {
    path: "/session/:session_id",
    component: () => import("../views/Session.vue"),
    children: [
      {
        path: "",
        name: "session",
        component: () => import("../components/Materials/index"),
      },
      {
        path: "tasks",
        component: () => import("../components/Session/Tasks"),
      },
      {
        path: "events",
        component: () => import("../components/Session/Events"),
      },
      {
        path: "evaluations",
        component: () => import("../components/Session/Evaluations/index"),
      },
      {
        path: "students",
        component: () => import("../components/Students/index"),
      },
    ],
  },
  {
    path: "/courses-editor",
    name: "courses-editor",
    component: () => import("../views/CoursesEditor.vue"),
  },
  {
    path: "/session-editor/:session_id",
    component: () => import("../views/SessionEditor.vue"),
    children: [
      {
        path: "",
        name: "session-editor",
        component: () => import("../components/Materials/index"),
      },
      {
        path: "tasks",
        component: () =>
          import("../components/SessionEditor/TasksEditor/index"),
      },
      {
        path: "events",
        component: () => import("../components/SessionEditor/EventsEditor"),
      },
      {
        path: "evaluations",
        component: () =>
          import("../components/SessionEditor/EvaluationsEditor/index"),
      },
      {
        path: "students",
        component: () => import("../components/Students/index"),
      },
    ],
  },
  {
    path: "/course-editor/:course_id",
    name: "course-editor",
    component: () => import("../views/CourseEditor.vue"),
  },
  {
    path: "/material-editor/:material_id",
    name: "material-editor",
    component: () => import("../views/MaterialEditor.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/Profile.vue"),
  },
  {
    path: "/task/:task_id",
    name: "task",
    component: () => import("../views/Task.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach(async (to, from, next) => {
  reset();
  const require_student = [
    "sessions-student",
    "session",
    "tasks",
    "events",
    "profile",
    "task",
  ]; // Require Student
  const require_admin = ["school-editor", "profile"]; // Require Admin
  const require_teacher = [
    "courses-editor",
    "sessions-teacher",
    "session-editor",
    "course-editor",
    "material-editor",
    "profile",
  ]; // Require Teacher
  const require_director = ["director", "profile"]; // Require Director
  const require_parent = [
    "sessions-student",
    "session",
    "tasks",
    "events",
    "profile",
  ]; // Require Director
  let to_name = to.name;
  let redirects = {
    ADM: "school-editor",
    TEA: "sessions-teacher",
    STU: "sessions-student",
    DIR: "director",
    PAR: "sessions-student",
  };

  let user = null;
  let token = localStorage.getItem("token");
  if (token) {
    store.state.loading = true;
    store.state.loading_msg = "";
    try {
      user = await getUser();
      user.name = user.last_name + ", " + user.first_name;
      store.commit("setUser", user);
    } catch (error) {
      localStorage.removeItem("token");
      store.commit("setUser", null);
    }
    store.state.loading = false;
  }

  //Chatbot
  store.commit("show_chatbot", false);
  if (["course-editor", "material-editor"].includes(to_name)) {
    store.commit("show_chatbot", true);
    store.commit("knowledge_default", "CE");
  }

  let path_child = to.fullPath.split("/")[1];
  if (["session-editor"].includes(path_child)) {
    store.commit("show_chatbot", true);
    store.commit("knowledge_default", "SE");
  }

  // Router Authorization
  if (
    require_student
      .concat(require_admin, require_teacher, require_director, require_parent)
      .includes(to_name)
  )
    if (
      user &&
      ((require_admin.includes(to_name) && user.role === "ADM") ||
        (require_teacher.includes(to_name) && user.role === "TEA") ||
        (require_student.includes(to_name) && user.role === "STU") ||
        (require_director.includes(to_name) && user.role === "DIR") ||
        (require_parent.includes(to_name) && user.role === "PAR"))
    )
      next();
    else redirect("home");
  else if (["home", "login"].includes(to_name) && user)
    redirect(redirects[user.role]);
  else next();
});

function reset() {
  let component_avatar = store.state.component_avatar;
  if (component_avatar) component_avatar.startTalk("");
}

export default router;
