<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header flex justify-space-between align-center">
        <h1>Reports</h1>
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
      	<div class="dashboard__container--body--col" v-if="users && empUsers">
      		<h3>Oboarded Employees</h3>
      		{{empUsers.length}}
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
      states:['CA', 'CO', 'FL'],
      state: '',
      columns: [
        {
          label: 'First',
          field: 'firstName',
        },
        {
          label: 'Last',
          field: 'lastName',
        },
        {
          label: 'Phone',
          field: 'phone',
        },
        {
          label: 'Email',
          field: 'email',
        },
      ]
    }
  },
  components: {
    Loader
  },
  created () {
    if (!this.users || this.users.length < 1) {
      this.$store.dispatch("getUserReports")
    }
  },
  computed: {
    ...mapState(['users', 'userProfile', 'stateUsers', 'appUsers', 'empUsers']),
    inStateUsers() {
    	return this.stateUsers.length > 0
    },
    // appUsers () {
    //   return this.users.filter(user => {
    //     return user.fcm_token
    //   })
    // },
    // empUsers () {
    //   return this.users.filter(user => {
    //     return user.employeeNumber
    //   })
    // },
    // filteredPlacedUsers () {
    //   return this.eventUsers.filter(user => {
    //     return ((user.status == 'placed') || (user.status == 'assigned'))
    //   })
    // },
  },
  methods: {
  	// setSelectedState(value) {
  	// 	console.log(value[0])
  	// 	this.$store.dispatch("getUsersByState", value[0])
  	// },
  	goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch("clearUsersState")
    this.$store.dispatch("clearUserReports")

    console.log(this)
  }
}
	
</script>