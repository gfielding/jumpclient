<template>
	<div class="dashboard__container--body">
    <Loader v-if="!events || events.length == 0" />
    <vue-good-table
      v-if="events && events.length > 0"
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
      >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field == 'startDate'">
          {{props.row.startDate | moment("MMM Do YYYY") }}
          <span v-if="props.row.endDate">
              - {{props.row.endDate | moment("MMM Do YYYY") }}
          </span>
        </span>
        <span v-else-if="props.column.field == 'title'">
          <router-link :to="`/events/` + props.row.id">
            {{props.row.title}}
            <!-- <button class="btn btn__icon btn__flat mr-4"><i class="fad fa-external-link"></i></button> -->
          </router-link>
        </span>

        <span v-else-if="props.column.field == 'timesheets'">
          <router-link :to="`/events/` + props.row.id + `/timesheets`">
            <button class="btn btn__icon btn__flat mr-2 ml-2"><i class="fad fa-external-link"></i></button>
          </router-link>
        </span>
        <span v-else-if="props.column.field == 'shifts'">
          <router-link :to="`/events/` + props.row.id + `/shifts`">
            <button class="btn btn__icon btn__flat mr-2 ml-2"><i class="fad fa-external-link"></i></button>
          </router-link>
        </span>
        <span v-else-if="props.column.field == 'placements'">
          <router-link :to="`/eventplacements/` + props.row.id">
            <button class="btn btn__icon btn__flat mr-2 ml-2"><i class="fad fa-external-link"></i></button>
          </router-link>
        </span>

         <span v-else-if="props.column.field == 'published'">
          <span v-if="props.row.cancelled">
            Cancelled
          </span>
          <span v-if="props.row.published && !props.row.cancelled">
            <i class="fas fa-eye"></i>
          </span>
          <span v-if="!props.row.published && !props.row.cancelled">
            <i class="fas fa-eye-slash"></i>
          </span>
          
        </span>
        <span v-else-if="props.column.field == 'paid'">
          <span v-if="props.row.paid">
            <i class="fas fa-check"></i>
          </span>
        </span>
         <span v-else>
          {{props.formattedRow[props.column.field]}}
        </span>
      </template>
    </vue-good-table>
   
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'eventsByMonth',
  data: () => ({
    performingRequest: false,
    // is2021: false,
    // is2022: true,
    showAll: true,
    columns: [
      {
        label: 'Event',
        field: 'title',
        width: '300px',
      },
      {
        label: 'Sheets',
        field: 'timesheets',
        sortable: false,
        width: '40px',
      },
      {
        label: 'Shifts',
        field: 'shifts',
        sortable: false,
        width: '40px',
      },
      {
        label: 'Place',
        field: 'placements',
        sortable: false,
        width: '40px',
      },
      {
        label: 'Date',
        field: 'startDate',
        width: '80px',
      },
      {
        label: 'Visible',
        field: 'published',
        width: '40px',
      },
      {
        label: 'Venue',
        field: 'venue.title',
        width: '150px',
      },
      {
        label: 'City',
        field: 'venue.address.city',
        thClass: 'hidden-small',
        tdClass: 'hidden-small',
        width: '80px',
      },
      {
        label: 'State',
        field: 'venue.address.state',
        width: '40px',
      },
    ]
  }),
  created () {
    this.$store.dispatch("getEventsByMonth", this.$route.params.id);
  },
  computed: {
    ...mapState(['eventsByMonth']),
    events() {
      return this.eventsByMonth
    }
  },
  components: {
    Loader,
  },
  methods: {
    // show2021() {
    //   this.performingRequest = true
    //   this.is2022 = false
    //   this.$store.dispatch('clear2022EventsState')
    //   this.$store.dispatch("get2021Events")
      
    //   setTimeout(() => {
        
    //     this.is2021 = true
    //     this.performingRequest = false
    //   }, 2000)
    // },
    // show2022() {
    //   this.performingRequest = true
    //   this.is2021 = false
    //   this.$store.dispatch('clear2021EventsState')
    //   this.$store.dispatch("get2022Events")
      
    //   setTimeout(() => {
        
    //     this.is2022 = true
    //     this.performingRequest = false
    //   }, 2000)
    // },
  },
  beforeDestroy () {
    this.performingRequest = false
    this.showAll = false
    this.columns = false
    delete this.showAll
    delete this.columns
    delete this.performingRequest
    console.log(this)
    this.$store.dispatch('clearEventsByMonth')
  }
}
</script>