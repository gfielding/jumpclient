<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Event Timesheets</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <div class="dashboard__container--body" v-if="eventInfo">
        <div class="eventdays mb-3">
          <button class="chipDark mr-2 mb-2" v-for="(day, index) in eventInfo.days" :key="index" @click="showEventShfts(day)">{{day}}</button>
        </div>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!eventShifts || eventShifts.length == 0" />
        <vue-good-table
          :columns="columns"
          :rows="eventShifts"
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
          @on-row-click="onRowClick"
        >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'payrollComplete'">
              <span v-if="props.row.payrollComplete">
                <i class="fas fa-check"></i>
              </span>
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
import router from '@/router'

export default {
  name: 'eventtimesheets',
  data: () => ({
    columns: [
      {
        label: 'Date',
        field: 'day',
      },
      {
        label: 'Event',
        field: 'event',
      },
      {
        label: 'Staff',
        field: 'staff',
      },
      {
        label: 'Start Time',
        field: 'startTime',
      },
      {
        label: 'End Time',
        field: 'endTime',
      },
      {
        label: 'Position',
        field: 'position.title',
      },
      {
        label: 'Complete',
        field: 'payrollComplete',
        tdClass: 'text-center',
      },
    ]
  }),
  computed: {
    ...mapState(['eventShifts', 'eventInfo']),
  },
  components: {
    Loader,
  },
  methods: {
    goBack() {
      router.go(-1)
    },
    showEventShfts(day) {
      let url = `/timesheets/` + this.$route.params.id + `/` + day
      router.push(url)
    },
    onRowClick(params) {
      let url = `/timesheets/` + params.row.id
      console.log(url)
      router.push(url)
    }
  },
  created () {
    this.$store.dispatch("getEventFromId", this.$route.params.id)
  },
  beforeDestroy () {
    this.$store.dispatch("clearEventState")
    this.$store.dispatch("clearEventShifts")
    this.$store.dispatch('clearErrors')
  }
}
</script>