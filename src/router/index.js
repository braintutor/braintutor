import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import { verifySession } from '@/services/security'

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
    path: '/chatbot',
    name: 'chatbot',
    component: () => import('../views/Chatbot.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const paths = ['panel', 'chatbot']
  let to_name = to.name

  if (paths.includes(to_name)) {
    verifySession(next, redirect('login'))
  } else if (to_name === 'login') {
    verifySession(redirect('panel'), next)
  } else {
    next()
  }
})

function redirect(name) {
  return () => router.push({ name }).catch(() => { })
}

export default router
