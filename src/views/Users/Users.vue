<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header flex justify-space-between align-center">
        <h1>Users</h1>
        <div class="flex align-center"> 
          <button class="btn btn__outlined mb-3" @click="exportAll()">export all</button>
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
                <h4 style="display: inline;">{{ item.firstName }} {{ item.lastName }} | <span v-if="item.address && item.address">{{item.address.city}} | </span>{{item.email}} | {{item.phone}}</h4 style="display: inline;">
              </div>
            </template>
          </ais-hits>
        </template>
      </ais-state-results>
    </ais-instant-search>


 <!--  <ais-instant-search>
      <ais-index
      app-id="0T1SIY6Y1V"
      api-key="f03dc899fbdd294d6797791724cdb402"
      index-name="a_users"
    >
      <ais-search-box></ais-search-box>
      <ais-results>
        <template slot-scope="{ result }">
          <p>
            <ais-highlight :result="result" attribute-name="name"></ais-highlight>
          </p>
        </template>
      </ais-results>
    </ais-index>
  </ais-instant-search> -->
      <!-- <div class="dashboard__container--body">
        <Loader v-if="!users || users.length == 0" />
        <div class="flex pt-3" v-if="users && users.length >= 1" style="width:100%;"> 
          <vue-good-table
            :columns="columns"
            :rows="users"
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 20,
            }"
          >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'created'">
              <span>{{formatDate(props.row.created)}}</span>
            </span>
            <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.id" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
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

      

    
             </span>


             <span v-else-if="props.column.field == 'empstatus'">
                <v-select
                  label="status" 
                  :options="empStatuses"
                  v-model="props.row.employeeStatus"
                  @input="onSheetEdit(props.row)"
                  :clearable=false
                  >
                </v-select>
              </span>


             <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
          </template>
          </vue-good-table>
        </div>
      </div> -->
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
    };
  },
  computed: {
    ...mapState(['userProfile']),
  },
  components: {
    Loader,
  },
  created () {
    // if (!this.users || this.users.length < 1) {
    //   this.$store.dispatch("getUsers")
    // }
  },
  methods: {
    onSheetEdit(row) {
      if (row.employeeStatus == `hired` || row.employeeStatus == 'signed offer letter') {
        row.employeeNumber = row.id.slice(0,10)
      }
      this.$store.dispatch('updateUser', row)
    },
    exportAll() {
      const exportHeaders = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "State"
      ]
      const exportItems = [];
      for (var key in this.users) {
        exportItems.push([
          this.users[key].firstName,
          this.users[key].lastName,
          this.users[key].email,
          this.users[key].phone,
          this.availableUsers[key].address.state || "",
        ])
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
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