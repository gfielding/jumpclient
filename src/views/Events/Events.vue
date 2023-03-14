<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Events</h1>
        <span>
          <router-link :to="{name: 'addevent'}" class="color--text">
            <!-- <button class="btn btn__flat ml-3"><i class="fas fa-plus fa-2x"></i></button> -->
            <button class="btn btn__outlined ml-3">Add Event</button>
          </router-link>
        </span>
        
      </div>
      <div class="dashboard__container--body">
          <Loader v-if="!events || events.length == 0" />
          <vue-good-table
              :columns="columns"
              :rows="events"
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
  name: 'events',
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
      // {
      //   label: 'Groups',
      //   field: 'groups',
      // },
      {
        label: 'Published',
        field: 'published',
      },
    ],
    // columns2: [
    //   {
    //     label: 'Name',
    //     field: 'title',
    //   },
    //   {
    //     label: 'Followers',
    //     field: 'followers',
    //   },
    //   {
    //     label: 'City',
    //     field: 'address.city',
    //     thClass: 'hidden-small',
    //     tdClass: 'hidden-small',
    //   },
    //   {
    //     label: 'State',
    //     field: 'address.state',
    //   },
    // ]
  }),
  created () {
    this.$store.dispatch("getEvents")
  },
  computed: {
    ...mapState(['currentUser', 'events']),
    // myGroups: function() {
    //   return this.groups.filter(group => {
    //     return group.owner == this.currentUser.uid
    //   })
    // },
  },
  components: {
    Loader,
  },
  methods: {
    // showFollowerGroups() {
    //   this.showFollower = true
    //   this.showAllGroups = false
    //   this.showMyGroups = false
    // },
    // showMine() {
    //   this.showFollower = false
    //   this.showAllGroups = false
    //   this.showMyGroups = true
    // },
    // showAll() {
    //   this.showFollower = false
    //   this.showAllGroups = true
    //   this.showMyGroups = false
    // },
    onRowClick(params) {
      let url = `/events/` + params.row.id
      console.log(url)
      router.push(url)
    },
    // onRowClick2(params) {
    //   let url = `/followersgroups/` + params.row.id
    //   console.log(url)
    //   router.push(url)
    // },
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
    this.$store.dispatch("clearEvents")
    console.log(this)
  }
}
</script>