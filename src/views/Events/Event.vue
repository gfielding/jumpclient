<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Edit Event</h1>
        <div class="flex align-center">
          <button class="btn btn__outlined mr-3" @click="shifts()">Event Shifts</button>
          <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
        </div>
        
      </div>
      <form ref="form" @submit.prevent>
        <Loader v-if="!event" />
      	<div class="dashboard__container--body" v-if="event">
      		<div class="dashboard__container--body--col">

    				<div class="mb-3">
    					<label for="eventName">Event Name:</label>
    					<input type="text" v-model.trim="event.title" id="eventName" required />
    				</div>

            <div class="mb-3">
              <label for="eventSlug">Event Slug:</label>
              <input type="text" v-model.trim="event.slug" id="eventSlug" required />
            </div>

    				<div class="mb-3">
    					<label for="eventPublished">Published:</label>
    					<input type="checkbox" v-model.trim="event.published" id="eventPublished" class="ml-3" />
    				</div>
          </div>
          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="eventDescription">Description:</label>
              <vue-editor id="eventDescription" v-model="event.description" required></vue-editor>
            </div>
          </div>
          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="multiDay">Multiple Days:</label>
              <input type="checkbox" v-model.trim="multiDay" id="multiDay" class="ml-3" />
            </div>

            <transition name="fadeStop">
              <div class="mb-3" v-if="multiDay">
                <label for="startDate">Start Date:</label>
                <input type="date" v-model.trim="event.startDate"  id="startDate"  />
              </div>
            </transition>

            <transition name="fadeStop">
              <div class="mb-3" v-if="multiDay">
                <label for="endDate">End Date:</label>
                <input type="date" v-model.trim="event.endDate"  id="endDate"  />
              </div>
            </transition>

            <transition name="fadeStop">
              <div class="mb-3" v-if="!multiDay">
                <label for="Date">Date:</label>
                <input type="date" v-model.trim="event.startDate"  id="Date"  />
              </div>
            </transition>

          </div>
          <div class="dashboard__container--body--col">

            <h3>Days to Staff</h3>
            <transition name="fadeStop">
              <div class="mb-2 mt-2 flex" v-if="event.days && event.days.length >= 1">
                <button class="chip mr-2" v-for="(day, index) in event.days" :key="day" @click="deleteDay(index)">{{day}} <i class="far fa-times-circle ml-2"></i></button>
              </div>
            </transition> 
            <transition name="fadeStop">
              <div class="mb-3" v-if="event.startDate">
                <label for="pickDate">Choose Date:</label>
                <input type="date" v-model.trim="day" id="pickDate" @change="addDay()" />
              </div>
            </transition>
          </div>

          <div class="dashboard__container--body--col">

            <h3>Jobs to Staff</h3>
            <transition name="fadeStop">
              <div class="mb-2 mt-2 flex" v-if="event.jobs && event.jobs.length >= 1">
                <button class="chip mr-2" v-for="(job, index) in event.jobs" :key="job.id" @click="deleteJob(index)">{{job.title}} <i class="far fa-times-circle ml-2"></i></button>
              </div>
            </transition> 
            <transition name="fadeStop">
              <div class="mb-3">
                <label for="pickDate">Choose Jobs:</label>
                <select v-model="job" id="venue" @change="addJob()">
                  <option v-for="job in jobs" v-bind:value="job">
                    {{job.title}}
                  </option>
                </select>
              </div>
            </transition>
          </div>


          <div class="dashboard__container--body--col">

            <div class="mb-3" v-if="venues.length > 1">
              <label for="venue">Venue: <span v-if="event.venue && event.venue.title">{{event.venue.title}}</span> - (updates on change)</label>
              <select v-model="event.venue" id="venue" required @change="updateVenue()"> 
                <option v-for="venue in venues" v-bind:value="venue">
                  {{venue.title}}
                </option>
              </select>
            </div>

          </div>
          <div class="dashboard__container--body--col">

            <div class="mb-3" v-if="clients.length >= 1">
              <label for="client">Client:</label>
              <select v-model="event.client" id="client" required>
                <option v-for="client in clients" v-bind:value="client">
                  {{client.title}}
                </option>
              </select>
            </div>

          </div>
          

      		<div class="dashboard__container--body--col">
            <div class="flex flex-column align-center">
              <div class="event-wrapper" :style="{ backgroundImage: 'url(' + backgroundUrl + ')' }">
                <croppa 
                v-model="croppa"
                :prevent-white-space="true"
                :width="300"
                :height="100"
                accept=".jpeg,.png,.jpg,.svg"
                :file-size-limit="2048000"
                :quality="6"
                :placeholder="'Upload Image'"
                placeholder-color="white"
                initial-size="cover"
                :remove-button-size="32"
                @file-size-exceed="onFileSizeExceed"
                @file-type-mismatch="onFileTypeMismatch"
              >
              </croppa>
              </div>
              <p class="caption mt-3">jpg or png file. 2MB max</p>
            </div>
          </div>
          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="attire">Attire:</label>
              <textarea name="attire" id="attire" cols="30" rows="2" v-model="event.attire"></textarea>
            </div>
          </div>
          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="pay">Pay:</label>
              <textarea name="pay" id="pay" cols="30" rows="2" v-model="event.pay"></textarea>
            </div>
          </div>
          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="checkin">Check-In Details:</label>
              <textarea name="checkin" id="checkin" cols="30" rows="2" v-model="event.checkin"></textarea>
            </div>

          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="parking">Parking Details:</label>
              <textarea name="parking" id="parking" cols="30" rows="2" v-model="event.parking"></textarea>
            </div>
          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="camping">Camping Details:</label>
              <textarea name="camping" id="camping" cols="30" rows="2" v-model="event.camping"></textarea>
            </div>
          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="creds">Credentials Details:</label>
              <textarea name="creds" id="creds" cols="30" rows="2" v-model="event.creds"></textarea>
            </div>
          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="covid">COVID Requirements:</label>
              <textarea name="covid" id="covid" cols="30" rows="2" v-model="event.covid"></textarea>
            </div>
          </div>


          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="notes">Additional Notes:</label>
              <textarea name="notes" id="notes" cols="30" rows="2" v-model="event.notes"></textarea>
            </div>
          </div>
          <div class="dashboard__container--body--col">
            <button class="btn btn__outlined btn__large" @click="updateStaff()">
              Update Staff
              <transition name="fade">
                <span class="ml-2" v-if="performingRequest2">
                <i class="fa fa-spinner fa-spin"></i>
                </span>
              </transition>
            </button>
            <div class="mt-2">
              <span v-if="event.updateStaffSent" class="caption">
              Last Sent: {{event.updateStaffSent.toDate() | moment("MMMM Do YYYY, h:mm a") }}
            </span>
            </div>
          </div>

          <div class="dashboard__container--body--col" style="background: transparent;">
            <div class="flex justify-space-between">
              <button class="btn btn__primary btn__large" @click="updateEvent()">
              Update Event
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>
              <button class="btn btn__dark" @click="deleteEvent()">delete</button>
            </div>
      		</div>
      	</div>
      </form>
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
  name: 'event',
  data: () => ({
    croppa: {},
    day:'',
    job: '',
    multiDay: false,
    performingRequest: false,
    performingRequest2: false,
  }),
  components: {
    VueEditor,
    Loader
  },
  created () {
    this.$store.dispatch("getEventFromId", this.$route.params.id);
    if (!this.venues || this.venues.length < 1) {
      this.$store.dispatch("getVenues")
    }
    if (!this.clients || this.clients.length < 1) {
      this.$store.dispatch("getClients")
    }
    if (!this.jobs || this.jobs.length < 1) {
      this.$store.dispatch("getJobsState")
    }
  },
  computed: {
    ...mapState(['eventInfo', 'venues', 'clients', 'jobs']),
    event() {
      return this.eventInfo
    },
    backgroundUrl() {
      return this.eventInfo.photoUrl || 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/stadium.png?alt=media&token=89f2362c-d1bc-4338-a837-fad1d664c51d'
    },
  },
  methods: {
    onFileTypeMismatch(file) {
      alert('Invalid file type. Please choose a jpeg or png file.')
    },
    onFileSizeExceed(file) {
      alert('Please choose a file smaller than 2MB')
    },
    goBack() {
      router.go(-1)
    },
    addDay() {
      let event = this.event
      event.days.push(this.day)
      this.day = ''
      this.$store.dispatch('updateEvent', event)
    },
    addJob() {
      let event = this.event
      event.jobs.push(this.job)
      this.job = ''
      this.$store.dispatch('updateEvent', event)
    },
    deleteDay(index) {
      let event = this.event
      event.days.splice(index, 1)
      this.$store.dispatch('updateEvent', event)
    },
    deleteJob(index) {
      let event = this.event
      event.jobs.splice(index, 1)
      this.$store.dispatch('updateEvent', event)
    },
    shifts() {
      let url = `/events/` + this.$route.params.id + `/shifts`
      router.push(url)
    },
    deleteEvent() {
      let event = this.eventInfo
      this.$store.dispatch('deleteEvent', event.id)
      let url = `/events`
      router.push(url)
    },
    updateVenue() {
      let event = this.event
      event.venueId = this.event.venue.id
      this.$store.dispatch('updateEventVenue', event)
    },
    updateStaff() {
      let event = this.event
      this.$store.dispatch('updateEventStaff', event)
    },
    updateEvent() {
      this.performingRequest = true
    	let event = this.event
      let croppa = this.croppa
      let store = this.$store
      if (croppa.hasImage()) {
        croppa.generateBlob(
          blob => {
            let croppaURL
            let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
            let picRef = fb.storageRef.child('eventImages/' + rand)
            picRef.put(blob).then((snap) => {
              picRef.getDownloadURL().then(function(croppaURL) {
                console.log('File available at', croppaURL)
                event.photoUrl = croppaURL
                store.dispatch('updateEvent', event)
              })
            })
          }
        )
        setTimeout(() => {
          this.performingRequest = false
          croppa.remove()
          let url = `/events`
          router.push(url)
        }, 5000)
      } else {
        console.log(event)
        this.$store.dispatch('updateEvent', event)
        setTimeout(() => {
          croppa.remove()
          this.performingRequest = false
          let url = `/events`
          router.push(url)
        }, 2000)
      }
    }
  },
  beforeDestroy () {
    this.croppa = null
    this.multiDay = null
    this.performingRequest = null
    this.performingRequest2 = null
    this.day = null
    delete this.day
    delete this.croppa
    delete this.multiDay
    delete this.performingRequest
    delete this.performingRequest2
  	this.$store.dispatch('clearErrors')
  }
}
</script>