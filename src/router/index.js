import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebaseConfig'
import store from '../store';

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
      path: '/reports', redirect: '/reports/payrollQueue',
      name: 'reportsHome',
      component: () => import('../views/Reports/ReportsHome.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/reports/payrollqueue',
          name: 'payrollQueue',
          component: () => import('../views/Reports/PayrollQueue.vue'),
          meta: {
            requiresAuth: true
          },
        },
        // {
        //   path: '/reports/evereeUsersWithoutExternalId',
        //   name: 'evereeUsersWithoutExternalId',
        //   component: () => import('../views/Reports/EvereeUsersWithoutExternalId.vue'),
        //   meta: {
        //     requiresAuth: true
        //   },
        // },


        
        // {
        //   path: '/reports/parse',
        //   name: 'userParse',
        //   component: () => import('../views/Reports/UserParse.vue'),
        //   meta: {
        //     requiresAuth: true
        //   },
        // },
      ]
    },
    // {
    //   path: '/markets',
    //   name: 'markets',
    //   component: () => import('../views/Leads/Markets.vue'),
    //   meta: {
    //     requiresAuth: true
    //   },
    // },
    {
      path: '/leads', redirect: '/leads/all',
      name: 'leadsHome',
      component: () => import('../views/Leads/LeadsHome.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/leads/all',
          name: 'allLeads',
          component: () => import('../views/Leads/AllLeads.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/leads/hidden',
          name: 'archivedLeads',
          component: () => import('../views/Leads/HiddenLeads.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/leads/my',
          name: 'myLeads',
          component: () => import('../views/Leads/MyLeads.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/leads/markets',
          name: 'markets',
          component: () => import('../views/Leads/Markets.vue'),
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
      ]
    },
    
    {
      path: '/shiftleads',
      name: 'shiftLeads',
      component: () => import('../views/ShiftLeads/ShiftLeads.vue'),
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
        requiresAuth: true,
      },
    },
    {
      path: '/groups/grouphome', redirect: '/groups/:id',
      name: 'groupHome',
      component: () => import('../views/Groups/GroupHome.vue'),
      meta: {
        requiresAuth: true,
        refreshGroup: true
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
          path: '/groups/:id/applicants',
          name: 'groupApplicants',
          component: () => import('../views/Groups/Applicants.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/groups/:id/waitlist',
          name: 'groupWaitlist',
          component: () => import('../views/Groups/Waitlist.vue'),
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
      path: '/payroll/help',
      name: 'payrollHelp',
      component: () => import('../views/PayrollHelp/PayrollHelp.vue'),
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
      path: '/events/:id', redirect: '/events/:id/details',
      name: 'eventHome',
      component: () => import('../views/Events/EventHome.vue'),
      meta: {
        requiresAuth: true,
        refreshEvent: true
      },
      children: [
        {
          path: '/events/:id/details',
          name: 'eventDetails',
          component: () => import('../views/Events/Event.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/events/:id/checkin',
          name: 'eventCheckin',
          component: () => import('../views/Events/EventCheckin.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/events/:id/shifts',
          name: 'eventshifts',
          component: () => import('../views/Events/EventShifts.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/events/:id/placement',
          name: 'eventplacement',
          component: () => import('../views/Placements/Event.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/events/:id/timesheets',
          name: 'eventtimesheets',
          component: () => import('../views/Shifts/EventShifts.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/events/:id/files',
          name: 'eventFiles',
          props: true,
          component: () => import('../views/Events/EventFiles.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/events/:id/email',
          name: 'eventEmail',
          component: () => import('../views/Events/EventEmail.vue'),
          meta: {
            requiresAuth: true
          },
        },


        
      ]
    },
    {
      path: '/jobs',
      name: 'weeks',
      component: () => import('../views/Weeks/Weeks.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/addjob',
      name: 'addweek',
      component: () => import('../views/Weeks/AddWeek.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/jobs/:id', redirect: '/jobs/:id/details',
      name: 'weekHome',
      component: () => import('../views/Weeks/WeekHome.vue'),
      meta: {
        requiresAuth: true,
        refreshEvent: true
      },
      children: [
        {
          path: '/jobs/:id/details',
          name: 'weekDetails',
          component: () => import('../views/Weeks/Week.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
      ]
    },
    // {
    //   path: '/events/:id',
    //   name: 'event',
    //   component: () => import('../views/Events/Event.vue'),
    //   meta: {
    //     requiresAuth: true
    //   },
    // },
    
    
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
      path: '/positions',
      name: 'jobs',
      component: () => import('../views/Jobs/Jobs.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/positions/:id',
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
      path: '/shifts',
      name: 'activeShifts',
      component: () => import('../views/Shifts/ActiveShifts.vue'),
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
      path: '/contractors',
      name: 'evereeContractors',
      component: () => import('../views/Everee/Contractors.vue'),
      meta: {
        requiresAuth: true
      },
    },
    // {
    //   path: '/payrolldata2',
    //   name: 'evereeContractorsTable',
    //   component: () => import('../views/Everee/Contractors2.vue'),
    //   meta: {
    //     requiresAuth: true
    //   },
    // },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/Users/Users.vue'),
      meta: {
        requiresAuth: true
      },
      afterRouteLeave(to, from, next) {
        return $store.dispatch('clearUserState').then(next)
        console.log('changing')
        
      },
    },
    {
      path: '/users/:id', redirect: '/users/:id/details',
      name: 'userHome',
      component: () => import('../views/Users/User.vue'),
      meta: {
        requiresAuth: true,
        refreshUser: true
      },
        children: [
          {
            path: '/users/:id/details',
            name: 'userDetails',
            component: () => import('../views/Users/UserDetails.vue'),
            props: true,
            meta: {
              requiresAuth: true
            },
          },
          {
            path: '/users/:id/certs',
            name: 'userCerts',
            component: () => import('../views/Users/UserCerts.vue'),
            props: true,
            meta: {
              requiresAuth: true
            },
          },
          {
            path: '/users/:id/groups',
            name: 'userGroups',
            component: () => import('../views/Users/UserGroups.vue'),
            props: true,
            meta: {
              requiresAuth: true
            },
          },
          {
            path: '/users/:id/skills',
            name: 'userSkills',
            component: () => import('../views/Users/UserSkills.vue'),
            props: true,
            meta: {
              requiresAuth: true
            },
          },
          {
            path: '/users/:id/payhistory',
            name: 'userPayHistory',
            component: () => import('../views/Users/UserPayHistory.vue'),
            props: true,
            meta: {
              requiresAuth: true
            },
          },
          {
            path: '/users/:id/everee',
            name: 'userEveree',
            component: () => import('../views/Users/UserEveree.vue'),
            props: true,
            meta: {
              requiresAuth: true
            },
          },
          {
            path: '/users/:id/emergency',
            name: 'userEmergency',
            component: () => import('../views/Users/UserEmergency.vue'),
            props: true,
            meta: {
              requiresAuth: true
            },
          },
          {
            path: '/users/:id/id',
            name: 'userId',
            component: () => import('../views/Users/UserId.vue'),
            props: true,
            meta: {
              requiresAuth: true
            },
          },
          {
            path: '/users/:id/backgroundcheck',
            name: 'userBackgroundCheck',
            component: () => import('../views/Users/UserBackgroundCheck.vue'),
            props: true,
            meta: {
              requiresAuth: true
            },
          },
          {
            path: '/users/:id/backgroundcheck/:ic',
            name: 'backgroundCheck',
            component: () => import('../views/Users/Check.vue'),
            props: true,
            meta: {
              requiresAuth: true
            },
          },

        {
          path: '/users/:id/assignments',
          name: 'userAssignments',
          component: () => import('../views/Users/UserAssignments.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/users/:id/payroll',
          name: 'userPayroll',
          component: () => import('../views/Users/UserPayroll.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/users/:id/notes',
          name: 'userNotes',
          component: () => import('../views/Users/UserNotes.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/users/:id/gallery',
          name: 'userGallery',
          component: () => import('../views/Users/UserGallery.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/users/:id/reviews',
          name: 'userReviews',
          component: () => import('../views/Users/UserReviews.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/users/:id/messages',
          name: 'userMessages',
          component: () => import('../views/Users/UserMessages.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
      ]
    },
    // {
    //   path: '/users/:id',
    //   name: 'user',
    //   component: () => import('../views/Users/User.vue'),
    //   meta: {
    //     requiresAuth: true
    //   },
    // },
    
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: {
        requiresAuth: true
      },
    },

    {
      path: '/access', redirect: '/access/clients',
      name: 'clientAccessHome',
      component: () => import('../views/ClientAccess/ClientAccessHome.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/access/clients',
          name: 'clientAccess',
          component: () => import('../views/ClientAccess/ClientAccess.vue'),
          props: true,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/access/new',
          name: 'giveClientAccess',
          component: () => import('../views/ClientAccess/GiveAccess.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/access/clients/:id',
          name: 'manageAccess',
          component: () => import('../views/ClientAccess/ManageAccess.vue'),
          meta: {
            requiresAuth: true
          },
        },
      ]
    },

    {
      path: '/timesheets/:id',
      name: 'shift',
      component: () => import('../views/Shifts/Shift.vue'),
      meta: {
        requiresAuth: true
      },
    },

  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = auth.currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  let refreshUser = to.matched.some(x => x.meta.refreshUser)
  let refreshEvent = to.matched.some(x => x.meta.refreshEvent)
  let refreshGroup = to.matched.some(x => x.meta.refreshGroup)

  if (requiresAuth && !currentUser) next('login');
  // else if (!requiresAuth && currentUser) next('dashboard');
  else next();

  if (refreshGroup && (to.name == "groupHome" || to.name == "groupEdit" || to.name == "groupMessages" || to.name == "groupWaitlist" || to.name == "groupApplicants" || to.name == "group"))
  {
    console.log('not clearing group')
  
  } else if (refreshGroup) {
    store.dispatch('clearGroupState')
  } else {

  }

  if (refreshUser && (to.name == "userSkills" || to.name == "userPayHistory" || to.name == "userId" || to.name == "userGroups" || to.name == "userEmergency" || to.name == "userCerts" || to.name == "userBackgroundCheck" || to.name == "userDetails" || to.name == "userPayroll" || to.name == "userAssignments" || to.name == "userNotes" || to.name == "userGallery" || to.name == "userReviews" || to.name == "userMessages")) 
  {
    console.log('not clearing state')
  
  } else if (refreshUser) {
    console.log(to.name)
    console.log('clearing state')
    store.dispatch('clearUserState')
  } else {

  }

  if (refreshEvent && (to.name == "eventDetails" || to.name == "eventplacement" || to.name == "eventshifts" || to.name == "eventCheckin" || to.name == "eventtimesheets" || to.name == "weekCheckin" || to.name == "weekDetails"))
  {
    console.log('not clearing state')
  } else if (refreshEvent) {
    store.dispatch('clearEventState')
    store.dispatch('clearWeekState')
  } else {

  }
});

export default router;

// // router.beforeEach((to, from, next) => {
// //   const requiresAuth = from.matched.some(x => x.meta.requiresAuth)
// //   // const refreshUser = to.matched.some(x => x.meta.refreshUser)
// //   // const refreshEvent = to.matched.some(x => x.meta.refreshEvent)

//   if (refreshUser && (to.name == "userDetails" || to.name == "userPayroll" || to.name == "userAssignments" || to.name == "userNotes" || to.name == "userGallery" || to.name == "userReviews" || to.name == "userMessages")) 
//   {
//     console.log('not clearing state')
  
//   } else  {
//     console.log(to.name)
//     console.log('clearing state')
//     store.dispatch('clearUserState')
//   }

//   if (refreshEvent && (to.name == "eventDetails" || to.name == "eventplacement" || to.name == "eventshifts" || to.name == "eventCheckin" || to.name == "eventtimesheets"))
//   {
//     console.log('not clearing state')
//   } else  {
//     store.dispatch('clearEventState')
//   }

//   if (requiresAuth) {
//       console.log('not currentUser')
//       store.dispatch('logout')
//       next('/login')

// //   }
// //   // else if (requiresAuth && currentUser) {
//   //   console.log('currentUser')
// //   //     next()
// //   // } 
// //   else {
// //     console.log('else')
// //       next()
// //   }
// // })

// // export default router