<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header flex justify-space-between align-center">
        <h1>Users</h1>
        <div class="flex align-center"> 
          <!-- <button class="btn btn__outlined mb-3" @click="exportUsers()">Everee Export</button> -->
          <!-- <button class="btn btn__outlined mb-3" @click="exportOldUsers()">Old User Export</button> -->
          <!-- <button class="btn btn__outlined mb-3" @click="addCreated()">add created</button> -->
        </div>
      </div>

      <ais-instant-search :search-client="searchClient" index-name="a_users" >
      <ais-search-box placeholder="Search Users..." />
      <ais-state-results>
        <template slot-scope="{ state: { query } }">
          <ais-hits v-show="query.length > 0">
            <template v-slot:item="{ item }">
              <div>
                <router-link :to="`users/` + item.objectID">
                  <button class="btn btn__icon btn__flat mr-4"><i class="fad fa-external-link"></i></button>
                </router-link>
                <h4 style="display: inline;">{{ item.firstName }} {{ item.lastName }} | <span v-if="item.address && item.address">{{item.address.city}} | </span>{{item.email}} | {{item.phone}}</h4>
              </div>
            </template>
          </ais-hits>
        </template>
      </ais-state-results>
    </ais-instant-search>
    <hr>
    <div class="dashboard__container--body pt-3" v-if="states">
        <div class="dashboard__container--body--col">
          <div>
          <label for="client">Users By State (CA, FL, TX):</label>
            <v-select
              class="mt-2"
              label="states" 
              taggable
              v-model="state"
              @input="setSelectedState" 
              >
            </v-select>
            </div>
        </div>
        <div class="dashboard__container--body--col">
          <div>
          <label for="client">Users By City:</label>
            <v-select
              class="mt-2"
              label="states" 
              taggable
              v-model="city"
              @input="setSelectedCity" 
              >
            </v-select>
        </div>
        </div>
      </div>
      <Loader v-if="state && stateUsers.length == 0" />
      <div class="dashboard__container--body" v-if="stateUsers.length > 0">
        <span class="flex align-center justify-space-between" style="width:100%;">
          <h4>Users by State</h4>
          <button class="btn btn__outlined mb-3 mt-3" @click="exportState()">export by State</button>
        </span>
        <vue-good-table
          :columns="columns"
          :rows="stateUsers"
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
          >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.id" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>
              <span v-else-if="props.column.field == 'created'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
            <span v-else-if="props.column.field == 'points'">
              <span v-if="props.row.points" style="display:inline; color:#0d3fd1;" class="ml-2 mr-2">
                {{props.row.points}}
              </span>
            </span>
            <span v-else-if="props.column.field == 'rating'">
              <span v-if="props.row.rating" style="display:inline; color:#c5950d;" class="ml-2 mr-2">
                {{props.row.rating}}
              </span>
            </span>
            <span v-else-if="props.column.field == 'blacklist'">
              <span v-if="props.row.blacklist && props.row.blacklist.length >=1" style="display:inline;">
                <v-popover>
                  <i class="fas fa-exclamation-triangle ml-2 mr-2" style="color:red;"></i>
                  <template slot="popover">
                  <span v-for="z in props.row.blacklist">{{z.title}}</span>
                </template>
                </v-popover>
              </span>
            </span>
            <span v-else-if="props.column.field == 'skills'">
              <span v-if="props.row.skills && props.row.skills.length > 0" style="display:inline;">
              <v-popover>
                  <i class="fad fa-briefcase ml-2 mr-2"></i>
                  <template slot="popover">
                  <span v-for="z in props.row.skills">{{z.title}} / </span>
                </template>
                </v-popover>
              </span>
            </span>
            <span v-else-if="props.column.field == 'addtogroup'">
              <v-select :reduce="group => group.title" :options="groups" label="title" taggable multiple push-tags v-model="props.row.groups" @input="updateUser(props.row)" />
            </span>
            <span v-else-if="props.column.field == 'vax'">
              <span v-if="props.row.fullyVaccinated && props.row.fullyVaccinated == `yes`" style="display:inline;">
                <i class="fas fa-syringe ml-2 mr-2" style="color: green;"></i>
              </span>
            </span>
          </template>
        </vue-good-table>
      </div>
      <div class="dashboard__container--body" v-if="cityUsers.length > 0">
        <Loader v-if="city && cityUsers.length == 0" />
        <span class="flex align-center justify-space-between" style="width:100%;">
          <h3>Users by City</h3>
          <button class="btn btn__outlined mb-3 mt-3" @click="exportCity()">export by City</button>
        </span>
        <vue-good-table
          :columns="columns"
          :rows="cityUsers"
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
          >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.id" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>
              <span v-else-if="props.column.field == 'created'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
            <span v-else-if="props.column.field == 'points'">
              <span v-if="props.row.points" style="display:inline; color:#0d3fd1;" class="ml-2 mr-2">
                {{props.row.points}}
              </span>
            </span>
            <span v-else-if="props.column.field == 'rating'">
              <span v-if="props.row.rating" style="display:inline; color:#c5950d;" class="ml-2 mr-2">
                {{props.row.rating}}
              </span>
            </span>
            <span v-else-if="props.column.field == 'blacklist'">
              <span v-if="props.row.blacklist && props.row.blacklist.length >=1" style="display:inline;">
                <v-popover>
                  <i class="fas fa-exclamation-triangle ml-2 mr-2" style="color:red;"></i>
                  <template slot="popover">
                  <span v-for="z in props.row.blacklist">{{z.title}}</span>
                </template>
                </v-popover>
              </span>
            </span>
            <span v-else-if="props.column.field == 'skills'">
              <span v-if="props.row.skills && props.row.skills.length > 0" style="display:inline;">
              <v-popover>
                  <i class="fad fa-briefcase ml-2 mr-2"></i>
                  <template slot="popover">
                  <span v-for="z in props.row.skills">{{z.title}} / </span>
                </template>
                </v-popover>
              </span>
            </span>
            <span v-else-if="props.column.field == 'addtogroup'">
              <v-select :options="groups" label="title" taggable multiple v-model="props.row.groups" @input="updateUser(props.row)" />
            </span>
            <span v-else-if="props.column.field == 'vax'">
              <span v-if="props.row.fullyVaccinated && props.row.fullyVaccinated == `yes`" style="display:inline;">
                <i class="fas fa-syringe ml-2 mr-2" style="color: green;"></i>
              </span>
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
import algoliasearch from 'algoliasearch/lite';
import 'instantsearch.css/themes/satellite-min.css'

