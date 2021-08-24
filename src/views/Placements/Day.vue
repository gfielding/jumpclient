<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header mb-3" v-if="day">
        <h1>Staff Placements for {{day | moment("dddd, MMMM Do YYYY") }}</h1>
        <div class="flex align-center"> 
	        <button class="btn btn__flat mr-3" @click="exportAll()">export all</button>
	        <button class="btn btn__icon" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
        </div>
      </div>
      <div class="dashboard__container--body" v-if="day">
      	<div class="dashboard__container--body--col">
    			<form ref="form" @submit.prevent>
    				<div class="mb-3">
    					<!-- <label for="addedUser">Add User:</label>
    					<select v-model="user" id="venue" @change="addUser()">
                <option v-for="user in users" v-bind:value="user">
                  {{user.firstName}} {{user.lastName}}
                </option>
              </select> -->
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
    				</div>
    			</form>
      		<vue-good-table
              :columns="columns"
              :rows="orderedUsers"
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
            	<span v-else-if="props.column.field == 'state'">
            		<span v-if="(props.row)">
		              <span v-for="u in filteredInfo(props.row)">
		              	<span v-if="u && u.address && u.address.city && u.address.state" style="display:inline;">
		              		<span v-tooltip="u.address.city">{{u.address.state}}</span>
				            </span>
		              </span>
		            </span>
            	</span>
            	<span v-else-if="props.column.field == 'extras'">
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
											<!-- <span v-if="u && u.address && u.address.city && u.address.state" style="display:inline;">
			              		<button class="icon" v-tooltip="u.address.city + ', ' + u.address.state">
				                	<i class="fas fa-map-marker"></i>
				                </button>
				              </span> -->
				             <!--  <span v-for="client in u.blacklist" style="display:inline;">
		              			<button class="icon" v-tooltip="client.title">
				                	<i class="fas fa-exclamation-triangle" style="color:red;"></i>
				                </button>
		              		</span> -->
		              	</span>
		              

	              		<!-- <span v-if="u.fullyVaccinated == 'yes'" style="display:inline; margin-right: 1.5rem;">
			              			<i class="fas fa-syringe" style="color:#5cb85c;"></i>
			              		</span>
			              		<span v-if="u.fullyVaccinated == 'no'" style="display:inline; margin-right: 1.5rem;">
			              			<i class="fas fa-syringe" style="color:#d9534f;"></i>
			              		</span>
			              		<span v-if="!u.fullyVaccinated || u.fullyVaccinated == null" style="display:inline; margin-right: 1.5rem;">
			              			<i class="fas fa-syringe"  style="opacity:0.25;"></i>
			              		</span> -->

	              		<!-- <span v-if="u.contractorStatus == 'applied' || !u.contractorStatus" style="display:inline; margin-right: 1.5rem;">
				              		<button class="icon" v-tooltip="'C - ' + u.contractorStatus">
					                	<i class="fas fa-hammer"  style="opacity:0.25;"></i>
					                </button>
					              </span>

					              <span v-if="u.contractorStatus == 'payroll invitation'" style="display:inline; margin-right: 1.5rem;">
				              		<button class="icon" v-tooltip="'C - ' + u.contractorStatus">
					                	<i class="fas fa-hammer" style="color:#f0ad4e;"></i>
					                </button>
					              </span>

					              <span v-if="u.contractorStatus == 'hired contractor'" style="display:inline; margin-right: 1.5rem;">
				              		<button class="icon" v-tooltip="'C - ' + u.contractorStatus">
					                	<i class="fas fa-hammer" style="color:#5cb85c;"></i>
					                </button>
					              </span>

					              <span v-if="u.employeeStatus == 'hired employee'" style="display:inline; margin-right: 1.5rem;">
				              		<button class="icon" v-tooltip="'E - ' + u.employeeStatus">
					                	<i class="fas fa-user" style="color:#5cb85c;"></i>
					                </button>
					              </span>

					              <span v-if="u.employeeStatus == 'payroll invitation'" style="display:inline; margin-right: 1.5rem;">
				              		<button class="icon" v-tooltip="'E - ' + u.employeeStatus">
					                	<i class="fas fa-user" style="color:#f0ad4e;"></i>
					                </button>
					              </span>

					              <span v-if="u.employeeStatus == 'applied' || !u.employeeStatus" style="display:inline; margin-right: 1.5rem;">
				              		<button class="icon" v-tooltip="'E - ' + u.employeeStatus">
					                	<i class="fas fa-user"></i>
					                </button>
					              </span> -->


	              		

	              		<!-- <span style="display:inline; margin-right: 1.5rem;">
	              			<button class="icon" v-tooltip="'TIPS Certification'">
	              				<i class="fas fa-file-certificate" style="color:green;" v-if="u.certTips"></i>
			                	<i class="fas fa-file-certificate" v-if="!u.certTips" style="color:red;"></i>
			                </button>
	              		</span> -->
	              	
	              		

			              <!-- <v-popover v-if="u.skills && u.skills.length >= 1" style="display:inline;">
			              	<button class="icon" style="display:inline; margin-right: 1.5rem;">
			                	<i class="fas fa-briefcase"></i>
			                </button>
			                <template slot="popover">
			                	<span v-for="job in u.skills">{{job.title}} / </span>
  										</template>
			              </v-popover> -->

			              <!-- <router-link :to="'/users/' + u.id" style="display:inline; margin-right: 1.5rem;">
                      <i class="fas fa-external-link" style="color:mediumblue;"></i>
                    </router-link> -->



	              	</span>
								</span>
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

      	<div class="dashboard__container--body--col" style="background:transparent; padding:0;">
      		<div v-for="shift in dayShifts" :key="shift.id" style=" padding:1.6rem; background: white; margin-bottom:1.6rem;">
      			<div class="flex align-center justify-space-between">
      				<h2>{{shift.event}}</h2>
      				<!-- <router-link :to="'/shifts/' + shift.id">
      					<button class="btn btn__small btn__outlined">Open <i class="fas fa-external-link ml-2"></i></button>
      				</router-link> -->
      				<div>
	      				<button class="btn btn__flat mr-3" @click="exportStaff(shift)">export</button>
	      				<button class="btn btn__icon" @click="expand(shift)" v-if="shift.collapse"><i class="fas fa-chevron-up"></i></button>
	      				<button class="btn btn__icon" @click="collapse(shift)" v-if="!shift.collapse"><i class="fas fa-chevron-down"></i></button>
      				</div>
      			</div>
      			<transition name="fade">
	      			<div v-if="shift.collapse == true">
		      			<div class="pt-2">
		      				<h3 v-if="shift.name">{{shift.name}}</h3>
		      				<h4 v-if="shift.position.title">{{shift.position.title}}, 
		                <span v-if="shift.startTime" class="ml-2"> {{ [ shift.startTime, "HH:mm" ] | moment("hh:mm A") }}</span> - 
		                <span v-if="shift.endTime">{{ [ shift.endTime, "HH:mm" ] | moment("hh:mm A") }}</span>
		              </h4>

		              <button class="btn btn__flat chip mt-1">{{orderedPlacedUsers(shift.id).length}} / {{shift.staff}}</button>
		      			</div>
		      			<div class="pt-3" v-if="orderedUsers.length >= 1">
		      				<v-select
		      					label="fullName" 
		      					:options="orderedUsers"
		      					v-model="shift.selectedStaff"
		      					@input="assignShift(shift)"
		      					>
		      				</v-select>
		      			</div>
		      			<div class="pt-3">
		      				<vue-good-table
			              :columns="columns2"
			              :rows="orderedPlacedUsers(shift.id)"
				            >
				            <template slot="table-row" slot-scope="props">
				            	<span v-if="props.column.field == 'extras2'">
				            		<span v-if="props.row.note" style="display:inline; margin-right: 1.5rem;">
				            			<button class="icon" v-tooltip="props.row.note">
					            			<i class="far fa-sticky-note"></i>
					            		</button>
				            		</span>
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
					                (props.row.dayStatus == 'hired')
					              " style="display:inline; margin-right: 1.5rem;">
					                <button class="icon" v-tooltip="'cancel reservation'" @click="unreserveUser(props.row)">
					                	<i class="fas fa-calendar-check" style="color:green;"></i>
					                </button>
					              </span>
					              <span v-if="
					                (props.row.dayStatus == 'not requested')
					              " style="display:inline; margin-right: 1.5rem;">
					                <button class="icon" v-tooltip="'cancel cancellation'" @click="cancelNotRequestUser(props.row)">
					                	<i class="fas fa-calendar-times" style="color:red;"></i>
					                </button>
					              </span>

					              <span v-if="
					                (props.row)
					              " style="display:inline; margin-right: 1.5rem;">
					              	<span v-for="u in filteredInfo(props.row)">

					              		<span v-if="u.fullyVaccinated == 'yes'" style="display:inline; margin-right: 1.5rem;">
					              			<i class="fas fa-syringe" style="color:#5cb85c;"></i>
					              		</span>
					              		<span v-if="u.fullyVaccinated == 'no'" style="display:inline; margin-right: 1.5rem;">
					              			<i class="fas fa-syringe" style="color:#d9534f;"></i>
					              		</span>
					              		<span v-if="!u.fullyVaccinated || u.fullyVaccinated == null" style="display:inline; margin-right: 1.5rem;">
					              			<i class="fas fa-syringe" style="opacity:0.25;"></i>
					              		</span>

					              		<span v-if="u.contractorStatus == 'applied' || !u.contractorStatus" style="display:inline; margin-right: 1.5rem;">
						              		<button class="icon" v-tooltip="'C - ' + u.contractorStatus">
							                	<i class="fas fa-hammer"  style="opacity:0.25;"></i>
							                </button>
							              </span>

							              <span v-if="u.contractorStatus == 'payroll invitation'" style="display:inline; margin-right: 1.5rem;">
						              		<button class="icon" v-tooltip="'C - ' + u.contractorStatus">
							                	<i class="fas fa-hammer" style="color:#f0ad4e;"></i>
							                </button>
							              </span>

							              <span v-if="u.contractorStatus == 'hired contractor'" style="display:inline; margin-right: 1.5rem;">
						              		<button class="icon" v-tooltip="'C - ' + u.contractorStatus">
							                	<i class="fas fa-hammer" style="color:#5cb85c;"></i>
							                </button>
							              </span>

							              <span v-if="u.employeeStatus == 'hired employee'" style="display:inline; margin-right: 1.5rem;">
						              		<button class="icon" v-tooltip="'E - ' + u.employeeStatus">
							                	<i class="fas fa-user" style="color:#5cb85c;"></i>
							                </button>
							              </span>

							              <span v-if="u.employeeStatus == 'payroll invitation'" style="display:inline; margin-right: 1.5rem;">
						              		<button class="icon" v-tooltip="'E - ' + u.employeeStatus">
							                	<i class="fas fa-user" style="color:#f0ad4e;"></i>
							                </button>
							              </span>

							              <span v-if="u.employeeStatus == 'applied' || !u.employeeStatus" style="display:inline; margin-right: 1.5rem;">
						              		<button class="icon" v-tooltip="'E - ' + u.employeeStatus">
							                	<i class="fas fa-user"></i>
							                </button>
							              </span>


					              		<span v-for="client in u.blacklist" style="display:inline; margin-right: 1.5rem;">
					              			<button class="icon" v-tooltip="client.title">
							                	<i class="fas fa-exclamation-triangle" style="color:red;"></i>
							                </button>
					              		</span>

					              		<span style="display:inline; margin-right: 1.5rem;">
					              			<button class="icon" v-tooltip="'TIPS Certification'">
					              				<i class="fas fa-file-certificate" style="color:green;" v-if="u.certTips"></i>
							                	<i class="fas fa-file-certificate" v-if="!u.certTips" style="color:red;"></i>
							                </button>
					              		</span>
					              	
					              		<span v-if="u && u.address && u.address.city && u.address.state" style="display:inline; margin-right: 1.5rem;">
						              		<button class="icon" v-tooltip="u.address.city + ', ' + u.address.state">
							                	<i class="fas fa-map-marker"></i>
							                </button>
							              </span>

							              <v-popover v-if="u.skills && u.skills.length >= 1" style="display:inline;">
							              	<button class="icon" style="display:inline; margin-right: 1.5rem;">
							                	<i class="fas fa-briefcase"></i>
							                </button>
							                <template slot="popover">
							                	<span v-for="job in u.skills">{{job.title}} / </span>
				  										</template>
							              </v-popover>

							              
					              	</span>

												</span>


												<button v-if="props.row.dayStatus == 'hired' && props.row.status != 'assigned'" class="icon" v-tooltip="'lock shift'" @click="lockShift(props, shift)" style="display:inline; margin-right: 1.5rem;">
				                	<i class="fas fa-lock-open-alt"></i>
				                </button>

				                <button class="icon" v-if="props.row.dayStatus == 'hired' && props.row.status == 'assigned'" style="display:inline; margin-right: 1.5rem;">
				                	<i class="fas fa-lock-alt"></i>
				                </button>

												<button v-if="props.row.status == 'placed'" class="icon ml-4" v-tooltip="'remove'" @click="removePlacement(props.row)">
				                	<i class="fas fa-trash"></i>
				                </button>

				                <button v-if="props.row.status == 'assigned'" class="icon ml-4" v-tooltip="'remove'" @click="removeAssignment(props, shift)">
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


		
	</div>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'
