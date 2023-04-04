import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Manage from '@/views/Manage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/manage-music',
    name: 'Manage',
    component: Manage,
    beforeEnter: (to, from, next) => {
      if (!to.meta.requiresAuth) {
        next()
        return
      }

      const user = useUserStore()

      if (user.userLoggedIn) {
        next()
      } else {
        next({ name: 'Home' })
      }
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/manage',
    redirect: { name: 'Manage' }
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'Home' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
})

export default router
