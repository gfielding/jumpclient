<template>
  <div class="dashboard">
    <Loader v-if="performingRequest" />
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>I-9 Verifications</h1>
        <button class="btn btn__outlined mr-3" @click="exportAll()">export all</button>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!verifications || verifications.length == 0" />
        
        <div class="flex pt-3" v-if="verifications && verifications.length >= 1" style="width:100%;"> 
          <vue-good-table
              :columns="columns"
              :rows="verifications"
              :pagination-options="{
                enabled: true,
                mode: 'records',
                perPage: 50,
              }"
              >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'url'">
                <a :href="props.row.url" target="_blank">View Document</a>
              </span>
              <span v-else-if="props.column.field == 'created'">
                <span>{{formatDate(props.row.created)}}</span>
              </span>
              <span v-else-if="props.column.field == 'verified'">
                <button class="btn btn__success btn__small ma-2 mr-5" @click="verify(props.row)">
                  Accept
                </button>

                <button class="btn btn__danger btn__small ma-2 mr-5" @click="unVerify(props.row)">
                  Reject
                </button>


                <!-- <button class="btn btn__flat pa-2 mr-5" @click="verify(props.row)">
                  <span v-if="!props.row.verified"><i class="fas fa-check" style="color:lightgrey"></i></span>
                </button>
                <button class="btn btn__flat pa-2 mr-5">
                  <span v-if="props.row.verified"><i class="fas fa-check" style="color:green"></i></span>
                </button>


                <button class="btn btn__flat pa-2" @click="unVerify(props.row)">
                  <span v-if="props.row.verified"><i class="fas fa-times" style="color:lightgrey"></i></span>
                </button>
                <button class="btn btn__flat pa-2">
                  <span v-if="!props.row.verified"><i class="fas fa-times" style="color:red"></i></span>
                </button> -->
              </span>
              <span v-else-if="props.column.field == 'user'">
                <router-link :to="`/users/` + props.row.userId" target="_blank">
                  <span v-if="props.row.firstName && props.row.lastName">
                    {{props.row.firstName}} {{props.row.lastName}}
                  </span>
                  <span v-if="!props.row.firstName || !props.row.lastName">
                    <button class="btn btn__icon btn__flat mr-2 ml-2"><i class="fad fa-external-link"></i></button>
                  </span>
                </router-link>
              </span>
              <span v-else-if="props.column.field == 'delete'">
                <button class="btn btn__icon pa-2" @click="deleteItem(props.row)" :disabled="props.row.verified">
                  <i class="fas fa-trash"></i>
                </button>
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as moment from 'moment'
import { mapState } from 'vuex'
import ExportService from "@/services/ExportService"
import Loader from '@/components/Loader.vue'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'verifications',
  data: () => ({
    performingRequest: false,
    columns: [
      {
        label: 'Uploaded',
        field: 'created',
      },
      {
        label: 'User',
        field: 'user',
        sortable: false
      },
      {
        label: 'Type',
        field: 'type',
      },
      {
        label: 'Link',
        field: 'url',
        sortable: false
      },
      
      {
        label: 'Verify',
        field: 'verified',
      },
      
      {
        label: 'Delete',
        field: 'delete',
        sortable: false
      },
    ]
  }),
  created () {
    this.$store.dispatch("getVerifications")
  },
  computed: {
    ...mapState(['verifications', 'currentUser']),
  },
  components: {
    Loader,
  },
  methods: {
    verify(item) {
      this.performingRequest = true
      console.log(item)
      fb.verificationsCollection.doc(item.id).update({
        verified: true
      })
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    unVerify(item) {
      this.performingRequest = true
      console.log(item)
      fb.verificationsCollection.doc(item.id).update({
        verified: false,
        rejected: true,
      })
      setTimeout(() => {
        this.performingRequest = false
      }, 2000)
    },
    exportAll() {
      let logFields = {
          user: this.currentUser.email,
          export: 'Verifications Export',
      }
      this.$store.dispatch('sendExportLog', logFields)
      const exportHeaders = [
        "Added",
        "Last Name",
        "First Name",
        "Email",
        "Phone",
        "State Wored",
      ]
      const exportItems = [];
      for (var key in this.opr) {
        exportItems.push([
          this.opr[key].created,
          this.opr[key].checked,
          this.opr[key].firstName,
          this.opr[key].lastName,
          this.opr[key].email,
          this.opr[key].phone,
          this.opr[key].eventInfo.venue.address.state,
          // this.opr[key].address.state,
        ])
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    markAdded(p) {
      p.eos = p.eos
      this.$store.dispatch("updateOpr", p)
    },
    deleteItem(item) {
      fb.verificationsCollection.doc(item.id).delete()
    },
    formatDate(q) {
      if(q) {
        console.log(q)
        const postedDate = new Date(q.seconds) * 1000;
        console.log(postedDate)
        return moment(postedDate).format('MMMM Do YYYY')
      } else {
        return null
      }
    },
  },
  beforeDestroy () {
    this.$store.dispatch("clearVerifications")
  }
}
</script>