<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Marketing Leads</h1>
        <span> 


          <button class="btn btn__small mr-3" v-bind:class="{ 'btn__dark': allLeads, 'btn__outlined': !allLeads }" @click="showAll">All Leads</button>
          <button class="btn btn__small mr-3" v-bind:class="{ 'btn__dark': myLeads, 'btn__outlined': !myLeads }" @click="showMine">My Leads</button>
          <button class="btn btn__small mr-3"v-bind:class="{ 'btn__dark': hiddenLeads, 'btn__outlined': !hiddenLeads }"  @click="showArchive">Archived Leads</button>
          <button class="btn btn__small btn__outlined mr-3" @click="exportMyLeads()">Export My Leads</button>
          <router-link :to="{name: 'enterNewLead'}" class="color--text">
            <button class="btn btn__flat"><i class="fas fa-plus fa-2x"></i></button>
          </router-link>
        </span>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!marketingLeads || marketingLeads.length == 0 || performingRequest" />
        <div class="flex pt-3" v-if="allLeads" style="width:100%;">
          <vue-good-table
            :columns="columns"
            :rows="marketingLeads"
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
        <div class="flex pt-3" v-if="hiddenLeads" style="width:100%;">
          <vue-good-table
            :columns="columns"
            :rows="archivedLeads"
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
        <div class="flex pt-3" v-if="myLeads" style="width:100%;">
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
import ExportService from "@/services/ExportService"
import LeadNote from '@/components/LeadNote.vue'
import * as moment from 'moment'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'marketingLeads',
  data: () => ({
    activeItem: null,
    allLeads: true,
    hiddenLeads: false,
    myLeads: false,
    statuses: ['New', 'Contacted', 'Signed Up', 'Not Interested'],
    performingRequest: false,
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
  computed: {
    ...mapState(['marketingLeads', 'archivedLeads', 'userProfile', 'marketLeads']),
  },
  components: {
    Loader,
    LeadNote
  },
  created () {
    this.$store.dispatch("getMarketetingLeads")
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
    showAll() {
      this.allLeads = true
      this.hiddenLeads = false
      this.myLeads = false
    },
    showMine() {
      this.allLeads = false
      this.hiddenLeads = false
      this.myLeads = true
    },
    showArchive() {
      this.allLeads = false
      this.hiddenLeads = true
      this.myLeads = false
    },
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
}
</script>