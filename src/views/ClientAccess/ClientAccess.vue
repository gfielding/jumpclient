<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header flex justify-space-between align-center mb-3">
      <h1>Manage Client Portal Access</h1>
      <router-link :to="{name: 'giveClientAccess'}" class="color--text">
        <button class="btn btn__flat ml-3"><i class="fas fa-plus fa-2x"></i></button>
      </router-link>
    </div> 
    <Loader v-if="!clientAccess || clientAccess.length == 0" />
    <div class="dashboard__container--body" v-if="clientAccess.length > 0">
        <vue-good-table
          :columns="columns"
          :rows="clientAccess"
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
            <span v-if="props.column.field == 'link'">
              <router-link :to="`/clientaccess/` + props.row.id">
                <i class="fas fa-external-link ml-3 mr-3"></i>
              </router-link>
            </span>
            <span v-else-if="props.column.field == 'name'">
              {{props.row.firstName}} {{props.row.lastName}}
            </span>
            <span v-else-if="props.column.field == 'comp'">
              <span v-for="(item, index) in props.row.company">{{item.title}}  </span>
            </span>
            <span v-else-if="props.column.field == 'ven'">
              <span v-for="(item, index) in props.row.venue">{{item.title}}  </span>
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
import ExportService from "@/services/ExportService"
import router from '@/router'

export default {
  name: 'clientAccess',
  data() {
    return {
      columns: [
        {
          label: 'Link',
          field: 'link',
        },
        {
          label: 'Name',
          field: 'name',
        },
        {
          label: 'Title',
          field: 'title',
        },
        {
          label: 'Company',
          field: 'comp',
        },
        {
          label: 'Venues',
          field: 'ven',
        },
        {
          label: 'Phone',
          field: 'phone',
          sortable: false
        },
        {
          label: 'Email',
          field: 'email',
          sortable: false
        },
        // {
        //   label: 'Rating',
        //   field: 'rating',
        // },
        // {
        //   label: 'Skills',
        //   field: 'skills',
        // },
        // {
        //   label: 'Blacklist',
        //   field: 'blacklist',
        // },
        // {
        //   label: 'Vaxed',
        //   field: 'vax',
        // },
        // {
        //   label: 'city',
        //   field: 'address.city',
        // },
        // {
        //   label: 'state',
        //   field: 'address.state',
        // },
      ]
    };
  },
  created () {
    if (!this.clientAccess || this.clientAccess.length < 1) {
      this.$store.dispatch("getClientAccess")
    }
  },
  computed: {
    ...mapState(['userProfile', 'currentUser', 'clientAccess']),
  },
  components: {
    Loader,
  },
  
  // methods: {
  //   updateUser(row) {
  //     let user = row
  //     let userGroups = (row.groups || null)
  //     console.log(userGroups)
  //     this.$store.dispatch('updateGroups', {
  //       groups: userGroups,
  //       user: user
  //     })
  //   },
  //   setSelectedState(value) {
  //     console.log(value)
  //     console.log(value)
  //     this.$store.dispatch("getUsersByState", value)
  //   },
  //   setSelectedCity(value) {
  //     console.log(value)
  //     console.log(value)
  //     this.$store.dispatch("getUsersByCity", value)
  //   },
  //   exportCity() {
  //     const exportHeaders = [
  //       "First Name",
  //       "Last Name",
  //       "Email",
  //       "Phone",
  //       "Points",
  //       "City",
  //       "State"
  //     ]
  //     const exportItems = [];
  //     for (var key in this.cityUsers) {
  //       exportItems.push([
  //         this.cityUsers[key].firstName,
  //         this.cityUsers[key].lastName,
  //         this.cityUsers[key].email,
  //         this.cityUsers[key].phone,
  //         this.cityUsers[key].points,
  //         this.cityUsers[key].address.city,
  //         this.cityUsers[key].address.state,
  //       ])
  //     }
  //     this.$gapi.getGapiClient().then(gapi => {
  //       const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
  //       exportService.export();
  //     });
  //   },
  //   exportState() {
  //     const exportHeaders = [
  //       "First Name",
  //       "Last Name",
  //       "Email",
  //       "Phone",
  //       "Points",
  //       "City",
  //       "State"
  //     ]
  //     const exportItems = [];
  //     for (var key in this.stateUsers) {
  //       exportItems.push([
  //         this.stateUsers[key].firstName,
  //         this.stateUsers[key].lastName,
  //         this.stateUsers[key].email,
  //         this.stateUsers[key].phone,
  //         this.stateUsers[key].points,
  //         this.stateUsers[key].address.city,
  //         this.stateUsers[key].address.state,
  //       ])
  //     }
  //     this.$gapi.getGapiClient().then(gapi => {
  //       const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
  //       exportService.export();
  //     });
  //   },
  //   onRowClick(params) {
  //     let url = `/users/` + params.row.id
  //     console.log(url)
  //     router.push(url)
  //   },
  //   formatDate(q) {
  //     if(q) {
  //       const postedDate = new Date(q.seconds) * 1000;
  //       return moment(postedDate).format('MMMM Do YYYY')
  //     } else {
  //       return null
  //     }
  //   },
  // },
  beforeDestroy () {
    this.$store.dispatch("clearClientAccess")
  }
}
</script>