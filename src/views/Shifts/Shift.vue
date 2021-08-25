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
        <div class="dashboard__container--body--col pt-5">
          <button class="btn btn__outlined mr-3 mb-3" @click.prevent="exportReportCont">Contractor Payroll<i class="fas fa-external-link ml-3"></i></button>
          <div class="caption mb-2" v-if="shift.exportedCont">
            Contractors Exported: {{ shift.exportedCont.toDate() | moment("MMMM Do YYYY, h:mm a") }}
          </div>
          <button class="btn btn__outlined mr-3 mb-3" @click.prevent="exportReportEmp">Employee Payroll<i class="fas fa-external-link ml-3"></i></button>
          <div class="caption mb-2" v-if="shift.exportedEmp">
            Employees Exported: {{ shift.exportedEmp.toDate() | moment("MMMM Do YYYY, h:mm a") }}
          </div>
          <button class="btn btn__outlined mr-3 mb-3" @click.prevent="exportRegister">Payroll Register<i class="fas fa-external-link ml-3"></i></button>
          <div class="caption mb-2" v-if="shift.exportedRegister">
            Register Exported: {{ shift.exportedRegister.toDate() | moment("MMMM Do YYYY, h:mm a") }}
          </div>
          <hr>
          <div>
            <label for="payrollStatus">Payroll Completed:</label>
              <input type="checkbox" v-model.trim="shift.payrollComplete" id="payrollStatus" class="ml-3" @change="updateShift()" />
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
              <span v-else-if="props.column.field == 'dayRate'">
                <input type="text" v-model.trim="props.row.dayRate" id="dayRate"" @change="onSheetEdit(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'firstName'">
                <input type="text" v-model.trim="props.row.firstName" id="firstName" readonly />
              </span>
              <span v-else-if="props.column.field == 'lastName'">
                <input type="text" v-model.trim="props.row.lastName" id="lastName" readonly />
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


              
              <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.userId" target="_blank">
                  <button class="btn btn__flat btn__small btn__outlined">open <i class="fas fa-external-link ml-2"></i></button>
                </router-link>
              </span>
               <span v-else>
                <!-- {{props.formattedRow[props.column.field]}} -->
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
        label: 'Day Rate',
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
  components: {
    Loader,
  },
  created () {
    this.$store.dispatch("getShiftFromId", this.$route.params.id);
    if (!this.users || this.users.length < 1) {
      this.$store.dispatch("getUsers")
    }
  },
  computed: {
    ...mapState(['userProfile', 'shift', 'shiftAssignments', 'users']),
  },
  methods: {
    updateShift() {
      this.$store.dispatch("updateEventShift", this.shift)
    },
    filteredInfo(user) {
      return this.users.filter(member => {
        return member.id == user.userId
      })
    },
    onSheetEdit(row) {
      this.$store.dispatch('updateTimesheet', row)
    },
    lock(item) {
      fb.usersCollection.where("id", "==", item.userId).get()
      .then(function (querySnapshot) {
        if (querySnapshot.empty) {
        }
        querySnapshot.forEach(function (doc) {
          console.log(doc.id, " => ", doc.data())
          console.log(doc.data().contractorNumber)
          console.log(doc.data().employeeNumber || null)
          fb.assignmentsCollection.doc(item.id).update({ 
            locked: true, 
            fileId: doc.data().employeeNumber || doc.data().contractorNumber || null
          })
        })
      })
    },
    unlock(item) {
      fb.assignmentsCollection.doc(item.id).update({ locked: false })
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
      fb.shiftsCollection.doc(this.shift.id).update({ exportedRegister: fb.firestore.FieldValue.serverTimestamp() })
      setTimeout(() => {
        this.$store.dispatch("getShiftFromId", this.$route.params.id)
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
        if (this.shiftAssignments[key].fileId.length < 9) {
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
      fb.shiftsCollection.doc(this.shift.id).update({ exportedCont: fb.firestore.FieldValue.serverTimestamp() })
      setTimeout(() => {
        this.$store.dispatch("getShiftFromId", this.$route.params.id)
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
        if (this.shiftAssignments[key].fileId.length > 9) {
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
      fb.shiftsCollection.doc(this.shift.id).update({ exportedEmp: fb.firestore.FieldValue.serverTimestamp() })
      setTimeout(() => {
        this.$store.dispatch("getShiftFromId", this.$route.params.id)
        this.performingRequest = false
      }, 2000)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearShiftState')
    console.log(this)
  }
}
</script>