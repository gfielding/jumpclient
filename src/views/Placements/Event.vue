<template>
	<div class="dashboard">
    <div>
      <div class="dashboard__container--header mb-3" v-if="event">
        <h2 v-if="event.title">Staff Placements for {{event.title}}</h2>
      </div>
      <Loader v-if="!eventUsers || eventUsers.length < 1" />
      <div class="dashboard__container--body" v-if="eventUsers && eventUsers.length >= 1">
        <div class="dashboard__container--body--col">
          <button class="btn btn__flat mr-3" @click="exportUnplaced()">export unplaced</button>
          <vue-good-table
              :columns="columns"
              :rows="filteredUsers"
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
              <span v-else-if="props.column.field == 'notes'">
                <button class="icon" v-if="props.row.note" v-tooltip="props.row.note">
                  <i class="far fa-sticky-note"></i>
                </button>
              </span>
              <!-- <span v-else-if="props.column.field == 'state'">
                <span v-if="(props.row)">
                  <span v-for="u in filteredInfo(props.row)">
                    <span v-if="u && u.address && u.address.city && u.address.state" style="display:inline;">
                      <span v-tooltip="u.address.city">{{u.address.state}}</span>
                    </span>
                  </span>
                </span>
              </span> -->
              <span v-else-if="props.column.field == 'days'">
                <span v-if="(props.row)">
                  {{props.row.start}}
                </span>
              </span>
              <!-- <span v-else-if="props.column.field == 'extras'">
                <span v-if="(props.row)">
                    <span v-for="u in filteredInfo(props.row)">
                      <v-popover>
                        <button class="tooltip-target" style="display:inline;"><i class="fas fa-th"></i></button>
                        <template slot="popover">
                          <p>
                            Vaccinated: {{u.fullyVaccinated || ''}}
                          </p>
                          <p>
                            Contractor: {{u.contractorStatus || ''}}
                          </p>
                          <p>
                            Employee: {{u.employeeStatus || ''}}
                          </p>
                          <p>
                            Alcohol Cert: <span v-if="u.certTips">yes</span><span v-else>false</span>
                          </p>
                          <p v-for="job in u.skills">{{job.title}}</p>
                          <p v-for="client in u.blacklist" class="danger">{{client.title}}</p>
                        </template>
                      </v-popover>
                    </span>
                  </span>
                </span>
              </span> -->
              <span v-else-if="props.column.field == 'reservations'">
                  <span v-if="
                    (props.row.dayStatus != 'hired') &&
                    (props.row.dayStatus != 'assigned') &&
                    (props.row.dayStatus != 'not requested')
                  " style="display:inline; margin-right: 1.5rem;">
                    <button class="icon" @click="reserveUser(props.row)" v-tooltip="'reserve user'">
                      <i class="far fa-calendar"></i>
                    </button>
                  </span>
                  <span v-if="
                    (props.row.dayStatus == 'hired' || props.row.dayStatus == 'assigned')
                  " style="display:inline;">
                    <button class="icon" v-tooltip="'cancel reservation'" @click="unreserveUser(props.row)">
                      <i class="fas fa-calendar-check" style="color:green;"></i>
                    </button>
                  </span>

                  <span v-if="
                    (props.row.dayStatus != 'hired') &&
                    (props.row.dayStatus != 'assigned') &&
                    (props.row.dayStatus != 'not requested')"
                    style="display:inline;">
                    <button class="icon" v-tooltip="'not use this staff today'" @click="notRequestUser(props.row)">
                      <i class="fas fa-calendar-times"></i>
                    </button>
                  </span>

                  <span v-if="
                    (props.row.dayStatus == 'not requested')
                  " style="display:inline;">
                    <button class="icon" v-tooltip="'cancel cancellation'" @click="cancelNotRequestUser(props.row)">
                      <i class="fas fa-calendar-times" style="color:red;"></i>
                    </button>
                  </span>
              </span>

              <span v-else-if="props.column.field == 'fullName'">
                <router-link :to="'/users/' + props.row.userId">
                  {{props.row.fullName}}
                </router-link>
              </span>
              <span v-else-if="props.column.field == 'delete'">

                <button class="icon" v-if="!props.row.showTrash" v-tooltip="'delete instance'" @click="showTrash(props)">
                  <i class="fas fa-times"></i>
                </button>

                <button class="icon" v-if="props.row.showTrash" v-tooltip="'cancel'" @click="hideTrash(props)">
                  <i class="fas fa-times"></i>
                </button>

                <button class="icon" v-if="props.row.showTrash" v-tooltip="'delete instance'" @click="deleteUser(props.row)" style="margin-left: 1.5rem;">
                  <i class="fas fa-trash"></i>
                </button>
              </span>
              <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
          </vue-good-table>
        </div>
        <div class="dashboard__container--body--col alt-col">
          <button class="btn btn__flat mr-3" @click="exportAll()">export all</button>
          <div v-for="shift in eventShifts" :key="shift.id" style=" padding:1.6rem; background: white; margin-bottom:1.6rem;">
            <div class="flex align-center justify-space-between">
              <span>
                <h3>{{shift.day | moment("dddd, MMM Do") }}</h3>
                <span v-if="shift.position.title">{{shift.position.title}}, 
                  <span v-if="shift.startTime" class="ml-2"> {{ [ shift.startTime, "HH:mm" ] | moment("hh:mm A") }}</span> - 
                  <span v-if="shift.endTime">{{ [ shift.endTime, "HH:mm" ] | moment("hh:mm A") }}</span>
                </span>
              </span>
              <div>
                <button class="btn btn__flat mr-3" @click="exportStaff(shift)">export</button>
                <button class="btn btn__icon" @click="expand(shift)" v-if="shift.collapse"><i class="fas fa-chevron-up"></i></button>
                <button class="btn btn__icon" @click="collapse(shift)" v-if="!shift.collapse"><i class="fas fa-chevron-down"></i></button>
              </div>
            </div>
            <transition name="fade">
              <div v-if="shift.collapse == true">
                <div class="pt-2">
                  <h4 v-if="shift.name">{{shift.name}}</h4>
                  <!-- <p v-if="shift.position.title">{{shift.position.title}}, 
                    <span v-if="shift.startTime" class="ml-2"> {{ [ shift.startTime, "HH:mm" ] | moment("hh:mm A") }}</span> - 
                    <span v-if="shift.endTime">{{ [ shift.endTime, "HH:mm" ] | moment("hh:mm A") }}</span>
                  </p> -->

                  <button class="btn btn__flat chip mt-1">{{orderedPlacedUsers(shift).length}} / {{shift.staff}}</button>
                </div>
                <div class="pt-3" v-if="orderedUsers.length >= 1">
                  <v-select
                    label="fullName" 
                    :options="orderedUsers(shift)"
                    v-model="shift.selectedStaff"
                    @input="assignShift(shift)"
                    >
                    <template #option="{ fullName, day, requestedJob }">
                      <span>{{ fullName }}<span v-if="requestedJob"> | {{requestedJob.title}}</span></span>
                    </template>
                  </v-select>
                </div>
                <div class="pt-3">
                  <vue-good-table
                    :columns="columns2"
                    :rows="orderedPlacedUsers(shift)"
                    >
                    <template slot="table-row" slot-scope="props">
                      <!-- <span v-if="props.column.field == 'extras'">
                        <span v-if="(props.row)">
                            <span v-for="u in filteredInfo(props.row)">
                              <v-popover>
                                <button class="tooltip-target" style="display:inline;"><i class="fas fa-th"></i></button>
                                <template slot="popover">
                                  <p>
                                    Vaccinated: {{u.fullyVaccinated || ''}}
                                  </p>
                                  <p>
                                    Contractor: {{u.contractorStatus || ''}}
                                  </p>
                                  <p>
                                    Employee: {{u.employeeStatus || ''}}
                                  </p>
                                  <p>
                                    Alcohol Cert: <span v-if="u.certTips">yes</span><span v-else>false</span>
                                  </p>
                                  <p v-for="job in u.skills">{{job.title}}</p>
                                  <p v-for="client in u.blacklist" class="danger">{{client.title}}</p>
                                </template>
                              </v-popover>
                            </span>
                          </span>
                        </span>
                      </span> -->
                      <span v-if="props.column.field == 'created'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
                      <span v-else-if="props.column.field == 'reservations'">
                  <span v-if="
                    (props.row.dayStatus != 'hired') &&
                    (props.row.dayStatus != 'assigned') &&
                    (props.row.dayStatus != 'not requested')
                  " style="display:inline; margin-right: 1.5rem;">
                    <button class="icon" @click="reserveUser(props.row)" v-tooltip="'reserve user'">
                      <i class="far fa-calendar"></i>
                    </button>
                  </span>
                  <span v-if="
                    (props.row.dayStatus == 'hired' || props.row.dayStatus == 'assigned')
                  " style="display:inline;">
                    <button class="icon" v-tooltip="'cancel reservation'" @click="unreserveUser(props.row)">
                      <i class="fas fa-calendar-check" style="color:green;"></i>
                    </button>
                  </span>

                  <span v-if="
                    (props.row.dayStatus != 'hired') &&
                    (props.row.dayStatus != 'assigned') &&
                    (props.row.dayStatus != 'not requested')"
                    style="display:inline;">
                    <button class="icon" v-tooltip="'not use this staff today'" @click="notRequestUser(props.row)">
                      <i class="fas fa-calendar-times"></i>
                    </button>
                  </span>

                  <span v-if="
                    (props.row.dayStatus == 'not requested')
                  " style="display:inline;">
                    <button class="icon" v-tooltip="'cancel cancellation'" @click="cancelNotRequestUser(props.row)">
                      <i class="fas fa-calendar-times" style="color:red;"></i>
                    </button>
                  </span>
              </span>

              <span v-else-if="props.column.field == 'fullName'">
                <router-link :to="'/users/' + props.row.userId">
                  {{props.row.fullName}}
                </router-link>
              </span>
              <span v-else-if="props.column.field == 'notes'">
                <button class="icon" v-if="props.row.note" v-tooltip="props.row.note">
                  <i class="far fa-sticky-note"></i>
                </button>
              </span>
              <!-- <span v-else-if="props.column.field == 'state'">
                <span v-if="(props.row)">
                  <span v-for="u in filteredInfo(props.row)">
                    <span v-if="u && u.address && u.address.city && u.address.state" style="display:inline;">
                      <span v-tooltip="u.address.city">{{u.address.state}}</span>
                    </span>
                  </span>
                </span>
              </span> -->
              <span v-else-if="props.column.field == 'delete'">

                <button v-if="props.row.dayStatus == 'hired' && props.row.status != 'assigned'" class="icon" v-tooltip="'lock shift'" @click="lockShift(props, shift)" style="display:inline; margin-right: 1.5rem;">
                          <i class="fas fa-lock-open-alt"></i>
                        </button>

                        <button class="icon" v-if="props.row.dayStatus == 'hired' && props.row.status == 'assigned'" style="display:inline; margin-right: 1.5rem;">
                          <i class="fas fa-lock-alt"></i>
                        </button>

                        <button v-if="props.row.status == 'placed'" class="icon ml-4" v-tooltip="'remove'" @click="removePlacement(props.row)">
                          <i class="fas fa-times"></i>
                        </button>

                        <button v-if="props.row.status == 'assigned'" class="icon ml-4" v-tooltip="'remove'" @click="removeAssignment(props, shift)">
                          <i class="fas fa-times"></i>
                        </button>
              </span>
                      
                      <span v-else>
                        {{props.formattedRow[props.column.field]}}
                      </span>
                    </template>
                  </vue-good-table>
                </div>
              </div>
            </transition>

          </div>

            
        </div>
        
      </div>
      
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import * as moment from 'moment'
import router from '@/router'
import ExportService from "@/services/ExportService"
const fb = require('../../firebaseConfig.js')

