<template>
  <div class="dashboard">
    <Loader v-if="!eventInfo || !eventInfo.id" />
    <div class="dashboard__container" v-if="eventInfo && eventInfo.id">
      <div class="dashboard__container--header">
        <div class="flex align-center">
          <h1 v-if="eventInfo.title">{{eventInfo.title}} Timesheets</h1>
          <button class="btn btn__large btn__danger ml-5" v-if="eventInfo && eventInfo.cancelled">
            Cancelled
          </button>
        </div>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <div class="dashboard__container--body" v-if="eventInfo">
        <div class="eventdays mb-3">
          <button class="mr-2 mb-2" v-for="(day, index) in eventInfo.days" :key="index" @click="showEventShfts(day)" v-bind:class="{ 'chipDark': activeDay == day, 'chip': activeDay != day }">
            {{day}}
          </button>
        </div>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!eventShifts || eventShifts.length == 0" />
        <vue-good-table
          v-if="!activeDay"
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
        <vue-good-table
          v-if="activeDay"
          :columns="columns"
          :rows="filteredEventShifts"
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
    activeDay: '',
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
    ]
  }),
  computed: {
    ...mapState(['eventShifts', 'eventInfo']),
    filteredEventShifts() {
      return this.eventShifts.filter(item => {
        return (item.day = this.activeDay)
      })
    }
  },
  components: {
    Loader,
  },
  methods: {
    goBack() {
      router.go(-1)
    },
    // showEventShfts(day) {
    //   let url = `/timesheets/` + this.$route.params.id + `/` + day
    //   router.push(url)
    // },
    showEventShfts(day) {
      this.activeDay = day
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
    this.columns = null
    delete this.columns
    this.$store.dispatch("clearEventState")
    this.$store.dispatch("clearEventShifts")
    this.$store.dispatch('clearErrors')
  }
}
</script>