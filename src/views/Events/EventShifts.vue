<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <div class="flex align-center">
          <h1>{{eventInfo.title}} Event Shifts</h1>
          <button class="btn btn__large btn__danger ml-5" v-if="eventInfo && eventInfo.cancelled">
            Cancelled
          </button>
        </div>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>


      
      <Loader v-if="!eventInfo || !eventInfo.id" />
    	<div class="dashboard__container--body pt-3" v-if="event">
    		<div class="dashboard__container--body--col">
	    		<form ref="form" @submit.prevent style="width:100%;">
	    			<div class="mb-3">
	            <label for="eventShiftsDetails">Shifts Details:</label>
	            <vue-editor id="eventShiftsDetails" v-model="event.shiftsDetails"></vue-editor>
	          </div>
	          <button class="btn btn__primary mt-3 ml-1" @click="updateEvent" :disabled="eventInfo.cancelled">Save</button>
	        </form>
	      </div>
	      <div class="dashboard__container--body--col" style="max-height: 48vh; overflow: auto;">
	    		<h2>Choose Jobs</h2>
    			<div v-for="(job, index) in jobs" :key="job.id">
    				<input type="checkbox" :id="index" :value="job" v-model="event.jobs" @change="updateEvent()">
						<label :for="job.title" class="ml-3">{{job.title}}</label>
    			</div>
	    	</div>
    	</div>
    	<hr>
     	<transition name="fade">
		    <div class="dashboard__container--body pt-3" style="justify-content: space-evenly;" v-if="event && event.jobs && event.jobs.length > 0">
		    	<div class="dashboard__container--body--col" style="width:calc(100% - 3.2rem);">
			    	<div class="list">
			  			<ul>
			  				<li class="align-center">
			  					<div class="mb-3 pr-3 pl-3">
				            <label for="name">Shift Name:</label>
				            <input type="text" v-model.trim="newShift.name" id="name" />
				          </div>
				          <div class="mb-3 pr-3 pl-3">
				            <label for="location">Shift Location:</label>
				            <input type="text" v-model.trim="newShift.location" id="location" />
				          </div>
						    	<div class="mb-3 pr-3 pl-3">
				            <label for="job">Select Job:</label>
				            <select v-model="newShift.job" id="job">
				              <option v-for="(job, index) in event.jobs" :key="index" v-bind:value="job">
				                {{job.title}}
				              </option>
				            </select>
				          </div>
				          <div class="mb-3 pr-3 pl-3">
				            <label for="day">Select day:</label>
				            <select v-model="newShift.day" id="day" required>
				              <option v-for="(day, index) in event.days" :key="index" v-bind:value="day">
				                {{day}}
				              </option>
				            </select>
				          </div>
				          <div class="mb-3 pr-3 pl-3">
				            <label for="staff">Staff Requested:</label>
				            <input type="number" v-model.trim="newShift.staffReqested" id="staff" />
				          </div>
				          <div class="mb-3 pr-3 pl-3">
				            <label for="start">Start Time:</label>
				            <input type="time" v-model.trim="newShift.start" id="start" />
				          </div>
				          <div class="mb-3 pr-3 pl-3">
				            <label for="end">End Time:</label>
				            <input type="time" v-model.trim="newShift.end" id="end" />
				          </div>
				          <button class="btn btn__primary ml-2" @click="addNewShift" :disabled="eventInfo.cancelled">Add</button>
						    
							  </li>
							</ul>
						</div>
					</div>
				</div>
		  </transition>
		  <hr>
		  <div class="dashboard__container--body">
		  	<div class="dashboard__container--body--col" style="width:calc(100% - 3.2rem);">
			  	<div class="list">
			  		<ul>
			  			<li v-for="(eventShift, index) in eventShifts" :key="eventShift.id" class="align-center">
			  				<div class="mb-3 pr-3 pl-3">
			            <label for="name">Shift Name:</label>
			            <input type="text" v-model.trim="eventShift.name" id="name"  />
			          </div>
			          <div class="mb-3 pr-3 pl-3">
				            <label for="location">Shift Location:</label>
				            <input type="text" v-model.trim="eventShift.location" id="location" />
				          </div>
			  				<div class="mb-3 pr-3 pl-3">
			            <label for="job">Select Job:</label>
			            <input type="text" v-model="eventShift.position.title" readonly />
			          </div>
			          <div class="mb-3 pr-3 pl-3" style="min-width: 140px;">
			            <label for="day">Select day:</label>
			            <select v-model="eventShift.day" id="day" >
			              <option v-for="(day, index) in event.days" :key="index" v-bind:value="day">
			                {{eventShift.day}}
			              </option>
			            </select>
			          </div>
			          <div class="mb-3 pr-3 pl-3">
			            <label for="staff">Staff Requested:</label>
			            <input type="number" v-model.trim="eventShift.staff" id="staff"  />
			          </div>
			          <div class="mb-3 pr-3 pl-3">
			            <label for="start">Start Time:</label>
			            <input type="time" v-model.trim="eventShift.startTime" id="start"   />
			          </div>
			          <div class="mb-3 pr-3 pl-3">
			            <label for="end">End Time:</label>
			            <input type="time" v-model.trim="eventShift.endTime" id="end"  />
			          </div>
			          <button class="btn btn__primary ml-2" @click="updateShift(eventShift)" :disabled="eventInfo.cancelled">
			          	Update
			          	<transition name="fade">
		                <span class="ml-2" v-if="performingRequest">
		                <i class="fa fa-spinner fa-spin"></i>
		                </span>
		              </transition>
			          </button>
			          <button class="btn btn__danger ml-2" @click="deleteShift(eventShift)">Delete</button>
			  			</li>
			  		</ul>
			  	</div>
		  	</div>
		  </div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import { VueEditor } from "vue2-editor";
import router from '@/router'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'eventshifts',
  components: {
    VueEditor,
    Loader
  },
  data() {
    return {
      performingRequest: false,
      newShift: {},
    }
  },
  created () {
    this.$store.dispatch("getEventFromId", this.$route.params.id);
  },
  async mounted () {
    if (!this.jobs || this.jobs.length < 1) {
      this.$store.dispatch("getJobsState")
    }
   //  if (this.eventShifts && this.eventShifts.length > 1) {
	  //  	this.emptyCheck(this.eventShifts)
	  // }
  },
  computed: {
    ...mapState(['eventInfo', 'jobs', 'eventShifts']),
    event() {
      return this.eventInfo
    },
    eventId() {
    	return this.eventInfo.id
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
    updateEvent(){
      let event = this.event
      console.log(event)
      this.$store.dispatch('updateEvent', event)
    },
    addNewShift () {
      let shift = {
        position: this.newShift.job || { title: null},
        startTime: this.newShift.start || null,
        endTime: this.newShift.end || null,
        name: this.newShift.name,
        location: this.newShift.location,
        staff: this.newShift.staffReqested,
        eventId: this.event.id,
        event: this.event.title,
        day: this.newShift.day
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
    	this.$store.dispatch("updateEventShift", eventShift)
    	setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    deleteShift(eventShift) {
      console.log(eventShift)
      this.$store.dispatch("deleteShift", eventShift.id)
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
  }
}
</script>
