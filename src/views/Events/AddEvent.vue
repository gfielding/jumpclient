<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Add Event</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <form ref="form" @submit.prevent>
      	<div class="dashboard__container--body">
      		<div class="dashboard__container--body--col">

    				<div class="mb-3">
    					<label for="eventName">Event Name:</label>
    					<input type="text" v-model.trim="event.title" id="eventName" required />
    				</div>
    				<div class="mb-3">
    					<label for="eventPublished">Published:</label>
    					<input type="checkbox" v-model.trim="event.published" id="eventPublished" class="ml-3" />
    				</div>
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
                <v-select
                  class="mt-2"
                  label="title" 
                  :options="jobs"
                  v-model="job"
                  @input="addJob()"
                  >
                </v-select>
              </div>
            </transition>
          </div>


          <div class="dashboard__container--body--col">

            <div class="mb-3" v-if="venues.length > 1">
              <label for="venue">Venue:</label>
              <v-select
                class="mt-2"
                label="title" 
                :options="venues"
                v-model="event.venue"
                @input="updateVenue()"
                >
              </v-select>
            </div>

          </div>
          <div class="dashboard__container--body--col">

            <div class="mb-3" v-if="clients.length >= 1">
              <label for="client">Client:</label>
              <v-select
                class="mt-2"
                label="title" 
                :options="clients"
                v-model="event.client"
                >
              </v-select>
            </div>

          </div>
          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="checkin">Check-In Details:</label>
              <vue-editor id="checkin" v-model="event.checkin"></vue-editor>
            </div>

      		</div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="parking">Parking Details:</label>
              <vue-editor id="parking" v-model="event.parking"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="camping">Camping Details:</label>
              <vue-editor id="camping" v-model="event.camping"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="creds">Credentials Details:</label>
              <vue-editor id="creds" v-model="event.creds"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="covid">COVID Requirements:</label>
              <vue-editor id="covid" v-model="event.covid"></vue-editor>
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

            <!-- <div class="mb-3 mt-5">
              <label for="venueImage">Use Venue Image Instead:</label>
              <input type="checkbox" v-model.trim="event.useVenueImage" id="venueImage" class="ml-3" />
            </div> -->

          </div>
          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="attire">Attire:</label>
              <vue-editor id="attire" v-model="event.attire"></vue-editor>
            </div>

            </div>
          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="pay">Pay:</label>
              <vue-editor id="pay" v-model="event.pay"></vue-editor>
            </div>

            </div>
          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="notes">Additional Notes:</label>
              <vue-editor id="notes" v-model="event.notes"></vue-editor>
            </div>
            </div>
          <div class="dashboard__container--body--col">
            <button class="btn btn__primary btn__large" @click="addEvent()">
              Add Event
              <transition name="fade">
                <span class="ml-2" v-if="performingRequest">
                <i class="fa fa-spinner fa-spin"></i>
                </span>
              </transition>
            </button>
      		</div>
      	</div>
      </form>
    </div>
	</div>
</template>

<script>
import * as moment from 'moment'
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import { VueEditor } from "vue2-editor";
import router from '@/router'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'addevent',
  data: () => ({
    event: {
      days:[],
      jobs:[],
      published: true,
    },
    croppa: {},
    day:'',
    job:'',
    multiDay: false,
    performingRequest: false,
  }),
  components: {
    VueEditor,
    Loader
  },
  created () {
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
    ...mapState(['venues', 'clients', 'jobs']),
    backgroundUrl() {
      return this.event.photoUrl || 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/stadium.png?alt=media&token=89f2362c-d1bc-4338-a837-fad1d664c51d'
    },
    year() {
      return moment(this.event.startDate).format('YYYY')
    },
    month() {
      return moment(this.event.startDate).format('M')
    },
    day() {
      return moment(this.event.startDate).format('D')
    },
    slug() {
      if (this.event.title && this.year) {
        return this.event.title.replace(/[^\w ]+/g,'').replace(/ +/g,'-').toLowerCase() + `-` + this.month + `-` + this.day + `-` + this.year
      }
    }
  },
  methods: {
    onFileTypeMismatch(file) {
      alert('Invalid file type. Please choose a jpeg or png file.')
    },
    onFileSizeExceed(file) {
      alert('Please choose a file smaller than 2MB')
    },
    formatDate(q) {
      if(q) {
        console.log(q)
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM')
      } else {
        return null
      }
    },
    addDay() {
      let event = this.event
      let day = this.day
      event.days.push(day)
      day = ''
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
    addEvent() {
      this.performingRequest = true
    	let event = this.event
      let croppa = this.croppa
      let store = this.$store
      let slug = this.slug
      if (croppa.hasImage()) {
        croppa.generateBlob(
          blob => {
            let croppaURL
            let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
            let picRef = fb.storageRef.child('eventImages/' + rand)
            picRef.put(blob).then((snap) => {
              picRef.getDownloadURL().then(function(croppaURL) {
                console.log('File available at', croppaURL)
                event = event
                event.photoUrl = croppaURL
                event.slug = slug
                store.dispatch('addEvent', event)
              })
            })
          }
        )
        setTimeout(() => {
          this.performingRequest = false
          event = {}
          croppa.remove()
          let url = `/events`
          router.push(url)
        }, 5000)
      } else {
        console.log(event)
        event.slug = slug
        store.dispatch('addEvent', event)
        setTimeout(() => {
          this.performingRequest = false
          event = {}
          let url = `/events`
          router.push(url)
        }, 2000)
      }
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.event = null
    this.croppa = null
    this.day = null
    delete this.day
    this.multiDay = null
    this.performingRequest = null
    delete this.event
    delete this.croppa
    delete this.multiDay
    delete this.performingRequest
  	this.$store.dispatch('clearErrors')
  }
}
</script>