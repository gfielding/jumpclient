<template>
	<div>
    <div class="dashboard__container pt-3">
      
      <Loader v-if="!event || !event.id" />
    	<div class="dashboard__container--body pt-3" v-if="event">

	      <div class="dashboard__container--body--col" style="overflow: auto;" v-if="event && event.venue && jobs">
	      	<div>
		    		<h4>Event Jobs</h4>
		    		<div class="mb-3">
	            <label for="pickDate">Choose Jobs:</label>
	            <v-select
	              class="mt-2"
	              label="title" 
	              :options="jobs"
	              taggable
	              multiple
	              v-model="event.venue.job"
	              >
	            </v-select>
	          </div>
	    			<div class="mb-3" v-if="event.venue.job && event.venue.job.length >= 1">
	            <div v-for="job in event.venue.job" class="mb-3 flex justify-space-between">
	              <input type="text" readonly v-model.trim="job.title" @change="updateJob()" />
	              <input class="ml-3" type="number" step=".01" placeholder="pay rate" v-model.trim="job.rate" @change="updateJob()" />
	              <input class="ml-3" type="text" placeholder="new label" v-model.trim="job.label" @change="updateJob()" />
	              <div class="ml-3">
		    					<label for="tipped">Tipped?</label>
		    					<input class="ml-3" type="checkbox" v-model="job.tipped" id="tipped" @change="updateJob()" />
		    				</div>
	              <!-- <button class="btn btn__accent btn__small ml-3">save</button> -->
	            </div>
	          </div>
          </div>
	    	</div>
	    	<div class="dashboard__container--body--col" style="overflow: auto;" v-if="event && event.venue">
	    		<div>
		    		<h4>Shift/Location Names</h4>
		    		<form ref="form" @submit.prevent>
		    			<label for="addname">Create New Shift or Location Name:</label>
		    			<v-select id="addname" label="title" taggable multiple push-tags v-model="event.venue.shiftNames" @input="submitName(value)" />

		    			<!-- <input type="text" v-model.trim="newName" placeholder="Cabana 1, Concessions Staff, etc." class="mb-3" /> -->
		    			<!-- <button class="btn btn__primary" @click="submitName()">Add</button> -->
		    		</form>
		    	</div>
	    	</div>
    	</div>
    	<hr>
     	<transition name="fade">
		    <div class="dashboard__container--body pt-3" style="justify-content: space-evenly;" v-if="event && event.venue && event.venue.job && event.venue.job.length > 0">
		    	<div class="dashboard__container--body--col" style="width:100%;">

			    	<div class="list">
			    		<h4>Create New Shift</h4>
			    		<span class="caption mb-3">*You can enter these shift defaults just as before, then override them per person when you place them if needed.</span>
	  					<div class="flex">
	  						<div>
	  							<label for="day">Shift Name:</label>
	  							<v-select
			              :options="event.venue.shiftNames"
			              v-model="newShift.name"
			              style="min-width: 180px;"
			              >
			            </v-select>
	  							<!-- <label for="name">Shift Name:</label>
			            <select v-model="newShift.name" id="name" style="min-width: 160px;" class="mb-3">
			              <option v-for="(name, index) in event.venue.shiftNames" :key="index" v-bind:value="name">
			              	<span v-if="name">{{name}}</span>
			              </option>
			            </select> -->
	  						</div>
	  						<div class="pl-3" v-if="event && event.days">
	  							<label for="day">Select day:</label>
	  							<v-select
			              label="title" 
			              :options="event.days"
			              v-model="newShift.day"
			              style="min-width: 180px;"
			              >
			            </v-select>
		            <!-- <label for="day">Select day:</label>
		            <select v-model="newShift.day" id="day" required>
		              <option v-for="(day, index) in event.days" :key="index" v-bind:value="day">
		                {{day}}
		              </option>
		            </select> -->
		          </div>
	  						<div class="pl-3">
	  							<label for="staff">Total Staff Requested:</label>
		            	<input type="number" v-model.trim="newShift.staffReqested" id="staff" />
	  						</div>
	  					</div>
	  					<div class="flex mb-3">
	  						<div>
	  							<label for="day">Set Default Job for Shift:</label>
	  							<v-select
			              label="title" 
			              :options="event.venue.job"
			              v-model="newShift.job"
			              style="min-width: 180px;"
			              >
			            </v-select>
			           <!--  <label for="job">Set Default Job for Shift:</label>
			            <select v-model="newShift.job" id="job">
			              <option v-for="(job, index) in event.venue.job" :key="index" v-bind:value="job">
			              	<span v-if="job.label">{{job.label}}</span>
			              	<span v-if="!job.label">{{job.title}}</span>
			              </option>
			            </select> -->
			          </div>
	  						<div class="pl-3">
		            <label for="start">Default Start Time:</label>
			            <input type="time" v-model.trim="newShift.start" id="start" />
			          </div>
			          <div class="pl-3">
			            <label for="end">Default End Time:</label>
			            <input type="time" v-model.trim="newShift.end" id="end" />
			          </div>

	  					</div>

	  					<div class="mb-3" style="max-width: 300px;">
	              <label for="rep">Required Certifications:</label>
	              <v-select
	                class="mt-2"
	                :options="certs"
	                v-model="newShift.certs"
	                multiple
	                >
	              </v-select>
	  					</div>

	  					<div class="mb-3">
		            <label for="details">Shift-Specific Details From Client:</label>
		            <textarea name="details" id="details" cols="30" rows="2" v-model.lazy="newShift.details" style="background: #efefef;"></textarea>
		          </div>

		          <div class="mb-3">
		            <label for="info">Shift Into to Email Staff:</label>
		            <textarea name="info" id="info" cols="30" rows="2" v-model.lazy="newShift.info" style="background: #efefef;"></textarea>
		          </div>
		          
		          <div>
		          <button :disabled="!newShift.staffReqested || !newShift.day || !newShift.name || event.cancelled" class="btn btn__success mt-2" @click="addNewShift()">Add Shift</button>
		          </div>
						</div>
					</div>
				</div>
		  </transition>
		  <hr>
		  <div class="dashboard__container--body">
		  	<div v-for="(eventShift, index) in eventShifts" :key="eventShift.id" class="dashboard__container--body--col" style="width:calc(100% - 3.2rem);">
		  		<div>
		  			<div class="flex">

			  				<div class="mb-3">
			            <label for="name">Shift Name:</label>
			            <input type="text" v-model.trim="eventShift.name" id="name"  />
			          </div>
			         <!--  <div class="mb-3 pr-3 pl-3">
				            <label for="location">Shift Location:</label>
				            <input type="text" v-model.trim="eventShift.location" id="location" />
				          </div> -->
			  				<!-- <div class="mb-3 pr-3 pl-3">
			            <label for="job">Select Job:</label>
			            <select v-model="eventShift.position" id="job">
			              <option v-for="(job, index) in event.venue.job" :key="index" v-bind:value="job">
			              	<span v-if="job.label">{{job.label}}</span>
			              	<span v-if="!job.label">{{job.title}}</span>
			              </option>
			            </select>

			            <input v-if="eventShift.position.label" type="text" v-model="eventShift.position.label" readonly />
			            <input v-if="!eventShift.position.label" type="text" v-model="eventShift.position.title" readonly />
			          </div> -->
			          <div class="mb-3 pl-3">
			          	<label for="day">Select day:</label>
			            <v-select
			              label="title" 
			              :options="event.days"
			              v-model="eventShift.day"
			              style="min-width: 180px;"
			              >
			            </v-select>
			          </div>
			          <div class="mb-3 pl-3">
			            <label for="staff">Total Staff Requested:</label>
			            <input type="number" v-model.trim="eventShift.staff" id="staff"  />
			          </div>
			          <div style="margin: auto 1rem; text-align: right; width:100%;">
				          <button v-if="(!eventShift.showDelete || eventShift.showDelete == false)" class="btn btn__primary ml-2" @click="updateShift(eventShift)" :disabled="event.cancelled">
				          	Update
				          	<transition name="fade">
			                <span class="ml-2" v-if="performingRequest">
			                <i class="fa fa-spinner fa-spin"></i>
			                </span>
			              </transition>
				          </button>
				          <button v-if="(!eventShift.showDelete || eventShift.showDelete == false)" class="btn btn__danger ml-2" @click="showDeleteShift(eventShift)">Delete</button>
				          <button v-if="eventShift.showDelete == true" class="btn btn__primary ml-2" @click="cancelDeleteShift(eventShift)">cancel</button>
				          <button v-if="eventShift.showDelete == true" class="btn btn__danger ml-2" @click="deleteShift(eventShift)">Yes Actually Delete</button>
			          </div>
			        </div>
			        <div class="flex mb-3">

	  						<div v-if="event.venue && event.venue.job && event.venue.job.length > 0">
	  							<label for="day">Set Default Job for Shift:</label>
	  							<v-select
			              label="title" 
			              :options="event.venue.job"
			              v-model="eventShift.position"
			              style="min-width: 180px;"
			              >
			            </v-select>

			            <!-- <label for="job">Default Job for Shift:</label>
			            <select v-model="eventShift.position" id="job">
			              <option v-for="(job, index) in event.venue.job" :key="index" v-bind:value="job">
			              	<span v-if="job.label">{{job.label}}</span>
			              	<span v-if="!job.label">{{job.title}}</span>
			              </option>
			            </select> -->

			           <!--  <input readonly v-model="eventShift.position.label || eventShift.position.title" /> -->
			            <!-- <select v-model="eventShift.job" id="job">
			              <option v-for="(job, index) in event.venue.job" :key="index" v-bind:value="job">
			              	<span v-if="job.label">{{job.label}}</span>
			              	<span v-if="!job.label">{{job.title}}</span>
			              </option>
			            </select> -->
			          </div>
	  						<div class="pl-3">
		            <label for="start">Default Start Time:</label>
			            <input type="time" v-model.trim="eventShift.startTime" id="start" />
			          </div>
			          <div class="pl-3">
			            <label for="end">Default End Time:</label>
			            <input type="time" v-model.trim="eventShift.endTime" id="end" />
			          </div>

	  					</div>
	  					<div class="mb-3" style="max-width: 300px;">
	              <label for="rep">Required Certifications:</label>
	              <v-select
	                class="mt-2"
	                :options="certs"
	                v-model="eventShift.certs"
	                multiple
	                >
	              </v-select>
	  					</div>
			        <div class="mb-3">
		            <label for="details">Details from Client:</label>
		            <textarea name="details" id="details" cols="30" rows="2" v-model.lazy="eventShift.details" style="background: #efefef;"></textarea>
		          </div>
		          <div>
		            <label for="info">Shift Info for Emails:</label>
		            <textarea name="info" id="info" cols="30" rows="2" v-model.lazy="eventShift.info" style="background: #efefef;"></textarea>
		          </div>

			          <!-- <div class="mb-3 pr-3 pl-3">
			            <label for="start">Start Time:</label>
			            <input type="time" v-model.trim="eventShift.startTime" id="start"   />
			          </div>
			          <div class="mb-3 pr-3 pl-3">
			            <label for="end">End Time:</label>
			            <input type="time" v-model.trim="eventShift.endTime" id="end"  />
			          </div> -->
			          
			  			</div>

				</div>
		  </div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import ShiftNote from '@/components/Placements/ShiftNote.vue'
