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
      path: '/addvenue',
      name: 'addvenue',
      component: () => import('../views/Venues/AddVenue.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/venues',
      name: 'venues',
      component: () => import('../views/Venues/Venues.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/venues/:id',
      name: 'venue',
      component: () => import('../views/Venues/Venue.vue'),
      meta: {
        requiresAuth: true
      },
    },
    // {
    //   path: '/addseries',
    //   name: 'addseries',
    //   component: () => import('../views/Series/AddSeries.vue'),
    //   meta: {
    //     requiresAuth: true
    //   },
    // },
    // {
    //   path: '/series',
    //   name: 'series',
    //   component: () => import('../views/Series/Series.vue'),
    //   meta: {
    //     requiresAuth: true
    //   },
    // },
    // {
    //   path: '/series/:id',
    //   name: 'seriesInfo',
    //   component: () => import('../views/Series/SeriesInfo.vue'),
    //   meta: {
    //     requiresAuth: true
    //   },
    // },
    // {
    //   path: '/series/:id/days',
    //   name: 'seriesDaus',
    //   component: () => import('../views/Series/SeriesDays.vue'),
    //   meta: {
    //     requiresAuth: true
    //   },
    // },
    {
      path: '/addevent',
      name: 'addevent',
      component: () => import('../views/Events/AddEvent.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/Events/Events.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/events/:id',
      name: 'event',
      component: () => import('../views/Events/Event.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/events/:id/shifts',
      name: 'eventshifts',
      component: () => import('../views/Events/EventShifts.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/addjob',
      name: 'addjob',
      component: () => import('../views/Jobs/AddJob.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('../views/Jobs/Jobs.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/jobs/:id',
      name: 'job',
      component: () => import('../views/Jobs/Job.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/addfaq',
      name: 'addfaq',
      component: () => import('../views/FAQ/AddFAQ.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/faqs',
      name: 'faqs',
      component: () => import('../views/FAQ/FAQS.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/faqs/:id',
      name: 'faq',
      component: () => import('../views/FAQ/FAQ.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/addclient',
      name: 'addclient',
      component: () => import('../views/Clients/AddClient.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/clients',
      name: 'clients',
      component: () => import('../views/Clients/Clients.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/clients/:id',
      name: 'client',
      component: () => import('../views/Clients/Client.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/Users/Users.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/users/:id',
      name: 'user',
      component: () => import('../views/Users/User.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: {
        requiresAuth: true
      },
    },
    
    {
      path: '/placements', redirect: '/placements/day',
      name: 'placementshome',
      component: () => import('../views/Placements/PlacementsHome.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/placements/day',
          name: 'placements',
          component: () => import('../views/Placements/Placements.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/placements/day/:id',
          name: 'day',
          component: () => import(/* webpackChunkName: "day" */ '../views/Placements/Day.vue'),
          meta: {
            requiresAuth: true
          }
        },
        // {
        //   path: '/eventplacements',
        //   name: 'eventplacements',
        //   component: () => import('../views/Placements/ByEvent.vue'),
        //   meta: {
        //     requiresAuth: true
        //   },
        // },
        {
          path: '/placements/event/:id',
          name: 'eventplacement',
          component: () => import('../views/Placements/Event.vue'),
          meta: {
            requiresAuth: true
          },
        },
      ]
    },
    {
      path: '/timesheets',
      name: 'shifts',
      component: () => import('../views/Shifts/Shifts.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/timesheets/:id',
      name: 'shift',
      component: () => import('../views/Shifts/Shift.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/opr',
      name: 'opr',
      component: () => import('../views/OPR/OPR.vue'),
      meta: {
        requiresAuth: true
      },
    },
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