import * as moment from 'moment'
import Loader from '@/components/Loader.vue'
import ExportService from "@/services/ExportService"
const fb = require('../../firebaseConfig.js')

export default {
  name: 'day',
  data() {
    return {
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
	        field: 'created',
	      },
	      {
	        field: 'state',
	        tdClass: 'text-center',
	        sortable: false,
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
	      {
	        label: '',
	        field: 'extras',
	        tdClass: 'text-center',
	        sortable: false,
	      },
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
	        label: '',
	        field: 'extras2',
	        tdClass: 'text-right',
	      },
	    ]
    }
  },
  computed: {
    ...mapState(['currentUser', 'dayShifts', 'availableUsers', 'dayUsers', 'users']),
    filteredUsers () {
      return this.dayUsers.filter(user => {
        return user.status == 'available'
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
      return this.filteredUsers.sort(compare);
    },
    filteredPlacedUsers () {
      return this.dayUsers.filter(user => {
        return ((user.status == 'placed') || (user.status == 'assigned'))
      })
    },
  },
  created () {
    if (this.day) {
      this.$store.dispatch("getDayShiftsState", this.day)
      this.$store.dispatch("getDayEventsState", this.day)
    }
    if (!this.users || this.users.length < 1) {
      this.$store.dispatch("getUsers")
	  }
  },
  components: {
    Loader
  },
  methods: {
  	expand(shift) {
  		shift.collapse = false
  		this.$store.dispatch("updateEventShift", shift)
  	},
  	collapse(shift) {
  		shift.collapse = true
  		this.$store.dispatch("updateEventShift", shift)
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
  		for (var key in this.availableUsers) {
  			exportItems.push([
  				this.availableUsers[key].firstName,
					this.availableUsers[key].lastName,
					this.availableUsers[key].email,
					this.availableUsers[key].phone,
					this.availableUsers[key].address.state,
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
      fb.usersCollection.doc(user.userId).get()
      .then(
        doc => {
          let dateObj = new Date(this.day);
          let month = dateObj.getUTCMonth() + 1;
          let day = dateObj.getUTCDate();
          let year = dateObj.getUTCFullYear();
          let newdate = month + "/" + day + "/" + year;
      		console.log(newdate)
      		console.log(user.id)
          fb.userDaysCollection.doc(user.id).update({
            dayStatus: 'hired',
            email: doc.data().email,
            phone: doc.data().phone,
            dateFormat: newdate
          })
        }
      )
    },
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
    	console.log(props.row)
    	console.log(shift)
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
          console.log(assignment)
          this.$store.dispatch("lockShift", assignment)
          fb.userDaysCollection.doc(props.row.id).update({status: "assigned", shift: shift.id})
        }
      )
      setTimeout(() => {
        // this.$store.dispatch("getDayShiftsState", this.day)
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
        return moment(postedDate).format('MMMM Do YYYY')
      } else {
        return null
      }
    },
    goBack() {
      router.go(-1)
    },
    addUser() {
      fb.userDaysCollection.add({
        userId: this.newUser.id,
        firstName: this.newUser.firstName,
        lastName: this.newUser.lastName,
        day: this.day,
        start: this.day,
        status: "available",
        fullName: this.newUser.firstName + ' ' + this.newUser.lastName,
      }).then(
        doc => {
          fb.userDaysCollection.doc(doc.id).update({
          created: fb.firestore.FieldValue.serverTimestamp(),
          id: doc.id, 
        })
      })
      setTimeout(() => {
        this.newUser = ''
      }, 1000)
    },
    showTrash(p) {
    	fb.userDaysCollection.doc(p.row.id).update({showTrash: true})
    },
    hideTrash(p) {
    	fb.userDaysCollection.doc(p.row.id).update({showTrash: false})
    },
    deleteUser(userDay) {
    	fb.userDaysCollection.doc(userDay.id).delete()
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
    this.$store.dispatch("clearDayState")
    console.log(this)
  }
}
</script>