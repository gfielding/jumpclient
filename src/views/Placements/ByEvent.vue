<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Place Staff By Event</h1>
      </div>
      <div class="dashboard__container--body">
          <Loader v-if="!events || events.length == 0" />
          <vue-good-table
              :columns="columns"
              :rows="events"
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
      {
        label: 'Pay Date',
        field: 'payDate',
        type: 'date',
        dateInputFormat: 'yyyy-MM-dd',
        dateOutputFormat: 'MMM do yyyy',
        thClass: 'hidden-small',
        tdClass: 'hidden-small',
      },
      {
        label: 'Complete',
        field: 'paid',
        tdClass: 'text-center',
        thClass: 'hidden-small',
        tdClass: 'hidden-small',
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
      let url = `/eventplacements/` + params.row.id
      console.log(url)
      router.push(url)
    }
  },
  created () {
    if (!this.events || this.events.length < 1) {
      this.$store.dispatch("getEvents")
    }
  },
  beforeDestroy () {
    this.columns = null
    delete this.columns
  }
}
</script>