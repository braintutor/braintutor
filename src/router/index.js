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
    path: '/school-editor',
    name: 'school-editor',
    component: () => import('../views/SchoolEditor.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/panel',
    name: 'panel',
    component: () => import('../views/Panel.vue')
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('../views/Courses.vue')
  },
  {
    path: '/course/:course_id',
    name: 'course',
    component: () => import('../views/Course.vue')
  },
  {
    path: '/chatbot/:chatbot_id',
    name: 'chatbot',
    component: () => import('../views/Chatbot.vue')
  },
  {
    path: '/editor/:chatbot_id',
    name: 'editor',
    component: () => import('../views/Editor.vue')
  },
  {
    path: '/course-editor/:course_id',
    name: 'course-editor',
    component: () => import('../views/CourseEditor.vue')
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

  const require_session = ['panel', 'chatbot', 'course', 'courses', 'school-editor', 'editor', 'course-editor'] // Require Session Exists
  const require_admin = ['school-editor'] // Require Admin
  const require_teacher = ['courses', 'editor', 'course-editor'] // Require Teacher
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
