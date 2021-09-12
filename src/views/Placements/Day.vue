<template>
	<div class="dashboard">
      <div class="flex justify-space-between align-center mb-3" v-if="day">
        <h2>Staff Placements for {{day | moment("dddd, MMMM Do YYYY") }}</h2>
        <div class="flex align-center"> 
	        <button class="btn btn__flat mr-3" @click="exportAll()">export all</button>
        </div>
      </div>
      <Loader v-if="!dayUsers || dayUsers.length < 1" />
      <div class="dashboard__container--body" v-if="dayUsers && dayUsers.length >= 1" style="width:100%;">
      	<div class="dashboard__container--body--col">
          <div class="flex justify-flex-end">
            <button class="btn btn__flat mr-3" @click="exportHomeless(dayUsers)">export homeless</button>
          </div>
    			<form ref="form" @submit.prevent class="mb-1">
    			<!-- 	<div class="mb-3">
              <h4>Add User:</h4>
              <v-select
                class="mt-2"
                label="Add User" 
                :options="users"
                placeholder="search"
                :getOptionLabel="user => user.firstName + ' ' + user.lastName"
                 v-model="newUser"
                @input="addUser()"
                >
              </v-select>
    				</div> -->
    <ais-instant-search :search-client="searchClient" index-name="a_users" >
      <ais-search-box placeholder="Add User..." />
      <ais-state-results>
        <template slot-scope="{ state: { query } }">
          <ais-hits v-show="query.length > 0">
            <template v-slot:item="{ item }">
              <div>
                <button @click="addUser(item)" class="btn btn__icon btn__flat mr-4"><i class="fas fa-plus" style="color:blue;"></i></button>
                <p style="display: inline;">{{ item.firstName }} {{ item.lastName }} | <span v-if="item.address && item.address">{{item.address.city}} | </span>{{item.email}} | {{item.phone}}</p style="display: inline;">
              </div>
            </template>
          </ais-hits>
        </template>
      </ais-state-results>
    </ais-instant-search>
      

    			</form>
      		<vue-good-table
              :columns="columns"
              :rows="orderedAvailableUsers"
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

            	 	<button class="icon" v-if="props.row.showTrash" v-tooltip="'delete instance'" @click="deleteUserDay(props.row)" style="margin-left: 1.5rem;">
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
      		<div v-for="event in eventsByDay" :key="event.id" style=" padding:1.6rem; background: white; margin-bottom:1.6rem;">
      			<div class="flex align-center justify-space-between">
              <h3>{{event.title}}<span v-if="event.venue"> | {{event.venue.title }}</span></h3>
              <div>
                <button class="btn btn__flat mr-3" @click="exportStaff(event)">export</button>
                <button class="btn btn__icon" @click="expand(event)" v-if="event.collapse"><i class="fas fa-chevron-up"></i></button>
                <button class="btn btn__icon" @click="collapse(event)" v-if="!event.collapse"><i class="fas fa-chevron-down"></i></button>
              </div>
            </div>
            <transition name="fade">
              <div v-if="event.collapse == true">
                <div class="pt-3" v-if="orderedAvailableUsers.length >= 1">
                  <v-select
                    label="fullName" 
                    :options="orderedAvailableUsers"
                    v-model="event.selectedStaff"
                    @input="assignEvent(event)"
                    >
                    <!-- <template #option="{ fullName, day }">
                      <span>{{ fullName }} | {{day | moment("ddd, MMM Do")}}</span>
                    </template> -->
                  </v-select>
                </div>
                <div class="pt-3">
                	<vue-good-table
                    :columns="columns2"
                    :rows="preferredUsers(event)"
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
              </div>
            </transition>
      		</div>
      		
      </div>
    </div>


		
	</div>
</template>

<style scoped type="text/css">
 .btn__icon {
  transition: ease all 1s;
 }
.btn__icon:hover {
   transform: scale(1.4);
  }
</style>

<script>
import { mapState } from 'vuex'
import router from '@/router'
import * as moment from 'moment'
import Loader from '@/components/Loader.vue'
import algoliasearch from 'algoliasearch/lite';
import ExportService from "@/services/ExportService"
const fb = require('../../firebaseConfig.js')

