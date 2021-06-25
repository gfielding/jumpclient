import Vue from 'vue'
import Vuex from 'vuex'
// import * as fb from '../firebaseConfig'
const fb = require('../firebaseConfig.js')
import router from '../router/index'

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
    errorMessage: ''
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
        status: 'applied'
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

      // redirect to login view
      router.push('/')
    },
    updateUserProfile({ commit }, payload) {
      fb.usersCollection.doc(payload.id).update(payload)
      const userProfile = fb.usersCollection.doc(payload.user.id).get()
      commit('setUserProfile', userProfile)
      
    },
    updateUser({ commit, state }, payload) {
      console.log(payload)
      let user = state.currentUser
      fb.usersCollection.doc(state.currentUser.uid).update(payload)
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
    setPerformingRequest(state, val) {
      state.performingRequest = val
    },
  },
})

export default store
