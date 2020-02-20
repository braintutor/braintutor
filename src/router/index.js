import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import { verifySession } from '@/services/security'
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
    path: '/chatbot/:chatbot_id',
    name: 'chatbot',
    component: () => import('../views/Chatbot.vue')
  },
  {
    path: '/editor/:chatbot_id',
    name: 'editor',
    component: () => import('../views/Editor.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const paths = ['panel', 'chatbot', 'editor'] // Require Session Exists
  let to_name = to.name

  if (paths.includes(to_name)) {
    verifySession(next, () => redirect('login'))
  } else if (to_name === 'login') {
    verifySession(() => redirect('panel'), next)
  } else {
    next()
  }
})

export default router
