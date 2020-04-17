import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import store from '../store'
import { sessionExists, getSession } from '@/services/security'
import { redirect } from '@/services/router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  { path: '*', redirect: { name: 'home' } },
  {
    path: '/login',
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
    path: '/student',
    name: 'student',
    component: () => import('../views/Student.vue')
  },
  {
    path: '/parent',
    name: 'parent',
    component: () => import('../views/Parent.vue')
  },
  {
    path: '/session/:session_id',
    name: 'session',
    component: () => import('../views/Session.vue')
  },
  {
    path: '/teacher',
    name: 'teacher',
    component: () => import('../views/Teacher.vue')
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
router.beforeEach((to, from, next) => {
  reset()
  const require_student = ['student', 'session', 'chatbot', 'profile'] // Require Student
  const require_admin = ['school-editor'] // Require Admin
  const require_teacher = ['chatbot', 'teacher', 'session-editor', 'course-editor', 'chatbot-editor'] // Require Teacher
  const require_director = ['director'] // Require Director
  const require_parent = ['parent', 'session', 'chatbot'] // Require Director

  let to_name = to.name
  let session_exists = sessionExists()
  // Admin
  if (require_student.concat(require_admin, require_teacher, require_director, require_parent).includes(to_name))
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
      redirect('login')
  else
    next()
})

function reset() {
  let component_avatar = store.state.component_avatar;
  if (component_avatar) component_avatar.startTalk('')
}

export default router