export default {
  name: 'day',
  data() {
    return {
      searchClient: algoliasearch(
        '0T1SIY6Y1V',
        'f03dc899fbdd294d6797791724cdb402',
      ),
    	day: this.$route.params.id,
      selectedStaff: {},
      performingRequest: false,
      activeUser: {},
      newUser: '',
      placeholder: {
				type: String,
				default: "Search Users"
			},
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
          label: 'Job',
          field: 'requestedJob.title',
          tdClass: 'text-center',
        },
	      // {
	      //   field: 'state',
	      //   tdClass: 'text-center',
	      //   sortable: false,
	      // },
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
        // {
        //   field: 'state',
        //   tdClass: 'text-center',
        //   sortable: false,
        // },
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
  computed: {
    ...mapState(['currentUser', 'eventsByDay', 'dayUsers']),
    filteredAvailableUsers () {
      return this.dayUsers.filter(user => {
        return (!user.preferredEvent || user.preferredEvent == null)
      })
    },
    filteredUsers () {
      return this.dayUsers.filter(user => {
        return user.status == 'available' && user.preferredEvent
      })
    },
    orderedUsers () {
      function compare(a, b) {
        if (a.firstName < b.firstName)
          return -1;
        if (a.firstName > b.firstName)
          return 1;
        return 0;
      }
      return this.filteredUsers.sort(compare)
    },
    orderedAvailableUsers () {
      function compare(a, b) {
        if (a.firstName < b.firstName)
          return -1;
        if (a.firstName > b.firstName)
          return 1;
        return 0;
      }
      return this.filteredAvailableUsers.sort(compare)
    },
    filteredPlacedUsers () {
      return this.dayUsers.filter(user => {
        return ((user.status == 'placed') || (user.status == 'assigned'))
      })
    },
  },
  created () {
    if (this.day) {
      this.$store.dispatch("getEventsByDay", this.day)
      this.$store.dispatch("getUserAvailabilityState", this.day)
      // this.$store.dispatch("getDayEventsState", this.day)
    }
   //  if (!this.users || this.users.length < 1) {
   //    this.$store.dispatch("getUsers")
	  // }
  },
  components: {
    Loader
  },
  methods: {
  	expand(event) {
  		event.collapse = false
  		this.$store.dispatch("updateEvent", event)
  	},
  	collapse(event) {
  		event.collapse = true
  		this.$store.dispatch("updateEvent", event)
  	},
    exportHomeless(orderedAvailableUsers) {
      const exportHeaders = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
      ]
      const exportItems = [];
      for (var key in this.orderedAvailableUsers) {
        exportItems.push([
          this.orderedAvailableUsers[key].firstName,
          this.orderedAvailableUsers[key].lastName,
          this.orderedAvailableUsers[key].email,
          this.orderedAvailableUsers[key].phone,
        ])
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
  	exportAll() {
  		const exportHeaders = [
  			"First Name",
				"Last Name",
				"Email",
				"Phone",
  		]
  		const exportItems = [];
  		for (var key in this.dayUsers) {
  			exportItems.push([
  				this.dayUsers[key].firstName,
					this.dayUsers[key].lastName,
					this.dayUsers[key].email,
					this.dayUsers[key].phone,
					// this.availableUsers[key].address.state,
  			])
  		}
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
				"Payroll Status"
			];
			const exportItems = [];
			for (var key in this.orderedPlacedUsers(shift.id)) {
				exportItems.push([
					shift.day,
					shift.event,
					shift.position.title,
					shift.startTime,
					shift.endTime,
					this.orderedPlacedUsers(shift.id)[key].firstName,
					this.orderedPlacedUsers(shift.id)[key].lastName,
					this.orderedPlacedUsers(shift.id)[key].phone,
					this.orderedPlacedUsers(shift.id)[key].email,
					this.orderedPlacedUsers(shift.id)[key].contractorStatus
				])
			}
			console.log(exportItems)
			this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
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
    },
  	goBack() {
      router.go(-1)
    },
    filteredInfo(user) {
      return this.availableUsers.filter(member => {
        return member.id == user.userId
      })
    },
    preferredUsers(event) {
    	return this.orderedUsers.filter(user => {
    		return user.preferredEvent == event.id
    	})
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
        return user.shift == shift
      });
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
    reserveUser(user) {
      this.$store.dispatch('reserveUser', user)
    },
    // reserveUser(user) {
    //   fb.usersCollection.doc(user.userId).get()
    //   .then(
    //     doc => {
    //       let dateObj = new Date(this.day);
    //       let month = dateObj.getUTCMonth() + 1;
    //       let day = dateObj.getUTCDate();
    //       let year = dateObj.getUTCFullYear();
    //       let newdate = month + "/" + day + "/" + year;
    //       fb.userDaysCollection.doc(user.id).update({
    //         dayStatus: 'hired',
    //         email: doc.data().email,
    //         phone: doc.data().phone,
    //         dateFormat: newdate
    //       })
    //     }
    //   )
    // },
    notRequestUser(user) {
      fb.userDaysCollection.doc(user.id).update({ dayStatus: 'not requested' })
    },
    unreserveUser(user) {
      fb.userDaysCollection.doc(user.id).update({dayStatus: null})
    },
    cancelNotRequestUser(user) {
      fb.userDaysCollection.doc(user.id).update({dayStatus: null})
    },
    lockShift(props, shift) {
      this.performingRequest = true
      let shiftDay = shift.day
      let dateObj = new Date(shift.day);
      let month = dateObj.getUTCMonth() + 1;
      let day = dateObj.getUTCDate();
      let year = dateObj.getUTCFullYear();
      let newdate = month + "/" + day + "/" + year;
      let shiftStart = this.formatAMPM(shift.startTime)
      let shiftEnd = this.formatAMPM(shift.endTime)
      fb.eventsCollection.doc(shift.eventId).get().then(
        doc => {
          let eventData = {
            eventInfo: doc.data(),
            slug: doc.data().slug,
          }
          let assignment = {
            shiftId: shift.id,
            userId: props.row.userId,
            date: newdate,
            eventId: shift.eventId,
            email: props.row.email,
            firstName: props.row.firstName,
            lastName: props.row.lastName,
            phone: props.row.phone,
            event: shift.event,
            name:  shift.event,
            fileId: props.row.employeeNumber || props.row.contractorNumber || '123',
            position: shift.position.title,
            start: shiftDay + " " + shift.startTime,
            end: shiftDay + " " + shift.endTime,
            startTime: shift.startTime,
            endTime: shift.endTime,
            slug: eventData.slug,
            eventInfo: eventData.eventInfo,
            shiftStart: shiftStart,
            shiftEnd: shiftEnd
          }
          this.$store.dispatch("lockShift", assignment)
          fb.userDaysCollection.doc(props.row.id).update({status: "assigned", shift: shift.id})
        }
      )
      setTimeout(() => {
        this.performingRequest = false
      }, 1500)
    },
    assignShift(shift) {
    	console.log(shift)
      let userId = shift.selectedStaff.userId
      console.log(userId)
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
    assignEvent(event) {
    	let userId = event.selectedStaff.userId
    	console.log(userId)
    	this.$store.dispatch('preferEvent', {
    		userId: userId,
    		event: event.id,
    		day: this.day
    	})
    	event.selectedStaff = null
    	// this.$store.dispatch("getUserAvailabilityState", this.day)
    },
    removeAssignment(props, shift) {
      console.log(props.row)
      console.log(shift)
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
    removePlacement(row) {
      this.$store.dispatch('removeUserPlacement', row)
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY, hh:mm a')
      } else {
        return null
      }
    },
    goBack() {
      router.go(-1)
    },
    addUser(item) {
      console.log(item)
      fb.userDaysCollection.add({
        userId: item.objectID,
        firstName: item.firstName,
        lastName: item.lastName,
        day: this.day,
        start: this.day,
        status: "available",
        fullName: item.firstName + ' ' + item.lastName,
      }).then(
        doc => {
          fb.userDaysCollection.doc(doc.id).update({
          created: fb.firestore.FieldValue.serverTimestamp(),
          id: doc.id, 
        })
      })
      setTimeout(() => {
        this.$state.query = ''
        // document
        // .querySelectorAll('.ais-SearchBox-input')
        // .forEach((e) => (e.value = ''))

      // clear all the hits
      // document.querySelectorAll('.ais-Hits-item').forEach((e) => e.remove())

      // also clear the hits from the component, otherwise subsequent searches throw exceptions
      // this.$refs.searchHits.state.hits = []
      }, 1000)
    },
    showTrash(p) {
    	fb.userDaysCollection.doc(p.row.id).update({showTrash: true})
    },
    hideTrash(p) {
    	fb.userDaysCollection.doc(p.row.id).update({showTrash: false})
    },
    deleteUserDay(p) {
    	fb.userDaysCollection.doc(p.id).delete()
    },
    deleteUser(userDay) {
    	fb.userDaysCollection.doc(userDay.id).update({
    		preferredEvent: null
    	})
    },
  },
  beforeDestroy () {
    this.day = null
    this.selectedStaff = null
    this.placeholder = null
    this.columns = null
    this.columns2 = null
    this.performingRequest = null
    this.activeUser = null
    this.newUser = null
    delete this.day
    delete this.selectedStaff
    delete this.placeholder
    delete this.columns
    delete this.columns2
    delete this.performingRequest
    delete this.activeUser
    delete this.newUser
    this.columns = null
    delete this.columns
    this.columns2 = null
    delete this.columns2
    this.$store.dispatch("clearDayState")
    console.log(this)
  }
}
</script>