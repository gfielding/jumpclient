<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <div class="flex align-center">
          <h1>Timesheets</h1>
        </div>
        <div class="flex align-center">
          <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
        </div>
      </div>
      <div class="dashboard__container--body mb-3" v-if="day && eventInfo && eventInfo.venue">
      	
      </div>
      <div class="dashboard__container--body">
        <div class="dashboard__container--body--col">
        	<div v-if="day && eventInfo && eventInfo.venue">
        	 <h2>{{eventInfo.title}}</h2>
        	{{day | moment("dddd, MMMM Do YYYY") }} | {{eventInfo.venue.title}}
        	</div>
        </div>
        <div class="dashboard__container--body--col">
          <button class="btn btn__outlined mr-3 mb-3" @click.prevent="exportReportCont">Contractor Payroll<i class="fas fa-external-link ml-3"></i></button>
          <div class="caption mb-2" v-if="eventInfo.exportedCont">
            Contractors Exported: {{ eventInfo.exportedCont.toDate() | moment("MMMM Do YYYY, h:mm a") }}
          </div>
          <button class="btn btn__outlined mr-3 mb-3" @click.prevent="exportReportEmp">Employee Payroll<i class="fas fa-external-link ml-3"></i></button>
          <div class="caption mb-2" v-if="eventInfo.exportedEmp">
            Employees Exported: {{ eventInfo.exportedEmp.toDate() | moment("MMMM Do YYYY, h:mm a") }}
          </div>
          <button class="btn btn__outlined mr-3 mb-3" @click.prevent="exportRegister">Payroll Register<i class="fas fa-external-link ml-3"></i></button>
          <div class="caption mb-2" v-if="eventInfo.exportedRegister">
            Register Exported: {{ eventInfo.exportedRegister.toDate() | moment("MMMM Do YYYY, h:mm a") }}
          </div>
          <!-- <hr>
          <div>
            <label for="payrollStatus">Payroll Completed:</label>
              <input type="checkbox" v-model.trim="eventInfo.payrollComplete" id="payrollStatus" class="ml-3" @change="updateShift()" />
          </div> -->
        </div>
      </div>
      
      <div class="dashboard__container--body">
        <Loader v-if="!dayShifts || dayShifts.length == 0" />
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
              <span v-else-if="props.column.field == 'dayRate'">
                <input type="text" v-model.trim="props.row.dayRate" id="dayRate" @change="onSheetEdit(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'firstName'">
                <input type="text" v-model.trim="props.row.firstName" id="firstName" readonly />
              </span>
              <span v-else-if="props.column.field == 'lastName'">
                <input type="text" v-model.trim="props.row.lastName" id="lastName" readonly />
              </span>
              <span v-else-if="props.column.field == 'note'">
                <button v-show="!props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="opacity:0.5;"></i></button>
                <button v-show="props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="color:blue"></i></button>
                <transition name="modal">
                  <div v-if="activeItem == props.row">
                    <TimesheetNote :item="props.row" @close="closeNote(props.row)" />
                  </div>
                </transition>
              </span>
              <!-- <span v-else-if="props.column.field == 'fileId'">
                <input type="text" v-model.trim="props.row.fileId" id="fileId" @change="onSheetEdit(props.row)" :readonly="props.row.locked" />
              </span> -->
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
                  :clearable=false
                  >
                </v-select>
              </span>
              <span v-else-if="props.column.field == 'paystatus'">
                <v-select
                  label="status" 
                  :options="paystatuses"
                  v-model="props.row.paystatus"
                  @input="onSheetEdit(props.row)"
                  :disabled="props.row.locked"
                  :clearable=true
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
              <span v-if="props.column.field == 'fileId'">
                <input type="text" v-model.trim="props.row.fileId" id="fileId" @change="onSheetEdit(props.row)" :readonly="props.row.locked" />
              </span>


              <span v-if="props.column.field == 'onpay'">
                <button class="btn btn__icon" @click="opr(props.row)" v-if="!props.row.opr">
                  <i class="fad fa-money-bill-wave ml-3 mr-3"></i>
                </button>
                <button class="btn btn__icon" @click="removeopr(props.row)" v-if="props.row.opr">
                  <i class="fad fa-money-bill-wave ml-3 mr-3" style="color:#f0ad4e;"></i>
                </button>
              </span>

              <span v-else-if="props.column.field == 'delete'">
                <button :disabled="props.row.locked" class="btn btn__icon" v-tooltip="'remove'" @click="removeEntry(props.row)">
                  <i class="fas fa-times ml-3 mr-2"></i>
                </button>
              </span>


              
              <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.userId" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>
               <span v-else>
                <!-- {{props.formattedRow[props.column.field]}} -->
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>

      <div class="dashboard__container--body">
        <div class="dashboard__container--body--col">
          <NotesTable :notes="eventTimesheetNotes" />
        </div>
        <div class="dashboard__container--body--col">
          <EventTimesheetNote :event="eventInfo" :me="userProfile" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped type="text/css">
