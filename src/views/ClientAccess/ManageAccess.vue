<template>
	<div class="pt-3">
  
      <form ref="form" @submit.prevent>
      	<div class="dashboard__container--body pt-3">
      		<div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="firstName">First Name:</label>
              <input type="text" placeholder="" v-model.trim="clientAccessInfo.firstName" id="firstName" />
            </div>
            <div class="mb-3">
              <label for="lastName">Last Name:</label>
              <input type="text" placeholder="" v-model.trim="clientAccessInfo.lastName" id="lastName" />
            </div>
            <div class="mb-3">
              <label for="title">Title:</label>
              <input type="text" placeholder="" v-model.trim="clientAccessInfo.title" id="title" />
            </div>
            <div class="mb-3">
              <label for="phone">Phone:</label>
              <input type="text" v-mask="'(###) ###-####'" placeholder="(999) 999-9999" v-model.trim="clientAccessInfo.phone" id="phone" />
            </div>
          </div>
          <div class="dashboard__container--body--col">
            <div class="mb-3" v-if="clients && clients.length > 1">
              <label for="company">Company:</label>
              <v-select
                class="mt-2"
                label="title" 
                :options="clients"
                multiple
                v-model="clientAccessInfo.company"
                required
                >
              </v-select>
            </div>
            <div class="mb-3" v-if="venues && venues.length > 1">
              <label for="venue">Venue(s):</label>
              <v-select
                class="mt-2"
                label="title" 
                :options="venues"
                multiple
                v-model="clientAccessInfo.venue"
                required
                >
              </v-select>
            </div>
            <button class="btn btn__primary mt-3" @click="updateClient()">
              Update
              <transition name="fade">
                <span class="ml-2" v-if="performingRequest">
                <i class="fa fa-spinner fa-spin"></i>
                </span>
              </transition>
              </button>
          </div>
        </div>
      </form>
      <hr>


      <div class="dashboard__container--body" v-if="clientAccessInfo">
        <!-- <div class="dashboard__container--body--col">
          
        </div> -->
        <div class="dashboard__container--body--col">
          <AccessNote :user="clientAccessInfo" :me="userProfile" />
        </div>
      </div>
      <div class="dashboard__container--body" v-if="clientAccessInfo">
        <div class="dashboard__container--body--col" style="width:100%;">
          <AccessNotesTable :notes="accessNotes" />
        </div>
      </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as moment from 'moment'
import Loader from '@/components/Loader.vue'
import AccessNotesTable from '@/components/Profile/AccessNotesTable.vue'
import AccessNote from '@/components/Profile/AccessNote.vue'
import router from '@/router'
import firebase from 'firebase/app';
const fb = require('../../firebaseConfig.js')

export default {
  name: 'manageAccess',
  data: () => ({
    performingRequest:false,
  }),
  components: {
    Loader,
    AccessNotesTable,
    AccessNote
  },
  created () {
    this.$store.dispatch("getAccessClientFromId", this.$route.params.id);
  },
  computed: {
    ...mapState(['clientAccessInfo', 'clients', 'venues', 'accessNotes', 'userProfile']),
  },
  methods: {
    updateClient() {
      this.performingRequest = true
      let client = this.clientAccessInfo
      this.$store.dispatch('updateClientAccess', client)
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.performingRequest = null
    delete this.performingRequest
    this.$store.dispatch('clearAccessClientState')
    this.$store.dispatch('clearContactsState')
    this.$store.dispatch('clearVenuesState')
  }
}
</script>