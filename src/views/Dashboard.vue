<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Dashboard</h1>
      </div>
      <div class="dashboard__container--body pt-3" v-if="userProfile">
        <div class="mb-3 flex align-center justify-space-between" style="width:100%;">
          <h2>My Leads:</h2>
          <button class="btn btn__small btn__outlined mr-3" @click="exportMyLeads()">Export My Leads</button>
        </div>
        <div class="flex" v-if="marketLeads && marketLeads.length >= 1" style="width:100%;">
          <vue-good-table
            :columns="columns"
            :rows="marketLeads"
            :pagination-options="{
              enabled: false,
              mode: 'records',
              perPage: 20,
            }"
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'created'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
              <span v-else-if="props.column.field == 'updated'">
                <span v-if="props.row.updated">{{formatDate(props.row.updated)}}</span>
              </span>
              <span v-else-if="props.column.field == 'market'">
                <span v-if="props.row.market">{{props.row.market.city}}</span>
                <!-- <input type="text" v-model.trim="props.row.market" placeholder="CA" id="state" @change="onSheetEditable(props.row)" :readonly="props.row.locked" /> -->
              </span>
              <span v-else-if="props.column.field == 'jobs'">
                <span v-for="(item, index) in props.row.jobs" :key="index">{{item.title}}, </span>
              </span>
              <span v-else-if="props.column.field == 'note'">
                <button v-show="!props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="opacity:0.5;"></i></button>
                <button v-show="props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="color:blue"></i></button>
                <transition name="modal">
                  <div v-if="activeItem == props.row">
                    <LeadNote :item="props.row" :userProfile="userProfile" @close="closeNote(props.row)" />
                  </div>
                </transition>
              </span>
              <span v-else-if="props.column.field == 'delete'">
                <button class="btn btn__primary btn__small ml-2 mr-2" @click="removeEntry(props.row)">
                  hide
                </button>
              </span>
              <span v-else-if="props.column.field == 'state'">
                <input type="text" v-model.trim="props.row.state" placeholder="CA" id="state" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'status'">
                <v-select
                  label="status" 
                  :options="statuses"
                  v-model="props.row.status"
                  @input="updateLead(props.row)"
                  :clearable=false
                  >
                </v-select>
              </span>
              <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
          </vue-good-table>
        </div>
        <!-- <div class="dashboard__container--body--col">
          <h3>Check-In/Check-Out</h3>
          {{checkInMaster}}
        </div> -->


         <!-- <button @click="removeBadApps()">Bad Applications</button> -->

        <!-- <button @click="updateSocials()">Update Socials</button> -->
        <!-- <button @click="updateEvents()">Update All Events</button> -->

       <!--  <button @click="updateAllApplications()">Update All Applications</button> -->


        <!-- <div class="dashboard__container--body--col">
          <ProfileImage :userProfile="userProfile" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileContact :userProfile="userProfile" :emailVerified="emailVerified" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileAddress :userProfile="userProfile" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileSocial :userProfile="userProfile" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileBio :userProfile="userProfile" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileEmergency :userProfile="userProfile" />
        </div> -->
      </div>
    </div>

    <Loader v-if="!userProfile" />

  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import Recap from '@/components/Recap.vue'
import LeadNote from '@/components/LeadNote.vue'
import ExportService from "@/services/ExportService"
import * as moment from 'moment'
const fb = require('../firebaseConfig.js')

export default {
  name: 'dashboard',
  data: () => ({
    statuses: ['New', 'Contacted', 'Signed Up', 'Not Interested'],
    performingRequest: false,
    activeItem: null,
    columns: [
      {
        label: 'Created',
        field: 'created',
        width: '120px'
      },
      {
        label: 'Status',
        field: 'status',
        width: '160px'
      },
      {
        label: 'Note',
        field: 'note',
      },
      {
        label: 'First Name',
        field: 'first',
      },
      {
        label: 'Last Name',
        field: 'last',
      },
      
      {
        label: 'Email',
        field: 'email',
      },
      {
        label: 'Phone',
        field: 'phone',
        width: '120px'
      },
      {
        label: 'Skills',
        field: 'jobs',
        sortable: false,
      },
      {
        label: 'Market',
        field: 'market',
      },
      {
        label: 'Source',
        field: 'source',
      },
      {
        label: 'Updated By',
        field: 'updatedBy',
        width: '120px'
      },
      {
        label: 'Last Updated',
        field: 'updated',
        width: '120px'
      },
      {
        label: 'Added By',
        field: 'addedBy',
        width: '120px'
      },
      {
        label: 'Hide',
        field: 'delete',
        sortable: false,
      },
    ]
  }),
  created () {
    this.$store.dispatch("getMyLeads")
    this.$store.dispatch("getVenues")
  },
  computed: {
    ...mapState(['userProfile', 'marketLeads']),
  },
  components: {
    Loader,
    Recap,
    LeadNote
  },
  methods: {
    exportMyLeads() {
      this.performingRequest = true
      const exportHeaders = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Source",
      ];
      const exportItems = [];
      for (var key in this.marketLeads) {
        exportItems.push([
          this.marketLeads[key].first,
          this.marketLeads[key].last,
          this.marketLeads[key].email,
          this.marketLeads[key].phone,
          this.marketLeads[key].source,
        ]);
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    // removeBadApps() {
    //   fb.assignmentsCollection.where()
    // }
    // updateSocials() {
    //   console.log('updating')
    //   fb.usersCollection.where("ssn", "!=", null).orderBy("ssn").limit(10000)
    //   .get()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       // console.log(doc.id, " => ", doc.data());
    //       let social = doc.data().ssn
    //       fb.assignmentsCollection.where("userId", "==", doc.id)
    //       .get()
    //       .then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //           console.log(doc.id, " => ", doc.data());
    //           fb.assignmentsCollection.doc(doc.id).update({
    //             fileId: social || ''
    //           })
    //         })
    //       })
    //     });
    //   })
    // },
    // updateEvents() {
    //   fb.eventsCollection.get()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       if (doc.data().venue && doc.data().venue.title) {
    //         console.log(doc.data().venue.title);
    //         fb.eventsCollection.doc(doc.id).update({
    //           venue_title: doc.data().venue.title
    //         })
    //       }
    //       if (doc.data().startDate && doc.data().endDate = null) {
    //         console.log(doc.id)
    //         fb.eventsCollection.doc(doc.id).update({
    //           endDate: doc.data().startDate
    //         })
    //       }
    //     })  
    //   })
    // },
    // updateAllEvents() {
    //   console.log('updating')
    //   this.$store.dispatch("updateAllEvents")
    // },
    // updateAllApplications() {
    //   console.log('updating')
    //   this.$store.dispatch("updateAllApplications")
    // },
    updateLead(row) {
      fb.marketingLeadsCollection.doc(row.id).update({
        status: row.status,
        updatedBy: this.userProfile.firstName + ' ' + this.userProfile.lastName,
        updated: fb.firestore.FieldValue.serverTimestamp(),
      })
    },
    showNote(r) {
      console.log(r)
      this.activeItem = r
    },
    closeNote(r) {
      this.activeItem = null
    },
    removeEntry(row) {
      fb.marketingLeadsCollection.doc(row.id).update({
        hidden:true
      })
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMM Do, YYYY')
      } else {
        return null
      }
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearMarketingLeads')
  }
  // created () {
  //   if (!this.userProfile) {
  //     this.$store.dispatch("getUserProfile");
  //   }
  // },

}
</script>