.dashboard__container {
  width: calc(100% - 4rem);
}
.max {
  width:calc(100% - 3.2rem);
}
table.vgt-table td {
  padding: 0 !important;
}
</style>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import * as moment from 'moment'
import router from '@/router'
import ExportService from "@/services/ExportService"
import TimesheetNote from '@/components/Timesheets/TimesheetNote.vue'
const fb = require('../../firebaseConfig.js')
import EventTimesheetNote from '@/components/Timesheets/EventTimesheetNote.vue'
import NotesTable from '@/components/Timesheets/NotesTable.vue'

export default {
  name: 'daytimesheets',
  data: () => ({
    activeItem: null,
    statuses: ['completed', 'arrived late', 'left early', 'no-show', 'client fired', 'terminated' ],
    paystatuses: ['paid', 'paid tips', 'paid hours', 'not paid' ],
    columns: [
      {
        field: 'locked',
        type: 'boolean',
        tdClass: 'text-center',
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
        field: 'note',
        sortable: false,
      },
      {
        field: 'onpay',
        sortable: false,
      },
      {
        label: 'Pay Status',
        field: 'paystatus',
        width: '150px',
        sortable: false,
      },
      {
        label: 'Event Status',
        field: 'status',
        width: '120px',
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
        label: 'ID',
        field: 'fileId',
        sortable: false,
      },
      {
        label: 'Bonus',
        field: 'dayRate',
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
	computed: {
    ...mapState(['dayShifts', 'eventInfo', 'shiftAssignments', 'userProfile', 'eventTimesheetNotes']),
    day() {
    	return this.$route.params.day
    }
  },
  components: {
    Loader,
    TimesheetNote,
    EventTimesheetNote,
    NotesTable
  },
	methods: {
		showNote(r) {
      console.log(r)
      this.activeItem = r
    },
    closeNote(r) {
      this.activeItem = null
    },
    onSheetEdit(row) {
      row = row
      this.$store.dispatch('updateTimesheet', row)
    },
    opr(item) {
      fb.assignmentsCollection.doc(item.id).update({ opr: true })
      fb.oprCollection.add(item)
      .then(
        doc => {
          fb.oprCollection.doc(doc.id).update({
            id: doc.id, 
            created: fb.firestore.FieldValue.serverTimestamp(),
            assignment: item.id
          })
        }
      )
    },
    removeopr(item) {
      fb.assignmentsCollection.doc(item.id).update({ opr: false })
      this.$store.dispatch("removeOpr", item)
    },
    goBack() {
      router.go(-1)
    },
    exportRegister() {
      this.performingRequest = true
      const exportHeaders = [
        "First Name",
        "Last Name",
        "Hourly Rate",
        "Reg Hours",
        "Overtime",
        "2x Overtime",
        "Break Penalty",
        "CC Tips"
      ];
      const exportItems = [];
      for (var key in this.shiftAssignments) {
        exportItems.push([
          this.shiftAssignments[key].firstName,
          this.shiftAssignments[key].lastName,
          this.shiftAssignments[key].regRate,
          this.shiftAssignments[key].regHours,
          this.shiftAssignments[key].otHours,
          this.shiftAssignments[key].ot2Hours,
          this.shiftAssignments[key].mbp,
          this.shiftAssignments[key].tips
        ]);
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
      fb.eventsCollection.doc(this.eventInfo.id).update({ exportedRegister: fb.firestore.FieldValue.serverTimestamp() })
      setTimeout(() => {
        this.$store.dispatch("getEventFromId", this.$route.params.id)
        this.performingRequest = false
      }, 2000)
    },
    exportReportCont() {
      this.performingRequest = true
      const exportHeaders = [
        "type",
        "id",
        "clock_user",
        "hours",
        "rate",
        "treat_as_cash",
      ];
      const exportItems = [];
      for (var key in this.shiftAssignments) {
        if (this.shiftAssignments[key].fileId && this.shiftAssignments[key].fileId.length < 9) {
          exportItems.push([
            "1",
            "307",
            this.shiftAssignments[key].fileId,
            "1",
            this.shiftAssignments[key].dayRate,
            "1"
          ]);
          exportItems.push([
            "1",
            "301",
            this.shiftAssignments[key].fileId,
            this.shiftAssignments[key].regHours,
            this.shiftAssignments[key].regRate,
            "0"
          ]);
          exportItems.push([
            "1",
            "310",
            this.shiftAssignments[key].fileId,
            this.shiftAssignments[key].otHours,
            this.shiftAssignments[key].regRate * 1.5,
            "0"
          ]);
          exportItems.push([
            "1",
            "300",
            this.shiftAssignments[key].fileId,
            this.shiftAssignments[key].ot2Hours,
            this.shiftAssignments[key].regRate * 2,
            "0"
          ]);
          exportItems.push([
            "1",
            "308",
            this.shiftAssignments[key].fileId,
            "1",
            this.shiftAssignments[key].tips,
            "1"
          ]);
          exportItems.push([
            "1",
            "309",
            this.shiftAssignments[key].fileId,
            "1",
            this.shiftAssignments[key].mbp,
            "0"
          ]);
        } else {
          console.log("no contractors")
        }
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
      fb.eventsCollection.doc(this.eventInfo.id).update({ exportedCont: fb.firestore.FieldValue.serverTimestamp() })
      setTimeout(() => {
        this.$store.dispatch("getEventFromId", this.$route.params.id)
        this.performingRequest = false
      }, 2000)
    },
    exportReportEmp() {
      this.performingRequest = true
      const exportHeaders = [
        "type",
        "id",
        "emp_num",
        "hours",
        "rate",
        "treat_as_cash",
      ];
      const exportItems = [];
      for (var key in this.shiftAssignments) {
        if (this.shiftAssignments[key].fileId && this.shiftAssignments[key].fileId.length > 9) {
          exportItems.push([
            "1",
            "307",
            this.shiftAssignments[key].fileId,
            "1",
            this.shiftAssignments[key].dayRate,
            "1"
          ]);
          exportItems.push([
            "1",
            "301",
            this.shiftAssignments[key].fileId,
            this.shiftAssignments[key].regHours,
            this.shiftAssignments[key].regRate,
            "0"
          ]);
          exportItems.push([
            "1",
            "310",
            this.shiftAssignments[key].fileId,
            this.shiftAssignments[key].otHours,
            this.shiftAssignments[key].regRate * 1.5,
            "0"
          ]);
          exportItems.push([
            "1",
            "300",
            this.shiftAssignments[key].fileId,
            this.shiftAssignments[key].ot2Hours,
            this.shiftAssignments[key].regRate * 2,
            "0"
          ]);
          exportItems.push([
            "1",
            "308",
            this.shiftAssignments[key].fileId,
            "1",
            this.shiftAssignments[key].tips,
            "1"
          ]);
          exportItems.push([
            "1",
            "309",
            this.shiftAssignments[key].fileId,
            "1",
            this.shiftAssignments[key].mbp,
            "0"
          ]);
        } else {
          console.log("no employees")
        }
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
      fb.eventsCollection.doc(this.eventInfo.id).update({ exportedEmp: fb.firestore.FieldValue.serverTimestamp() })
      setTimeout(() => {
        this.$store.dispatch("getEventFromId", this.$route.params.id)
        this.performingRequest = false
      }, 2000)
    },
  },
	created () {
		this.$store.dispatch("getEventFromId", this.$route.params.id);
    this.$store.dispatch("getDayShifts", 
    	{ 
    		event: this.$route.params.id,
    		day: this.$route.params.day,
    	}
    )
  },
  beforeDestroy () {
    this.$store.dispatch("clearEventState")
    this.$store.dispatch("clearDayShifts")
    this.$store.dispatch('clearErrors')
  }
}
	
</script>