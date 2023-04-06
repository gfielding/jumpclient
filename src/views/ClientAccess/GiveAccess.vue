<template>
	<div>
    <div>
      <form ref="form" @submit.prevent>
      	<div class="dashboard__container--body pt-3">
      		<div class="dashboard__container--body--col">
            <div>
            <div class="mb-3">
              <label for="firstName">First Name:</label>
              <input type="text" placeholder="" v-model.trim="client.firstName" id="firstName" />
            </div>
            <div class="mb-3">
              <label for="lastName">Last Name:</label>
              <input type="text" placeholder="" v-model.trim="client.lastName" id="lastName" />
            </div>
            <div class="mb-3">
              <label for="title">Title:</label>
              <input type="text" placeholder="" v-model.trim="client.title" id="title" />
            </div>
            <div class="mb-3">
              <label for="role">Role:</label>
              <v-select
                class="mt-2"
      
                :options="roles"
                multiple
                v-model="client.role"
                required
                >
              </v-select>
            </div>
            <div class="mb-3">
              <label for="phone">Phone:</label>
              <input type="text" v-mask="'(###) ###-####'" placeholder="(999) 999-9999" v-model.trim="client.phone" id="phone" />
            </div>
            <div class="mb-3">
              <label for="email">Email:</label>
              <input type="text" placeholder="" v-model.trim="client.email" id="email" />
            </div>
            <div class="mb-3">
              <label for="password">Password:</label>
              <input type="text" placeholder="" v-model.trim="client.password" id="password" />
            </div>
          </div>
          </div>
          <div class="dashboard__container--body--col">
            <div>
            <div class="mb-3" v-if="clients.length > 1">
              <label for="company">Company:</label>
              <v-select
                class="mt-2"
                label="title" 
                :options="clients"
                multiple
                v-model="client.company"
                required
                >
              </v-select>
            </div>
            <div class="mb-3" v-if="venues.length > 1">
              <label for="venue">Venue(s):</label>
              <v-select
                class="mt-2"
                label="title" 
                :options="venues"
                multiple
                v-model="client.venue"
                required
                >
              </v-select>
            </div>
            </div>
            <div class="floating_buttons">
              <button class="btn btn__primary mt-3" @click="addUser()">
                Send Invite
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as moment from 'moment'
import Loader from '@/components/Loader.vue'
import router from '@/router'
import firebase from 'firebase/app';
const fb = require('../../firebaseConfig.js')

export default {
  name: 'giveClientAccess',
  data: () => ({
    client: {},
    performingRequest:false,
    roles: ['Admin', 'User']
  }),
  components: {
    Loader
  },
  created () {
    if (!this.clients || this.clients.length < 1) {
      this.$store.dispatch("getClients")
    }
    if (!this.venues || this.venues.length < 1) {
      this.$store.dispatch("getVenues")
    }
  },
  computed: {
    ...mapState(['clients', 'venues']),
  },
  methods: {
    addUser() {
      this.performingRequest = true
      let client = this.client
      var createUser = firebase.functions().httpsCallable('createUser');
      createUser(client)
      .then((result) => {
        console.log(result)
      })
      setTimeout(() => {
        this.performingRequest = false
        client = {}
        let url = `/clientAccess`
        router.push(url)
      }, 2000)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.client = null
    this.performingRequest = null
    delete this.client
    delete this.performingRequest
    this.$store.dispatch('clearContactsState')
    this.$store.dispatch('clearVenuesState')
  }
}
</script>