import { VueEditor } from "vue2-editor";
import router from '@/router'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'eventshifts',
  props: ['eventInfo'],
  components: {
    VueEditor,
    Loader,
    ShiftNote
  },
  data() {
    return {
      performingRequest: false,
      showNewNote: false,
      newShift: {},
      newName: '',
      certs: ['Food Hander', 'Alcohol Awareness']
    }
  },
  created () {
  	// this.$store.dispatch("getEventFromId", this.$route.params.id);
    this.$store.dispatch("getEventShiftsId", this.$route.params.id);
  },
  mounted () {
    if (!this.jobs || this.jobs.length < 1) {
      this.$store.dispatch("getJobsState")
    }
   //  if (this.eventShifts && this.eventShifts.length > 1) {
	  //  	this.emptyCheck(this.eventShifts)
	  // }
  },
  computed: {
    ...mapState(['jobs', 'eventShifts']),
    event() {
      return this.eventInfo
    },
    eventId() {
    	return this.eventInfo.id
    },
    groupIDs() {
    	let idsArray = []
    	this.event.groups.forEach(group => {
    		idsArray.push(group.id)
    	})
    	return idsArray
    }
  },
  methods: {
  	// emptyCheck(row) {
	  // 		fb.assignmentsCollection.where("shiftId", "==", row.id).get().then((querySnapshot) => {
	  // 			querySnapshot.forEach((doc) => {
	  // 				if (doc.exists) {
	  // 					console.log("exists")
	  // 					return row.disabled = true
	  // 				} else {
	  // 					console.log("not exists")
	  // 					return false
	  // 				}
		 //  		})
	  // 		})
  	// },
  	goBack() {
      router.go(-1)
    },
    updateJob() {
      console.log(event)
      let event = this.event
      this.$store.dispatch('updateEvent', event)
    },
    updateEvent(){
      let event = this.event
      console.log(event)
      this.$store.dispatch('updateEvent', event)
    },
    submitName() {
    	let event = this.event
    	this.$store.dispatch('updateEvent', event)
    	// let newName = this.newName
    	// this.event.venue.shiftNames.push(newName)
    	// this.newName = ''
    },
    addNewShift () {
      let shift = {
        position: this.newShift.job || { title: null},
        startTime: this.newShift.start || null,
        endTime: this.newShift.end || null,
        name: this.newShift.name || null,
        certs: this.newShift.certs || null,
        // location: this.newShift.location || null,
        staff: this.newShift.staffReqested,
        eventId: this.event.id,
        event: this.event.title,
        day: this.newShift.day,
        groups: this.event.groups,
        groupIds: this.groupIDs,
        location: this.event.venue.address.city + ', ' +  this.event.venue.address.state,
        venue: this.event.venue.title,
      }
      console.log(shift)
      fb.shiftsCollection.add(shift)
      .then(
        doc => {
          fb.shiftsCollection.doc(doc.id).update({
            id: doc.id, 
          })
        }
      )
      this.newShift = {}
      this.$store.dispatch("getEventShifts", this.eventId)
    },
    updateShift(eventShift) {
    	this.performingRequest = true
    	eventShift.location = this.event.venue.address.city + ', ' +  this.event.venue.address.state;
    	eventShift.venue = this.event.venue.title;
    	eventShift.groupIds = this.groupIDs
    	this.$store.dispatch("updateEventShift", eventShift)
    	setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    showDeleteShift(eventShift) {
    	eventShift.showDelete = true
    	this.$store.dispatch("updateEventShift", eventShift)
    },
    cancelDeleteShift(eventShift) {
    	eventShift.showDelete = false
    	this.$store.dispatch("updateEventShift", eventShift)
    },
    deleteShift(eventShift) {
      console.log(eventShift)
      this.$store.dispatch("deleteShift", eventShift.id)
    },
    placements() {
      let url = `/eventplacements/` + this.$route.params.id
      router.push(url)
    },
    sheets() {
      let url = `/events/` + this.$route.params.id + `/timesheets`
      router.push(url)
    },
    editEvent() {
      let url = `/events/` + this.$route.params.id
      router.push(url)
    },
    checkIn() {
      let url = `/events/` + this.$route.params.id + `/checkin`
      router.push(url)
    },
    files() {
      let url = `/events/` + this.$route.params.id + `/files`
      router.push(url)
    },
  },
  beforeDestroy () {
  	this.performingRequest = null
  	this.newShift = null
  	delete this.performingRequest
  	delete this.newShift
  	this.$store.dispatch("clearJobsState")
    this.$store.dispatch("clearEventState")
    this.$store.dispatch("clearEventShifts")
  	this.$store.dispatch('clearErrors')
  	console.log(this)
  }
}
</script>
