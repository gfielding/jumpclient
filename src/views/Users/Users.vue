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
             <span v-else-if="props.column.field == 'vax'">
              <i class="fas fa-syringe" style="color:#5cb85c;" v-if="props.row.fullyVaccinated == 'yes'"></i>
              <i class="fas fa-syringe" style="color:#d9534f;" v-if="props.row.fullyVaccinated == 'no'"></i>
              <i class="fas fa-syringe" v-if="!props.row.fullyVaccinated || props.row.fullyVaccinated == null" style="opacity:0.25;"></i>
             </span>
             <span v-else-if="props.column.field == 'status'">
              <span v-if="props.row.contractorStatus != 'hired as employee'">
                <span style="display:inline;">
                  <i class="fas fa-hammer" v-if="props.row.contractorStatus == 'applied' || !props.row.contractorStatus" style="margin-right: 2.5rem; opacity:0.25;"></i>
                </span>
                <span  style="display:inline;">
                  <i class="fas fa-hammer" v-if="props.row.contractorStatus == 'payroll invitation' || props.row.contractorStatus == 'on-hold'" style="color:#f0ad4e; margin-right: 2.5rem;"></i>
                </span>
                <span  style="display:inline;">
                  <i class="fas fa-hammer" v-if="props.row.contractorStatus == 'hired contractor'" style="color:#5cb85c; margin-right: 2.5rem;"></i>
                </span>
                <span  style="display:inline;">
                  <i class="fas fa-hammer" v-if="props.row.contractorStatus == 'terminated' || props.row.contractorStatus == 'not-hired'" style="color:#d9534f; margin-right: 2.5rem;"></i>
                </span>
              </span>

              <span style="display:inline;">
                <i class="fas fa-user" v-if="props.row.employeeStatus == 'applied' || !props.row.employeeStatus" style="margin-right: 2.5rem;opacity:0.25;"></i>
              </span>
              <span style="display:inline;">
                <i class="fas fa-user" v-if="props.row.employeeStatus == 'payroll invitation' || props.row.employeeStatus == 'on-hold'" style="color:#f0ad4e; margin-right: 2.5rem;"></i>
              </span>
              <span style="display:inline;">
                <i class="fas fa-user" v-if="props.row.employeeStatus == 'hired'" style="color:#5cb85c; margin-right: 2.5rem;"></i>
              </span>
              <span  style="display:inline;">
                <i class="fas fa-user" v-if="props.row.employeeStatus == 'terminated' || props.row.employeeStatus == 'not-hired'" style="color:#d9534f; margin-right: 2.5rem;"></i>
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
        label: 'Vax',
        field: 'vax',
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
    filteredInfo(user) {
      return this.availableUsers.filter(member => {
        return member.id == user.userId
      })
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
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY')
      } else {
        return null
      }
    },
  },
  beforeDestroy () {
    this.columns = []
    delete this.columns
    this.search = ''
    delete this.search
    this.$store.dispatch("clearUsersState")
    console.log(this)
  }
}
</script>