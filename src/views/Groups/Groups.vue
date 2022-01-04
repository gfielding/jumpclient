<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Groups</h1>
        <span>
          <button class="btn btn__outlined" @click="showAll = true" v-if="!showAll">All Groups</button>
          <button class="btn btn__outlined" @click="showAll = false" v-if="showAll">My Groups</button>
          <router-link :to="{name: 'addgroup'}" class="color--text">
            <button class="btn btn__flat ml-3"><i class="fas fa-plus fa-2x"></i></button>
          </router-link>
        </span>
        
      </div>
      <div class="dashboard__container--body pt-4">
          <Loader v-if="!groups || groups.length == 0" />
          <vue-good-table
            v-if="showAll"
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
            v-if="!showAll"
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
    showAll: true,
    columns: [
      {
        label: 'Title',
        field: 'title',
      },
      {
        label: 'Created',
        field: 'created',
      },
    ]
  }),
  created () {
    if (!this.groups || this.groups.length < 1) {
      this.$store.dispatch("getGroups")
    }
  },
  computed: {
    ...mapState(['groups', 'currentUser']),
    myGroups: function() {
      return this.groups.filter(group => {
        return group.owner == this.currentUser.uid
      })
    }
  },
  components: {
    Loader,
  },
  methods: {
    onRowClick(params) {
      let url = `/groups/` + params.row.id
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