export default {
  name: 'users',
  data() {
    return {
      searchClient: algoliasearch(
        '0T1SIY6Y1V',
        'f03dc899fbdd294d6797791724cdb402'
      ),
      states:['CA', 'CO', 'FL'],
      state: '',
      city: '',
      columns: [
        {
          label: 'Link',
          field: 'link',
        },
        {
          label: 'Created',
          field: 'created',
        },

        {
          label: 'First',
          field: 'firstName',
        },
        {
          label: 'Last',
          field: 'lastName',
        },
        {
          label: 'Phone',
          field: 'phone',
        },
        {
          label: 'Email',
          field: 'email',
        },
        // {
        //   label: 'Groups',
        //   field: 'addtogroup',
        //   width: '200px'
        // },
        {
          label: 'Points',
          field: 'points',
        },
        // {
        //   label: 'Rating',
        //   field: 'rating',
        // },
        {
          label: 'Skills',
          field: 'skills',
        },
        {
          label: 'Blacklist',
          field: 'blacklist',
        },
        {
          label: 'Vaxed',
          field: 'vax',
        },
        {
          label: 'city',
          field: 'address.city',
        },
        {
          label: 'state',
          field: 'address.state',
        },
      ]
    };
  },
  computed: {
    ...mapState(['currentUser', 'userProfile', 'stateUsers', 'cityUsers', 'groups']),
  },
  components: {
    Loader,
  },
  created () {
    if (!this.groups || this.groups.length < 1) {
      this.$store.dispatch("getGroups")
    }
    // if (!this.users || this.users.length < 1) {
    //   this.$store.dispatch("getUsers")
    // }
    // this.$store.dispatch("getOldUsersByState")
  },
  methods: {
    updateUser(row) {
      let user = row
      let userGroups = (row.groups || null)
      // let lastGroup = userGroups.slice(-1)
      // console.log(lastGroup)
      this.$store.dispatch('updateGroups', {
        groups: userGroups,
        user: user
      })
      // this.$store.dispatch("addUserToGroup", {
      //   user: user.id,
      //   group: lastGroup
      // })
    },
    setSelectedState(value) {
      console.log(value)
      console.log(value)
      this.$store.dispatch("getUsersByState", value)
    },
    setSelectedCity(value) {
      console.log(value)
      console.log(value)
      this.$store.dispatch("getUsersByCity", value)
    },
    exportCity() {
      // let logFields = {
      //     user: this.currentUser.email,
      //     export: 'City (Users) Export',
      //      city: this.value
      // }
      // this.$store.dispatch('sendExportLog', logFields)
      const exportHeaders = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Points",
        "City",
        "State"
      ]
      const exportItems = [];
      for (var key in this.cityUsers) {
        exportItems.push([
          this.cityUsers[key].firstName,
          this.cityUsers[key].lastName,
          this.cityUsers[key].email,
          this.cityUsers[key].phone,
          this.cityUsers[key].points,
          this.cityUsers[key].address.city,
          this.cityUsers[key].address.state,
        ])
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    exportState() {
      // let logFields = {
      //     user: this.currentUser.email,
      //     export: 'State (Users) Export',
      //     state: this.value
      // }
      // this.$store.dispatch('sendExportLog', logFields)
      
      const exportHeaders = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Points",
        "City",
        "State"
      ]
      const exportItems = [];
      for (var key in this.stateUsers) {
        exportItems.push([
          this.stateUsers[key].firstName,
          this.stateUsers[key].lastName,
          this.stateUsers[key].email,
          this.stateUsers[key].phone,
          this.stateUsers[key].points,
          this.stateUsers[key].address.city,
          this.stateUsers[key].address.state,
        ])
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    exportOldUsers() {
      const exportHeaders = [
        "First Name",
        "Last Name",
        "State",
        "City"
        ]
      const exportItems = [];
      for (var key in this.oldUsersByState) {

        let state = (this.findState(this.oldUsersByState[key]))
        let city = (this.findCity(this.oldUsersByState[key]))

        exportItems.push([
          this.oldUsersByState[key].firstName,
          this.oldUsersByState[key].lastName,
          state,
          city
          
        ])
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    exportUsers() {
      const exportHeaders = [
        "Created",
        "First Name",
        "Middle Name",
        "Last Name",
        "Phone",
        "Email",
        "Start Date",
        "End Date",
        "Approval Group",
        "Legal work location",
        "External worker id",
        "Payee type",
        "Business legal name",
      ]
      const exportItems = [];
      for (var key in this.users) {

        let created = (this.formatDate(this.users[key].created) || null)

        exportItems.push([
          created,
          this.users[key].firstName,
          '',
          this.users[key].lastName,
          this.users[key].phone,
          this.users[key].email,
          'YYYY-MM-DD',
          '',
          '',
          '',
          this.users[key].id,
          "INDIVIDUAL",
          '',
        ])
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    findState(user) {
      if (user && user.address && user.address.state) {
        return user.address.state
      } else {
        return null
      }
    },
    findCity(user) {
      if (user && user.address && user.address.city) {
        return user.address.city
      } else {
        return null
      }
    },
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
    addCreated(){
      this.$store.dispatch("addCreated")
    }
  },
  beforeDestroy () {
    this.search = ''
    delete this.search
    this.$store.dispatch("clearUsersByState")
    this.$store.dispatch("clearUsersByCity")
    // this.$store.dispatch("clearUsersState")
    this.$store.dispatch("clearOldUsersByState")
  }
}
</script>