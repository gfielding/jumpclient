<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header mb-3">
        <h1>Place Staff By Event</h1>
        <span>
          <button class="btn mr-3" v-bind:class="{ 'btn__dark': is2021, 'btn__outlined': !is2021 }" @click="show2021()">2021</button>
          <button class="btn mr-3" v-bind:class="{ 'btn__dark': is2022, 'btn__outlined': !is2022 }" @click="show2022()">2022</button>
          <!-- <button class="btn btn__outlined" @click="showAll = true" v-if="!showAll">Show Visible</button>
          <button class="btn btn__outlined" @click="showAll = false" v-if="showAll">Show Hidden</button> -->
          <router-link :to="{name: 'addevent'}" class="color--text">
            <button class="btn btn__flat ml-3"><i class="fas fa-plus fa-2x"></i></button>
          </router-link>
        </span>
        
      </div>
      <div class="dashboard__container--body">
          <Loader v-if="!events || events.length == 0" />
          <vue-good-table
          v-if="is2021"
              :columns="columns"
              :rows="events2021"
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
              <span v-if="props.column.field == 'startDate'">
                {{props.row.startDate | moment("ddd, MMM Do YYYY") }}
                <span v-if="props.row.endDate">
                    - {{props.row.endDate | moment("ddd, MMM Do YYYY") }}
                </span>
              </span>
              <span v-else-if="props.column.field == 'published'">
                <span v-if="props.row.published">
                  <i class="fas fa-eye"></i>
                </span>
                <span v-else>
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


          <vue-good-table
          v-if="is2022"
              :columns="columns"
              :rows="events2022"
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
              <span v-if="props.column.field == 'startDate'">
                {{props.row.startDate | moment("ddd, MMM Do YYYY") }}
                <span v-if="props.row.endDate">
                    - {{props.row.endDate | moment("ddd, MMM Do YYYY") }}
                </span>
              </span>
              <span v-else-if="props.column.field == 'published'">
                <span v-if="props.row.published">
                  <i class="fas fa-eye"></i>
                </span>
                <span v-else>
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

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'eventplacements',
  data: () => ({
    showAll: true,
    is2021: false,
    is2022: true,
    columns: [
      {
        label: 'Event',
        field: 'title',
      },
      {
        label: 'Date',
        field: 'startDate',
      },
      {
        label: 'Visible',
        field: 'published',
        thClass: 'hidden-small',
        tdClass: 'hidden-small',
        width: '60px',
      },
      {
        label: 'Venue',
        field: 'venue.title',
      },
      {
        label: 'City',
        field: 'venue.address.city',
        thClass: 'hidden-small',
        tdClass: 'hidden-small',
      },
      {
        label: 'State',
        field: 'venue.address.state',
      },
      // {
      //   label: 'Pay Date',
      //   field: 'payDate',
      //   type: 'date',
      //   dateInputFormat: 'yyyy-MM-dd',
      //   dateOutputFormat: 'MMM do yyyy',
      //   thClass: 'hidden-small',
      //   tdClass: 'hidden-small',
      // },
      // {
      //   label: 'Complete',
      //   field: 'paid',
      //   tdClass: 'text-center',
      //   thClass: 'hidden-small',
      //   tdClass: 'hidden-small',
      // },
    ]
  }),
  created () {
    if (!this.events || this.events.length < 1) {
      this.$store.dispatch("getEvents")
    }
  },
  computed: {
    ...mapState(['events']),
    //  allEvents: function() {
    //   return this.events.filter(event => {
    //     return event.published
    //   })
    // },
    // hiddenEvents: function() {
    //   return this.events.filter(event => {
    //     return !event.published
    //   })
    // },
    events2021: function() {
      return this.events.filter(event => {
        return event.startDate.includes("2021")
      })
    },
    events2022: function() {
       return this.events.filter(event => {
        return event.startDate.includes("2022")
      })
    },
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
    onRowClick(params) {
      let url = `/eventplacements/` + params.row.id
      console.log(url)
      router.push(url)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('clearEventsState')
  }
}
</script>