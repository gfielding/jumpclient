<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Dashboard</h1>
        <!-- <button @click="updateAllApplications()">update</button> -->
        <!-- <button @click="updateSSN()">delete ssn</button> -->
      </div>
      <div class="dashboard__container--body pt-3">
        <vue-good-table
              :columns="columns"
              :rows="myGroupsNewApplications"
               styleClass="vgt-table condensed"
              :search-options="{
                enabled: true,
                placeholder: 'Search this table',
              }"
              :pagination-options="{
                enabled: true,
                mode: 'records',
                perPage: 20,
              }"
              @on-row-click="onRowClick"
            >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'created'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
              <span v-else-if="props.column.field == 'owner'">
                <span v-if="props.row.owner">
                  {{props.row.owner.firstName}}
                </span>
                <span v-if="props.row.owner">
                  {{props.row.owner.lastName}}
                </span>
              </span>
              <span v-else-if="props.column.field == 'applicants'">
                <span v-if="props.row.applicants" style="color:green;">
                  {{props.row.applicants.length}}
                </span>
              </span>
              <span v-else-if="props.column.field == 'members'">
                <span v-if="props.row.members">
                  {{props.row.members.length}}
                </span>
              </span>
              <span v-else-if="props.column.field == 'admins'">
                <span v-if="props.row.admins && props.row.admins.length > 0">
                  <button class="btn btn__small chip mr-2" v-for="(item, index) in props.row.admins" :key="item.id">{{item.name}}</button>
                </span>
              </span>
              <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
          </vue-good-table>
      </div>

        <Loader v-if="!userProfile" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
// import Recap from '@/components/Recap.vue'
// import LeadNote from '@/components/LeadNote.vue'
// import ExportService from "@/services/ExportService"
import * as moment from 'moment'
import router from '@/router'
const fb = require('../firebaseConfig.js')

export default {
  name: 'dashboard',
  data: () => ({
    performingRequest: false,
    columns: [
      {
        label: 'Title',
        field: 'title',
      },
      {
        label: 'Members',
        field: 'members',
      },
      {
        label: 'New Applicants',
        field: 'applicants',
      },
    ],
  }),
  created () {
    if (!this.groups || this.groups.length < 1) {
      this.$store.dispatch("getGroups")
    }
  },
  computed: {
    ...mapState(['groups', 'currentUser', 'userProfile']),
    myGroupsNewApplications: function() {
      return this.groups.filter(group => {
        return (((group.owner == this.currentUser.uid) ||group.admins.includes(this.currentUser.uid)) && (group.applicants && group.applicants.length > 0))
      })
    },

  },
  components: {
    Loader,
  },
  methods: {
    // updateSSN() {
    //   this.$store.dispatch('updateSSN')
    // },
    onRowClick(params) {
      console.log(params)
      let url = `/groups/` + params.row.id
      console.log(url)
      router.push(url)
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMM Do, YYYY')
      } else {
        return null
      }
    },
    updateAllApplications() {
      this.$store.dispatch('updateAllApplications')
    }
  },
  beforeDestroy () {
    this.$store.dispatch('clearMarketingLeads')
  }

}
</script>