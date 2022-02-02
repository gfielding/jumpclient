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
          <button class="btn btn__outlined mr-3 mb-3" @click.prevent="exportReportEmp">Export Payroll<i class="fas fa-external-link ml-3"></i></button>
          <div class="caption mb-2" v-if="shift.exportedEmp">
            Last Exported: {{ shift.exportedEmp.toDate() | moment("MMMM Do YYYY, h:mm a") }}
          </div>
          <!-- <button class="btn btn__outlined mr-3 mb-3" @click.prevent="exportReportEmp">Employee Payroll<i class="fas fa-external-link ml-3"></i></button> -->
          <div class="caption mb-2" v-if="shift.exportedEmp">
            Employees Exported: {{ shift.exportedEmp.toDate() | moment("MMMM Do YYYY, h:mm a") }}
          </div>
          <button class="btn btn__outlined mr-3 mb-3" @click.prevent="exportRegister">Payroll Register<i class="fas fa-external-link ml-3"></i></button>
          <div class="caption mb-2" v-if="shift.exportedRegister">
            Register Exported: {{ shift.exportedRegister.toDate() | moment("MMMM Do YYYY, h:mm a") }}
          </div>
          <button class="btn btn__outlined mr-3 mb-3" @click.prevent="exportDetails">Export Details<i class="fas fa-external-link ml-3"></i></button>
          <hr>
          <div>
            <label for="payrollStatus">Payroll Completed:</label>
              <input type="checkbox" v-model.trim="shift.payrollComplete" id="payrollStatus" class="ml-3" @change="updateShift()" />
          </div>
        </div>
      </div>
      <div class="dashboard__container--body" v-if="shift">
        <div class="dashboard__container--body--col max">
          <div style="max-width: 30rem; margin-bottom: 1rem;">
          <ais-instant-search :search-client="searchClient" index-name="a_users" >
            <ais-search-box placeholder="Add a User" />
            <ais-state-results>
              <template slot-scope="{ state: { query } }">
                <ais-hits v-show="query.length > 0">
                  <template v-slot:item="{ item }">
                    <div>
                      <button class="btn btn__icon btn__flat mr-2 mb-2" @click="addUser(item)"><i class="fad fa-plus"></i></button>
                      <h4 style="display: inline;">{{ item.firstName }} {{ item.lastName }} | <span v-if="item.address && item.address">{{item.address.city}} | </span>{{item.email}} | {{item.phone}}</h4 style="display: inline;">
                    </div>
                  </template>
                </ais-hits>
              </template>
            </ais-state-results>
          </ais-instant-search>
          </div>
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
                <input type="number" v-model.trim="props.row.regRate" id="regRate" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'dayRate'">
                <input type="text" v-model.trim="props.row.dayRate" id="dayRate" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'firstName'">
                <input type="text" v-model.trim="props.row.firstName" id="firstName" readonly />
              </span>
              <span v-else-if="props.column.field == 'lastName'">
                <input type="text" v-model.trim="props.row.lastName" id="lastName" readonly />
              </span>
              <!-- <span v-else-if="props.column.field == 'fileId'">
                <input type="text" v-model.trim="props.row.fileId" id="fileId" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span> -->
              <span v-else-if="props.column.field == 'note'">
                <button v-show="!props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="opacity:0.5;"></i></button>
                <button v-show="props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="color:blue"></i></button>
                <transition name="modal">
                  <div v-if="activeItem == props.row">
                    <TimesheetNote :item="props.row" @close="closeNote(props.row)" />
                  </div>
                </transition>
              </span>

              <span v-else-if="props.column.field == 'confirmed'">
                <span v-if="props.row.confirmed">{{props.row.confirmed}}</span>
              </span>

              <span v-else-if="props.column.field == 'regHours'">
                <input type="number" v-model.trim="props.row.regHours" id="regHours" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'otHours'">
                <input type="number" v-model.trim="props.row.otHours" id="otHours" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'ot2Hours'">
                <input type="number" v-model.trim="props.row.ot2Hours" id="ot2Hours" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'mbp'">
                <input type="number" v-model.trim="props.row.mbp" id="mbp" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'tips'">
                <input type="number" v-model.trim="props.row.tips" id="tips" @change="onSheetEditable(props.row)" :readonly="props.row.locked"  />
              </span>
              <span v-else-if="props.column.field == 'state'">
                <input type="text" v-model.trim="props.row.state" placeholder="CA" id="state" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
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
                  <i class="fas fa-lock-open-alt ml-3 mr-3"></i>
                </button>
                <button class="btn btn__icon" @click="unlock(props.row)" v-if="props.row.locked">
                  <i class="fas fa-lock-alt ml-3 mr-3" style="color:#5cb85c;"></i>
                </button>
              </span>
              <span v-if="props.column.field == 'fileId'">
                <input type="text" v-model.trim="props.row.fileId" id="fileId" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
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
              <span v-else-if="props.column.field == 'save'">
                <button :disabled="(props.row.locked || !props.row.editable)" class="btn btn__primary btn__small ml-2 mr-2" @click="onSheetEdit(props.row)">
                  Save
                </button>
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
.dashboard__container {
  width: calc(100% - 4rem);
}
.max {
  width:calc(100% - 3.2rem);
}
table.vgt-table td {
  padding: 0 !important;
}
input, textarea {
  padding: 0.4rem 0;
}
</style>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
import ExportService from "@/services/ExportService"
import TimesheetNote from '@/components/Timesheets/TimesheetNote.vue'
const fb = require('../../firebaseConfig.js')
import algoliasearch from 'algoliasearch/lite';
import 'instantsearch.css/themes/satellite-min.css'

