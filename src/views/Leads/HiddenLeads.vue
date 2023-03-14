<template>
	<div class="dashboard__container--body">
    <Loader v-if="!archivedLeads || archivedLeads.length == 0 || performingRequest" />
    <div class="flex" v-if="(archivedLeads && archivedLeads.length > 0)" style="width:100%;">
      <vue-good-table
        :columns="columns"
        :rows="archivedLeads"
        styleClass="vgt-table condensed"
        :pagination-options="{
          enabled: true,
          mode: 'records',
          perPage: 20,
        }"
        :search-options="{
          enabled: true,
          placeholder: 'Search this table',
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
            <button class="btn btn__primary btn__small ml-2 mr-2" @click="showEntry(props.row)">
              unarchive
            </button>
          </span>
          <span v-else-if="props.column.field == 'state'">
            <input type="text" v-model.trim="props.row.state" placeholder="CA" id="state" />
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
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
import LeadNote from '@/components/LeadNote.vue'
import * as moment from 'moment'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'archivedLeads',
  data: () => ({
    statuses: ['New', 'Contacted', 'Signed Up', 'Not Interested'],
    activeItem: null,
    performingRequest: false,
    columns: [
    	{
        label: 'Show',
        field: 'delete',
        sortable: false,
      },
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
      
    ]
  }),
  computed: {
    ...mapState(['archivedLeads', 'userProfile']),
  },
  components: {
    Loader,
    LeadNote
  },
  methods: {
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
    showEntry(row) {
      fb.marketingLeadsCollection.doc(row.id).update({
        hidden: false
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
}
</script>