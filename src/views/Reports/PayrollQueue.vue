<template>
  <div class="pt-3">
    <Loader v-if="performingRequest || (payrollQueue && payrollQueue.length == 0) || (!users || (users && users.length == 0))" />
    <div class="dashboard__container--body">
        <vue-good-table
          v-if="users && users.length >= 1"
            :columns="columns"
            :rows="payrollQueue"
            styleClass="vgt-table bordered condensed"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 25,
            }"
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
           
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'regRate'">
                <input type="number" v-model.trim="props.row.regRate" id="regRate" @change="onEditRegRate(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'dayRate'">
                <input type="text" v-model.trim="props.row.dayRate" id="dayRate" @change="onEditDayRate(props.row)" :readonly="props.row.locked" />
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

              <span v-else-if="props.column.field == 'checkInTimeStamp'">
                <span v-if="props.row.checkInTimeStamp">{{formatDate(props.row.checkInTimeStamp)}}</span>

                <input v-if="!props.row.checkInTimeStamp" type="time" v-model.trim="props.row.inTime" id="in" @blur="onEditInOut(props.row)" :readonly="props.row.locked" />

              </span>

              <span v-else-if="props.column.field == 'onboardStatus'">
                <span v-for="u in filteredInfo(props.row)" class="flex">
       
                  <span v-if="u.evereeOnboardingComplete">
                    <button class="btn btn__small btn__flat">Onboarded<i class="fa-solid fa-check ml-2"></i></button>
                  </span>
                  <span v-if="!u.evereeOnboardingComplete">
                    <button class="btn btn__small btn__flat">In Process<i class="fas fa-exclamation-triangle ml-2 danger"></i></button>
                  </span>
                </span>
              </span>


              <span v-else-if="props.column.field == 'checkOutTimeStamp'">
                <span v-if="props.row.checkOutTimeStamp">{{formatDate(props.row.checkOutTimeStamp)}}</span>

                <input v-if="!props.row.checkOutTimeStamp" type="time" v-model.trim="props.row.outTime" id="in" @blur="onEditInOut(props.row)" :readonly="props.row.locked" />

              </span>
              <span v-else-if="props.column.field == 'date'">
                <span v-if="props.row.date">{{props.row.date}}</span>
              </span>

              <span v-else-if="props.column.field == 'position'">
                <span v-if="props.row.position">{{props.row.position}}</span>
              </span>

              <span v-else-if="props.column.field == 'confirmed'">
                <span v-if="props.row.confirmed">{{props.row.confirmed}}</span>
              </span>

              <span v-else-if="props.column.field == 'breakTime'">
                <input type="number" v-model.trim="props.row.breakTime" id="breakTime" @change="onEditBreakTime(props.row)" :readonly="props.row.locked" />
              </span>

              <span v-else-if="props.column.field == 'totalHours'">
                <input type="number" v-model.trim="props.row.totalHours" id="totalHours" @change="onEditTotalHours(props.row)" :readonly="props.row.locked" />
              </span>

              <span v-else-if="props.column.field == 'regHours'">
                <input type="number" v-model.trim="props.row.regHours" id="regHours" @change="onEditRegHours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'otHours'">
                <input type="number" v-model.trim="props.row.otHours" id="otHours" @change="onEditotHours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'ot2Hours'">
                <input type="number" v-model.trim="props.row.ot2Hours" id="ot2Hours" @change="onEditot2Hours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'mbp'">
                <input type="number" v-model.trim="props.row.mbp" id="mbp" @change="onEditMBP(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'tips'">
                <input type="number" v-model.trim="props.row.tips" id="tips" @change="onEditTips(props.row)" :readonly="props.row.locked"  />
              </span>
              <span v-else-if="props.column.field == 'state'">
                <input type="text" v-model.trim="props.row.state" placeholder="CA" id="state" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'status'">
                <v-select
                  label="status" 
                  :options="statuses"
                  v-model="props.row.status"
                  @input="onUpdateStatus(props.row)"
                  :disabled="props.row.locked"
                  :clearable=true
                  >
                </v-select>
              </span>
              <span v-else-if="props.column.field == 'paystatus'">
                <v-select
                  label="status" 
                  :options="paystatuses"
                  v-model="props.row.paystatus"
                  @input="onUpdatePay(props.row)"
                  :disabled="props.row.locked"
                  :clearable=true
                  >
                </v-select>
              </span>
              <span v-else-if="props.column.field == 'locked'">
                <button class="btn btn__outlined btn__small" @click="lock(props.row)" v-if="!props.row.locked">
                  Lock
                  <i class="fas fa-lock-open-alt ml-2"></i>
                </button>
                <button class="btn btn__outlined btn__small" @click="unlock(props.row)" v-if="props.row.locked">
                  Unlock
                  <i class="fas fa-lock-alt ml-2" style="color:#5cb85c;"></i>
                </button>
              </span>


              <span v-else-if="props.column.field == 'delete'">
                <button :disabled="props.row.locked" class="btn btn__dark btn__small ml-2 mr-2" @click="removeEntry(props.row)">
                  hide
                </button>
              </span>
              <span v-else-if="props.column.field == 'name'">
                <a :href="`/events/` + props.row.eventId">
                  {{props.row.name}}
                 
                </a>
              </span>


              
              <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.userId" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>
              <span v-else-if="props.column.field == 'payTotal'">
                <input type="text" v-model.trim="props.row.payTotal" id="payTotal" readonly />
              </span>
              <!-- <span v-else-if="props.column.field == 'save'">
                {{userLookUp(props.row)}}
                  <span v-if="userLookUp(props.row).evereeOnboardingComplete">
                    <button :disabled="(!props.row.payTotal || props.row.payTotal == null)" class="btn btn__primary btn__small ml-2 mr-2" @click="sendPayment(props.row)">
                    Send Payment
                    </button>
                  </span>
              </span> -->
              <span v-else-if="props.column.field == 'save'">
                <span v-for="u in filteredInfo(props.row)" class="flex">
                  <span v-if="u.evereeOnboardingComplete">
                    <button :disabled="(!props.row.payTotal || props.row.payTotal == null)" class="btn btn__primary btn__small ml-2 mr-2" @click="sendPayment(props.row)">
                    Send Payment
                    </button>
                  </span>
                </span>
              </span>
               <span v-else>
                <!-- {{props.formattedRow[props.column.field]}} -->
              </span>
            </template>
          </vue-good-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import * as moment from 'moment'
