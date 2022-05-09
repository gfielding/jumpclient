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
      name: 'venueQR',
      component: () => import('../views/Venues/Venue.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/venues/:id/qr',
      name: 'venue',
      component: () => import('../views/Venues/qrCode.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/reports',
      name: 'userReports',
      component: () => import('../views/Reports/UserReports.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/markets',
      name: 'markets',
      component: () => import('../views/Leads/Markets.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/leads',
      name: 'marketingLeads',
      component: () => import('../views/Leads/Leads.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/leads/add',
      name: 'enterNewLead',
      component: () => import('../views/Leads/AddLead.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/groups',
      name: 'groups',
      component: () => import('../views/Groups/Groups.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/addgroup',
      name: 'addgroup',
      component: () => import('../views/Groups/AddGroup.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/groups/grouphome', redirect: '/groups/:id',
      name: 'groupHome',
      component: () => import('../views/Groups/GroupHome.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/groups/:id',
          name: 'group',
          component: () => import('../views/Groups/Group.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/groups/:id/edit',
          name: 'groupEdit',
          component: () => import('../views/Groups/EditGroup.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/groups/:id/messages',
          name: 'groupMessages',
          component: () => import('../views/Groups/GroupMessages.vue'),
          meta: {
            requiresAuth: true
          },
        },
      ]
    },
    {
      path: '/followersgroups/grouphome', redirect: '/followergroups/:id',
      name: 'followersGroupHome',
      component: () => import('../views/Groups/FollowersGroupHome.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/followersgroups/:id',
          name: 'followersGroup',
          component: () => import('../views/Groups/FollowersGroup.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/followersgroups/:id/edit',
          name: 'followersGroupEdit',
          component: () => import('../views/Groups/EditFollowersGroup.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/followersgroups/:id/messages',
          name: 'followersGroupMessages',
          component: () => import('../views/Groups/FollowersGroupMessages.vue'),
          meta: {
            requiresAuth: true
          },
        },
      ]
    },
    {
      path: '/payroll/help',
      name: 'payrollHelp',
      component: () => import('../views/PayrollHelp/PayrollHelp.vue'),
      meta: {
        requiresAuth: true
      },
    },

 


    // {
    //   path: '/accounting/events', redirect: '/accounting/events/year/2022',
    //   name: 'accountingEvents',
    //   component: () => import('../views/Accounting/Events.vue'),
    //   meta: {
    //     requiresAuth: true
    //   },
    //   children: [
    //     {
    //       path: '/accounting/events/year/:id',
    //       name: 'accountingEventsTable',
    //       component: () => import('../views/Accounting/EventsTable.vue'),
    //       meta: {
    //         requiresAuth: true
    //       },
    //     },
    //   ]
    // },
    {
      path: '/accounting/events/',
      name: 'accountingEvents',
      component: () => import('../views/Accounting/Events.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/accounting/events/:id',
      name: 'accountingEvent',
      component: () => import('../views/Accounting/Event.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/accounting/referrals',
      name: 'accountReferrals',
      component: () => import('../views/Accounting/Referrals.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/accounting/payroll',
      name: 'allPayroll',
      component: () => import('../views/Accounting/AllPayroll.vue'),
      meta: {
        requiresAuth: true
      },
    },
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
      path: '/events/:id/checkin',
      name: 'eventcheckin',
      component: () => import('../views/Events/EventCheckin.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/events/:id/timesheets',
      name: 'eventtimesheets',
      component: () => import('../views/Shifts/EventShifts.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/timesheets/:id/:day',
      name: 'daytimesheets',
      component: () => import('../views/Shifts/DayShifts.vue'),
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
      path: '/tags',
      name: 'tags',
      component: () => import('../views/Tags/Tags.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/addtag',
      name: 'addtag',
      component: () => import('../views/Tags/AddTag.vue'),
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
      path: '/addmgr',
      name: 'addmgr',
      component: () => import('../views/Team/AddMgr.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('../views/Team/Team.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/team/:id',
      name: 'mgr',
      component: () => import('../views/Team/Mgr.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/pagetext',
      name: 'pageText',
      component: () => import('../views/PageText/PageText.vue'),
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
      path: '/internalDocuments',
      name: 'internalDocuments',
      component: () => import('../views/InternalDocuments/internalDocuments.vue'),
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
    // {
    //   path: '/events', redirect: '/events/2022-04',
    //   name: 'eventsHome',
    //   component: () => import('../views/Events/EventsHome.vue'),
    //   meta: {
    //     requiresAuth: true
    //   },
    //   children: [
    //     {
    //       path: '/events/:id',
    //       name: 'eventsByMonth',
    //       component: () => import('../views/Events/EventsByMonth.vue'),
    //       meta: {
    //         requiresAuth: true
    //       },
    //     },
    //     {
    //       path: '/events/venue/:id',
    //       name: 'eventsByVenue',
    //       component: () => import('../views/Events/EventsByVenue.vue'),
    //       meta: {
    //         requiresAuth: true
    //       },
    //     },
    //   ]
    // },
    {
      path: '/clients/clienthome', redirect: '/clients/:id',
      name: 'clientHome',
      component: () => import('../views/Clients/ClientHome.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/clients/:id',
          name: 'client',
          component: () => import('../views/Clients/Client.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/clients/:id/summary',
          name: 'clientSummary',
          component: () => import('../views/Clients/ClientSummary.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/clients/:id/contacts',
          name: 'clientContacts',
          component: () => import('../views/Clients/ClientContacts.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/clients/:id/notes',
          name: 'clientNotes',
          component: () => import('../views/Clients/ClientNotes.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/clients/:id/files',
          name: 'clientFiles',
          component: () => import('../views/Clients/ClientFiles.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/clients/:id/venues',
          name: 'clientVenues',
          component: () => import('../views/Clients/ClientVenues.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
      ]
    },
    {
      path: '/addcontact',
      name: 'addcontact',
      component: () => import('../views/Contacts/AddContact.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('../views/Contacts/Contacts.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/contacts/:id',
      name: 'contact',
      component: () => import('../views/Contacts/Contact.vue'),
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
      path: '/clientaccess',
      name: 'clientAccess',
      component: () => import('../views/ClientAccess/ClientAccess.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/clientaccess/new',
      name: 'giveClientAccess',
      component: () => import('../views/ClientAccess/GiveAccess.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/clientaccess/:id',
      name: 'manageAccess',
      component: () => import('../views/ClientAccess/ManageAccess.vue'),
      meta: {
        requiresAuth: true
      },
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
      path: '/eventplacements/:id',
      name: 'eventplacement',
      component: () => import('../views/Placements/Event.vue'),
      meta: {
        requiresAuth: true
      },
    },
    // {
    //   path: '/placements', redirect: '/placements/day',
    //   name: 'placementshome',
    //   component: () => import('../views/Placements/PlacementsHome.vue'),
    //   meta: {
    //     requiresAuth: true
    //   },
    //   children: [
    //     {
    //       path: '/placements/day',
    //       name: 'placements',
    //       component: () => import('../views/Placements/Placements.vue'),
    //       meta: {
    //         requiresAuth: true
    //       },
    //     },
    //     {
    //       path: '/placements/day/:id',
    //       name: 'day',
    //       component: () => import(/* webpackChunkName: "day" */ '../views/Placements/Day.vue'),
    //       meta: {
    //         requiresAuth: true
    //       }
    //     },
        
    //   ]
    // },
    // {
    //   path: '/timesheets',
    //   name: 'shifts',
    //   component: () => import('../views/Shifts/Shifts.vue'),
    //   meta: {
    //     requiresAuth: true
    //   },
    // },
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
    {
      path: '/verifications',
      name: 'verifications',
      component: () => import('../views/Verifications/Verifications.vue'),
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