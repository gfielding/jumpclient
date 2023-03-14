<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Jobs</h1>
        <span>
          <router-link :to="{name: 'addweek'}" class="color--text">
            <!-- <button class="btn btn__flat ml-3"><i class="fas fa-plus fa-2x"></i></button> -->
            <button class="btn btn__outlined ml-3">Add Job</button>
          </router-link>
        </span>
        
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!weeks || weeks.length == 0" />
        <vue-good-table
            :columns="columns"
            :rows="weeks"
             styleClass="vgt-table condensed"
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 25,
            }"
            @on-row-click="onRowClick"
          >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'created'">
              <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
            </span>
            <span v-else-if="props.column.field == 'published'">
              <i class="fa-solid fa-check" v-if="props.row.published" style="color:green;"></i>
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
import * as moment from 'moment'
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'weeks',
  data: () => ({
    showAllGroups: true,
    showMyGroups: false,
    showFollower: false,
    columns: [
      {
        label: 'Start Date',
        field: 'startDate',
      },
      {
        label: 'Title',
        field: 'title',
      },
      {
        label: 'City',
        field: 'event_city',
      },
      {
        label: 'State',
        field: 'event_state',
      },
      {
        label: 'Venue',
        field: 'venue_title',
      },
      {
        label: 'Published',
        field: 'published',
      },
    ],
  }),
  created () {
    this.$store.dispatch("getWeeks")
  },
  computed: {
    ...mapState(['currentUser', 'weeks']),
  },
  components: {
    Loader,
  },
  methods: {
    onRowClick(params) {
      let url = `/jobs/` + params.row.id
      console.log(url)
      router.push(url)
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY, hh:mm a')
      } else {
        return null
      }
    },
  },
  beforeDestroy() {
    // this.$store.dispatch('clearEventsState')
    this.$store.dispatch("clearWeeks")
    console.log(this)
  }
}
</script>