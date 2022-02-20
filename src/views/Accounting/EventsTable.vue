<template>
	<div class="dashboard__container--body pt-3">
		<Loader v-if="!eventsByYear || eventsByYear.length == 0" />
    <vue-good-table
        :columns="columns"
        :rows="eventsByYear"
         styleClass="vgt-table striped"
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
          {{props.row.startDate | moment("MMM Do, YYYY") }}
          <span v-if="props.row.endDate">
              - {{props.row.endDate | moment("MMM Do, YYYY") }}
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
        <span v-else-if="props.column.field == 'invoiced'">
            <input type="text" v-model.trim="props.row.invoiced" id="invoiced" />
          </span>
          <span v-else-if="props.column.field == 'invoiceStatus'">
            <span v-if="props.row.invoiceStatus == 'complete'">
              <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#5cb85c;"></i>
            </span>
            <span v-if="props.row.invoiceStatus == 'partial'">
              <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#f0ad4e;"></i>
            </span>
            <span v-if="!props.row.invoiceStatus">
              <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#d9534f;"></i>
            </span>

          </span>
          <span v-else-if="props.column.field == 'invoiceRequested'">
            <span v-if="props.row.invoiceRequested">
              <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#d9534f;"></i>
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
  name: 'accountingEventsTable',
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
        label: 'Client',
        field: 'client.title',
        thClass: 'hidden-small',
        tdClass: 'hidden-small',
      },
      {
        label: 'State',
        field: 'venue.address.state',
      },
      {
        label: 'Status',
        field: 'invoiceStatus',
        tdClass: 'text-center',
      },
      {
        label: 'New Request',
        field: 'invoiceRequested',
        tdClass: 'text-center',
      },
    ]
  }),
  created () {
    // if (!this.events || this.events.length < 1) {
    //   this.$store.dispatch("getEvents")
    // }
    if (!this.eventsByYear || this.eventsByYear.length < 1) {
      this.$store.dispatch("getEventsByYear", this.$route.params.id)
    }
  },
  computed: {
    ...mapState(['eventsByYear']),
  },
  components: {
    Loader,
  },
  methods: {
    onRowClick(params) {
      let url = `/accounting/events/` + params.row.id
      console.log(url)
      router.push(url)
    }
  },
  beforeDestroy () {
  	this.$store.dispatch('clearEventsByYear')
    console.log(this)
  }
}
</script>