export default {
  name: 'shift',
  data: () => ({
    searchClient: algoliasearch(
      '0T1SIY6Y1V',
      'f03dc899fbdd294d6797791724cdb402'
    ),
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
        label: 'Confirmed',
        field: 'confirmed',
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
      {
        label: 'Save',
        field: 'save',
      },
    ]
  }),
  components: {
    Loader,
    TimesheetNote
  },
  created () {
    this.$store.dispatch("getShiftFromId", this.$route.params.id);
    // if (!this.users || this.users.length < 1) {
    //   this.$store.dispatch("getUsers")
    // }
  },
  computed: {
    ...mapState(['userProfile', 'shift', 'shiftAssignments']),
  },
  methods: {
    addUser(item) {
      console.log(item)
      this.$store.dispatch("addUserToShift", {
        shift: this.shift,
        user: item,
        shiftStart: this.formatAMPM(this.shift.startTime) ,
        shiftEnd:this.formatAMPM(this.shift.endTime)
      })
      document
        .querySelectorAll('.ais-SearchBox-input')
        .forEach((e) => (e.value = ''))
        document.querySelectorAll('.ais-Hits-item').forEach((e) => e.remove())
        // this.$refs.searchHits.state.hits = []
    },
    formatAMPM(date) {
      if (typeof date === "string") {
        let [hours, minutes] = date.split(":");
        let ampm = "AM";

        if (Number(hours) >= 12) {
          hours = Number(hours) - 12;
          ampm = "PM";
        }

        return `${hours}:${minutes} ${ampm}`;

      } else if (date instanceof Date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();

        let ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        let strTime = hours + ":" + minutes + " " + ampm;

        return strTime;
      }

      return date;
    },
    showNote(r) {
      console.log(r)
      this.activeItem = r
    },
    closeNote(r) {
      this.activeItem = null
    },
    removeEntry(row) {
      fb.assignmentsCollection.doc(row.id).delete()
    },
    updateShift() {
      this.$store.dispatch("updateEventShift", this.shift)
    },
    // filteredInfo(user) {
    //   return this.users.filter(member => {
    //     return member.id == user.userId
    //   })
    // },
    onSheetEditable(row)  {
      row = row
      row.editable = true
      this.$store.dispatch('updateTimesheet', row)
    },
    onSheetEdit(row) {
      row = row
      row.editable = false
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
    lock(item) {
      fb.usersCollection.doc(item.userId).get()
      .then(
        doc => {
          console.log(doc.id, " => ", doc.data())
          console.log(doc.data().contractorNumber)
          console.log(doc.data().employeeNumber || null)
          fb.assignmentsCollection.doc(item.id).update({ 
            locked: true, 
            fileId: doc.data().employeeNumber || doc.data().contractorNumber || null
          })
        }
      )
    },
    //   .then(function (querySnapshot) {
    //     if (querySnapshot.empty) {
    //     }
    //     querySnapshot.forEach(function (doc) {
    //       console.log(doc.id, " => ", doc.data())
    //       console.log(doc.data().contractorNumber)
    //       console.log(doc.data().employeeNumber || null)
    //       fb.assignmentsCollection.doc(item.id).update({ 
    //         locked: true, 
    //         fileId: doc.data().employeeNumber || doc.data().contractorNumber || null
    //       })
    //     })
    //   })
    // },
    unlock(item) {
      fb.assignmentsCollection.doc(item.id).update({ locked: false })
    },
    goBack() {
      router.go(-1)
    },
    exportDetails() {
      this.performingRequest = true
      const exportHeaders = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
      ];
      const exportItems = [];
      for (var key in this.shiftAssignments) {
        exportItems.push([
          this.shiftAssignments[key].firstName,
          this.shiftAssignments[key].lastName,
          this.shiftAssignments[key].email,
          this.shiftAssignments[key].phone,
        ]);
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
      setTimeout(() => {
        this.performingRequest = false
      }, 2000)
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
        // if (this.shiftAssignments[key].fileId && this.shiftAssignments[key].fileId.length < 9) {
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
            "0",
            this.shiftAssignments[key].mbp,
            "0"
          ]);
        // } else {
        //   console.log("no contractors")
        // }
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
        if (this.shiftAssignments[key].fileId && this.shiftAssignments[key].fileId.length > 9) {
          exportItems.push([
            "1",
            "7",
            this.shiftAssignments[key].fileId,
            "1",
            this.shiftAssignments[key].dayRate,
            "1"
          ]);
          exportItems.push([
            "1",
            "1",
            this.shiftAssignments[key].fileId,
            this.shiftAssignments[key].regHours,
            this.shiftAssignments[key].regRate,
            "0"
          ]);
          exportItems.push([
            "1",
            "2",
            this.shiftAssignments[key].fileId,
            this.shiftAssignments[key].otHours,
            this.shiftAssignments[key].regRate * 1.5,
            "0"
          ]);
          exportItems.push([
            "1",
            "22",
            this.shiftAssignments[key].fileId,
            this.shiftAssignments[key].ot2Hours,
            this.shiftAssignments[key].regRate * 2,
            "0"
          ]);
          exportItems.push([
            "1",
            "125",
            this.shiftAssignments[key].fileId,
            "1",
            this.shiftAssignments[key].tips,
            "1"
          ]);
          exportItems.push([
            "1",
            "4",
            this.shiftAssignments[key].fileId,
            "0",
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