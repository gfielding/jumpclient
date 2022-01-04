<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header flex justify-space-between align-center">
        <h1>User Reports</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <Loader v-if="!users || (users && users.length == 0)" />
      <div class="dashboard__container--body pt-3">
      	<div class="dashboard__container--body--col" v-if="users">
      		<h3>Total Users</h3>
      		{{users.length}}
      	</div>
      	<div class="dashboard__container--body--col" v-if="users && appUsers">
      		<h3>App Users</h3>
      		{{appUsers.length}}
      	</div>
      </div>
    </div>
  </div>
	
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import * as moment from 'moment'
import router from '@/router'
import ExportService from "@/services/ExportService"
const fb = require('../../firebaseConfig.js')

export default {
  name: 'userReports',
  data() {
    return {
      performingRequest: false,
      columns: [
        {
          label: 'Name',
          field: 'fullName',
        },
      ]
    }
  },
  components: {
    Loader
  },
  created () {
    if (!this.users || this.users.length < 1) {
      this.$store.dispatch("getUsers")
    }
  },
  computed: {
    ...mapState(['users', 'userProfile']),
    appUsers () {
      return this.users.filter(user => {
        return user.fcm_token
      })
    },
    // filteredPlacedUsers () {
    //   return this.eventUsers.filter(user => {
    //     return ((user.status == 'placed') || (user.status == 'assigned'))
    //   })
    // },
  },
  methods: {
  	goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch("clearUsersState")
    console.log(this)
  }
}
	
</script>