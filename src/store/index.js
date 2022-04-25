import Vue from 'vue'
import Vuex from 'vuex'
// import * as fb from '../firebaseConfig'
const fb = require('../firebaseConfig.js')
import router from '../router/index'
import * as moment from 'moment'
import firebase from 'firebase/app';

Vue.use(Vuex)

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
    store.dispatch('fetchUserProfile', user)
  }
})


const store = new Vuex.Store({
  state: {
    userProfile: {},
    currentUser: null,
    emailVerified: '',
    errorMessage: '',
    venues: [],
    hiddenVenues: [],
    venueInfo: {},
    venueEvents: [],
    venueFollowers: [],
    users:[],
    userInfo:{},
    userNotes: [],
    userMessages: [],
    userEmailVerified: '',
    events: [],
    eventsByYear: [],
    events2021: [],
    events2022: [],
    eventInfo: {},
    eventShifts: [],
    eventDays: [],
    eventsByDay: [],
    eventUsers: [],
    eventDrops: [],
    allEvents: [],
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
    clientVenues: [],
    referrals: [],
    stateUsers: [],
    cityUsers: [],
    appUsers: [],
    empUsers: [],
    clientContacts: [],
    followersGroupUsers: [],
    followersGroup: {},
    followersGroupMessages: [],
    followersGroups: [],
    pageText: {},
    clientAccess: [],
    clientAccessInfo: {},
    accessNotes: [],
    verifications: [],
    userVerifications: [],
    eventsByMonth: [],
    eventsByVenue: [],
    tags: [],
    tagInfo: {},
    infiniteEvents: [],
    nextInfiniteEvents: [],
    prevInfiniteEvents: [],
    lastVisibleEventSnapShot: {},
    firstVisibleEventSnapShot: {},
    taggedEvents: [],
    venueEventsSearchResults: [],
    eventAssignments: [],
    cancelledEvents: [],
    allPayroll: [],
    myRecaps: [],
    staticEventUsers: [],
    checkInMaster: null,
    eventsCancelled: [],
    completeEvents: [],
    partialEvents: []
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
      if (user && user.email && user.emailVerified && user.email.endsWith('mvpeventstaffing.com') && (user.email != 'd.brown@mvpeventstaffing.com' || user.email != 'jlax@mvpeventstaffing.com' || user.email != 'selina@mvpeventstaffing.com')) {
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
      console.log('fetchUserProfile')
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get()

      // set user profile in state
      commit('emailVerified', user.emailVerified)

      // set user profile in state
      commit('setUserProfile', userProfile.data())
      // store.dispatch('getVenues')
      // store.dispatch('getJobsState')
      // store.dispatch('getClients')
      // store.dispatch('getGroups')

      // change route to dashboard
      // if (router.currentRoute.path === '/login') {
      //   router.push('/dashboard')
      // }
    },
    async logout({ commit }) {
      // log user out
      await fb.auth.signOut()

      // clear user data from state
      commit('setUserProfile', {})
      commit('setEvents', [])
      commit('setCurrentUser', null)
      commit('setVenues', [])
      commit('setJobs', [])
      commit('setClients', [])
      commit('setContacts', [])
      commit('setGroups', [])

      // redirect to login view
      router.push('/')
    },
    getUserProfile({ commit, state }) {
      console.log('getUserProfile')
      fb.usersCollection.doc(state.currentUser.uid)
      .onSnapshot(function (doc) {
        if (doc.exists) {
          commit('setUserProfile', doc.data())
        } else {
          store.dispatch('logout')
        }
      })
    },
    // getMyRecaps({ commit, state }) {
    //   fb.eventsCollection.where("event.venue.mgrs", "array-contains", "Greg Fielding").onSnapshot(querySnapshot => {
    //     let eventsArray = []
    //     querySnapshot.forEach(doc => {
    //       console.log(doc.data())
    //     })
    //     commit('setMyRecaps',eventsArray)
    //   })
    // },
    getMyRecaps({ commit, state }) {
      console.log('getMyRecaps')
      var eventsRef = fb.eventsCollection
      let documents = eventsRef.limit(1).get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            console.log("Parent Document ID: ", doc.id);

            let subCollectionDocs = eventsRef.doc(doc.id/{venue}).collection("mgrs").get()
              .then(snapshot => {
                snapshot.forEach(doc => {
                  console.log("Sub Document ID: ", doc.id);
                })
              }).catch(err => {
                console.log("Error getting sub-collection documents", err);
              })
          });
        }).catch(err => {
        console.log("Error getting documents", err);
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
      console.log('updateUser')
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


    /*USER REPORTS*/
    getUserReports({ commit, state }) {
       fb.usersCollection.onSnapshot(querySnapshot => {
        let usersArray = []
        let appUsers = []
        let empUsers = []
        querySnapshot.forEach(doc => {
          let user = doc.data()
          usersArray.push(user)
          if (doc.data().fcm_token) {
            appUsers.push(user)
          }
          if (doc.data().employeeNumber) {
            empUsers.push(user)
          }
        })
      })
      commit('setUsers', usersArray)
      commit('setAppUsers', appUsers)
      commit('setEmpUsers', empUsers)
    },
    clearUserReports({ commit }) {
      commit('setUsersByState', [])
      commit('setUsers', [])
      commit('setAppUsers', [])
      commit('setEmpUsers', [])
    },

    getUsersByState({ commit }, payload) {
      console.log(payload)
      fb.usersCollection.where("address.state", "==", payload).orderBy('created', 'desc')
      .onSnapshot(querySnapshot => {
        let usersArray = []
        querySnapshot.forEach(doc => {
          let user = doc.data()
          usersArray.push(user)
        })
        commit('setUsersByState', usersArray)
      })
    },
    clearUsersByState({ commit }) {
      commit('setUsersByState', [])
    },
    getUsersByCity({ commit }, payload) {
      console.log(payload)
      fb.usersCollection.where("address.city", "==", payload).orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let usersArray = []
        querySnapshot.forEach(doc => {
          let user = doc.data()
          usersArray.push(user)
        })
        commit('setUsersByCity', usersArray)
      })
    },
    clearUsersByCity({ commit }) {
      commit('setUsersByCity', [])
    },


    /*dash buttons*/
    updateAllApplications({ commit }) {
      let timestamp = new Date('2022-03-13 00:00:00');
      let timestamp2 = new Date('2022-03-15 00:00:00');
      fb.userDaysCollection.where("created", ">", timestamp).where("created", "<=", timestamp2)
      .get()
      .then((querySnapshot) => {
        let onboarded
        let address
        let blacklist
        let certs
        let groups
        let phoneVerified
        let photoUrl
        let points
        let rating
        let shirtsize
        let skills
        let fullyVaccinated
        let firstName
        let lastName
        let phone
        let ssn
        querySnapshot.forEach((doc) => {
          console.log(doc.id)
          let userDayId = doc.id
          fb.usersCollection.doc(doc.data().userId)
          .get()
          .then(doc => {
            // console.log(doc.data())
            let newUpdates = {
              onboarded: doc.data().onboarded,
              address: doc.data().address,
              blacklist: doc.data().blacklist,
              certs: doc.data().certs,
              groups: doc.data().groups,
              phoneVerified: doc.data().phoneVerified,
              photoUrl: doc.data().photoUrl,
              points: doc.data().points,
              rating: doc.data().rating,
              shirtsize: doc.data().shirtsize,
              skills: doc.data().skills,
              fullyVaccinated: doc.data().fullyVaccinated,
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              phone: doc.data().phone,
              ssn: doc.data().ssn,
            }
            console.log(newUpdates)
            store.dispatch('updateUserDayDetails', {
              newUpdates: newUpdates,
              userDayId: userDayId
            })
          })
        })
      })
    },
    updateUserDayDetails({ commit }, payload) {
      console.log(payload.userDayId)
      fb.userDaysCollection.doc(payload.userDayId).update({
        onboarded: payload.newUpdates.onboarded || null,
        address: payload.newUpdates.address || null,
        blacklist: payload.newUpdates.blacklist || null,
        certs: payload.newUpdates.certs || null,
        groups: payload.newUpdates.groups || null,
        phoneVerified: payload.newUpdates.phoneVerified || null,
        photoUrl: payload.newUpdates.photoUrl || null,
        points: payload.newUpdates.points || null,
        rating: payload.newUpdates.rating || null,
        shirtsize: payload.newUpdates.shirtsize || null,
        skills: payload.newUpdates.skills || null,
        fullyVaccinated: payload.newUpdates.fullyVaccinated || null,
        firstName: payload.newUpdates.firstName || null,
        lastName: payload.newUpdates.lastName || null,
        phone: payload.newUpdates.phone || null,
        ssn: payload.newUpdates.ssn || null,
      })
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

    /*REFERRALS*/
    getReferrals({ commit }, payload) {
      console.log('getReferrals')
      fb.referralsCollection.orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let referralsArray = []

        querySnapshot.forEach(doc => {
          let message = doc.data()
          message.id = doc.id
          referralsArray.push(message)
        })
        commit('setReferrals', referralsArray)
      })
    },

    updateReferral({ commit }, payload) {
      fb.referralsCollection.doc(payload.id).update({
        status: payload.status,
        statusChange: fb.firestore.FieldValue.serverTimestamp(),
      })
    },
    lockReferral({ commit }, payload) {
      fb.referralsCollection.doc(payload).update({ locked: true })
    },
    unlockReferral({ commit }, payload) {
      fb.referralsCollection.doc(payload).update({ locked: false })
    },
    clearReferralsState({ commit }) {
      commit('setReferrals', [])
    },

    /*Client Access*/
    getClientAccess({ commit }) {
      fb.clientAccessCollection.orderBy('lastName', 'asc').onSnapshot(querySnapshot => {
        let clientAccessArray = []
        querySnapshot.forEach(doc => {
          let item = doc.data()
          clientAccessArray.push(item)
        })
        commit('setClientAccess', clientAccessArray)
      })
    },
    getAccessClientFromId({ commit }, payload) {
      console.log("getting")
      fb.clientAccessCollection.doc(payload).get()
      .then(
        doc => {
          commit("setClientAccessInfo", doc.data())
        }
      )
      store.dispatch('getAccessNotes', payload)
    },
    updateClientAccess({ commit }, payload) {
      fb.clientAccessCollection.doc(payload.id).update(payload)
    },
    clearAccessClientState({ commit }) {
      commit('setClientAccessInfo', {})
      commit('setAccessNotes', [])
    },
    clearClientAccess({ commit }) {
      commit('setClientAccess', [])
    },
    
    /*Groups*/
    getFollowersGroups({ commit }) {
      console.log('getFollowersGroups')
      fb.venueFollowersCollection.orderBy('venueName', 'asc').onSnapshot(querySnapshot => {
        let groupsArray = []
        querySnapshot.forEach(doc => {
          let group = doc.data()
          groupsArray.push(group)
        })
        const unique = Array.from(new Set(groupsArray.map(a => a.venueName)))
         .map(venueName => {
           return groupsArray.find(a => a.venueName === venueName)
         })
        commit('setFollowerGroups', unique)
      })
    },
    getFollowersGroupFromId({ commit }, payload) {
      fb.venuesCollection.doc(payload).get()
      .then(
        doc => {
          commit("setFollowersGroup", doc.data())
        })
      store.dispatch('getFollowersGroupUsers', payload)
      store.dispatch('getFollowersGroupMessages', payload)
    },
    getFollowersGroupUsers({ commit }, payload) {
      console.log('getFollowersGroupUsers')
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
        commit('setFollowersGroupUsers', followersArray)
      })
    },
    getFollowersGroupMessages({ commit }, payload) {
      console.log("getting Messages")
      fb.groupUpdatesCollection.where("groupId", "==", payload).orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let groupMessagesArray = []

        querySnapshot.forEach(doc => {
          let message = doc.data()
          message.id = doc.id
          groupMessagesArray.push(message)
        })
        let newArray = Object.values(groupMessagesArray.reduce((acc,cur)=>Object.assign(acc,{[cur.message]:cur}),{}))
        commit('setFollowersGroupMessages', newArray)
      })
    },
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
    addUserToGroup({ commit }, payload) {
      console.log(payload)
      fb.usersCollection.doc(payload.id).update({
        groups: firebase.firestore.FieldValue.arrayUnion(payload.group.title)
      })
      store.dispatch('getGroupFromId', payload.group.id)
    },
    removeUserFromGroup({ commit }, payload) {
      console.log(payload)
      fb.usersCollection.doc(payload.userId).update({
        groups: firebase.firestore.FieldValue.arrayRemove(payload.group.title)
      })
      store.dispatch('getGroupFromId', payload.group.id)
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
      console.log('getGroups')
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
    clearFollowersGroupState({ commit }) {
      commit('setFollowersGroup', {})
      commit('setFollowersGroupUsers', [])
      commit('setFollowersGroupMessages', [])
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
    updateVenueAccess({ commit }, payload) {
      fb.usersCollection.where("id", "==", payload.user.objectID).onSnapshot(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          fb.venuesCollection.doc(payload.venue.id).update({
            access: firebase.firestore.FieldValue.arrayUnion(doc.data())
          })
        })
      })
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
      console.log('getVenues')
      fb.venuesCollection.orderBy('title', 'asc')
      .get().then((querySnapshot) => {
        let venuesArray = []
        let venuesHiddenArray = []
        querySnapshot.forEach((doc) => {
          let venue = doc.data()
          if (doc.data().visible) {
            venuesArray.push(venue)
          } else {
            venuesHiddenArray.push(venue)
          }
        })
        commit('setVenues', venuesArray)
        commit('setHiddenVenues', venuesHiddenArray)
      })
    },
    getVenueFromId({ commit }, payload) {
      console.log('getVenueFromId')
      fb.venuesCollection.doc(payload).get()
      .then(
        doc => {
          commit("setVenueInfo", doc.data())
          store.dispatch('getVenueEvents', payload)
          store.dispatch('getVenueFollowers', payload)
        }
      )


      // onSnapshot(querySnapshot => {
      //   querySnapshot.forEach(function (doc) {
          
      //   })
      // })
      // fb.venuesCollection.where("id", "==", payload).onSnapshot(querySnapshot => {
      //   querySnapshot.forEach(function (doc) {
      //     commit("setVenueInfo", doc.data())
      //     store.dispatch('getVenueEvents', payload)
      //     store.dispatch('getVenueFollowers', payload)
      //   })
      // })
    },
    getVenueFromIdPlacements({ commit }, payload) {
      console.log('getVenueFromIdPlacements')
      fb.venuesCollection.doc(payload).get()
      .then(
        doc => {
          commit("setVenueInfo", doc.data())
          // store.dispatch('getVenueEvents', payload)
          // store.dispatch('getVenueFollowers', payload)
        }
      )
    },
    getVenueFollowers({ commit }, payload) {
      console.log('getVenueFollowers')
      fb.venueFollowersCollection.where("venue", "==", payload)
      .get().then((querySnapshot) => {
        let followersArray = []
        querySnapshot.forEach((doc) => {

      // .onSnapshot(querySnapshot => {
      //   let followersArray = []
      //   querySnapshot.forEach(doc => {
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
      console.log('getVenueEvents')
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
      commit('setHiddenVenues', [])
    },





    /*USERS*/
    getUsers({ commit }) {
      console.log('getUsers')
      fb.usersCollection
      .get().then((querySnapshot) => {
         let usersArray = []
        querySnapshot.forEach((doc) => {

      // .onSnapshot(querySnapshot => {
      //   let usersArray = []
      //   querySnapshot.forEach(doc => {
          let user = doc.data()
          usersArray.push(user)
        })
        commit('setUsers', usersArray)
      })
    },
    getUserFromId({ commit }, payload) {
      console.log("getUserFromId")
      fb.usersCollection.doc(payload).get()
      .then(
        doc => {
          commit("setUserInfo", doc.data())
          store.dispatch('getUserNotes', payload)
          store.dispatch('getUserMessages', payload)
          store.dispatch('getUserReviews', payload)
          store.dispatch('getUserEvents', payload)
          store.dispatch('getUserAssignments', payload)
          store.dispatch('getUserVerifications', payload)
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
      console.log("getAccountingNotes")
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
      console.log("getting contact notes")
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
    addAccessNote({ commit, state }, payload) {
      console.log(payload)
      fb.accessNotesCollection.add(payload)
      .then(
        doc => {
          fb.accessNotesCollection.doc(doc.id).update({
            userId: payload.userId,
            submittedBy: payload.submittedBy,
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp()
          })
        }
      )
    },
    getAccessNotes({ commit }, payload) {
      fb.accessNotesCollection.where("userId", "==", payload).orderBy('created', 'desc').onSnapshot(querySnapshot => {
        let userNotesArray = []

        querySnapshot.forEach(doc => {
          let note = doc.data()
          note.id = doc.id
          userNotesArray.push(note)
        })
        commit('setAccessNotes', userNotesArray)
      })
    },
    addUserNote({ commit, state }, payload) {
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
      console.log("getting user reviews")
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
      console.log('getUserEvents')
      fb.userDaysCollection.where("userId", "==", payload).orderBy('created', 'desc')
      // .get().then((querySnapshot) => {
      //    let eventsArray = []
      //   querySnapshot.forEach((doc) => {

      .onSnapshot(querySnapshot => {
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
      console.log('getUserAssignments')
      fb.assignmentsCollection.where("userId", "==", payload).onSnapshot(querySnapshot => {
        let assignmentsArray = []
        querySnapshot.forEach(doc => {
          let shift = doc.data()
          assignmentsArray.push(shift)
        })
        commit('setUserAssignments', assignmentsArray)
      })
    },
    clearUserState({ commit }) {
      commit('setUserInfo', {})
      commit('setUserNotes', [])
      commit('setUserMessages', [])
      commit('setReviews', [])
      commit('setUserEvents', [])
      commit('setUserAssignments', [])
      commit('setUserVerifications', [])
    },
    clearUsersState({ commit }) {
      commit('setUsers', [])
    },

    /*TAGS*/
    getTagsState({ commit }, payload) {
      console.log('getTagsState')
      fb.tagsCollection
      .get()
        .then(snapshot => {
          let tagsArray = []
          snapshot.forEach(doc => {

      // .onSnapshot(querySnapshot => {
      //   let tagsArray = []
      //   querySnapshot.forEach(doc => {
          let tag = doc.data()
          tagsArray.push(tag)
        })
        commit('setTags', tagsArray)
      })
    },
    addTag({ commit }, payload) {
      console.log(payload)
      fb.tagsCollection.add(payload)
      .then(
        doc => {
          fb.tagsCollection.doc(doc.id).update({
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp(),
          })
        }
      )
    },
    geTagFromId({ commit }, payload) {
      fb.tagsCollection.where("id", "==", payload).onSnapshot(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          commit("setTagInfo", doc.data())
        })
      })
    },
    deleteTag({ commit }, payload) {
      fb.tagsCollection.doc(payload).delete()
    },
    updateTag({ commit }, payload) {
      fb.tagsCollection.doc(payload.id).update(payload)
    },
    clearTagState({ commit }) {
      commit('setTagInfo', {})
    },
    clearTagsState({ commit }) {
      commit('setTags', [])
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
      fb.jobsCollection.doc(payload)
      .get().then(doc => {
        commit("setJobInfo", doc.data())
      })

      // .onSnapshot(querySnapshot => {
      //   querySnapshot.forEach(function (doc) {
      //     commit("setJobInfo", doc.data())
      //   })
      // })
      // fb.jobsCollection.where("id", "==", payload).onSnapshot(querySnapshot => {
      //   querySnapshot.forEach(function (doc) {
      //     commit("setJobInfo", doc.data())
      //   })
      // })
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


    /*PAGE TEXT*/
    getPageText({ commit }) {
      fb.pageTextCollection.doc("XQLfFD57iwjlpMjMlyVw").get()
      .then(
        doc => {
          let pageText = doc.data()
          commit('setPageText', pageText)
        }
      )
    },
    updatePageText({ commit }, payload) {
      fb.pageTextCollection.doc("XQLfFD57iwjlpMjMlyVw").update(payload)
    },


    /*FAQS*/
    addFaq({ commit }, payload) {
      fb.faqsCollection.add(payload)
      .then(
        doc => {
          fb.faqsCollection.doc(doc.id).update({
            id: doc.id,
            order: 0,
            created: fb.firestore.FieldValue.serverTimestamp(),
          })
        }
      )
    },
    getFaqsState({ commit }) {
      fb.faqsCollection.orderBy('order', 'asc').onSnapshot(querySnapshot => {
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



    /*Verifications*/

    getVerifications({ commit }) {
      console.log('getting verifications')
      fb.verificationsCollection.where("verified", "==", false).orderBy('created', 'desc')
      .onSnapshot(querySnapshot => {
        let verificationsArray = []
        querySnapshot.forEach(doc => {
          let verification = doc.data()
          verificationsArray.push(verification)
        })
        commit('setVerifications', verificationsArray)
      })
    },
    getUserVerifications({ commit }, payload) {
      console.log(payload)
      fb.verificationsCollection.where("userId", "==", payload).orderBy('created', 'desc')
      .onSnapshot(querySnapshot => {
        let verificationsArray = []
        querySnapshot.forEach(doc => {
          let verification = doc.data()
          verificationsArray.push(verification)
        })
        commit('setUserVerifications', verificationsArray)
      })
    },
    clearVerifications({ commit }) {
      commit('setVerifications', [])
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
      store.dispatch('getClientContacts', payload)
      store.dispatch('getClientVenues', payload)
    },
    getClientContacts({ commit }, payload) {
      fb.contactsCollection.where("company.id", "==", payload).onSnapshot(querySnapshot => {
        let contactsArray = []
        querySnapshot.forEach(doc => {
          let contact = doc.data()
          contactsArray.push(contact)
        })
        commit('setClientContacts', contactsArray)
      })
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
              clients.forEach(client => {
              if (client.id == payload) {
                newArray.push(ven)
              }
            })
          }
        })
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
      commit('setClientContacts', [])
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
          let geo = new fb.firestore.GeoPoint(payload.venue.center.lat, payload.venue.center.lng)
          payload.event_location = geo
          fb.eventsCollection.doc(doc.id).update({
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp(),
            venueId: payload.venue.id,
            jobs: payload.jobs || [],
            days: payload.days || [],
            event_city: payload.venue.address.city,
            event_location: payload,
            event_state: payload.venue.address.state,
            event_venue_title: payload.title,
            event_zip: payload.venue.address.zip
          })
        }
      )
      store.dispatch('alertFollowers', payload)
    },
    alertFollowers({ commit }, payload) {
      console.log('alertFollowers')
      fb.venueFollowersCollection.where("venue", "==", payload.venue.id)
      .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {


      // .onSnapshot(querySnapshot => {
      //   querySnapshot.forEach(doc => {
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
      // let geo = new fb.firestore.GeoPoint(payload.venue.center.lat, payload.venue.center.lng)
      // payload.event_location = geo
      fb.eventsCollection.doc(payload.id).update(payload)
    },
    updateAllEvents({ commit }) {
      fb.eventsCollection.orderBy('id', 'asc').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let geo
          if (doc.data().venue && doc.data().venue.center && doc.data().venue.center) {
            geo = new fb.firestore.GeoPoint(doc.data().venue.center.lat, doc.data().venue.center.lng)
          }
          if (!doc.data().venue || !doc.data().venue.center.lat || !doc.data().venue.center.lng) {
            geo = null
          }
          if (doc.data().venue && doc.data().venue.address) {
            console.log(doc.id)
            fb.eventsCollection.doc(doc.id).update({
              event_city: doc.data().venue.address.city || null,
              event_location: geo,
              event_state: doc.data().venue.address.state || null,
              event_venue_title: doc.data().title || null,
              event_zip: doc.data().venue.address.zip || null
            })
          }
          
        })
      })
    },
    updateEventJobs({ commit }, payload) {
      console.log(payload)
      fb.eventsCollection.doc(payload.eventId).update({
          venue: payload.venue
      })
    },
    updateEventStaff({ commit }, payload) {
      console.log(payload)
      fb.userDaysCollection.where("event", "==", payload.id)
      .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

      // .onSnapshot(querySnapshot => {
      //   querySnapshot.forEach(doc => {
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
    getEventsByYear({ commit }, payload) {
      console.log('getEventsByYear')
      console.log(payload)
      fb.eventsCollection.where("published", "==", true).orderBy('startDate', 'asc').get().then((querySnapshot) => {
        let eventsArray = []
        querySnapshot.forEach((doc) => {
          let event = doc.data()
          if (doc.data().startDate.includes(payload)) {
            eventsArray.push(event)
          }
        })
        commit('setEventsByYear', eventsArray)
      })
    },
    clearEventsByYear({ commit }) {
      commit('setEventsByYear', [])
    },
    getEventsByVenue({ commit }, payload) {
      console.log(payload)
      fb.eventsCollection.orderBy('startDate', 'asc').get().then((querySnapshot) => {
        let eventsArray = []
        querySnapshot.forEach((doc) => {
          let event = doc.data()
          if (doc.data().venueId == payload) {
            eventsArray.push(event)
          }
        })
        commit('setEventsByVenue', eventsArray)
      })
    },
    clearEventsByVenue({ commit }) {
      commit('setEventsByVenue', [])
    },
    getEventsByMonth({ commit }, payload) {
      console.log(payload)
      fb.eventsCollection.orderBy('startDate', 'asc').get().then((querySnapshot) => {
        let eventsArray = []
        querySnapshot.forEach((doc) => {
          let event = doc.data()
          if (doc.data().startDate.includes(payload)) {
            eventsArray.push(event)
          }
        })
        commit('setEventsByMonth', eventsArray)
      })
    },
    clearEventsByMonth({ commit }) {
      commit('setEventsByMonth', [])
    },
    get2022Events({ commit }) {
      console.log('get2022Events')
      fb.eventsCollection.orderBy('startDate', 'asc').get().then((querySnapshot) => {
        let events2022Array = []
        querySnapshot.forEach((doc) => {

          let event = doc.data()
          if (doc.data().startDate.includes("2022")) {
            events2022Array.push(event)
          }
        })
        commit('set2022Events', events2022Array)
      })
    },
    get2021Events({ commit }) {
      fb.eventsCollection.orderBy('startDate', 'asc')
      .get().then((querySnapshot) => {
        let events2021Array = []
        querySnapshot.forEach((doc) => {

          let event = doc.data()
          if (doc.data().startDate.includes("2021")) {
            events2021Array.push(event)
          }
        })
        commit('set2021Events', events2021Array)
      })
    },
    getEventFromId({ commit }, payload) {
      console.log('getEventFromId')
      fb.eventsCollection.doc(payload).get()
      .then(
        doc => {
          commit("setEventInfo", doc.data())
          store.dispatch('getUserNotes', payload)
        }
      )
      store.dispatch('getEventShifts', payload)
    },  
    // getAllEvents({ commit }) {
    //   console.log('getting all')
    //   fb.eventsCollection.where("published", "==", true).orderBy('startDate', 'asc')
    //   .onSnapshot(querySnapshot => {
    //     let allEventsArray = []
    //     querySnapshot.forEach((doc) => {
    //       let event = doc.data()
    //       allEventsArray.push(event)
    //     })
    //     commit('setAllEvents', allEventsArray)
    //   })
    // },
    getInfiniteEvents({ commit }) {
      console.log('getInfiniteEvents')
      fb.eventsCollection.orderBy('startDate', 'asc').get().then((querySnapshot) => {
        var lastVisibleEventSnapShot = {};
        var firstVisibleEventSnapShot = {};
        let yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1);
        let currentEventsArray = []
        let cancelledEventsArray = []
        let allEventsArray = []
        querySnapshot.forEach(doc => {
          let startComp = new Date(doc.data().startDate)
          let endComp = new Date(doc.data().endDate)
          let event = doc.data()
          if ((endComp >= yesterday || startComp >= yesterday) && (event.status != 'cancelled')) {
            currentEventsArray.push(event)
          }
          if (event.status != 'cancelled') {
            allEventsArray.push(event)
          }
          if (event.status == 'cancelled') {
            cancelledEventsArray.push(event)
          }
        })
        let twelve = currentEventsArray.slice(0, 12);
        // firstVisibleEventSnapShot = currentEventsArray.slice(0, 1);
        // lastVisibleEventSnapShot = currentEventsArray.slice(11, 12);
        firstVisibleEventSnapShot = twelve[twelve.length - 12];
        lastVisibleEventSnapShot = twelve[twelve.length - 1];
        commit('setLastVisibleEventSnapShot', lastVisibleEventSnapShot)
        commit('setFirstVisibleEventSnapShot', firstVisibleEventSnapShot)
        commit('setAllEvents', allEventsArray)
        commit('setCancelledEvents', cancelledEventsArray)
        commit('setInfiniteEvents', twelve)
      })
    },
    getNextInfiniteEvents({ commit, state }) {
      const isLast = (element) => element == state.lastVisibleEventSnapShot;
      const lastIndex = state.allEvents.findIndex(isLast)
      var size = lastIndex + 13;
      var items = state.allEvents.slice(lastIndex + 1, size)
      commit('setLastVisibleEventSnapShot', items.at(-1))
      commit('setFirstVisibleEventSnapShot', items.at(+1))
      commit('setNextInfiniteEvents', items)
    },
    getPrevInfiniteEvents({ commit, state }) {
      console.log(state.firstVisibleEventSnapShot)
      const isFirst = (element) => element == state.firstVisibleEventSnapShot;
      const firstIndex = state.allEvents.findIndex(isFirst)
      var size = firstIndex - 13;
      var items = state.allEvents.slice(size, firstIndex - 1)
      // console.log(items)
      commit('setLastVisibleEventSnapShot', items.at(-1))
      commit('setFirstVisibleEventSnapShot', items.at(+1))
      commit('setPrevInfiniteEvents', items)
    },
    // getSearchEvents({ commit }, payload) {
    //   console.log('getting search')
    //   fb.eventsCollection.where("published", "==", true).orderBy('startDate', 'asc').where("title")
    // },
    getTaggedEvents({ commit }, payload) {
      console.log('getting tagged')
      fb.eventsCollection.where("published", "==", true).where("tags", "array-contains", payload).orderBy('startDate', 'asc')
      .onSnapshot(querySnapshot => {
        let taggedEventsArray = []
        querySnapshot.forEach((doc) => {
          taggedEventsArray.push(doc.data())
        })
        commit('setTaggedEvents', taggedEventsArray)
      })
    },
    getVenueEventsSearchResults({ commit }, payload) {
      console.log('getVenueEventsSearchResults')
      fb.eventsCollection.where("venueId", "==", payload).orderBy('startDate', 'asc')
      .get().then((querySnapshot) => {
        let yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1);
        let venueEventsArray = []
        querySnapshot.forEach(doc => {


      // .onSnapshot(querySnapshot => {
      //   let yesterday = new Date()
      //   yesterday.setDate(yesterday.getDate() - 1);
      //   let venueEventsArray = []
      //   querySnapshot.forEach((doc) => {
          let startComp = new Date(doc.data().startDate)
          let endComp = new Date(doc.data().endDate)
          let event = doc.data()
          venueEventsArray.push(event)
          // if ((endComp >= yesterday || startComp >= yesterday)) {
          //   venueEventsArray.push(event)
          // }
        })
        commit('setVenueEventsSearchResults', venueEventsArray)
      })
    },

    clearVenueEventsSearchResults({ commit }) {
      commit('setVenueEventsSearchResults', [])
    },
    clearTaggedEvents({ commit }) {
      commit('setTaggedEvents', [])
    },
    clearEventState({ commit }) {
      commit('setEventInfo', {})
    },
    clear2021EventsState({ commit }) {
      commit('set2021Events', [])
    },
    clear2022EventsState({ commit }) {
      commit('set2022Events', [])
    },
    clearEventsState({ commit }) {
      commit('setEvents', [])
      commit('set2021Events', [])
      commit('set2022Events', [])
      commit('setAllEvents', [])
      commit('setTaggedEvents', [])
      commit('setInfiniteEvents', [])
      commit('setNextInfiniteEvents', [])
      commit('setCancelledEvents', [])
      commit('setPrevInfiniteEvents', [])
      commit('setLastVisibleEventSnapShot', {})
      commit('setFirstVisibleEventSnapShot', {})
      commit('setVenueEventsSearchResults', [])
    },


    /*CODE*/
    getCode({ commit }) {
      console.log('getting code')
      fb.checkInMasterCollection.doc('q6fwrK6k4RxLSw3NQN6y')
      .onSnapshot((doc) => {
        let checkInMaster = doc.data().checkInMaster
        commit('setCheckInMaster', checkInMaster)
      })
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
      fb.shiftsCollection.where("eventId", "==", payload).orderBy('day', 'desc')
      .onSnapshot(querySnapshot => {
        let shiftsArray = []
        querySnapshot.forEach(doc => {
          let shift = doc.data()
          shift.id = doc.id
          fb.assignmentsCollection.where("shiftId", "==", shift.id).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (doc.exists) {
                return shift.disabled = true
              } else {
                return shift.disabled = false
              }
            })
          })
          shiftsArray.push(shift)
        })
        commit('setEventShifts', shiftsArray)
      })
    },
    clearEventShifts({ commit }) {
      commit('setEventShifts', [])
    },
    getEventAssignments({ commit }, payload) {
      fb.assignmentsCollection.where("eventId", "==", payload).onSnapshot(querySnapshot => {
        let assignmentsArray = []
        querySnapshot.forEach(doc => {
          let assignment = doc.data()
          assignmentsArray.push(assignment)
        })
        commit('setEventAssignments', assignmentsArray)
      })
    },
    checkoutAssignment({ commit }, payload) {
      console.log(payload)
      fb.userDaysCollection.doc(payload.id).update({
        checkOutTimeStamp: fb.firestore.FieldValue.serverTimestamp(payload.newTime)
      })
    },
    checkinAssignment({ commit }, payload) {
      console.log(payload)
      fb.userDaysCollection.doc(payload.id).update({
        checkInTimeStamp: fb.firestore.FieldValue.serverTimestamp(payload.newTime)
      })
    },
    checkoutTimeAssignment({ commit }, payload) {
      var date = new Date(payload.checkOutTimeStamp.seconds*1000);
      let postedDate = new Date(payload.checkOutTimeStamp.seconds*1000);
      let split = payload.newTime.split(/:|,/)
      postedDate.setHours(split[0], split[1])
      let newSeconds = (postedDate.getTime()/1000)

      console.log(newSeconds)
      fb.userDaysCollection.doc(payload.id).update({
        checkOutTimeStamp: {
          seconds: newSeconds
        }
      })
    },

    checkinTimeAssignment({ commit }, payload) {
      console.log(payload.id)
      console.log(payload.checkInTimeStamp.seconds*1000)
      var date = new Date(payload.checkInTimeStamp.seconds*1000);
      console.log(date.getTime())
      console.log(date)
      let postedDate = new Date(payload.checkInTimeStamp.seconds*1000);
      console.log(postedDate)
      let split = payload.newTime.split(/:|,/)
      console.log(split)
      postedDate.setHours(split[0], split[1])
      console.log(postedDate)

      let newSeconds = (postedDate.getTime()/1000)

      console.log(newSeconds)
      fb.userDaysCollection.doc(payload.id).update({
        checkInTimeStamp: {
          seconds: newSeconds
        }
      })
    },
    newCheckIn({ commit }, payload) {
      console.log(payload)
    },
    updateAssignment({ commit }, payload) {
      console.log(payload)
      fb.userDaysCollection.doc(payload.id).update(payload)
    },
    clearEventAssignments({ commit }) {
      commit('setEventAssignments', [])
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
      fb.shiftsCollection.orderBy('day', 'desc')
      .onSnapshot(querySnapshot => {
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
      fb.assignmentsCollection.where("shiftId", "==", payload).orderBy('firstName', 'asc')
      .onSnapshot(querySnapshot => {
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
      fb.assignmentsCollection.where("eventId", "==", payload.event).where("day", "==", payload.day).orderBy('firstName', 'asc')
      .onSnapshot(querySnapshot => {
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
        // fb.eventStaffCollection.add(assignment)
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
      fb.eventTimesheetNotesCollection.where("eventId", "==", payload).orderBy('created', 'desc')
      .onSnapshot(querySnapshot => {
        let userNotesArray = []
        querySnapshot.forEach(doc => {
          let note = doc.data()
          note.id = doc.id
          userNotesArray.push(note)
        })
        commit('setEventTimesheetNotes', userNotesArray)
      })
    },
    getAllPayroll({ commit }) {
      fb.assignmentsCollection.where("paystatus", "!=", "paid")
      .onSnapshot(querySnapshot => {
        let assignmentsArray = []
        querySnapshot.forEach(doc => {
          let docDate = new Date(doc.data().date)
          let Feb = new Date("2/1/2022")
          if (docDate > Feb) {
            assignmentsArray.push(doc.data())
          }
        })
        commit('setAllPayroll', assignmentsArray)
      })
    },
    clearAllPayroll({ commit }) {
      commit('setAllPayroll', [])
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
    clearEventCheckin({ commit }) {
      commit('setStaticEventUsers', [])
    },
    getEventCheckin({ commit }, payload) {
      fb.eventsCollection.doc(payload)
        .get()
        .then(doc => {
      // fb.eventsCollection.where("id", "==", payload)
      // .onSnapshot(querySnapshot => {
      //   querySnapshot.forEach(doc => {
          commit("setEventInfo", doc.data())
          store.dispatch('getEventUsers', doc.data().id)
          store.dispatch('getEventDrops', doc.data().id)
          store.dispatch("getEventShiftsState", doc.data().id)
          store.dispatch("getVenueFromIdPlacements", doc.data().venueId)
        // })
      })
    },
    getStaticEventUsers({ commit }, payload) {
      fb.userDaysCollection.where("preferredEvent", "==", payload).orderBy('created', 'asc')
      .get()
        .then(snapshot => {
          let eventUsersArray = []
          snapshot.forEach(doc => {
            let user = doc.data()
            eventUsersArray.push(user)
          })
      // .onSnapshot(querySnapshot => {
      //   let eventUsersArray = []
      //   querySnapshot.forEach(doc => {
      //     let user = doc.data()
      //     eventUsersArray.push(user)
      //   })
        commit('setStaticEventUsers', eventUsersArray)
      })
    },
    getEventPlacementFromId({ commit }, payload) {
      console.log(payload)
      fb.eventsCollection.doc(payload)
        .get()
        .then(doc => {
      //     let eventUsersArray = []
      //     snapshot.forEach(doc => {
      // fb.eventsCollection.where("id", "==", payload)
      // .onSnapshot(querySnapshot => {
      //   querySnapshot.forEach(doc => {
          commit("setEventInfo", doc.data())
          store.dispatch('getEventUsers', doc.data().id)
          store.dispatch('getEventDrops', doc.data().id)
          store.dispatch("getEventShiftsState", doc.data().id)
          store.dispatch("getVenueFromIdPlacements", doc.data().venueId)
      })
    },
    getEventUsers({ commit }, payload) {
      console.log('getEventUsers')
      fb.userDaysCollection.where("preferredEvent", "==", payload).orderBy('created', 'asc')
      // .get()
      //   .then(snapshot => {
      //     let eventUsersArray = []
      //     snapshot.forEach(doc => {
      //       let user = doc.data()
      //       eventUsersArray.push(user)
      //     })
      .onSnapshot(querySnapshot => {
        let eventUsersArray = []
        querySnapshot.forEach(doc => {
          let user = doc.data()
          eventUsersArray.push(user)
        })
        commit('setEventUsers', eventUsersArray)
      })
    },
    getEventDrops({ commit }, payload) {
      console.log('getEventDrops')
      fb.dropsCollection.where("preferredEvent", "==", payload).orderBy('created', 'asc')
      .onSnapshot(querySnapshot => {
        let eventUsersArray = []
        querySnapshot.forEach(doc => {
          let user = doc.data()
          eventUsersArray.push(user)
        })
        commit('setEventDrops', eventUsersArray)
      })
    },
    getDayShiftsState({ commit }, payload) {
      console.log('getDayShiftsState(')
      fb.shiftsCollection.where("day", "==", payload).orderBy('startTime', 'asc')
        .get()
        .then(snapshot => {
          let dayShiftsArray = []
          snapshot.forEach(doc => {
            let dayShift = doc.data()
            dayShiftsArray.push(dayShift)
          })
          commit('setDayShifts', dayShiftsArray)
          store.dispatch('getUserAvailabilityState', payload)

      // .onSnapshot(querySnapshot => {
      //   let dayShiftsArray = []
      //   querySnapshot.forEach(doc => {
      //     let dayShift = doc.data()
      //     dayShift.id = doc.id
      //     dayShiftsArray.push(dayShift)
      //   })
        
      })
    },
    getInfiniteEvents({ commit }) {
      console.log('getInfiniteEvents')
      fb.eventsCollection.orderBy('startDate', 'asc').get().then((querySnapshot) => {
        var lastVisibleEventSnapShot = {};
        var firstVisibleEventSnapShot = {};
        let yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1);
        let currentEventsArray = []
        let cancelledEventsArray = []
        let allEventsArray = []
        querySnapshot.forEach(doc => {
          let startComp = new Date(doc.data().startDate)
          let endComp = new Date(doc.data().endDate)
          let event = doc.data()
          if ((endComp >= yesterday || startComp >= yesterday) && (event.status != 'cancelled')) {
            currentEventsArray.push(event)
          }
          if (event.status != 'cancelled') {
            allEventsArray.push(event)
          }
          if (event.status == 'cancelled') {
            cancelledEventsArray.push(event)
          }
        })
        let twelve = currentEventsArray.slice(0, 12);
        // firstVisibleEventSnapShot = currentEventsArray.slice(0, 1);
        // lastVisibleEventSnapShot = currentEventsArray.slice(11, 12);
        firstVisibleEventSnapShot = twelve[twelve.length - 12];
        lastVisibleEventSnapShot = twelve[twelve.length - 1];
        commit('setLastVisibleEventSnapShot', lastVisibleEventSnapShot)
        commit('setFirstVisibleEventSnapShot', firstVisibleEventSnapShot)
        commit('setAllEvents', allEventsArray)
        commit('setCancelledEvents', cancelledEventsArray)
        commit('setInfiniteEvents', twelve)
      })
    },


    getEvents({ commit }, payload) {
      console.log('getEvents')
      fb.eventsCollection.where("published", "==", true).orderBy('startDate', 'asc')
      .onSnapshot(querySnapshot => {
        let eventsArray = []
        let completeEventsArray = []
        let partialEventsArray = []
        let cancelledEventsArray = []
        querySnapshot.forEach(doc => {
          
          let event = doc.data()
          // if (event.status != 'cancelled') {
          //   eventsArray.push(event)
          // }
          if (event.status != 'cancelled' && event.invoiceStatus == 'complete' && event.startDate.includes("2022")) {
            completeEventsArray.push(event)
          }
          if (event.status != 'cancelled' && event.invoiceStatus == 'partial' && event.startDate.includes("2022")) {
            partialEventsArray.push(event)
          }
          if (event.status != 'cancelled' && !event.invoiceStatus && event.startDate.includes("2022")) {
            eventsArray.push(event)
          }
          if (event.status == 'cancelled' && event.startDate.includes("2022")) {
            cancelledEventsArray.push(event)
          }
        })
        commit('setEvents', eventsArray.slice(0, 96))
        commit('setPartialEvents', partialEventsArray)
        commit('setCompleteEvents', completeEventsArray)
        commit('setEventsCancelled', cancelledEventsArray)
      })
    },
    clearEvents({ commit }) {
      commit('setEvents', [])
      commit('setPartialEvents', [])
      commit('setCompleteEvents', [])
      commit('setEventsCancelled', [])
    },
    getEventsByDay({ commit }, payload) {
      console.log('getEventsByDay')
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
      console.log('getEventShiftsState')
      fb.shiftsCollection.where("eventId", "==", payload).orderBy('day', 'asc').orderBy('startTime', 'asc')
     .onSnapshot(querySnapshot => {
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
      console.log('getUserAvailabilityState')
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
      .get().then((querySnapshot) => {
        let dayUsersArray = []
        querySnapshot.forEach((doc) => {
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
      console.log('getDayEventsState')
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
      fb.userDaysCollection.doc(payload.id).update({status: "placed", shift: payload.placement.shiftId, start: ''})
    },
    lockTheShifts({ commit }, payload) {
      console.log(payload)
      let event = payload.event
      let shift = payload.shift
      let shiftDay = payload.shift.day
      let dateObj = new Date(payload.shift.day);
      let month = dateObj.getUTCMonth() + 1;
      let day = dateObj.getUTCDate();
      let year = dateObj.getUTCFullYear();
      let newdate = month + "/" + day + "/" + year;

      payload.rows.forEach(row => {

        // let shiftStartTime = formatAMPM(row.start)
        // let shiftEndTime = formatAMPM(row.end)

        console.log(row)
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
          fileId: row.ssn || '123',
          position: row.job.title,
          start: shiftDay + " " + shift.startTime,
          end: shiftDay + " " + shift.endTime,
          startTime: row.start,
          endTime: row.end,
          eventInfo: event,
          shiftStart: row.start,
          shiftEnd: row.end,
          event: event.id,
          eventName: event.title,
          slug: event.slug,
          status: "assigned",
          shiftName: row.shiftName
        }
        // fb.userDaysCollection.doc(userId).update({
        //   event: assignment.event,
        //   slug: assignment.slug,
        //   event: assignment.eventId,
        //   fileId: assignment.fileId,
        //   eventName: assignment.eventName,
        //   status: "assigned",
        //   shift: assignment.shiftId
        // })
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
        //       shift: assignment.shiftId,
        //       shiftName: assignment.shiftName
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
        // fb.eventStaffCollection.add(assignment)

      })
    },
    // getEventCheckinList({ commit }, payload) {
    //   console.log('getUserAvailabilityState')
    //   fb.userDaysCollection.where("day", "==", TODAY).where()
    //   .get().then((querySnapshot) => {
    //     let dayUsersArray = []
    //     querySnapshot.forEach((doc) => {
    //       let dayUser = doc.data()
    //       dayUsersArray.push(dayUser)
    //     })
    //     commit('setDayUsers', dayUsersArray)
    //   })
    // },
    findShiftUser({ commit }, payload) {
      fb.userDaysCollection.where("userId", "==", payload.userId).where("shift", "==", payload.shift)
      .get()
      .then(doc => {
        commit("setCheckinUser", doc.data())
      })
    },
    clearShiftUser({ commit }) {
      commit("setCheckinUser", null)
    },
    lockAShift({ commit }, payload) {
      console.log(payload)
      let event = payload.event
      let row = payload.row
      let shift = payload.shift
      let shiftDay = payload.shift.day
      let dateObj = new Date(payload.shift.day);
      let month = dateObj.getUTCMonth() + 1;
      let day = dateObj.getUTCDate();
      let year = dateObj.getUTCFullYear();
      let newdate = month + "/" + day + "/" + year;
      let shiftStart = payload.shiftStart
      let shiftEnd = payload.shiftEnd
      let userId = payload.row.userId
      let ssn
      let rate
      let tipped
      let positioned

      if (row.ssn) {
        ssn = row.ssn
      } else {
        ssn = ''
      }

      if (row.job && row.job.rate) {
        rate = row.job.rate
      } else if ((!row.job || !row.job.rate) && (shift.position && shift.position.rate)) {
        rate = shift.position.rate
      } else {
        rate = "0"
      }

      if (row.job && row.job.tipped) {
        tipped = row.job.tipped
      } else {
        tipped = false
      }

      if (row.job && row.job.title) {
        positioned = row.job.title
      } else if (!row.job || !row.job.title) {
        positioned = shift.position.title
      } else {
        positioned = {}
      }


      let assignment = {
        shiftId: shift.id,
        userId: userId,
        date: newdate,
        day: shift.day,
        eventId: shift.eventId,
        email: payload.row.email,
        firstName: payload.row.firstName,
        lastName: payload.row.lastName,
        phone: payload.row.phone,
        name:  shift.event,
        fileId: ssn,
        position: positioned,
        regRate: rate,
        tipped: tipped,
        start: shiftDay + " " + shiftStart,
        end: shiftDay + " " + shiftEnd,
        startTime: shiftStart,
        endTime: shiftEnd,
        eventInfo: event,
        shiftStart: shiftStart,
        shiftEnd: shiftEnd,
        event: event.id,
        eventName: event.title,
        slug: event.slug,
        shiftName: payload.shift.name
      }
      console.log(assignment)
      fb.assignmentsCollection.add(assignment)
      .then(
        doc => {
          console.log(doc.id)
          fb.assignmentsCollection.doc(doc.id).update({
            id: doc.id,
            created: fb.firestore.FieldValue.serverTimestamp()
          })
        }
      )

      // fb.userDaysCollection.where("userId", "==", assignment.userId).where("day", "==", assignment.day[0]).get()
      // .then(function (querySnapshot) {
      //     querySnapshot.forEach(function (doc) {
      //       fb.userDaysCollection.doc(doc.id).update({
      //       event: assignment.event,
      //       slug: assignment.slug,
      //       event: assignment.eventId,
      //       fileId: assignment.fileId,
      //       eventName: assignment.eventName,
      //       status: "assigned",
      //       shift: assignment.shiftId,
      //       shiftName: payload.shift.name
      //     })
      //   })
      // })
    },
    
    getUsersPerDay({ commit }) {
      console.log('getUsersPerDay')
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

    updateTimesheetRates({ commit }, payload) {
      fb.assignmentsCollection.doc(payload.id).update(payload)
    },

    updateTimesheetPay({ commit }, payload) {
      console.log(payload)
      fb.assignmentsCollection.doc(payload.id).update({
        paystatus: payload.paystatus
      })
    },
    updateTimesheetStatus({ commit }, payload) {
      console.log(payload)
      fb.assignmentsCollection.doc(payload.id).update({
        status: payload.status
      })
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
    setHiddenVenues(state, val) {
      if (val) {
        state.hiddenVenues = val
      } else {
        state.hiddenVenues = []
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
    setCheckinUser(state, val) {
      state.checkinUser = val
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
    set2021Events(state, val) {
      if (val) {
        state.events2021 = val
      } else {
        state.events2021 = []
      }
    },
    set2022Events(state, val) {
      if (val) {
        state.events2022 = val
      } else {
        state.events2022 = []
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
    // setCheckinInfo(state, val) {
    //   state.checkinInfo = val
    // },
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
    setAllEvents(state, val) {
      if (val) {
        state.allEvents = val
      } else {
        state.allEvents = []
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
    setStaticEventUsers(state, val) {
      if (val) {
        state.staticEventUsers = val
      } else {
        state.staticEventUsers = []
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
    setAccessNotes(state, val) {
      if (val) {
        state.accessNotes = val
      } else {
        state.accessNotes = []
      }
    },
    setClientVenues(state, val) {
      if (val) {
        state.clientVenues = val
      } else {
        state.clientVenues = []
      }
    },
    setClientContacts(state, val) {
      if (val) {
        state.clientContacts = val
      } else {
        state.clientContacts = []
      }
    },
    setGroups(state, val) {
      if (val) {
        state.groups = val
      } else {
        state.groups = []
      }
    },
    setReferrals(state, val) {
      if (val) {
        state.referrals = val
      } else {
        state.referrals = []
      }
    },
    setUsersByState(state, val) {
      if (val) {
        state.stateUsers = val
      } else {
        state.stateUsers = []
      }
    },
    setUsersByCity(state, val) {
      if (val) {
        state.cityUsers = val
      } else {
        state.cityUsers = []
      }
    },
    setAppUsers(state, val) {
      if (val) {
        state.appUsers = val
      } else {
        state.appUsers = []
      }
    },
    setEmpUsers(state, val) {
      if (val) {
        state.empUsers = val
      } else {
        state.empUsers = []
      }
    },
    setFollowersGroupUsers(state, val) {
      if (val) {
        state.followersGroupUsers = val
      } else {
        state.followersGroupUsers = []
      }
    },
    setFollowersGroup(state, val) {
      state.followersGroup = val
    },
    setFollowerGroups(state, val) {
      if (val) {
        state.followersGroups = val
      } else {
        state.followersGroups = []
      }
    },
    setFollowersGroupMessages(state, val) {
      if (val) {
        state.followersGroupMessages = val
      } else {
        state.followersGroupMessages = []
      }
    },
    setClientAccess(state, val) {
      if (val) {
        state.clientAccess = val
      } else {
        state.clientAccess = []
      }
    },
    setClientAccessInfo(state, val) {
      state.clientAccessInfo = val
    },
    setPageText(state, val) {
      state.pageText = val
    },
    setEventsByYear(state, val) {
      if (val) {
        state.eventsByYear = val
      } else {
        state.eventsByYear = []
      }
    },
    setVerifications(state, val) {
      if (val) {
        state.verifications = val
      } else {
        state.verifications = []
      }
    },
    setUserVerifications(state, val) {
      if (val) {
        state.userVerifications = val
      } else {
        state.userVerifications = []
      }
    },
    setEventsByMonth(state, val) {
      if (val) {
        state.eventsByMonth = val
      } else {
        state.eventsByMonth = []
      }
    },
    setEventsByVenue(state, val) {
      if (val) {
        state.eventsByVenue = val
      } else {
        state.eventsByVenue = []
      }
    },
    setTagInfo(state, val) {
      state.tagInfo = val
    },
    setTags(state, val) {
      if (val) {
        state.tags = val
      } else {
        state.tags = []
      }
    },
    setInfiniteEvents(state, val) {
      if (val) {
        state.infiniteEvents = val
      } else {
        state.infiniteEvents = []
      }
    },
    setNextInfiniteEvents(state, val) {
      if (val) {
        state.nextInfiniteEvents = val
      } else {
        state.nextInfiniteEvents = []
      }
    },
    setPrevInfiniteEvents(state, val) {
      if (val) {
        state.prevInfiniteEvents = val
      } else {
        state.prevInfiniteEvents = []
      }
    },
    setLastVisibleEventSnapShot(state, val) {
      state.lastVisibleEventSnapShot = val
    },
    setFirstVisibleEventSnapShot(state, val) {
      state.firstVisibleEventSnapShot = val
    },
    setVenueEventsSearchResults(state, val) {
      if (val) {
        state.venueEventsSearchResults = val
      } else {
        state.venueEventsSearchResults = []
      }
    },
    setCancelledEvents(state, val) {
      if (val) {
        state.cancelledEvents = val
      } else {
        state.cancelledEvents = []
      }
    },
    setTaggedEvents(state, val) {
      if (val) {
        state.taggedEvents = val
      } else {
        state.taggedEvents = []
      }
    },
    setEventAssignments(state, val) {
      if (val) {
        state.eventAssignments = val
      } else {
        state.eventAssignments = []
      }
    },
    setAllPayroll(state, val) {
      if (val) {
        state.allPayroll = val
      } else {
        state.allPayroll = []
     }
    },
    setMyRecaps(state, val) {
      if (val) {
        state.myRecaps = val
      } else {
        state.myRecaps = []
      }
    },
    setCheckInMaster(state, val) {
      state.checkInMaster = val
    },
    setEventsCancelled(state, val) {
      if (val) {
        state.eventsCancelled = val
      } else {
        state.eventsCancelled = []
      }
    },
    setPartialEvents(state, val) {
      if (val) {
        state.partialEvents = val
      } else {
        state.partialEvents = []
      }
    },
    setCompleteEvents(state, val) {
      if (val) {
        state.completeEvents = val
      } else {
        state.completeEvents = []
      }
    },
  },
})

export default store