export default {
  name: 'eventplacement',
  data() {
    return {
      columns: [
        {
          label: 'Name',
          field: 'fullName',
        },
        {
          label: 'Signed Up',
          field: 'created',
          sortable: false,
        },
        {
          label: '',
          field: 'days',
        },
        {
          label: 'Job',
          field: 'requestedJob.title',
          tdClass: 'text-center',
        },
        {
          label: '',
          field: 'notes',
          sortable: false,
          tdClass: 'text-center',
        },
        {
          label: '',
          field: 'reservations',
          sortable: false,
        },
        // {
        //   label: '',
        //   field: 'extras',
        //   tdClass: 'text-center',
        //   sortable: false,
        // },
        {
          label: '',
          field: 'delete',
          tdClass: 'text-left',
          sortable: false,
        },
      ],
      columns2: [
        {
          label: 'Name',
          field: 'fullName',
        },
        {
          label: 'Signed Up',
          field: 'created',
          sortable: false,
        },
        {
          label: 'Job',
          field: 'requestedJob.title',
          tdClass: 'text-center',
        },
        {
          label: '',
          field: 'notes',
          sortable: false,
          tdClass: 'text-center',
        },
        {
          label: '',
          field: 'reservations',
          sortable: false,
        },
        // {
        //   label: '',
        //   field: 'extras',
        //   tdClass: 'text-center',
        //   sortable: false,
        // },
        {
          label: '',
          field: 'delete',
          tdClass: 'text-left',
          sortable: false,
        },
      ]
    }
  },
  components: {
    Loader
  },
  created () {
    this.$store.dispatch("getEventPlacementFromId", this.$route.params.id)
    this.$store.dispatch("getUserAvailabilityState", this.$route.params.id)
    // if (!this.users || this.users.length < 1) {
    //   this.$store.dispatch("getUsers")
    // }
  },
  watch: {
    '$route' (to) {
      this.$store.dispatch("getEventPlacementFromId", this.$route.params.id)
    }
  },
  // mounted() {
  //   if (!this.users || this.users.length < 1) {
  //     this.$store.dispatch("getUsers")
  //   }
  // },
  computed: {
    ...mapState(['eventUsers', 'eventShifts', 'eventInfo']),
    event() {
      return this.eventInfo 
    },
    filteredUsers () {
      return this.eventUsers.filter(user => {
        // return user.status == 'available'
        return ((user.status != 'placed') && (user.status != 'assigned'))
      })
    },
    
    filteredPlacedUsers () {
      return this.eventUsers.filter(user => {
        return ((user.status == 'placed') || (user.status == 'assigned'))
      })
    },
  },
  methods: {
    exportAll() {
      const exportHeaders = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Day",
      ]
      const exportItems = [];
      for (var key in this.eventUsers) {
        exportItems.push([
          this.eventUsers[key].firstName,
          this.eventUsers[key].lastName,
          this.eventUsers[key].email,
          this.eventUsers[key].phone,
          this.eventUsers[key].day,
          // this.eventUsers[key].address.state,
        ])
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    exportUnplaced() {
      const exportHeaders = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Day",
      ]
      const exportItems = [];
      for (var key in this.filteredUsers) {
        exportItems.push([
          this.filteredUsers[key].firstName,
          this.filteredUsers[key].lastName,
          this.filteredUsers[key].email,
          this.filteredUsers[key].phone,
          this.filteredUsers[key].day,
        ])
      }
      console.log(exportItems)
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    exportStaff(shift) {
      console.log(shift)
      const exportHeaders = [
        "Day",
        "Event",

        "Position",
        "Start",
        "End",
        "First Name",
        "Last Name",
        "Phone",
        "Email",
        "Code",
      ];
      const exportItems = [];
      for (var key in this.orderedPlacedUsers2(shift.id)) {
        exportItems.push([
          shift.day,
          shift.event,
          shift.position.title,
          shift.startTime,
          shift.endTime,
          this.orderedPlacedUsers2(shift.id)[key].firstName,
          this.orderedPlacedUsers2(shift.id)[key].lastName,
          this.orderedPlacedUsers2(shift.id)[key].phone,
          this.orderedPlacedUsers2(shift.id)[key].email,
          `=REGEXEXTRACT(H2,"....$")`
        ])
      }
      console.log(exportItems)
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    removeAssignment(props, shift) {
      fb.userDaysCollection.doc(props.row.id).update({status: "available", shift: null})
      fb.assignmentsCollection.where("shiftId", "==", shift.id).where("userId", "==", props.row.userId).get().then(function(querySnapshot) {
        querySnapshot.forEach(doc => {
          console.log(doc.id)
          fb.assignmentsCollection.doc(doc.id).delete()
        })
      })
      fb.eventStaffCollection.where("event", "==", shift.eventId).where("user", "==", props.row.userId).get().then(function(querySnapshot) {
        querySnapshot.forEach(doc => {
          fb.eventStaffCollection.doc(doc.id).delete()
        })
      })
    },
    showTrash(p) {
      fb.userDaysCollection.doc(p.row.id).update({showTrash: true})
    },
    hideTrash(p) {
      fb.userDaysCollection.doc(p.row.id).update({showTrash: false})
    },
    deleteUser(userDay) {
      fb.userDaysCollection.doc(userDay.id).update({
        preferredEvent: null
      })
    },
    orderedUsers(shift) {
      function compare(a, b) {
        if (a.firstName < b.firstName)
          return -1;
        if (a.firstName > b.firstName)
          return 1;
        return 0;
      }
      return this.filteredUsers.filter(user => {
        return user.status == 'available' && user.day == shift.day
      })
    },
    removePlacement(row) {
      this.$store.dispatch('removeUserPlacement', row)
    },
    expand(shift) {
      shift.collapse = false
      this.$store.dispatch("updateEventShift", shift)
    },
    collapse(shift) {
      shift.collapse = true
      this.$store.dispatch("updateEventShift", shift)
    },
    // filteredUsers(shift) {
    //   return this.eventUsers.filter(user => {
    //     return user.status == 'available' && user.shift == shift.id && user.day == shift.day
    //   })
    // },
    orderedPlacedUsers2 (shift) {
      function compare(a, b) {
        if (a.firstName < b.firstName)
          return -1;
        if (a.firstName > b.firstName)
          return 1;
        return 0;
      }
      return this.filteredPlacedUsers.sort(compare).filter(user => {
        return user.shift == shift
      });
    },
    orderedPlacedUsers (shift) {
      function compare(a, b) {
        if (a.firstName < b.firstName)
          return -1;
        if (a.firstName > b.firstName)
          return 1;
        return 0;
      }
      return this.filteredPlacedUsers.sort(compare).filter(user => {
        return user.shift == shift.id && user.day == shift.day
      });
    },
    lockShift(props, shift) {
      console.log(props.row)
      console.log(shift)
      let event = this.event
      let shiftDay = shift.day
      let dateObj = new Date(shift.day);
      let month = dateObj.getUTCMonth() + 1;
      let day = dateObj.getUTCDate();
      let year = dateObj.getUTCFullYear();
      let newdate = month + "/" + day + "/" + year;
      let shiftStart = this.formatAMPM(shift.startTime)
      let shiftEnd = this.formatAMPM(shift.endTime)

      props.row.status = "assigned"

      let assignment = {
        shiftId: shift.id,
        userId: props.row.userId,
        date: newdate,
        day: shift.day,
        eventId: shift.eventId,
        email: props.row.email,
        firstName: props.row.firstName,
        lastName: props.row.lastName,
        phone: props.row.phone,
        name:  shift.event,
        fileId: props.row.employeeNumber || props.row.contractorNumber || '123',
        position: shift.position.title,
        start: shiftDay + " " + shift.startTime,
        end: shiftDay + " " + shift.endTime,
        startTime: shift.startTime,
        endTime: shift.endTime,
        eventInfo: event,
        shiftStart: shiftStart,
        shiftEnd: shiftEnd,
        event: event.id,
        eventName: event.title,
        slug: event.slug,
      }
      console.log(assignment)
      this.$store.dispatch("lockShift", assignment)
    },
    assignShift(shift) {
      let userId = shift.selectedStaff.userId
      let day = this.day
      let placement = {
        shiftId: shift.id,
        userId: userId,
        day: this.day

      }
      this.$store.dispatch('addPlacement', {
        id:shift.selectedStaff.id,
        placement: placement
      })
      shift.selectedStaff = null
    },
    reserveUser(user) {
      user.dayStatus = "hired"
      this.$store.dispatch('reserveUser', user)
    },
    notRequestUser(user) {
      user.dayStatus = "not requested"
      fb.userDaysCollection.doc(user.id).update({ dayStatus: 'not requested' })
    },
    unreserveUser(user) {
      user.dayStatus = null
      fb.userDaysCollection.doc(user.id).update({dayStatus: null})
    },
    cancelNotRequestUser(user) {
      user.dayStatus = null
      fb.userDaysCollection.doc(user.id).update({dayStatus: null})
    },
    filteredInfo(user) {
      return this.users.filter(member => {
        return member.id == user.userId
      })
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
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY, hh:mm a')
      } else {
        return null
      }
    },
  },
  beforeDestroy () {
    this.$store.dispatch("clearEventUsers")
    this.$store.dispatch("clearEventState")
    this.$store.dispatch("clearEventShiftsState")
    this.columns = null
    delete this.columns
    this.columns2 = null
    delete this.columns2
    console.log(this)
  }
}
</script>
