<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Referrals</h1>
        <!-- <span>
          <button class="btn btn__outlined" @click="showAll = true" v-if="!showAll">Show Visible</button>
          <button class="btn btn__outlined" @click="showAll = false" v-if="showAll">Show Hidden</button>
        </span> -->
      </div>
      <div class="dashboard__container--body pt-3">
        <Loader v-if="!referrals || referrals.length == 0" />
        <vue-good-table
            :columns="columns"
            :rows="referrals"
             styleClass="vgt-table striped"
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 20,
            }"
          >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'created'">
              <span v-if="props.row.created">{{formatDate(props.row.created)}}
              </span>
            </span>
            <span v-else-if="props.column.field == 'statusChange'">
              <span v-if="props.row.statusChange">{{formatDate2(props.row.paid)}}
              </span>
            </span>
            <span v-else-if="props.column.field == 'locked'">
              <button class="btn btn__icon" @click="lock(props.row)" v-if="!props.row.locked">
                <i class="fas fa-lock-open-alt ml-3 mr-3"></i>
              </button>
              <button class="btn btn__icon" @click="unlock(props.row)" v-if="props.row.locked">
                <i class="fas fa-lock-alt ml-3 mr-3" style="color:#5cb85c;"></i>
              </button>
            </span>
            <span v-else-if="props.column.field == 'note'">
              <button v-show="!props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="opacity:0.5;"></i></button>
              <button v-show="props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="color:blue"></i></button>
              <transition name="modal">
                <div v-if="activeItem == props.row">
                  <ReferralNote :item="props.row" @close="closeNote(props.row)" />
                </div>
              </transition>
            </span>
            <span v-if="props.column.field == 'referrer'">
              {{props.row.referrer_firstName}} {{props.row.referrer_lastName}}
            </span>
            <span v-if="props.column.field == 'friend'">
              {{props.row.friend_firstName}} {{props.row.friend_lastName}}
            </span>
            <!-- <span v-if="props.column.field == 'status'">
              {{props.row.status}}
            </span> -->
            <span v-if="props.column.field == 'value'">
              {{props.row.value}}
            </span>
            <span v-else-if="props.column.field == 'status'">
              <v-select :options="statuses" v-model="props.row.status" @input="updateReferral(props.row)" :disabled="props.row.locked" />
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
import router from '@/router'
import ReferralNote from '@/components/Timesheets/ReferralNote.vue'
import * as moment from 'moment'

export default {
  name: 'accountReferrals',
  data: () => ({
    showAll: true,
    activeItem: null,
    statuses: ['new', 'pending', 'cancelled', 'paid'],
    columns: [
      {
        field: 'locked',
        type: 'boolean',
        tdClass: 'text-center',
        sortable: false,
      },
      {
        label: 'Status',
        field: 'status',
        width: '132px'
      },
      {
        label: 'Note',
        field: 'note',
      },
      {
        label: 'Referrer',
        field: 'referrer',
      },
      {
        label: 'Friend',
        field: 'friend',
      },
      {
        label: 'Value',
        field: 'value',
      },
      {
        label: 'Created',
        field: 'created',
      },
      {
        label: 'Paid/Cancelled',
        field: 'statusChange',
      }
    ]
  }),
  created () {
    if (!this.referrals || this.referrals.length < 1) {
      this.$store.dispatch("getReferrals")
    }
  },
  computed: {
    ...mapState(['referrals']),
    // allEvents: function() {
    //   return this.events.filter(event => {
    //     return event.published
    //   })
    // },
    // hiddenEvents: function() {
    //   return this.events.filter(event => {
    //     return !event.published
    //   })
    // }
  },
  components: {
    Loader,
    ReferralNote
  },
  methods: {
    updateReferral(r) {
      this.$store.dispatch("updateReferral", r)
    },
    showNote(r) {
      console.log(r)
      this.activeItem = r
    },
    closeNote(r) {
      this.activeItem = null
    },
    onRowClick(params) {
      let url = `/accounting/events/` + params.row.id
      console.log(url)
      router.push(url)
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY, HH:MM A')
      } else {
        return null
      }
    },
    formatDate2(q) {
      return moment(q).format('MMMM Do YYYY, HH:MM A')
    },
    lock(item) {
      this.$store.dispatch("lockReferral", item.id);
    },
    unlock(item) {
      this.$store.dispatch("unlockReferral", item.id);
    },
  },
  beforeDestroy () {
    this.$store.dispatch("clearReferralsState")
  }
}
</script>