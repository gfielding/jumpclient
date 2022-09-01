<template>
  <div class="pt-3">
    <Loader v-if="performingRequest" />
    <div class="dashboard__container--body">
      <div class="flex mb-3 justify-space-between" style="width:100%;">
        <span>
          <button class="btn btn__small mr-3 " v-bind:class="{ 'btn__dark': showTheQueue, 'btn__outlined': !showTheQueue }" @click="showQueue()">In Queue</button>
          <button class="btn btn__small mr-3" v-bind:class="{ 'btn__dark': !showTheQueue, 'btn__outlined': showTheQueue }" @click="hideQueue()">Added to Vensure</button>
        </span>
      <button v-if="showTheQueue" class="btn btn__small btn__outlined mr-3" @click="exportQueue()">export Queue</button>
      <button v-if="!showTheQueue" class="btn btn__small btn__outlined mr-3" @click="exportOnboarded()">export Onboarded</button>
      </div>
      <div class="dashboard__container--body--col" style="width:100%;">
      	<vue-good-table
          v-if="showTheQueue"
          :columns="columns"
          :rows="notOnboarded"
          :search-options="{
            enabled: true,
            placeholder: 'Search this table',
          }"
          :pagination-options="{
            enabled: true,
            mode: 'records',
            perPage: 50,
          }"
          >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'created'">
              <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
            </span>
            <span v-else-if="props.column.field == 'userId'">
              <router-link :to="`/users/` + props.row.userId" target="_blank">
                <i class="fas fa-external-link ml-3 mr-3"></i>
              </router-link>
            </span>
            <span v-else-if="props.column.field == 'Onboarded'">
              <button class="btn btn__small btn__flat btn__outlined-success" @click="onboard(props.row)">Onboard</button>
            </span>
            <span v-else-if="props.column.field == 'ssn'">
              <input style="width: 100%;" :value="decryptedText(props.row.ssn)" type="text" maxlength = "11" id="ssn2" readonly  />
            </span>
            <span v-else>
              {{props.formattedRow[props.column.field]}}
            </span>

          </template>
        </vue-good-table>
        <vue-good-table
          v-if="!showTheQueue"
          :columns="columns"
          :rows="onboarded"
          :search-options="{
            enabled: true,
            placeholder: 'Search this table',
          }"
          :pagination-options="{
            enabled: true,
            mode: 'records',
            perPage: 50,
          }"
          >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'created'">
              <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
            </span>
            <span v-else-if="props.column.field == 'userId'">
              <router-link :to="`/users/` + props.row.userId" target="_blank">
                <i class="fas fa-external-link ml-3 mr-3"></i>
              </router-link>
            </span>
            <span v-else-if="props.column.field == 'Onboarded'">
              <button class="btn btn__small btn__flat btn__outlined-danger" @click="unonboard(props.row)">Undo</button>
            </span>
            <span v-else-if="props.column.field == 'ssn'">
              <input style="width: 100%;" :value="decryptedText(props.row.ssn)" type="text" maxlength="11" id="ssn2" readonly  />
            </span>
            <span v-else>
              {{props.formattedRow[props.column.field]}}
            </span>

          </template>
        </vue-good-table>
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
  name: 'payrollSubmissions',
  data: () => ({
    showTheQueue: true,
    performingRequest: false,
    performingRequest: false,
    encryptionKey: 'SKD433{}{[SKD433{}{[SKD433{}{[32',
    columns: [
      {
        label: 'Created',
        field: 'created',
      },
      {
        label: 'Change Status',
        field: 'Onboarded',
      },
      {
        label: 'First',
        field: 'firstName',
      },
      {
        label: 'Last',
        field: 'lastName',
      },
      {
        label: 'ssn',
        field: 'ssn',
      },
      {
        label: 'Phone',
        field: 'phone',
      },
      {
        label: 'Email',
        field: 'email',
      },
      {
        label: 'State',
        field: 'state',
      },
      {
        label: 'DOB',
        field: 'dob',
      },
      {
        label: 'UserId',
        field: 'userId',
      },
    ]
  }),
  components: {
    Loader
  },
  created () {
    this.$store.dispatch("getPayrollSubmissions")

    // if (!this.users || this.users.length < 2) {
    //   this.$store.dispatch("getUserReports")
    // }
  },
  computed: {
    ...mapState(['users', 'userProfile', 'payrollSubmissions']),
    onboarded () {
      return this.payrollSubmissions.filter(submission => {
        return ((submission.Onboarded == true))
      })
    },
    notOnboarded () {
      return this.payrollSubmissions.filter(submission => {
        return ((submission.Onboarded == false))
      })
    },
    // inStateUsers() {
    // 	return this.stateUsers.length > 0
    // },
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
    showQueue() {
      this.performingRequest = true
      this.showTheQueue = true
      setTimeout(() => {
        this.performingRequest = false
      }, 2000)
    },
    hideQueue() {
      this.performingRequest = true
      this.showTheQueue = false
      setTimeout(() => {
        this.performingRequest = false
      }, 2000)
    },
    onboard(row) {
      this.$store.dispatch('onboardSubmission', row)
    },
    unonboard(row) {
      this.$store.dispatch('unonboardSubmission', row)
    },
  	// setSelectedState(value) {
  	// 	console.log(value[0])
  	// 	this.$store.dispatch("getUsersByState", value[0])
  	// },
    decryptedText(ssn) {
      if (ssn) {
       return (this.$CryptoJS.AES.decrypt(ssn, this.encryptionKey).toString(this.CryptoJS.enc.Utf8) || this.$CryptoJS.AES.encrypt(ssn, this.encryptionKey).toString())
      } else {
        return null
      }
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY, hh:mm a')
      } else {
        return null
      }
    },
    exportOnboarded() {
      const exportHeaders = [
        "Created",
        "Onboarded",
        "First Name",
        "Last Name",
        "Social",
        "Email",
        "Phone",
        "State Worked",
        "DOB"
      ]
      const exportItems = [];
      for (var key in this.onboarded) {
        exportItems.push([
          this.formatDate(this.onboarded[key].created),
          this.onboarded[key].Onboarded,
          this.onboarded[key].firstName,
          this.onboarded[key].lastName,
          this.decryptedText(this.onboarded[key].ssn),
          this.onboarded[key].email,
          this.onboarded[key].phone,
          this.onboarded[key].state,
          this.onboarded[key].dob,
        ])
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    exportQueue() {
      const exportHeaders = [
        "Created",
        "Onboarded",
        "First Name",
        "Last Name",
        "Social",
        "Email",
        "Phone",
        "State Worked",
        "DOB"
      ]
      const exportItems = [];
      for (var key in this.notOnboarded) {
        exportItems.push([
          this.formatDate(this.notOnboarded[key].created),
          this.notOnboarded[key].Onboarded,
          this.notOnboarded[key].firstName,
          this.notOnboarded[key].lastName,
          this.decryptedText(this.notOnboarded[key].ssn),
          this.notOnboarded[key].email,
          this.notOnboarded[key].phone,
          this.notOnboarded[key].state,
          this.notOnboarded[key].dob,
        ])
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
  },
  beforeDestroy () {
    // this.$store.dispatch("clearUsersState")
    this.$store.dispatch("clearPayrollSubmissions")
  }
}
	
</script>