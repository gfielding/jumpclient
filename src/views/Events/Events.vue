<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Events</h1>
        <router-link :to="{name: 'addevent'}" class="color--text">
          <button class="btn btn__flat"><i class="fas fa-plus fa-2x"></i></button>
        </router-link>
      </div>
      <div class="dashboard__container--body">
          <Loader v-if="!events || events.length == 0" />
          <vue-good-table
              :columns="columns"
              :rows="events"
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
              <span v-if="props.column.field == 'startDate'">
                {{props.row.startDate | moment("ddd, MMM Do YYYY") }}
                <span v-if="props.row.endDate">
                    - {{props.row.endDate | moment("ddd, MMM Do YYYY") }}
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
  name: 'events',
  data: () => ({
    columns: [
      {
        label: 'Event',
        field: 'title',
      },
      {
        label: 'Date',
        field: 'startDate',
        type: 'date',
      },
      {
        label: 'Visible',
        field: 'published',
      },
      {
        label: 'Venue',
        field: 'venue.title',
      },
      {
        label: 'City',
        field: 'venue.address.city',
      },
      {
        label: 'State',
        field: 'venue.address.state',
      },
    ]
  }),
  computed: {
    ...mapState(['events']),
  },
  components: {
    Loader,
  },
  methods: {
    onRowClick(params) {
      let url = `/events/` + params.row.id
      console.log(url)
      router.push(url)
    }
  },
  created () {
    if (!this.events || this.events.length < 1) {
      this.$store.dispatch("getEvents")
    }
  }
}
</script>