import router from '@/router'
import firebase from 'firebase/app';
const fb = require('../../firebaseConfig.js')

export default {
  name: 'payrollQueue',
  data: () => ({
    performingRequest: false,
    activeItem: null,
     statuses: ['completed', 'no-show', 'dropped', 'no-response', 'arrived late', 'left early', 'client fired', 'terminated' ],
    paystatuses: ['paid', 'paid tips', 'paid hours', 'not paid' ],
    columns: [
      
      {
        field: 'delete',
        sortable: false,
      },
      {
        label: 'Date',
        field: 'date',
      },
      // {
      //   label: 'Confirmed',
      //   field: 'confirmed',
      //   sortable: false,
      // },
      {
        label: 'Event Name',
        field: 'name',
        width: '124px',
      },
      {
        label: 'Pay Status',
        field: 'paystatus',
        width: '152px',
        sortable: false,
      },
      {
        label: 'Event Status',
        field: 'status',
        width: '152px',
        sortable: false,
      },
      {
        field: 'note',
        sortable: false,
      },
      {
        label: 'First',
        field: 'firstName',
        width: '100px',
      },
      {
        label: 'Last',
        field: 'lastName',
        width: '100px',
      },
      {
        label: 'Link',
        field: 'link',
      },
      
      {
        label: 'Rate',
        field: 'regRate',
        width: '64px',
        sortable: false,
      },
      {
        label: 'In',
        field: 'checkInTimeStamp',
        width: '88px',
        sortable: false,
      },
      {
        label: 'Out',
        field: 'checkOutTimeStamp',
        width: '88px',
        sortable: false,
      },
      {
        label: 'Break Time',
        field: 'breakTime',
        width: '88px',
        sortable: false,
      },
      {
        label: 'Total Hours',
        field: 'totalHours',
        width: '88px',
        sortable: false,
      },
      {
        label: 'Reg Hours',
        field: 'regHours',
        width: '88px',
        sortable: false,
      },
      {
        label: 'OT',
        field: 'otHours',
        width: '88px',
        sortable: false,
      },
      {
        label: '2OT',
        field: 'ot2Hours',
        width: '88px',
        sortable: false,
      },
      {
        label: 'MBP Penalty',
        field: 'mbp',
        width: '88px',
        sortable: false,
      },
      {
        label: 'Tips',
        field: 'tips',
        width: '88px',
      },
      {
        label: 'Bonus',
        field: 'dayRate',
        width: '88px',
        sortable: false,
      },
      {
        label: 'Pay Total',
        field: 'payTotal',
        width: '88px',
        sortable: false,
      },
      {
        label: 'Onboarded',
        field: 'onboardStatus',
        sortable: false,
      },
      {
        label: 'Send Payment',
        field: 'save',
        sortable: false,
      },
    ],
  }),
  components: {
    Loader
  },
  created () {
    this.$store.dispatch("getPayrollUsers")
    // this.$store.dispatch("getPayrollQueue") 
    // if (this.users && this.users.length >= 1) {
    //   this.$store.dispatch("getPayrollQueue") 
    // }
  },
  // async mounted() {
  //   if (this.users && this.users.length >= 1) {
  //     this.$store.dispatch("getPayrollQueue") 
  //   }
    
  // },
  computed: {
    ...mapState(['users', 'userProfile', 'payrollQueue']),
  },
  methods: {
    filteredInfo(user) {
      return this.users.filter(member => {
        if (member && member.id) {
          return (member.id == user.userId)
        }
      })
    },
    formatDateCalc(q) {
      if(q) {
        const postedDate = new Date(q) * 1000;
        console.log(postedDate)
        let time = new Date(postedDate).toISOString().substr(11, 8)
        console.log(time)
        let hours = moment.duration(time).asHours()
        return hours
      } else {
        return null
      }
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;

        return moment.utc(postedDate).local().format('HH:mm:ss A')
        // return moment(postedDate).format('HH:MM A')
      } else {
        return null
      }
    },
    formatDate2(q) {
      return moment(q).format('HH:MM A')
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
    onUpdatePay(row) {
      row.editable = true
      this.$store.dispatch('updateTimesheetPay', {
        id: row.id,
        paystatus: row.paystatus
      })
      row.editable = false
    },
    onUpdateStatus(row) {
      row.editable = true
      this.$store.dispatch('updateTimesheetStatus', {
        id: row.id,
        status: row.status
      })
      row.editable = false
    },
    showNote(r) {
      console.log(r)
      this.activeItem = r
    },
    closeNote(r) {
      this.activeItem = null
    },
    removeEntry(row) {
      fb.assignmentsCollection.doc(row.id).update({
        hidden:true
      })
    },
    showEntry(row) {
      fb.assignmentsCollection.doc(row.id).update({
        hidden:false
      })
    },
    async sendPayment(row) {
      this.performingRequest = true
      console.log(row)
      const sendUserPayment = firebase.functions().httpsCallable('createBatchPayment')
        await sendUserPayment({
        amount: row.payTotal,
        id: row.userId,
        note: row.name  
      })
      .then(result => {
        if (result && result.data) {
          console.log(result.data)
          fb.assignmentsCollection.doc(row.id).update({
            paystatus: 'paid',
            returned: result.data
          })
        }
      })
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    onEditRegRate(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        regRate: row.regRate
      })
      this.onUpdateTotal(row)
      row.editable = false
    },
    async onEditInOut(row) {
      row.editable = true
      let inTime = row.inTime || null
      var inhoursMinutes = inTime.split(/[.:]/);
      var inhours = parseInt(inhoursMinutes[0], 10);
      var inminutes = inhoursMinutes[1] ? parseInt(inhoursMinutes[1], 10) : 0;
      let outTime = row.outTime || null
      var outhoursMinutes = outTime.split(/[.:]/);
      var outhours = parseInt(outhoursMinutes[0], 10);
      var outminutes = outhoursMinutes[1] ? parseInt(outhoursMinutes[1], 10) : 0;
      let totalHours = ((outhours + outminutes / 60).toFixed(2) - (inhours + inminutes / 60).toFixed(2))
      row.inTime = inTime
      row.outTime = outTime
      row.totalHours = totalHours.toFixed(2)

      await fb.assignmentsCollection.doc(row.id).update({
        inTime: inTime,
        outTime: outTime,
        totalHours: totalHours
      })
      row.editable = false
      this.onEditTotalHours(row)
    },
    async onEditTotalHours(row) {
      row.editable = true
      await fb.assignmentsCollection.doc(row.id).update({
        totalHours: row.totalHours
      })
      this.onEditRegHours(row)
      row.editable = false
    },
    async onEditRegHours(row) {
      console.log(row)
      row.editable = true
      let calcHours = (row.totalHours - row.breakTime)
      row.regHours = calcHours
      await fb.assignmentsCollection.doc(row.id).update({
        regHours: calcHours
      })
      this.onUpdateTotal(row)
      // this.onUpdateTotal(row)
      row.editable = false
    },
    onEditotHours(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        otHours: row.otHours
      })
      this.onUpdateTotal(row)
      row.editable = false
    },
    onEditot2Hours(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        ot2Hours: row.ot2Hours
      })
      this.onUpdateTotal(row)
      row.editable = false
    },
    async onEditDayRate(row) {
      row.editable = true
      await b.assignmentsCollection.doc(row.id).update({
        dayRate: row.dayRate
      })
      this.onUpdateTotal(row)
      row.editable = false
    },
    async onEditBreakTime(row) {
      console.log(row)

      row.editable = true
      await fb.assignmentsCollection.doc(row.id).update({
        breakTime: row.breakTime
      })
      row.editable = false
      this.onEditRegHours(row)
    },
    async onUpdateTotal(row) {
      console.log('editing total')
      console.log(row)
      row.editable = true


      let total = (row.regHours * row.regRate) + 
      (parseFloat(((row.otHours || 0) * (row.regRate * 1.5)))) + 
      (parseFloat(((row.ot2Hours || 0) * ((row.regRate || 0) * 2)))) + 
      (parseFloat(((row.mbp || 0) * row.regRate))) + 
      (parseFloat((row.tips || 0))) + 
      (parseFloat((row.dayRate || 0)))

      

      console.log(total)


      await fb.assignmentsCollection.doc(row.id).update({
        payTotal: total.toFixed(2),
        paytimestamp: new Date().getTime()
      })
      row.editable = false
    },
    onEditMBP(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        mbp: row.mbp
      })
      this.onUpdateTotal(row)
      row.editable = false
    },
    onEditTips(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        tips: row.tips
      })
      this.onUpdateTotal(row)
      row.editable = false
    },
    onSheetEditable(row)  {
      row.editable = true
    },
    onSheetEdit(row) {
      row = row
      row.editable = false
      this.$store.dispatch('updateTimesheet', row)
    },
    exportRegister() {
      this.performingRequest = true
      const exportHeaders = [
        "Date",
        "First Name",
        "Last Name",
        "Position",
        "Hourly Rate",
        "Clock-In",
        "Clock-Out",
        "Reg Hours",
        "Overtime",
        "2x Overtime",
        "Break Penalty",
        "CC Tips"
      ];
      const exportItems = [];
      for (var key in this.eventAssignments) {
        if (!this.eventAssignments[key].hidden) {

          let inTime = (this.formatDate(this.eventAssignments[key].checkInTimeStamp) || this.eventAssignments[key].inTime)
          let outTime = (this.formatDate(this.eventAssignments[key].checkOutTimeStamp) || this.eventAssignments[key].outTime)

          exportItems.push([
            this.eventAssignments[key].date,
            this.eventAssignments[key].firstName,
            this.eventAssignments[key].lastName,
            this.eventAssignments[key].position,
            this.eventAssignments[key].regRate,
            inTime,
            outTime,
            this.eventAssignments[key].regHours,
            this.eventAssignments[key].otHours,
            this.eventAssignments[key].ot2Hours,
            this.eventAssignments[key].mbp,
            this.eventAssignments[key].tips
          ]);
        }
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
      setTimeout(() => {
        this.performingRequest = false
      }, 2000)
    },
  
  },
  beforeDestroy () {
    this.$store.dispatch("clearUsersState")
    this.$store.dispatch("clearPayrollQueue")
  }
}
	
</script>