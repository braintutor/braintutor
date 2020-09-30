/* eslint-disable */
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

import store from "../store";
import { redirect } from "@/services/router";
import { getUser } from "@/services/userService";
import { onRouterChange } from "../knowledge";

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
    component: () => import("../views/SchoolEditor.vue"),
    children: [
      {
        path: "",
        name: "school-editor",
        component: () => import("../components/SchoolEditor/SchoolSettings"),
      },
      {
        path: "teachers",
        component: () => import("../components/SchoolEditor/TeachersEditor"),
      },
      {
        path: "courses",
        component: () => import("../components/SchoolEditor/CoursesEditor"),
      },
      {
        path: "classrooms",
        component: () => import("../components/SchoolEditor/ClassroomsEditor"),
      },
      {
        path: "students",
        component: () => import("../components/SchoolEditor/StudentsEditor"),
      },
      {
        path: "sessions",
        component: () => import("../components/SchoolEditor/SessionsEditor"),
      },
      {
        path: "director",
        component: () => import("../components/SchoolEditor/DirectorEditor"),
      },
      {
        path: "parents",
        component: () => import("../components/SchoolEditor/ParentsEditor"),
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
        component: () => import("../components/Students/index"),
      },
    ],
  },
  {
    path: "/course-editor/:course_id",
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
  {
    path: "/parent",
    name: "parent",
    component: () => import("../views/Parent.vue"),
  },
  // DIR
  {
    path: "/director-courses",
    name: "director-courses",
    component: () => import("../views/DirectorCourses.vue"),
  },
  {
    path: "/director-students",
    name: "director-students",
    component: () => import("../views/DirectorStudents.vue"),
    // children: [
    //   {
    //     path: "",
    //     name: "director-students",
    //     component: () => import("../components/Director/Sessions/index"),
    //   },
    //   {
    //     path: "student/:student_id",
    //     component: () => import("../components/Director/Student/index"),
    //   },
    //   {
    //     path: "students",
    //     component: () => import("../components/Director/Students/index"),
    //   },
    //   {
    //     path: "session/:session_id",
    //     component: () => import("../components/Director/Session/index"),
    //   },
    // ],
  },
  {
    path: "/director-session/:session_id",
    component: () => import("../views/DirectorSession.vue"),
    children: [
      {
        path: "",
        name: "director-session-tasks",
        component: () => import("../components/DirectorSession/Tasks"),
      },
      {
        path: "events",
        name: "director-session-events",
        component: () => import("../components/DirectorSession/Events"),
      },
      {
        path: "evaluations",
        name: "director-session-evaluations",
        component: () => import("../components/DirectorSession/Evaluations/index"),
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
  const require_parent = ["parent", "profile"]; // Require Director
  let to_name = to.name;
  let redirects = {
    ADM: "school-editor",
    TEA: "sessions-teacher",
    STU: "sessions-student",
    DIR: "director-courses",
    PAR: "parent",
  };

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

  // Chatbot
  onRouterChange(to.fullPath.split("/")[1]);

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

export default router;
