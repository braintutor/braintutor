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

  const require_session = ['chatbot', 'school-editor', 'director', 'student', 'session', 'teacher', 'session-editor', 'course-editor', 'chatbot-editor'] // Require Session Exists
  const require_admin = ['school-editor'] // Require Admin
  const require_teacher = ['teacher', 'session-editor', 'course-editor', 'chatbot-editor'] // Require Teacher
  const require_director = ['director'] // Require Director
  let to_name = to.name

  if (require_session.includes(to_name)) {
    if (sessionExists()) {
      // Admin
      if (require_admin.includes(to_name)) {
        if (getSession().type == 0)
          next()
        else
          redirect('home')
      }
      // Teacher
      if (require_teacher.includes(to_name)) {
        if (getSession().type == 1)
          next()
        else
          redirect('home')
      }
      // Director
      if (require_director.includes(to_name)) {
        if (getSession().type == 3)
          next()
        else
          redirect('home')
      }
      next()
    } else {
      redirect('login')
    }
  }
  next()
})

function reset() {
  let component_avatar = store.state.component_avatar;
  if (component_avatar) component_avatar.startTalk('')
}

export default router
