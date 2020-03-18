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
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  reset()

  const paths_1 = ['panel', 'chatbot', 'course', 'courses', 'editor', 'course-editor'] // Require Session Exists
  const paths_2 = ['courses', 'editor', 'course-editor'] // Require Admin
  let to_name = to.name

  if (paths_1.includes(to_name)) {
    if (paths_2.includes(to_name)) {
      if (getSession().type == 0)
        next()
      else
        redirect('panel')
    }
    else
      if (sessionExists())
        next()
      else
        redirect('login')
  } else if (to_name === 'login') {
    if (sessionExists())
      redirect('panel')
    else
      next()
  } else {
    next()
  }
})

function reset() {
  let component_avatar = store.state.component_avatar;
  if (component_avatar) component_avatar.startTalk('')

}

export default router
