<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Timesheets</h1>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!shifts || shifts.length == 0" />
        <vue-good-table
          :columns="columns"
          :rows="shifts"
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
  name: 'shifts',
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
    ]
  }),
  computed: {
    ...mapState(['shifts']),
  },
  components: {
    Loader,
  },
  methods: {
    onRowClick(params) {
      let url = `/timesheets/` + params.row.id
      console.log(url)
      router.push(url)
    }
  },
  created () {
    if (!this.shifts || this.shifts.length < 1) {
      this.$store.dispatch("getShifts")
    }
  },
  beforeDestroy () {
    this.$store.dispatch('clearShiftsState')
  }
}
</script>