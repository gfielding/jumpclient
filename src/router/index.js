import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebaseConfig'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/dashboard', redirect: '/dashboard/home',
      name: 'dashboard',
      component: () => import('../views/Dashboard/Dashboard.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/dashboard/home',
          name: 'dashHome',
          component: () => import('../views/Dashboard/DashHome.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/dashboard/profile',
          name: 'profile',
          component: () => import('../views/Dashboard/Profile.vue'),
          meta: {
            requiresAuth: true
          },
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router