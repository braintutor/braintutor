/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import store from '../store'
import { sessionExists, getSession } from '@/services/security'
import { redirect } from '@/services/router'
import { getUser } from "@/services/userService";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  // { path: '*', redirect: { name: 'home' } },
  {
    path: '/login/:school_user',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/school-editor',
    name: 'school-editor',
    component: () => import('../views/SchoolEditor.vue')
  },
  {
    path: '/director',
    name: 'director',
    component: () => import('../views/Director.vue')
  },
  {
    path: '/sessions-student',
    name: 'sessions-student',
    component: () => import('../views/SessionsStudent.vue')
  },
  {
    path: '/sessions-teacher',
    name: 'sessions-teacher',
    component: () => import('../views/SessionsTeacher.vue')
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('../views/Tasks.vue')
  },
  {
    path: '/events',
    name: 'events',
    component: () => import('../views/Events.vue')
  },
  {
    path: '/session/:session_id',
    name: 'session',
    component: () => import('../views/Session.vue')
  },
  {
    path: '/courses-editor',
    name: 'courses-editor',
    component: () => import('../views/CoursesEditor.vue')
  },
  {
    path: '/session-editor/:session_id',
    name: 'session-editor',
    component: () => import('../views/SessionEditor.vue')
  },
  {
    path: '/course-editor/:course_id',
    name: 'course-editor',
    component: () => import('../views/CourseEditor.vue')
  },
  {
    path: '/chatbot-editor/:chatbot_id',
    name: 'chatbot-editor',
    component: () => import('../views/ChatbotEditor.vue')
  },
  {
    path: '/chatbot/:chatbot_id',
    name: 'chatbot',
    component: () => import('../views/Chatbot.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach(async (to, from, next) => {
  reset()
  const require_student = ['sessions-student', 'session', 'tasks', 'events', 'chatbot', 'profile'] // Require Student
  const require_admin = ['school-editor', 'profile'] // Require Admin
  const require_teacher = ['chatbot', 'courses-editor', 'sessions-teacher', 'session-editor', 'course-editor', 'chatbot-editor', 'profile'] // Require Teacher
  const require_director = ['director', 'profile'] // Require Director
  const require_parent = ['sessions-student', 'session', 'tasks', 'events', 'chatbot', 'profile'] // Require Director

  let to_name = to.name
  let session_exists = sessionExists()

  if (require_student.concat(require_admin, require_teacher, require_director, require_parent).includes(to_name)) {
    try {
      let user = await getUser()
      console.log(user);
      
      store.commit('setUser', user)

      if (session_exists)
        if ((require_admin.includes(to_name) && getSession().type == 0) ||
          (require_teacher.includes(to_name) && getSession().type == 1) ||
          (require_student.includes(to_name) && getSession().type == 2) ||
          (require_director.includes(to_name) && getSession().type == 3) ||
          (require_parent.includes(to_name) && getSession().type == 4))
          next()
        else
          redirect('home')
      else
        redirect('home')
    } catch (error) {
      store.commit('setUser', null)
      redirect('home')
    }
  }
  else
    next()
})

function reset() {
  let component_avatar = store.state.component_avatar;
  if (component_avatar) component_avatar.startTalk('')
}

export default router
