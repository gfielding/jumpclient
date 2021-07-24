<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <div class="flex align-center">
          <h1>Timesheet</h1>
        </div>
        <div class="flex align-center">
          <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
        </div>
      </div>
      <Loader v-if="!shift" />
      <div class="dashboard__container--body" v-if="shift">
        <div class="dashboard__container--body--col">
          <h2>{{shift.event}}</h2>
          <h3 v-if="shift.position">{{shift.position.title}}</h3>
          <h5>{{shift.day | moment("dddd, MMM Do YYYY") }}</h5>
          <span>{{ [ shift.startTime, "HH:mm" ] | moment("hh:mm A") }}</span> - <span>{{ [ shift.endTime, "HH:mm" ] | moment("hh:mm A") }}</span>
          <div>Staff Requested: {{shift.staff}}</div>
        </div>
        <div class="dashboard__container--body--col">
          <button class="btn btn__outlined" @click.prevent="exportReport">Export Payroll<i class="fas fa-external-link ml-3"></i></button>
          <div class="caption mt-3" v-if="shift.exported">
            Last Exported: {{ shift.exported.toDate() | moment("MMMM Do YYYY, h:mm a") }}
          </div>
        </div>
      </div>
      <div class="dashboard__container--body" v-if="shift">
        <div class="dashboard__container--body--col max">
          <vue-good-table
            :columns="columns"
            :rows="shiftAssignments"
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
              <span v-if="props.column.field == 'regRate'">
                <input type="number" v-model.trim="props.row.regRate" id="regRate" @change="onSheetEdit(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'fileId'">
                <input type="text" v-model.trim="props.row.fileId" id="fileId" @change="onSheetEdit(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'regHours'">
                <input type="number" v-model.trim="props.row.regHours" id="regHours" @change="onSheetEdit(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'otHours'">
                <input type="number" v-model.trim="props.row.otHours" id="otHours" @change="onSheetEdit(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'ot2Hours'">
                <input type="number" v-model.trim="props.row.ot2Hours" id="ot2Hours" @change="onSheetEdit(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'mbp'">
                <input type="number" v-model.trim="props.row.mbp" id="mbp" @change="onSheetEdit(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'tips'">
                <input type="number" v-model.trim="props.row.tips" id="tips" @change="onSheetEdit(props.row)" :readonly="props.row.locked"  />
              </span>
              <span v-else-if="props.column.field == 'state'">
                <input type="text" v-model.trim="props.row.state" placeholder="CA" id="state" @change="onSheetEdit(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'status'">
                <v-select
                  label="status" 
                  :options="statuses"
                  v-model="props.row.status"
                  @input="onSheetEdit(props.row)"
                  :disabled="props.row.locked"
                  >
                </v-select>
              </span>
              <span v-else-if="props.column.field == 'locked'">
                <button class="btn btn__icon" @click="lock(props.row)" v-if="!props.row.locked">
                  <i class="fas fa-lock-open-alt"></i>
                </button>
                <button class="btn btn__icon" @click="unlock(props.row)" v-if="props.row.locked">
                  <i class="fas fa-lock-alt" style="color:#5cb85c;"></i>
                </button>
              </span>


              
              <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.id" target="_blank">
                  <button class="btn btn__flat btn__small btn__outlined">open <i class="fas fa-external-link ml-2"></i></button>
                </router-link>
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

<style scoped type="text/css">
.max {
  width:calc(100% - 3.2rem);
}
</style>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
import ExportService from "@/services/ExportService"
const fb = require('../../firebaseConfig.js')

export default {
  name: 'shift',
  data: () => ({
    activeItem: null,
    statuses: ['completed', 'arrived late', 'left early', 'no-show', 'client fired', 'terminated' ],
    columns: [
      {
        label: 'Lock',
        field: 'locked',
        type: 'boolean',
        tdClass: 'text-center',
      },
      {
        field: 'link',
        sortable: false,
      },
      {
        label: 'Status',
        field: 'status',
        width: '150px',
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
        label: 'ID',
        field: 'fileId',
        sortable: false,
      },
      {
        label: 'State',
        field: 'state',
      },
      {
        label: 'Reg Rate',
        field: 'regRate',
      },
      {
        label: 'Reg Hours',
        field: 'regHours',
      },
      {
        label: 'OT Hours',
        field: 'otHours',
      },
      {
        label: '2OT Hours',
        field: 'ot2Hours',
      },
      {
        label: 'Meal Break Penalty',
        field: 'mbp',
      },
      {
        label: 'Tips',
        field: 'tips',
      },
    ]
  }),
  components: {
    Loader,
  },
  created () {
    this.$store.dispatch("getShiftFromId", this.$route.params.id);
  },
  computed: {
    ...mapState(['userProfile', 'shift', 'shiftAssignments']),
  },
  methods: {
    onSheetEdit(row) {
      this.$store.dispatch('updateTimesheet', row)
    },
    lock(item) {
      fb.assignmentsCollection.doc(item.id).update({ locked: true })
    },
    unlock(item) {
      fb.assignmentsCollection.doc(item.id).update({ locked: false })
    },
    goBack() {
      router.go(-1)
    },
    exportReport() {
      this.performingRequest = true
      const exportHeaders = [
        "Co Code",
        "Batch ID",
        "File #",
        "State",
        "Tax Frequency",
        "Temp Dept",
        "Temp Rate",
        "Reg Hours",
        "O/T Hours",
        "2 O/T Hours",
        "Meal Break Penalty",
        "Tips"
      ];
      console.log(exportHeaders)
      const exportItems = [];
      for (var key in this.shiftAssignments) {
        exportItems.push([
          "VJL",
          this.shiftAssignments[key].id,
          this.shiftAssignments[key].fileId,
          this.shiftAssignments[key].state,
          "", 
          "",
          this.shiftAssignments[key].regRate,
          this.shiftAssignments[key].regHours,
          this.shiftAssignments[key].otHours,
          this.shiftAssignments[key].ot2Hours,
          this.shiftAssignments[key].mbp,
          this.shiftAssignments[key].tips,
        ]);
      }
      console.log(exportItems)
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
      fb.shiftsCollection.doc(this.shift.id).update({ exported: fb.firestore.FieldValue.serverTimestamp() })
      setTimeout(() => {
        this.$store.dispatch("getShiftFromId", this.$route.params.id)
        this.performingRequest = false
      }, 2000)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearShiftState')
  }
}
</script>