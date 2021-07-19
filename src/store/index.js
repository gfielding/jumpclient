import Vue from 'vue'
import Vuex from 'vuex'
// import * as fb from '../firebaseConfig'
const fb = require('../firebaseConfig.js')
import router from '../router/index'

Vue.use(Vuex)

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
    store.dispatch('getEvents')
    store.dispatch('getVenues')
    store.dispatch('getJobsState')
    store.dispatch('getClients')
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
    users:[],
    userInfo:{},
    userNotes: [],
    userEmailVerified: '',
    events: [],
    eventInfo: {},
    eventShifts: [],
    eventDays: [],
    jobs:[],
    jobInfo: {},
    clients:[],
    clientInfo: {},
    dayShifts: [],
    dayUsers: [],
    availableUsers: [],
    dayEvents: [],
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
      dispatch('fetchUserProfile', user)
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

      // redirect to login view
      router.push('/')
    },
    updateUserProfile({ commit }, payload) {
      fb.usersCollection.doc(payload.id).update(payload)
      const userProfile = fb.usersCollection.doc(payload.user.id).get()
      commit('setUserProfile', userProfile)
      
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
        })
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
      fb.usersCollection.where("id", "==", payload).onSnapshot(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          commit("setUserInfo", doc.data())
          store.dispatch('getUserNotes', payload)
        })
      })
    },
    addUserNote({ commit, state }, payload) {
      console.log(payload)
      fb.userNotesCollection.add(payload)
      .then(
        doc => {
          fb.userNotesCollection.doc(doc.id).update({
            userId: payload.userId,
            submittedBy: state.currentUser.uid,
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp()
          })
        }
      )
    },
    getUserNotes({ commit }, payload) {
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
    clearUserState({ commit }) {
      commit('setUserInfo', {})
      commit('setUserNotes', [])
    },
    clearUsersState({ commit }) {
      commit('setUsers', [])
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
    },
    deleteClient({ commit }, payload) {
      fb.clientsCollection.doc(payload).delete()
    },
    updateClient({ commit }, payload) {
      fb.clientsCollection.doc(payload.id).update(payload)
    },
    clearClientState({ commit }) {
      commit('setClientInfo', {})
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
            event: payload.title,
            start: payload.startDate,
            created: fb.firestore.FieldValue.serverTimestamp(),
            slug: payload.slug
          }
          if (doc.data().published) {
            console.log(message)
            fb.smsCollection.add(message)
          }
        })
      })
    },
    updateEventVenue({ commit }, payload) {
      console.log(payload)
      fb.eventsCollection.doc(payload.id).update(payload)
    },
    updateEvent({ commit }, payload) {
      console.log(payload)
      fb.eventsCollection.doc(payload.id).update(payload)
      .then(
        doc => {
          console.log(payload)
          store.dispatch('alertFollowers', payload)
        }
      )
    },
    updateEventStaff({ commit }, payload) {
      console.log(payload)
      fb.eventStaffCollection.where("event", "==", payload.id).onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          let message = {
            phone: doc.data().phone,
            name: doc.data().name,
            email: doc.data().email,
            event: payload
          }
          if (payload.published) {
            fb.smsUpdatesCollection.add(message)
            fb.emailUpdatesCollection.add(message)
          }
        })
      })
      fb.eventsCollection.doc(payload.id).update({
        updateStaffSent: fb.firestore.FieldValue.serverTimestamp()
      })
    },
    deleteEvent({ commit }, payload) {
      fb.eventsCollection.doc(payload).delete()
    },
    getEvents({ commit }) {
      fb.eventsCollection.orderBy('startDate', 'asc').onSnapshot(querySnapshot => {
        let eventsArray = []
        let eventDays = []

        querySnapshot.forEach(doc => {
          let event = doc.data()
          event.id = doc.id
          eventsArray.push(event)
          eventDays.push(event.days)
        })
        commit('setEvents', eventsArray)


        let merged = [].concat.apply([], eventDays)
        let uniqueSet = new Set(merged)
        let uniqueEventDays = [...uniqueSet]
        commit('setEventDays', uniqueEventDays)
      })
    },
    getEventFromId({ commit }, payload) {
      console.log(payload)
      fb.eventsCollection.where("id", "==", payload).onSnapshot(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          commit("setEventInfo", doc.data())
        })
      })
      store.dispatch('getEventShifts', payload)
    },
    clearEventState({ commit }) {
      commit('setEventInfo', {})
    },
    clearEventsState({ commit }) {
      commit('setEvents', [])
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



    /*PLACEMENTS*/
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
    getUserAvailabilityState({ commit }, payload) {
      console.log(payload)
      fb.userDaysCollection.where("day", "==", payload).onSnapshot(querySnapshot => {
        let dayUsersArray = []
        let dayUserIdsArray = []
        querySnapshot.forEach(doc => {
          let dayUser = doc.data()
          let dayUserID = doc.data().userId
          dayUser.id = doc.id
          dayUsersArray.push(dayUser)
          dayUserIdsArray.push(dayUserID)
        })
        commit('setDayUsers', dayUsersArray)
        store.dispatch('getDayUserListState', dayUserIdsArray)
      })
    },
    getDayUserListState({ commit }, payload) {
      fb.usersCollection.onSnapshot(querySnapshot => {
        let usersArray = []
        querySnapshot.forEach(doc => {
          let user = doc.data()
          user.id = doc.id
          usersArray.push(user)
        })
        const availableUsers = usersArray.filter(item => payload.includes(item.id))
        commit('setAvailableUsers', availableUsers)
      })
    },
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
      fb.userDaysCollection.doc(payload.id).update({status: "available", shift: null})
    },
    addPlacement({ commit }, payload) {
      console.log(payload)
      fb.userDaysCollection.doc(payload.id).update({status: "placed", shift: payload.placement.shiftId})
    },
    lockShift({ commit }, payload) {
      console.log(payload)
      fb.assignmentsCollection.add(payload)
      .then(
        doc => {
          fb.assignmentsCollection.doc(doc.id).update({
            id: doc.id, 
            created: fb.firestore.FieldValue.serverTimestamp()
          })
        }
      )
      fb.eventStaffCollection.add({
        email: payload.email,
        name: payload.firstName,
        phone: payload.phone,
        user: payload.userId,
        event: payload.eventId,
        venueName: payload.eventInfo.venue.title,
        venue: payload.eventInfo.venueId
      })
    },
    clearDayState({ commit }) {
      commit('setDayEvents', null)
      commit('setDayShifts', null)
      commit('setDayUsers', null)
      commit('setAvailableUsers', null)
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
    setEvents(state, val) {
      if (val) {
        state.events = val
      } else {
        state.events = []
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
    setUsers(state, val) {
      if (val) {
        state.users = val
      } else {
        state.users = []
      }
    },
    setUserNotes(state, val) {
      if (val) {
        state.userNotes = val
      } else {
        state.userNotes = []
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
    setJobInfo(state, val) {
      state.jobInfo = val
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
    setDayShifts(state, val) {
      if (val) {
        state.dayShifts = val
      } else {
        state.dayShifts = []
      }
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
    setDayEvents(state, val) {
      if (val) {
        state.dayEvents = val
      } else {
        state.dayEvents = []
      }
    },
    setPerformingRequest(state, val) {
      state.performingRequest = val
    },
  },
})

export default store
