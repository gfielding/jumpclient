<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Groups</h1>
        <span>
          <button class="btn mr-3" v-bind:class="{ 'btn__dark': showAllGroups, 'btn__outlined': !showAllGroups }"  @click="showAll()">All Groups</button>
          <button class="btn mr-3" v-bind:class="{ 'btn__dark': showMyGroups, 'btn__outlined': !showMyGroups }" @click="showMine()">My Groups</button>
          <button class="btn mr-3" v-bind:class="{ 'btn__dark': showFollower, 'btn__outlined': !showFollower }" @click="showFollowerGroups()">Follower Groups</button>
          <router-link :to="{name: 'addgroup'}" class="color--text">
            <button class="btn btn__flat ml-3"><i class="fas fa-plus fa-2x"></i></button>
          </router-link>
        </span>
        
      </div>
      <div class="dashboard__container--body pt-4">
          <Loader v-if="!groups || groups.length == 0" />
          <vue-good-table
            v-if="showAllGroups"
              :columns="columns"
              :rows="groups"
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
              <span v-if="props.column.field == 'created'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
              <span v-else-if="props.column.field == 'owner'">
                <span v-if="props.row.owner">
                  {{props.row.owner.firstName}}
                </span>
                <span v-if="props.row.owner">
                  {{props.row.owner.lastName}}
                </span>
              </span>
              <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
          </vue-good-table>

          <vue-good-table
            v-if="showMyGroups"
              :columns="columns"
              :rows="myGroups"
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
              <span v-if="props.column.field == 'created'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
              <span v-else-if="props.column.field == 'owner'">
                <span v-if="props.row.owner">
                  {{props.row.owner.firstName}}
                </span>
                <span v-if="props.row.owner">
                  {{props.row.owner.lastName}}
                </span>
              </span>
              <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
          </vue-good-table>

          <vue-good-table
          v-if="showFollower"
            :columns="columns2"
            :rows="venues"
            styleClass="vgt-table striped"
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 10,
            }"
            @on-row-click="onRowClick2"
          >
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
  name: 'groups',
  data: () => ({
    showAllGroups: true,
    showMyGroups: false,
    showFollower: false,
    columns: [
      {
        label: 'Title',
        field: 'title',
      },
      {
        label: 'Created',
        field: 'created',
      },
    ],
    columns2: [
      {
        label: 'Name',
        field: 'title',
      },
      {
        label: 'Followers',
        field: 'followers',
      },
      {
        label: 'City',
        field: 'address.city',
        thClass: 'hidden-small',
        tdClass: 'hidden-small',
      },
      {
        label: 'State',
        field: 'address.state',
      },
    ]
  }),
  created () {
    if (!this.groups || this.groups.length < 1) {
      this.$store.dispatch("getGroups")
    }
    if (!this.venues || this.venues.length < 1) {
      this.$store.dispatch("getVenues")
    }
  },
  computed: {
    ...mapState(['groups', 'currentUser', 'venues']),
    myGroups: function() {
      return this.groups.filter(group => {
        return group.owner == this.currentUser.uid
      })
    },
  },
  components: {
    Loader,
  },
  methods: {
    showFollowerGroups() {
      this.showFollower = true
      this.showAllGroups = false
      this.showMyGroups = false
    },
    showMine() {
      this.showFollower = false
      this.showAllGroups = false
      this.showMyGroups = true
    },
    showAll() {
      this.showFollower = false
      this.showAllGroups = true
      this.showMyGroups = false
    },
    onRowClick(params) {
      let url = `/groups/` + params.row.id
      console.log(url)
      router.push(url)
    },
    onRowClick2(params) {
      let url = `/followersgroups/` + params.row.id
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
}
</script>