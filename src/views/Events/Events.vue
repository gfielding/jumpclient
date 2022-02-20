<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header mb-3">
        <h1>Events</h1>
        <span>
          <button class="btn mr-3" v-bind:class="{ 'btn__dark': is2021, 'btn__outlined': !is2021 }" @click="show2021()">2021</button>
          <button class="btn mr-3" v-bind:class="{ 'btn__dark': is2022, 'btn__outlined': !is2022 }" @click="show2022()">2022</button>
          <router-link :to="{name: 'addevent'}" class="color--text">
            <button class="btn btn__flat ml-3"><i class="fas fa-plus fa-2x"></i></button>
          </router-link>
        </span>
        
      </div>
      <div class="dashboard__container--body" v-if="is2021">
          <Loader v-if="!events2021 || events2021.length == 0" />
          <vue-good-table
           
              :columns="columns"
              :rows="events2021"
               
              :search-options="{
                enabled: true,
                placeholder: 'Search this table',
              }"
              :pagination-options="{
                enabled: true,
                mode: 'records',
                perPage: 50,
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
        <div class="dashboard__container--body" v-if="is2022">
          <Loader v-if="!events2022 || events2022.length == 0" />


          <vue-good-table
           v-if="is2022"
              :columns="columns"
              :rows="events2022"
               
              :search-options="{
                enabled: true,
                placeholder: 'Search this table',
              }"
              :pagination-options="{
                enabled: true,
                mode: 'records',
                perPage: 50,
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
    </div>
  </div>
</template>

<style scoped type="text/css">
.dashboard__container {
  width: calc(100% - 4rem);
}
.max {
  width:calc(100% - 3.2rem);
}
table.vgt-table td {
  padding: 0 !important;
}
input, textarea {
  padding: 0.4rem 0;
}
</style>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'events',
  data: () => ({
    is2021: false,
    is2022: true,
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
    if (!this.events || this.events.length < 1) {
      this.$store.dispatch("getEvents")
    }
  },
  computed: {
    ...mapState(['events2021', 'events2022']),
  },
  components: {
    Loader,
  },
  methods: {
    show2021() {
      this.is2021 = true
      this.is2022 = false
    },
    show2022() {
      this.is2022 = true
      this.is2021 = false
    },
  },
  beforeDestroy () {
    this.is2021 = false
    this.is2022 = false
    this.showAll = false
    this.columns = false
    delete this.is2021
    delete this.is2022
    delete this.showAll
    delete this.columns
    console.log(this)
    this.$store.dispatch('clearEventsState')
  }
}
</script>