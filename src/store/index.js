import Vue from 'vue'
import Vuex from 'vuex'
// import * as fb from '../firebaseConfig'
const fb = require('../firebaseConfig.js')
import router from '../router/index'
import firebase from 'firebase/app';

Vue.use(Vuex)

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
  }
})


const store = new Vuex.Store({
  state: {
    userProfile: {},
    currentUser: null,
    emailVerified: '',
    errorMessage: '',
    venues: [],
    venueInfo: {},
    venueEvents: [],
    venueFollowers: [],
    users:[],
    userInfo:{},
    userNotes: [],
    userMessages: [],
    userEmailVerified: '',
    events: [],
    eventInfo: {},
    eventShifts: [],
    eventDays: [],
    eventsByDay: [],
    eventUsers: [],
    eventDrops: [],
    currentEvents: [],
    pastEvents: [],
    jobs:[],
    jobInfo: {},
    faqs:[],
    faqInfo: {},
    clients:[],
    clientInfo: {},
    dayShifts: [],
    dayUsers: [],
    availableUsers: [],
    dayEvents: [],
    shifts:[],
    shift:{},
    shiftAssignments: [],
    usersPerDay: [],
    eventShifts: [],
    dayShifts: [],
    opr: [],
    eventTimesheetNotes: [],
    mgrs: [],
    mgrInfo: {},
    userEvents: [],
    userAssignments: [],
    accountingNotes: [],
    payrollHelp: [],
    groups: [],
    group: {},
    groupUsers: [],
    groupMessages: [],
    reviews: [],
    contacts: [],
    contactInfo: {},
    contactNotes: [],
    clientNotes: [],
    clientVenues: []
  },
  actions: {
    async login({ dispatch, commit }, form) {
      // sign user in
      const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
      .catch(err => {
        console.log(err)
        commit('setErrorMessage', err.message)
        })

      // fetch user profile and set in state
      if (user && user.email && user.email.endsWith('mvpeventstaffing.com')) {
        dispatch('fetchUserProfile', user)
      } else {
        store.dispatch('logout')
      }
    },

    


    async signup({ dispatch }, form) {
      // sign user up
      const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)

      // create user object in userCollections
      await fb.usersCollection.doc(user.uid).set({
        firstName: form.firstName,
        lastName: form.lastName,
        id: user.uid,
        email: form.email,
        skills: [],
        status: 'applied',
        created: fb.firestore.FieldValue.serverTimestamp(),
      })


      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },
    async fetchUserProfile({ commit }, user) {

      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get()

      // set user profile in state
      commit('emailVerified', user.emailVerified)

      // set user profile in state
      commit('setUserProfile', userProfile.data())
      store.dispatch('getVenues')
      store.dispatch('getJobsState')
      store.dispatch('getClients')
      store.dispatch('getGroups')

      // change route to dashboard
      if (router.currentRoute.path === '/login') {
        router.push('/dashboard')
      }
    },
    async logout({ commit }) {
      // log user out
      await fb.auth.signOut()

      // clear user data from state
      commit('setUserProfile', {})
      commit('setEvents', [])
      commit('setVenues', [])
      commit('setJobs', [])
      commit('setClients', [])
      commit('setContacts', [])
      commit('setGroups', [])

      // redirect to login view
      router.push('/')
    },
    getUserProfile({ commit, state }) {
      fb.usersCollection.doc(state.currentUser.uid)
      .onSnapshot(function (doc) {
        if (doc.exists) {
          commit('setUserProfile', doc.data())
        } else {

        }
      })
    },
    updateUserProfile({ commit }, payload) {
      fb.usersCollection.doc(payload.id).update(payload)
      const userProfile = fb.usersCollection.doc(payload.user.id).get()
      commit('setUserProfile', userProfile)
      
    },
    updateUser2({ commit }, payload) {
      console.log(payload)
      let user = payload
      fb.usersCollection.doc(payload.userId).update(
      {
        employeeNumber: payload.employeeNumber,
        employeeStatus: payload.employeeStatus
      })
      .then(
        store.dispatch('fetchUserProfile', user)
      )
    },
    updateUser({ commit }, payload) {
      console.log(payload)
      let user = payload
      fb.usersCollection.doc(payload.id).update(payload)
      .then(
        store.dispatch('fetchUserProfile', user)
      )
    },
    updateUserEmail({ commit }, payload) {
      const user = fb.auth.currentUser

      console.log(user)
      user.updateEmail(payload.email).then(() => {
       console.log('email changed')
      }).catch((error) => {
        console.log(error)
        commit('setErrorMessage', error)
      })
      fb.usersCollection.doc(payload.id).update(payload)
      .then(
        store.dispatch('fetchUserProfile', user)
      )
    },
    resendVerificationEmail({ commit }) {
      fb.auth.currentUser.sendEmailVerification()
      .then(() => {
       console.log('email changed')
      }).catch((error) => {
        console.log(error)
      })
    },
    incrementUser({ commit }, payload) {
      fb.usersCollection.doc(payload.user.id).update({
        points: firebase.firestore.FieldValue.increment(payload.points)
      })
      store.dispatch("getUserFromId", payload.user.id);
    },


    /*User Messages*/
    sendUserMessage({ commit }, payload) {
      console.log(payload)
      fb.userMessagesCollection.add(payload)
      .then(
        doc => {
          fb.userMessagesCollection.doc(doc.id).update({
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp()
          })
        }
      )
    },
    getUserMessages({ commit }, payload) {
      console.log("getting Messages")
      fb.userMessagesCollection.where("userId", "==", payload).orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let userMessagesArray = []

        querySnapshot.forEach(doc => {
          let message = doc.data()
          message.id = doc.id
          userMessagesArray.push(message)
        })
        commit('setUserMessages', userMessagesArray)
      })
    },

    /*Groups*/
    addGroup({ commit }, payload) {
      console.log(payload)
      fb.groupsCollection.add(payload)
      .then(
        doc => {
          fb.groupsCollection.doc(doc.id).update({
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp(),
          })
        }
      )
    },
    updateGroup({ commit }, payload) {
      console.log(payload)
      fb.groupsCollection.doc(payload.id).update(payload)
    },
    deleteGroup({ commit }, payload) {
      fb.groupsCollection.doc(payload.id).delete()
    },
    updateGroups({ commit, state }, payload) {
      console.log(payload)
      let user = payload.user
      fb.usersCollection.doc(user.id).update(user)
      // .then(
      //   store.dispatch('fetchUserProfile', user)
      // )
      payload.groups.forEach(p => {
        if (state.groups.some(i => i.title.includes(p))) {
          console.log("includes")
        } else {
          console.log(p)
          fb.groupsCollection.add({
            title: p,
            owner: state.currentUser.uid
          })
          .then(
            doc => {
            fb.groupsCollection.doc(doc.id).update({
              id: doc.id,
              created: fb.firestore.FieldValue.serverTimestamp()
            })
          })
        }
      })
    },
    getGroups({ commit }) {
      fb.groupsCollection.orderBy('title', 'asc').onSnapshot(querySnapshot => {
        let groupsArray = []
        querySnapshot.forEach(doc => {
          let group = doc.data()
          groupsArray.push(group)
        })
        const unique = Array.from(new Set(groupsArray.map(a => a.title)))
         .map(title => {
           return groupsArray.find(a => a.title === title)
         })
        commit('setGroups', unique)
      })
    },
    getGroupFromId({ commit }, payload) {
      fb.groupsCollection.doc(payload).get()
      .then(
        doc => {
          commit("setGroup", doc.data())
          console.log(doc.data().title)
          let groupUsersArray = []
          fb.usersCollection.where("groups", "array-contains", doc.data().title).onSnapshot(querySnapshot => {
          querySnapshot.forEach(function (doc) {
            let user = doc.data()
            groupUsersArray.push(user)
          })
          commit('setGroupUsers', groupUsersArray)
        })
      })
      store.dispatch('getGroupMessages', payload)
    },
    getGroupMessages({ commit }, payload) {
      console.log("getting Messages")
      fb.groupUpdatesCollection.where("groupId", "==", payload).orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let groupMessagesArray = []

        querySnapshot.forEach(doc => {
          let message = doc.data()
          message.id = doc.id
          groupMessagesArray.push(message)
        })
        let newArray = Object.values(groupMessagesArray.reduce((acc,cur)=>Object.assign(acc,{[cur.message]:cur}),{}))
        commit('setGroupMessages', newArray)
      })
    },
    clearGroupState({ commit }) {
      commit('setGroup', {})
      commit('setGroupUsers', [])
      commit('setGroupMessages', [])
    },


    /*PAYROLL HELP*/
    getPayrollHelp({ commit }) {
      fb.payHelpCollection.orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let payrollHelpArray = []
        querySnapshot.forEach(doc => {
          let ph = doc.data()
          ph.id = doc.id
          payrollHelpArray.push(ph)
        })
        commit('setPayrollHelp', payrollHelpArray)
      })
    },
    closePH({ commit }, payload) {
      fb.payHelpCollection.doc(payload.id).update({
        closed: true
      })
    },
    openPH({ commit }, payload) {
      fb.payHelpCollection.doc(payload.id).update({
        closed: false
      })
    },

    



    /*MESSAGING*/
    updateProfileEmail({ commit }, payload) {
      fb.emailsCollection.add(payload)
      .then(
        doc => {
        fb.emailsCollection.doc(doc.id).update({
          id: doc.id,
          created: fb.firestore.FieldValue.serverTimestamp()
        })
        fb.usersCollection.doc(payload.userId).update({
          updateProfileReminderSent: fb.firestore.FieldValue.serverTimestamp()
        })
      })
    },
    updatePayrollEmail({ commit }, payload) {
      fb.emailsCollection.add(payload)
      .then(
        doc => {
        fb.emailsCollection.doc(doc.id).update({
          id: doc.id,
          created: fb.firestore.FieldValue.serverTimestamp()
        })
        fb.usersCollection.doc(payload.userId).update({
          updatePayrollReminderSent: fb.firestore.FieldValue.serverTimestamp()
        })
      })
    },
    updateAvailabilityEmail({ commit }, payload) {
      fb.emailsCollection.add(payload)
      .then(
        doc => {
        fb.emailsCollection.doc(doc.id).update({
          id: doc.id,
          created: fb.firestore.FieldValue.serverTimestamp()
        })
        fb.usersCollection.doc(payload.userId).update({
          updateAvailabilityReminderSent: fb.firestore.FieldValue.serverTimestamp()
        })
      })
    },
    updateProfileText({ commit }, payload) {
      fb.textsCollection.add(payload)
      .then(
        doc => {
        fb.textsCollection.doc(doc.id).update({
          id: doc.id,
          created: fb.firestore.FieldValue.serverTimestamp()
        })
        fb.usersCollection.doc(payload.userId).update({
          updateProfileReminderSent: fb.firestore.FieldValue.serverTimestamp()
        })
      })
    },
    updatePayrollText({ commit }, payload) {
      fb.textsCollection.add(payload)
      .then(
        doc => {
        fb.textsCollection.doc(doc.id).update({
          id: doc.id,
          created: fb.firestore.FieldValue.serverTimestamp()
        })
        fb.usersCollection.doc(payload.userId).update({
          updatePayrollReminderSent: fb.firestore.FieldValue.serverTimestamp()
        })
      })
    },
    updateAvailabilityText({ commit }, payload) {
      fb.textsCollection.add(payload)
      .then(
        doc => {
        fb.textsCollection.doc(doc.id).update({
          id: doc.id,
          created: fb.firestore.FieldValue.serverTimestamp()
        })
        fb.usersCollection.doc(payload.userId).update({
          updateAvailabilityReminderSent: fb.firestore.FieldValue.serverTimestamp()
        })
      })
    },


    


    /*VENUES*/
    addVenue({ commit }, payload) {
      fb.venuesCollection.add(payload)
      .then(
        doc => {
          fb.venuesCollection.doc(doc.id).update({
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp(),
          })
        }
      )
    },
    updateVenue({ commit }, payload) {
      fb.venuesCollection.doc(payload.id).update(payload)
    },
    deleteVenue({ commit }, payload) {
      fb.venuesCollection.doc(payload).delete()
    },
    updateOpr({ commit }, payload) {
      fb.oprCollection.doc(payload.id).update(payload)
    },
    removeOpr({ commit }, payload) {
      console.log(payload)
      fb.oprCollection.where("id", "==", payload.id).get()
      .then(
        doc => {
          fb.oprCollection.doc(doc.id).delete()
        }
      )
    },
    removeOpr2({ commit }, payload) {
      console.log(payload)
      fb.oprCollection.where("userId", "==", payload.userId).where("shiftId", "==", payload.shiftId).onSnapshot(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          console.log(doc.data())
          fb.oprCollection.doc(doc.data().id).delete()
        })
      })
      store.dispatch('removeOprAssignment', payload)
      // .then(
      //   doc => {
      //     console.log(doc.data())
      //     fb.oprCollection.doc(doc.id).delete()
      //   }
      // )
    },
    removeOprAssignment({ commit }, payload) {
      console.log(payload)
      fb.assignmentsCollection.where("userId", "==", payload.userId).where("shiftId", "==", payload.shiftId).onSnapshot(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          console.log(doc.data())
          fb.assignmentsCollection.doc(doc.data().id).update({
            opr: false
          })
        })
      })
    },
    getVenues({ commit }) {
      fb.venuesCollection.orderBy('address.state', 'asc').orderBy('address.city', 'asc').onSnapshot(querySnapshot => {
        let venuesArray = []
        querySnapshot.forEach(doc => {
          let venue = doc.data()
          venue.id = doc.id
          venuesArray.push(venue)
        })
        commit('setVenues', venuesArray)
      })
    },
    getVenueFromId({ commit }, payload) {
      console.log(payload)
      fb.venuesCollection.where("id", "==", payload).onSnapshot(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          commit("setVenueInfo", doc.data())
          store.dispatch('getVenueEvents', payload)
          store.dispatch('getVenueFollowers', payload)
        })
      })
    },
    getVenueFollowers({ commit }, payload) {
      fb.venueFollowersCollection.where("venue", "==", payload).onSnapshot(querySnapshot => {
        let followersArray = []
        querySnapshot.forEach(doc => {
          let follower = doc.data()
          follower.id = doc.id
          followersArray.push(follower)
        })
        fb.venuesCollection.doc(payload).update({
          followers: followersArray.length
        })
        commit('setVenueFollowers', followersArray)
      })
    },
    getVenueEvents({ commit }, payload) {
      fb.eventsCollection.where("venueId", "==", payload).orderBy('startDate', 'desc').onSnapshot(querySnapshot => {
        console.log(payload)
        let eventsArray = []

        if (querySnapshot.empty) {
          console.log('No matching documents.')
          commit('setVenueEvents', null)
        }

        querySnapshot.forEach(doc => {
          let event = doc.data()
          event.id = doc.id

          eventsArray.push(event)
          commit('setVenueEvents', eventsArray)
        })
      })
    },
    clearVenueState({ commit }) {
      commit('setVenueInfo', {})
      commit('setVenueEvents', null)
      commit('setVenueFollowers', [])
    },
    clearVenuesState({ commit }) {
      commit('setVenues', [])
    },





    /*USERS*/
    getUsers({ commit }) {
      fb.usersCollection.onSnapshot(querySnapshot => {
        let usersArray = []
        querySnapshot.forEach(doc => {
          let user = doc.data()
          usersArray.push(user)
        })
        commit('setUsers', usersArray)
      })
    },
    getUserFromId({ commit }, payload) {
      console.log("getting")
      fb.usersCollection.doc(payload).get()
      .then(
        doc => {
          commit("setUserInfo", doc.data())
          store.dispatch('getUserNotes', payload)
          store.dispatch('getUserMessages', payload)
          store.dispatch('getUserReviews', payload)
          store.dispatch('getUserEvents', payload)
          store.dispatch('getUserAssignments', payload)
        }
      )
    },
    // getUserFromId({ commit }, payload) {
    //   fb.usersCollection.where("id", "==", payload).onSnapshot(querySnapshot => {
    //     querySnapshot.forEach(function (doc) {
    //       commit("setUserInfo", doc.data())
    //       store.dispatch('getUserNotes', payload)
    //     })
    //   })
    // },
    addAccountingNote({ commit }, payload) {
      fb.accountingNotesCollection.add(payload)
      .then(
        doc => {
          fb.accountingNotesCollection.doc(doc.id).update({
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp()
          })
        }
      )
    },
    getAccountingNotes({ commit }, payload) {
      console.log(payload)
      fb.accountingNotesCollection.where("event.id", "==", payload).orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let accountingNotesArray = []

        querySnapshot.forEach(doc => {
          let note = doc.data()
          note.id = doc.id
          accountingNotesArray.push(note)
        })
        commit('setAccountingNotes', accountingNotesArray)
      })
    },
    clearAccountingNotes({ commit }) {
      commit('setAccountingNotes', [])
    },
    addUserReview({ commit, state }, payload) {
      fb.reviewsCollection.add(payload)
      .then(
        doc => {
          fb.reviewsCollection.doc(doc.id).update({
            userId: payload.userId,
            submittedBy: payload.submittedBy,
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp()
          })
        }
      )
      store.dispatch('getUserReviews', payload.userId)
    },
    addContactNote({ commit, state }, payload) {
      console.log(payload)
      fb.contactNotesCollection.add(payload)
      .then(
        doc => {
          fb.contactNotesCollection.doc(doc.id).update({
            userId: payload.userId,
            submittedBy: payload.submittedBy,
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp()
          })
        }
      )
    },
    getContactNotes({ commit }, payload) {
      console.log("getting notes")
      fb.contactNotesCollection.where("userId", "==", payload).orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let userNotesArray = []

        querySnapshot.forEach(doc => {
          let note = doc.data()
          note.id = doc.id
          userNotesArray.push(note)
        })
        commit('setContactNotes', userNotesArray)
      })
    },
    addClientNote({ commit, state }, payload) {
      console.log(payload)
      fb.clientNotesCollection.add(payload)
      .then(
        doc => {
          fb.clientNotesCollection.doc(doc.id).update({
            userId: payload.userId,
            submittedBy: payload.submittedBy,
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp()
          })
        }
      )
    },
    getClientNotes({ commit }, payload) {
      console.log("getting notes")
      console.log(payload)
      fb.clientNotesCollection.where("userId", "==", payload).orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let userNotesArray = []

        querySnapshot.forEach(doc => {
          let note = doc.data()
          note.id = doc.id
          userNotesArray.push(note)
        })
        commit('setClientNotes', userNotesArray)
      })
    },
    addUserNote({ commit, state }, payload) {
      console.log(payload)
      fb.userNotesCollection.add(payload)
      .then(
        doc => {
          fb.userNotesCollection.doc(doc.id).update({
            userId: payload.userId,
            submittedBy: payload.submittedBy,
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp()
          })
        }
      )
    },
    getUserReviews({ commit }, payload) {
      console.log("getting review")
      fb.reviewsCollection.where("userId", "==", payload).orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let reviewsArray = []

        querySnapshot.forEach(doc => {
          let review = doc.data()
          review.id = doc.id
          reviewsArray.push(review)
        })
        commit('setReviews', reviewsArray)
        let length = reviewsArray.length
        let totalArray = []
        reviewsArray.forEach((element) => {
          totalArray.push(element.rating)
        })
        let newRating = totalArray.reduce((a, b) => a + b, 0) / length
        fb.usersCollection.doc(payload).update({
          rating: newRating
        })
        // store.dispatch('getUserFromId', payload)
      })
    },
    // getUserReviews({ commit }, payload) {
    //   fb.reviewsCollection.where("userId", "==", payload).orderBy('created', 'desc').onSnapshot(querySnapshot => {
    //     let reviewsArray = []

    //     querySnapshot.forEach(doc => {
    //       let review = doc.data()
    //       review.id = doc.id
    //       reviewsArray.push(review)
    //     })
    //     commit('setReviews', reviewsArray)
    //   })
    // },
    getUserNotes({ commit }, payload) {
      console.log("getting notes")
      fb.userNotesCollection.where("userId", "==", payload).orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let userNotesArray = []

        querySnapshot.forEach(doc => {
          let note = doc.data()
          note.id = doc.id
          userNotesArray.push(note)
        })
        commit('setUserNotes', userNotesArray)
      })
    },
    getUserEvents({ commit }, payload) {
      fb.userDaysCollection.where("userId", "==", payload).orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let eventsArray = []
        querySnapshot.forEach(doc => {
          let event = doc.data()
          event.id = doc.id
          eventsArray.push(event)
        })
        let myEvents = []
        eventsArray.forEach(ev => {
          let evId = ev.preferredEvent
          if (evId != null) {
            fb.eventsCollection.where("id", "==", evId).onSnapshot(querySnapshot => {
              querySnapshot.forEach(doc => {
                let myEvent = doc.data()
                myEvents.push(myEvent)
              })
            })
          }
        })
        commit('setUserEvents', myEvents)
      })
    },
    getUserAssignments({ commit }, payload) {
      fb.assignmentsCollection.where("userId", "==", payload).onSnapshot(querySnapshot => {
        let assignmentsArray = []
        querySnapshot.forEach(doc => {
          let shift = doc.data()
          assignmentsArray.push(shift)
          commit('setUserAssignments', assignmentsArray)
        })
      })
    },
    clearUserState({ commit }) {
      commit('setUserInfo', {})
      commit('setUserNotes', [])
      commit('setUserMessages', [])
      commit('setReviews', [])
      commit('setUserEvents', [])
      commit('setUserAssignments', [])
    },
    clearUsersState({ commit }) {
      commit('setUsers', [])
    },


    /*MGRS*/
    getMgrsState({ commit }, payload) {
      fb.mgrsCollection.onSnapshot(querySnapshot => {
        let mgrsArray = []
        querySnapshot.forEach(doc => {
          let mgr = doc.data()
          mgrsArray.push(mgr)
        })
        commit('setMgrs', mgrsArray)
      })
    },
    addMgr({ commit }, payload) {
      console.log(payload)
      fb.mgrsCollection.add(payload)
      .then(
        doc => {
          fb.mgrsCollection.doc(doc.id).update({
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp(),
          })
        }
      )
    },
    getMgrFromId({ commit }, payload) {
      fb.mgrsCollection.where("id", "==", payload).onSnapshot(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          commit("setMgrInfo", doc.data())
        })
      })
    },
    deleteMgr({ commit }, payload) {
      fb.mgrsCollection.doc(payload).delete()
    },
    updateMgr({ commit }, payload) {
      fb.mgrsCollection.doc(payload.id).update(payload)
    },
    clearMgrState({ commit }) {
      commit('setMgrInfo', {})
    },
    clearMgrsState({ commit }) {
      commit('setMgrs', [])
    },



    /*JOBS*/
    addJob({ commit }, payload) {
      fb.jobsCollection.add(payload)
      .then(
        doc => {
          fb.jobsCollection.doc(doc.id).update({
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp(),
          })
        }
      )
    },
    getJobsState({ commit }) {
      fb.jobsCollection.onSnapshot(querySnapshot => {
        let jobsArray = []
        querySnapshot.forEach(doc => {
          let job = doc.data()
          jobsArray.push(job)
        })
        commit('setJobs', jobsArray)
      })
    },
    getJobFromId({ commit }, payload) {
      fb.jobsCollection.where("id", "==", payload).onSnapshot(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          commit("setJobInfo", doc.data())
        })
      })
    },
    deleteJob({ commit }, payload) {
      fb.jobsCollection.doc(payload).delete()
    },
    updateJob({ commit }, payload) {
      fb.jobsCollection.doc(payload.id).update(payload)
    },
    clearJobState({ commit }) {
      commit('setJobInfo', {})
    },
    clearJobsState({ commit }) {
      commit('setJobs', [])
    },



    /*FAQS*/
    addFaq({ commit }, payload) {
      fb.faqsCollection.add(payload)
      .then(
        doc => {
          fb.faqsCollection.doc(doc.id).update({
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp(),
          })
        }
      )
    },
    getFaqsState({ commit }) {
      fb.faqsCollection.onSnapshot(querySnapshot => {
        let faqsArray = []
        querySnapshot.forEach(doc => {
          let faq = doc.data()
          faqsArray.push(faq)
        })
        commit('setFaqs', faqsArray)
      })
    },
    getFaqFromId({ commit }, payload) {
      fb.faqsCollection.where("id", "==", payload).onSnapshot(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          commit("setFaqInfo", doc.data())
        })
      })
    },
    deleteFaq({ commit }, payload) {
      fb.faqsCollection.doc(payload).delete()
    },
    updateFaq({ commit }, payload) {
      fb.faqsCollection.doc(payload.id).update(payload)
    },
    clearFaqState({ commit }) {
      commit('setFaqInfo', {})
    },
    clearFaqsState({ commit }) {
      commit('setFaqs', [])
    },


    /*CONTACTS*/
    addContact({ commit }, payload) {
      fb.contactsCollection.add(payload)
      .then(
        doc => {
          fb.contactsCollection.doc(doc.id).update({
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp(),
          })
        }
      )
    },
    getContacts({ commit }) {
      fb.contactsCollection.onSnapshot(querySnapshot => {
        let contactsArray = []
        querySnapshot.forEach(doc => {
          let contact = doc.data()
          contactsArray.push(contact)
        })
        commit('setContacts', contactsArray)
      })
    },
    getContactFromId({ commit }, payload) {
      fb.contactsCollection.where("id", "==", payload).onSnapshot(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          commit("setContactInfo", doc.data())
        })
      })
      store.dispatch('getContactNotes', payload)
    },
    deleteContact({ commit }, payload) {
      fb.contactsCollection.doc(payload).delete()
    },
    updateContact({ commit }, payload) {
      fb.contactsCollection.doc(payload.id).update(payload)
    },
    clearContactState({ commit }) {
      commit('setContactInfo', {})
      commit('setContactNotes', [])
    },
    clearContactsState({ commit }) {
      commit('setContacts', [])
    },




    /*CLIENTS*/
    addClient({ commit }, payload) {
      fb.clientsCollection.add(payload)
      .then(
        doc => {
          fb.clientsCollection.doc(doc.id).update({
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp(),
          })
        }
      )
    },
    getClients({ commit }) {
      fb.clientsCollection.onSnapshot(querySnapshot => {
        let clientsArray = []
        querySnapshot.forEach(doc => {
          let client = doc.data()
          clientsArray.push(client)
        })
        commit('setClients', clientsArray)
      })
    },
    getClientFromId({ commit }, payload) {
      fb.clientsCollection.where("id", "==", payload).onSnapshot(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          commit("setClientInfo", doc.data())
        })
      })
      store.dispatch('getClientNotes', payload)
      store.dispatch('getClientVenues', payload)
    },
    getClientVenues({ commit }, payload) {
      console.log(payload)
      fb.venuesCollection.onSnapshot(querySnapshot => {

        let venuesArray = []
        querySnapshot.forEach(doc => {
          let venue = doc.data()
          venuesArray.push(venue)
        })
        let newArray = []
        venuesArray.forEach((ven, i) => {
          // console.log(ven)
          if (ven.client && ven.client.length >= 1) {
            let clients = ven.client
            console.log(clients)
              clients.forEach(client => {
              if (client.id == payload) {
                newArray.push(ven)
              }
            })
          }
          
          
          // if ((ven.client && ven.client.length >= 1) && (ven.client[i] && ven.client[i].id == payload)) {
          //   newArray.push(ven)
          // } else {

          // }
        })
        console.log(newArray)
        commit('setClientVenues', newArray)
      })
    },
    addClientFile({ commit }, payload) {
      fb.clientsCollection.doc(payload.client.id).update({
        files: firebase.firestore.FieldValue.arrayUnion(payload)
      })
    },
    deleteClient({ commit }, payload) {
      fb.clientsCollection.doc(payload).delete()
    },
    updateClient({ commit }, payload) {
      fb.clientsCollection.doc(payload.id).update(payload)
    },
    clearClientState({ commit }) {
      commit('setClientInfo', {})
      commit('setClientNotes', [])
      commit('setClientVenues', [])
    },
    clearClientsState({ commit }) {
      commit('setClients', [])
    },


   

    /*EVENTS*/
    addEvent({ commit }, payload) {
      console.log(payload)
      fb.eventsCollection.add(payload)
      .then(
        doc => {
          fb.eventsCollection.doc(doc.id).update({
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp(),
            venueId: payload.venue.id,
            jobs: payload.jobs || [],
            days: payload.days || []
          })
        }
      )
      store.dispatch('alertFollowers', payload)
    },
    alertFollowers({ commit }, payload) {
      fb.venueFollowersCollection.where("venue", "==", payload.venue.id).onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          let message = {
            phone: doc.data().phone,
            name: doc.data().name,
            venueName: doc.data().venueName,
            venueId: doc.data().venue,
            user: doc.data().user,
            event: payload.title,
            start: payload.startDate,
            created: fb.firestore.FieldValue.serverTimestamp(),
            slug: payload.slug
          }
          console.log(message)
          fb.smsCollection.add(message)
        })
      })
    },
    updateEventVenue({ commit }, payload) {
      fb.eventsCollection.doc(payload.id).update(payload)
    },
    updateEvent({ commit }, payload) {
      fb.eventsCollection.doc(payload.id).update(payload)
      .then(
        doc => {
          store.dispatch('alertFollowers', payload)
        }
      )
    },
    updateEventStaff({ commit }, payload) {
      console.log(payload)
      fb.userDaysCollection.where("event", "==", payload.id).onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          let message = {
            phone: doc.data().phone || null,
            name: doc.data().fullName,
            userId: doc.data().userId,
            // email: doc.data().email || null,
            message: payload.updateMessage,
            event: payload
          }
        })
        fb.smsUpdatesCollection.add(message)
      })
      fb.eventsCollection.doc(payload.id).update({
        updateStaffSent: fb.firestore.FieldValue.serverTimestamp()
      })
    },
    updateShiftStaff({ commit }, payload) {
      console.log(payload)
      payload.staff.forEach(user => {
        let message = {
          shift: payload.shift,
          user: user,
          userId: user.id,
          message: payload.message,
          from: payload.from
        }
        fb.shiftUpdatesCollection.add(message)
      })
    },
    updateGroupStaff({ commit }, payload) {
      console.log(payload)
      payload.groupUsers.forEach(user => {
        let message = {
          groupId: payload.groupId,
          user: user,
          message: payload.message,
          from: payload.from
        }
        console.log(message)
        fb.groupUpdatesCollection.add(message)
        .then(
          doc => {
            fb.groupUpdatesCollection.doc(doc.id).update({
              id: doc.id,
              created: fb.firestore.FieldValue.serverTimestamp(),
            })
          }
        )
      })
    },
    deleteEvent({ commit }, payload) {
      fb.eventsCollection.doc(payload).delete()
    },
    getEvents({ commit }) {
      fb.eventsCollection.orderBy('startDate', 'asc').onSnapshot(querySnapshot => {
        let eventsArray = []
        let eventDays = []
        let currentEventsArray = []
        let pastEventsArray = []

        querySnapshot.forEach(doc => {
          let yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1);
          let startComp = new Date(doc.data().startDate)
          let endComp = new Date(doc.data().endDate)

          let event = doc.data()
          event.id = doc.id
          let start = doc.data().startDate
          let dateObject = new Date(start)

          eventsArray.push(event)
          eventDays.push(event.days)

          if (doc.data().published && (endComp >= yesterday || startComp >= yesterday)) {
            currentEventsArray.push(event)
            
          }

          // if (doc.data().published && startComp >= yesterday) {
          //   currentEventsArray.push(event)
          //   commit('setCurrentEvents', currentEventsArray)
          // }

          if (doc.data().published && startComp < yesterday) {
            pastEventsArray.push(event)
            
          }

        })
        commit('setCurrentEvents', currentEventsArray)
        commit('setEvents', eventsArray)
        commit('setPastEvents', pastEventsArray)


        let merged = [].concat.apply([], eventDays)
        let uniqueSet = new Set(merged)
        let uniqueEventDays = [...uniqueSet]
        commit('setEventDays', uniqueEventDays)

        // commit('setEventDays', uniqueEventDays.sort((a, b) => a.days[0] > b.days[0] ? 1 : a.days[0] === b.days[0] ? 0 : -1))
        
      })
    },
    getEventFromId({ commit }, payload) {
      fb.eventsCollection.doc(payload).get()
      .then(
        doc => {
          commit("setEventInfo", doc.data())
          store.dispatch('getUserNotes', payload)
        }
      )
      store.dispatch('getEventShifts', payload)
    },  
    clearEventState({ commit }) {
      commit('setEventInfo', {})
    },
    clearEventsState({ commit }) {
      commit('setEvents', [])
      commit('setCurrentEvents', [])
      commit('setPastEvents', [])
    },



    /*SHIFTS*/
    addEventShift({ commit }, payload) {
      fb.shiftsCollection.add(payload)
      .then(
        doc => {
          fb.shiftsCollection.doc(doc.id).update({
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp(),
          })
        }
      )
    },
    deleteShift({ commit }, payload) {
      fb.shiftsCollection.doc(payload).delete()
      fb.assignmentsCollection.where("shiftId", "==", payload).onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          fb.assignmentsCollection.doc(doc.id).delete()
        })
      })
      fb.userDaysCollection.where("shift", "==", payload).onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          fb.userDaysCollectionCollection.doc(doc.id).update({
            shift: null,
            dayStatus: null,
            status: "available"
          })
        })
      })
    },
    updateEventShift({ commit }, payload) {
      fb.shiftsCollection.doc(payload.id).update(payload)
    },
    getEventShifts({ commit }, payload) {
      console.log(payload)
      fb.shiftsCollection.where("eventId", "==", payload).orderBy('day', 'desc').onSnapshot(querySnapshot => {
        let shiftsArray = []
        querySnapshot.forEach(doc => {
          let shift = doc.data()
          shift.id = doc.id
          shiftsArray.push(shift)
        })
        commit('setEventShifts', shiftsArray)
      })
    },
    clearEventShifts({ commit }) {
      commit('setEventShifts', [])
    },
    getDayShifts({ commit }, payload) {
      console.log(payload)
      fb.shiftsCollection.where("eventId", "==", payload.event).where("day", "==", payload.day).onSnapshot(querySnapshot => {
        let shiftsArray = []
        querySnapshot.forEach(doc => {
          let shift = doc.data()
          shift.id = doc.id
          shiftsArray.push(shift)
        })
        commit('setDayShifts', shiftsArray)
      })
      store.dispatch('getAssignmentsForDay', payload)
      store.dispatch('getEventTimesheetNotes', payload.event)
    },
    clearDayShifts({ commit }) {
      commit('setDayShifts', [])
      commit('setShiftAssignments', [])
    },

    getShifts({ commit }, payload) {
      fb.shiftsCollection.orderBy('day', 'desc').onSnapshot(querySnapshot => {
        let shiftsArray = []
        querySnapshot.forEach(doc => {
          let shift = doc.data()
          shift.id = doc.id
          shiftsArray.push(shift)
        })
        commit('setShifts', shiftsArray)
      })
    },
    clearShiftsState({ commit }) {
      commit('setShifts', [])
    },
    getShiftFromId({ commit }, payload) {
      fb.shiftsCollection.doc(payload).get()
      .then(
        doc => {
          commit("setShift", doc.data())
        }
      )
      store.dispatch('getAssignmentsForShift', payload)
    },
    getAssignmentsForShift({ commit }, payload) {
      console.log(payload)
      fb.assignmentsCollection.where("shiftId", "==", payload).orderBy('firstName', 'asc').onSnapshot(querySnapshot => {
        let assignmentsArray = []
        querySnapshot.forEach(doc => {
          let assignment = doc.data()
          assignment.id = doc.id
          assignmentsArray.push(assignment)
        })
        commit('setShiftAssignments', assignmentsArray)
      })
    },
    getAssignmentsForDay({ commit }, payload) {
      console.log(payload)
      fb.assignmentsCollection.where("eventId", "==", payload.event).where("day", "==", payload.day).orderBy('firstName', 'asc').onSnapshot(querySnapshot => {
        let assignmentsArray = []
        querySnapshot.forEach(doc => {
          let assignment = doc.data()
          assignment.id = doc.id
          assignmentsArray.push(assignment)
        })
        commit('setShiftAssignments', assignmentsArray)
      })
    },
    clearShiftState({ commit }) {
      commit('setShift', {})
      commit('setShiftAssignments', [])
    },
    addUserToShift({ commit }, payload) {
      console.log(payload)
      fb.eventsCollection.doc(payload.shift.eventId).get()
        .then(function (doc) {
        let event = doc.data()
        let shift = payload.shift
        let shiftDay = payload.shift.day
        let dateObj = new Date(payload.shift.day);
        let month = dateObj.getUTCMonth() + 1;
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();
        let newdate = month + "/" + day + "/" + year;
        let shiftStart = payload.shiftStart
        let shiftEnd = payload.shiftEnd
        let assignment = {
          shiftId: shift.id,
          userId: payload.user.objectID,
          date: newdate,
          day: shift.day,
          eventId: shift.eventId,
          email: payload.user.email,
          firstName: payload.user.firstName,
          lastName: payload.user.lastName,
          phone: payload.user.phone,
          name:  shift.event,
          fileId: payload.user.employeeNumber || payload.user.contractorNumber || '123',
          position: shift.position.title,
          start: shiftDay + " " + shift.startTime,
          end: shiftDay + " " + shift.endTime,
          startTime: shift.startTime,
          endTime: shift.endTime,
          eventInfo: event,
          shiftStart: shiftStart,
          shiftEnd: shiftEnd,
          event: event.id,
          eventName: event.title,
          slug: event.slug,
        }
        console.log(assignment)
        fb.assignmentsCollection.add(assignment)
        .then(
          doc => {
            fb.assignmentsCollection.doc(doc.id).update({
              id: doc.id, 
              created: fb.firestore.FieldValue.serverTimestamp()
            })
          }
        )
        fb.eventStaffCollection.add(assignment)
        fb.userDaysCollection.where("userId", "==", assignment.userId).where("day", "==", assignment.day).get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              fb.userDaysCollection.doc(doc.id).update({
              event: assignment.event,
              slug: assignment.slug,
              event: assignment.eventId,
              fileId: assignment.fileId,
              eventName: assignment.eventName,
              status: "assigned",
              shift: assignment.shiftId
            })
          })
        })
      })
      
      
      

      
      
    },
    addEventTimesheetNote({ commit }, payload) {
      console.log(payload)
      fb.eventTimesheetNotesCollection.add(payload)
      .then(
        doc => {
          fb.eventTimesheetNotesCollection.doc(doc.id).update({
            eventId: payload.eventId,
            submittedBy: payload.submittedBy,
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp()
          })
        }
      )
    },
    getEventTimesheetNotes({ commit }, payload) {
      console.log(payload)
      fb.eventTimesheetNotesCollection.where("eventId", "==", payload).orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let userNotesArray = []

        querySnapshot.forEach(doc => {
          let note = doc.data()
          note.id = doc.id
          userNotesArray.push(note)
        })
        commit('setEventTimesheetNotes', userNotesArray)
      })
    },
    lockTheShifts({ commit }, payload) {
      let event = payload.event
      let shift = payload.shift
      let shiftDay = payload.shift.day
      let dateObj = new Date(payload.shift.day);
      let month = dateObj.getUTCMonth() + 1;
      let day = dateObj.getUTCDate();
      let year = dateObj.getUTCFullYear();
      let newdate = month + "/" + day + "/" + year;
      let shiftStart = payload.shiftStart
      let shiftEnd = payload.shiftEnd

      payload.rows.forEach(row => {
        let assignment = {
          shiftId: shift.id,
          userId: row.userId,
          date: newdate,
          day: shift.day,
          eventId: shift.eventId,
          email: row.email,
          firstName: row.firstName,
          lastName: row.lastName,
          phone: row.phone,
          name: shift.event,
          fileId: row.employeeNumber || row.contractorNumber || '123',
          position: shift.position.title,
          start: shiftDay + " " + shift.startTime,
          end: shiftDay + " " + shift.endTime,
          startTime: shift.startTime,
          endTime: shift.endTime,
          eventInfo: event,
          shiftStart: shiftStart,
          shiftEnd: shiftEnd,
          event: event.id,
          eventName: event.title,
          slug: event.slug,
          status: "assigned"
        }
        // console.log(assignment)
        // fb.userDaysCollection.where("userId", "==", assignment.userId).where("day", "==", assignment.day).get()
        // .then(function (querySnapshot) {
        //     querySnapshot.forEach(function (doc) {
        //       console.log(doc.data())
        //       fb.userDaysCollection.doc(doc.id).update({
        //       event: assignment.event,
        //       slug: assignment.slug,
        //       event: assignment.eventId,
        //       fileId: assignment.fileId,
        //       eventName: assignment.eventName,
        //       status: "assigned",
        //       shift: assignment.shiftId
        //     })
        //   })
        // })
        fb.assignmentsCollection.add(assignment)
        .then(
          doc => {
            fb.assignmentsCollection.doc(doc.id).update({
              id: doc.id, 
              created: fb.firestore.FieldValue.serverTimestamp()
            })
          }
        )
        fb.eventStaffCollection.add(assignment)

      })
    },


    /*PLACEMENTS*/
    preferEvent({ commit }, payload) {
      console.log(payload)
      fb.userDaysCollection.where("userId", "==", payload.userId).where("day", "==", payload.day).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            console.log(doc.id, " => ", doc.data())
            fb.userDaysCollection.doc(doc.id).update({
            preferredEvent: payload.event
          })
        })
      })

    },
    getEventPlacementFromId({ commit }, payload) {
      console.log(payload)
      fb.eventsCollection.where("id", "==", payload).onSnapshot(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          commit("setEventInfo", doc.data())
          store.dispatch('getEventUsers', doc.data().id)
          store.dispatch('getEventDrops', doc.data().id)
          store.dispatch("getEventShiftsState", doc.data().id)
        })
      })
    },
    getEventUsers({ commit }, payload) {
      fb.userDaysCollection.where("preferredEvent", "==", payload).orderBy('created', 'asc').onSnapshot(querySnapshot => {
        let eventUsersArray = []
        querySnapshot.forEach(doc => {
          let user = doc.data()
          eventUsersArray.push(user)
        })
        commit('setEventUsers', eventUsersArray)
      })
    },
    getEventDrops({ commit }, payload) {
      fb.dropsCollection.where("preferredEvent", "==", payload).orderBy('created', 'asc').onSnapshot(querySnapshot => {
        let eventUsersArray = []
        querySnapshot.forEach(doc => {
          let user = doc.data()
          eventUsersArray.push(user)
        })
        commit('setEventDrops', eventUsersArray)
      })
    },
    getDayShiftsState({ commit }, payload) {
      fb.shiftsCollection.where("day", "==", payload).orderBy('startTime', 'asc').onSnapshot(querySnapshot => {
        let dayShiftsArray = []
        querySnapshot.forEach(doc => {
          let dayShift = doc.data()
          dayShift.id = doc.id
          dayShiftsArray.push(dayShift)
        })
        commit('setDayShifts', dayShiftsArray)
        store.dispatch('getUserAvailabilityState', payload)
      })
    },
    getEventsByDay({ commit }, payload) {
      fb.eventsCollection.where("days", "array-contains", payload).orderBy('title', 'asc').onSnapshot(querySnapshot => {
        let dayEventsArray = []
        querySnapshot.forEach(doc => {
          let dayEvents = doc.data()
          dayEvents.id = doc.id
          dayEventsArray.push(dayEvents)
        })
        commit('setEventsByDay', dayEventsArray)
      })
    },
    getEventShiftsState({ commit }, payload) {
      fb.shiftsCollection.where("eventId", "==", payload).orderBy('day', 'asc').orderBy('startTime', 'asc').onSnapshot(querySnapshot => {
        let eventShiftsArray = []
        querySnapshot.forEach(doc => {
          let eventShift = doc.data()
          eventShift.id = doc.id
          eventShiftsArray.push(eventShift)
        })
        commit('setEventShifts', eventShiftsArray)
        // store.dispatch('getUserAvailabilityState', payload)
      })
    },
    getUserAvailabilityState({ commit }, payload) {
      console.log(payload)
      fb.userDaysCollection.where("day", "==", payload)
      // .get()
      // .then((querySnapshot) => {
      //   let dayUsersArray = []
      //   querySnapshot.forEach((doc) => {
      //     let dayUser = doc.data()
      //     dayUsersArray.push(dayUser)
      //   })
      //   commit('setDayUsers', dayUsersArray)
      // })
      .onSnapshot(querySnapshot => {
        let dayUsersArray = []
        querySnapshot.forEach(doc => {
          let dayUser = doc.data()
          dayUsersArray.push(dayUser)
        })
        commit('setDayUsers', dayUsersArray)
      })
    },
    // getDayUserListState({ commit }, payload) {
    //   fb.usersCollection.onSnapshot(querySnapshot => {
    //     let usersArray = []
    //     querySnapshot.forEach(doc => {
    //       let user = doc.data()
    //       user.id = doc.id
    //       usersArray.push(user)
    //     })
    //     const availableUsers = usersArray.filter(item => payload.includes(item.id))
    //     commit('setAvailableUsers', availableUsers)
    //   })
    // },
    getDayEventsState({ commit }, payload) {
      fb.eventsCollection.where("days", "array-contains", payload).orderBy('startDate', 'desc').onSnapshot(querySnapshot => {
        let dayEventsArray = []
        querySnapshot.forEach(doc => {
          let dayEvent = doc.data()
          dayEvent.id = doc.id
          dayEventsArray.push(dayEvent)
        })
        commit('setDayEvents', dayEventsArray)
      })
    },
    removeUserPlacement({ commit }, payload) {
      console.log(payload)
      fb.userDaysCollection.doc(payload.id).update({
        status: "available", 
        shift: null,
        event: null,
        eventName: null,
        slug: null
      })
    },
    reserveUser({ commit }, payload) {
      console.log(payload)
      fb.usersCollection.doc(payload.userId).get()
      .then(
        doc => {
          let dateObj = new Date(payload.day);
          let month = dateObj.getUTCMonth() + 1;
          let day = dateObj.getUTCDate();
          let year = dateObj.getUTCFullYear();
          let newdate = month + "/" + day + "/" + year;
          fb.userDaysCollection.doc(payload.id).update({
            dayStatus: 'hired',
            email: doc.data().email,
            phone: doc.data().phone,
            dateFormat: newdate,
          })
        }
      )
    },
    addPlacement({ commit }, payload) {
      console.log(payload)
      fb.userDaysCollection.doc(payload.id).update({status: "placed", shift: payload.placement.shiftId})
    },
    lockAShift({ commit }, payload) {
      let event = payload.event
      let shift = payload.shift
      let shiftDay = payload.shift.day
      let dateObj = new Date(payload.shift.day);
      let month = dateObj.getUTCMonth() + 1;
      let day = dateObj.getUTCDate();
      let year = dateObj.getUTCFullYear();
      let newdate = month + "/" + day + "/" + year;
      let shiftStart = payload.shiftStart
      let shiftEnd = payload.shiftEnd

      let assignment = {
        shiftId: shift.id,
        userId: payload.row.userId,
        date: newdate,
        day: shift.day,
        eventId: shift.eventId,
        email: payload.row.email,
        firstName: payload.row.firstName,
        lastName: payload.row.lastName,
        phone: payload.row.phone,
        name:  shift.event,
        fileId: payload.row.employeeNumber || payload.row.contractorNumber || '123',
        position: shift.position.title,
        start: shiftDay + " " + shift.startTime,
        end: shiftDay + " " + shift.endTime,
        startTime: shift.startTime,
        endTime: shift.endTime,
        eventInfo: event,
        shiftStart: shiftStart,
        shiftEnd: shiftEnd,
        event: event.id,
        eventName: event.title,
        slug: event.slug,
      }
      fb.assignmentsCollection.add(assignment)
      .then(
        doc => {
          fb.assignmentsCollection.doc(doc.id).update({
            id: doc.id, 
            created: fb.firestore.FieldValue.serverTimestamp()
          })
        }
      )
      fb.eventStaffCollection.add(assignment)
      // fb.userDaysCollection.where("userId", "==", assignment.userId).where("day", "==", assignment.day).get()
      // .then(function (querySnapshot) {
      //     querySnapshot.forEach(function (doc) {
      //       fb.userDaysCollection.doc(doc.id).update({
      //       event: assignment.event,
      //       slug: assignment.slug,
      //       event: assignment.eventId,
      //       fileId: assignment.fileId,
      //       eventName: assignment.eventName,
      //       status: "assigned",
      //       shift: assignment.shiftId
      //     })
      //   })
      // })
    },
    lockShift({ commit }, payload) {
      fb.userDaysCollection.where("userId", "==", payload.userId).where("day", "==", payload.day).get()
      .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            fb.userDaysCollection.doc(doc.id).update({
            event: payload.event,
            slug: payload.slug,
            event: payload.eventId,
            fileId: payload.fileId,
            eventName: payload.eventName,
            status: "assigned",
            shift: payload.shiftId
          })
        })
      })
      fb.assignmentsCollection.add(payload)
      .then(
        doc => {
          fb.assignmentsCollection.doc(doc.id).update({
            id: doc.id, 
            created: fb.firestore.FieldValue.serverTimestamp()
          })
        }
      )
      fb.eventStaffCollection.add(payload)
    },
    getUsersPerDay({ commit }) {
      fb.userDaysCollection.onSnapshot(querySnapshot => {
        let userDaysArray = []
        querySnapshot.forEach(doc => {
          let day = doc.data()
          userDaysArray.push(day)
        })
        commit('setUsersPerDay', userDaysArray)
      })
    },
    clearDayState({ commit }) {
      commit('setDayEvents', null)
      commit('setEventsByDay', null)
      commit('setDayShifts', null)
      commit('setDayUsers', null)
      commit('setUsers', [])
      commit('setAvailableUsers', null)
    },
    clearPlacementsState({ commit }) {
      commit('setEventDays', null)
      commit('setUsersPerDay', null)
    },
    clearEventUsers({ commit }) {
      commit('setEventUsers', null)
      commit('setEventDrops', null)
      commit('setEventInfo', null)
    },
    clearEventShiftsState({ commit }) {
      commit('setEventShifts', null)
      commit('setEventInfo', null)
    },
    clearPlacementsHome({ commit }) {
      commit('setUsersPerDay', null)
      commit('setPastEvents', null)
    },

    /*TIMESHEETS*/
    // updateTimesheet({ commit }, payload) {
    //   console.log(payload)
    //   fb.assignmentsCollection.where("id", "==", payload.id).get()
    //   .then(function (querySnapshot) {
    //     if (querySnapshot.empty) {
    //     }
    //     querySnapshot.forEach(function (doc) {
    //       fb.assignmentsCollection.doc(doc.id).update(payload)
    //     })
    //   })
    // },
    updateTimesheet({ commit }, payload) {
      console.log(payload)
      fb.assignmentsCollection.doc(payload.id).update(payload)
    },
    getOprs({ commit }, payload) {
      fb.oprCollection.orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let oprArray = []
        querySnapshot.forEach(doc => {
          let op = doc.data()
          op.id = doc.id
          oprArray.push(op)
        })
        commit('setOpr', oprArray)
      })
    },
    removeUserOpr({ commit }, payload) {
      console.log(payload)
      fb.oprCollection.where("user.id", "==", payload.user.id).delete()
    },
    clearOprState({ commit }) {
      commit('setOpr', [])
    },


    clearErrors({ commit }) {
      commit('setErrorMessage', '')
    }
  },
  mutations: {
    emailVerified(state, val) {
      state.emailVerified = val
    },
    setCurrentUser(state, val) {
      state.currentUser = val
    },
    setErrorMessage(state, val) {
      state.errorMessage = val
    },
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setVenues(state, val) {
      if (val) {
        state.venues = val
      } else {
        state.venues = []
      }
    },
    setVenueInfo(state, val) {
      state.venueInfo = val
    },
    setVenueEvents(state, val) {
      if (val) {
        state.venueEvents = val
      } else {
        state.venueEvents = []
      }
    },
    setVenueFollowers(state, val) {
      if (val) {
        state.venueFollowers = val
      } else {
        state.venueFollowers = []
      }
    },
    setSeries(state, val) {
      if (val) {
        state.series = val
      } else {
        state.series = []
      }
    },
    setSeriesDays(state, val) {
      if (val) {
        state.seriesDays = val
      } else {
        state.seriesDays = []
      }
    },
    setSeriesInfo(state, val) {
      state.seriesInfo = val
    },
    setSeriesDays(state, val) {
      if (val) {
        state.seriesDays = val
      } else {
        state.seriesDays = []
      }
    },
    setOpr(state, val) {
      if (val) {
        state.opr = val
      } else {
        state.opr = []
      }
    },
    setPayrollHelp(state, val) {
      if (val) {
        state.payrollHelp = val
      } else {
        state.payrollHelp = []
      }
    },
    setEvents(state, val) {
      if (val) {
        state.events = val
      } else {
        state.events = []
      }
    },
    setEventsByDay(state, val) {
      if (val) {
        state.eventsByDay = val
      } else {
        state.eventsByDay = []
      }
    },
    setEventDays(state, val) {
      if (val) {
        state.eventDays = val
      } else {
        state.eventDays = []
      }
    },
    setEventInfo(state, val) {
      state.eventInfo = val
    },
    setEventShifts(state, val) {
      if (val) {
        state.eventShifts = val
      } else {
        state.eventShifts = []
      }
    },
    setDayEvents(state, val) {
      if (val) {
        state.dayEvents = val
      } else {
        state.dayEvents = []
      }
    },
    setCurrentEvents(state, val) {
      if (val) {
        state.currentEvents = val
      } else {
        state.currentEvents = []
      }
    },
    setPastEvents(state, val) {
      if (val) {
        state.pastEvents = val
      } else {
        state.pastEvents = []
      }
    },
    setUsers(state, val) {
      if (val) {
        state.users = val
      } else {
        state.users = []
      }
    },
    setGroupMessages(state, val) {
      if (val) {
        state.groupMessages = val
      } else {
        state.groupMessages = []
      }
    },
    setGroupUsers(state, val) {
      if (val) {
        state.groupUsers = val
      } else {
        state.groupUsers = []
      }
    },
    setUserNotes(state, val) {
      if (val) {
        state.userNotes = val
      } else {
        state.userNotes = []
      }
    },
    setContactNotes(state, val) {
      if (val) {
        state.contactNotes = val
      } else {
        state.contactNotes = []
      }
    },
    setUserMessages(state, val) {
      if (val) {
        state.userMessages = val
      } else {
        state.userMessages = []
      }
    },
    setUserEvents(state, val) {
      if (val) {
        state.userEvents = val
      } else {
        state.userEvents = []
      }
    },
    setReviews(state, val) {
      if (val) {
        state.reviews = val
      } else {
        state.reviews = []
      }
    },
    setUserAssignments(state, val) {
      if (val) {
        state.userAssignments = val
      } else {
        state.userAssignments = []
      }
    },
    setEventTimesheetNotes(state, val) {
      if (val) {
        state.eventTimesheetNotes = val
      } else {
        state.eventTimesheetNotes = []
      }
    },
    setUserInfo(state, val) {
      state.userInfo = val
    },
    userEmailVerified(state, val) {
      state.userEmailVerified = val
    },
    setJobs(state, val) {
      if (val) {
        state.jobs = val
      } else {
        state.jobs = []
      }
    },
    setMgrs(state, val) {
      if (val) {
        state.mgrs = val
      } else {
        state.mgrs = []
      }
    },
    setMgrInfo(state, val) {
      state.mgrInfo = val
    },
    setJobInfo(state, val) {
      state.jobInfo = val
    },
    setFaqs(state, val) {
      if (val) {
        state.faqs = val
      } else {
        state.faqs = []
      }
    },
    setFaqInfo(state, val) {
      state.faqInfo = val
    },
    setClients(state, val) {
      if (val) {
        state.clients = val
      } else {
        state.clients = []
      }
    },
    setClientInfo(state, val) {
      state.clientInfo = val
    },
    setContacts(state, val) {
      if (val) {
        state.contacts = val
      } else {
        state.contacts = []
      }
    },
    setContactInfo(state, val) {
      state.contactInfo = val
    },
    setDayShifts(state, val) {
      if (val) {
        state.dayShifts = val
      } else {
        state.dayShifts = []
      }
    },
    setEventShifts(state, val) {
      if (val) {
        state.eventShifts = val
      } else {
        state.eventShifts = []
      }
    },
    setEventUsers(state, val) {
      if (val) {
        state.eventUsers = val
      } else {
        state.eventUsers = []
      }
    },
    setEventDrops(state, val) {
      if (val) {
        state.eventDrops = val
      } else {
        state.eventDrops = []
      }
    },
    setShifts(state, val) {
      if (val) {
        state.shifts = val
      } else {
        state.shifts = []
      }
    },
    setDayShifts(state, val) {
      if (val) {
        state.dayShifts = val
      } else {
        state.dayShifts = []
      }
    },
    setShift(state, val) {
      state.shift = val
    },
    setGroup(state, val) {
      state.group = val
    },
    setDayUsers(state, val) {
      if (val) {
        state.dayUsers = val
      } else {
        state.dayUsers = []
      }
    },
    setAvailableUsers(state, val) {
      if (val) {
        state.availableUsers = val
      } else {
        state.availableUsers = []
      }
    },
    setShiftAssignments(state, val) {
      if (val) {
        state.shiftAssignments = val
      } else {
        state.shiftAssignments = []
      }
    },
    setUsersPerDay(state, val) {
      if (val) {
        state.usersPerDay = val
      } else {
        state.usersPerDay = []
      }
    },
    setPerformingRequest(state, val) {
      state.performingRequest = val
    },
    setAccountingNotes(state, val) {
      if (val) {
        state.accountingNotes = val
      } else {
        state.accountingNotes = []
      }
    },
    setClientNotes(state, val) {
      if (val) {
        state.clientNotes = val
      } else {
        state.clientNotes = []
      }
    },
    setClientVenues(state, val) {
      if (val) {
        state.clientVenues = val
      } else {
        state.clientVenues = []
      }
    },
    setGroups(state, val) {
      if (val) {
        state.groups = val
      } else {
        state.groups = []
      }
    },
  },
})

export default store
