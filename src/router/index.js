import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

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
  const paths_1 = ['panel', 'chatbot', 'editor'] // Require Session Exists
  const paths_2 = ['editor'] // Require Admin
  let to_name = to.name
  console.log(to_name);


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

export default router
