<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>OnPay Requests</h1>
        <button class="btn btn__outlined mr-3" @click="exportAll()">export all</button>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!opr || opr.length == 0" />
        
        <div class="flex pt-3" v-if="opr && opr.length >= 1" style="width:100%;"> 
          <vue-good-table
            :columns="columns"
            :rows="opr"
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
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
              <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.userId" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>
              <span v-else-if="props.column.field == 'checked'">
                <input type="checkbox" v-model.trim="props.row.eos" id="check" class="ml-3" @change="markAdded(props.row)" />
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
              <span v-else-if="props.column.field == 'extras'">
                <span v-if="(props.row)">
                  <span v-for="u in filteredInfo(props.row)">
                    {{u.firstName}}
                  </span>
                </span>
              </span>

              <span v-else-if="props.column.field == 'delete'">
                <button class="btn btn__icon" v-tooltip="'delete'" @click="removeEntry(props.row)">
                  <i class="fas fa-times ml-3 mr-2"></i>
                </button>
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
import ExportService from "@/services/ExportService"
import Loader from '@/components/Loader.vue'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'oprs',
  data: () => ({
    search: '',
    empStatuses: ['applied', 'payroll invitation', 'signed offer letter', 'hired', 'not-hired', 'on-hold', 'terminated'],
    columns: [
      {
        label: 'EOS',
        field: 'checked',
        sortable: false,
      },
      {
        field: 'delete',
        sortable: false,
      },
      {
        field: 'link',
        sortable: false,
      },
      {
        label: 'Created',
        field: 'created',
        sortable: false,
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
        label: 'Email',
        field: 'email',
      },
      {
        label: 'Phone',
        field: 'phone',
      },
      {
        label: 'Emp Status',
        field: 'empstatus',
        width: '150px',
      },
      {
        label: 'Pay ID',
        field: 'employeeNumber',
      },
      // {
      //   label: 'Extras',
      //   field: 'extras',
      // },
      // {
      //   label: 'State',
      //   field: 'address.state',
      // },
      {
        label: 'State Wored',
        field: 'eventInfo.venue.address.state',
      },
    ]
  }),
  computed: {
    ...mapState(['opr']),
  },
  components: {
    Loader,
  },
  created () {
    if (!this.opr || this.opr.length < 1) {
      this.$store.dispatch("getOprs")
    }
  },
  methods: {
    filteredInfo(p) {
      fb.usersCollection.doc(p.id).get()
      .then(
        doc => {
          return doc.data()
        }
      )
      // return this.users.filter(member => {
      //   return member.id == user.userId
      // })
    },
    onSheetEdit(row) {
      if (row.employeeStatus == `hired` || row.employeeStatus == 'signed offer letter') {
        row.employeeNumber = row.id.slice(0,10)
      }
      this.$store.dispatch('updateUser2', row)
      setTimeout(() => {
        this.$store.dispatch("removeOpr2", row)
        // this.$store.dispatch("removeOprAssignment", row)
      }, 1000)
    },
    exportAll() {
      const exportHeaders = [
        "Added",
        "Last Name",
        "First Name",
        "Email",
        "Phone",
        "State Wored",
      ]
      const exportItems = [];
      for (var key in this.opr) {
        exportItems.push([
          this.opr[key].created,
          this.opr[key].checked,
          this.opr[key].firstName,
          this.opr[key].lastName,
          this.opr[key].email,
          this.opr[key].phone,
          this.opr[key].eventInfo.venue.address.state,
          // this.opr[key].address.state,
        ])
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    markAdded(p) {
      p.eos = p.eos
      this.$store.dispatch("updateOpr", p)
    },
    removeEntry(r) {
      fb.oprCollection.doc(r.id).delete()
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MM Do YYYY, hh:mm a')
      } else {
        return null
      }
    },
  },
  beforeDestroy () {
    this.$store.dispatch("clearOprState")
    console.log(this)
  }
}
</script>