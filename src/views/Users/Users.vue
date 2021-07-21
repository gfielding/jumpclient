<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Users</h1>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!users || users.length == 0" />
        <div class="flex pt-3" v-if="users && users.length >= 1" style="width:100%;"> 
          <vue-good-table
            :columns="columns"
            :rows="users"
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
              <span>{{formatDate(props.row.created)}}</span>
            </span>
          </template>
          </vue-good-table>
        </div>
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
  name: 'users',
  data: () => ({
    search: '',
    columns: [
      {
        label: 'First Name',
        field: 'firstName',
      },
      {
        label: 'Last Name',
        field: 'lastName',
      },
      {
        label: 'Status',
        field: 'status',
      },
      {
        label: 'City',
        field: 'address.city',
      },
      {
        label: 'State',
        field: 'address.state',
      },
      {
        label: 'Email',
        field: 'email',
      },
      {
        label: 'Phone',
        field: 'phone',
      },
      {
        label: 'Created',
        field: 'created',
      }
    ]
  }),
  computed: {
    ...mapState(['users']),
    searchText() {
      if (this.search) {
        return this.search.toLowerCase().trim()
      }
      if (!this.search || this.search == null) {
        return null
      }
    },
    filteredUsers() {
      if (!this.searchText) {return this.users}
      else {
      return this.users.filter(user => {
        return (user.firstName.toLowerCase().includes(this.searchText) || user.lastName.toLowerCase().includes(this.searchText) || user.address.city.toLowerCase().includes(this.searchText))
      })
      }
    },
  },
  components: {
    Loader,
  },
  created () {
    if (!this.users || this.users.length < 1) {
      this.$store.dispatch("getUsers")
    }
  },
  methods: {
    onRowClick(params) {
      let url = `/users/` + params.row.id
      console.log(url)
      router.push(url)
    },
    formatDate(q) {
      if(q) {
        console.log(q)
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY, h:mm:ss a')
      } else {
        return null
      }
    },
  },
  beforeDestroy () {
    this.$store.dispatch("clearUsersState")
  }
}
</script>