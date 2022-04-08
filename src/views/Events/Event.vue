<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <div class="flex align-center">
          <h1>Edit Event</h1>
          <button class="btn btn__large btn__success ml-5" v-if="event && event.published" :disabled="event.cancelled">
            Published
          </button>
          <button class="btn btn__large btn__warning ml-5" v-if="event && !event.published" :disabled="event.status == 'cancelled'">
            Draft
          </button>
          <button class="btn btn__large btn__danger ml-5" v-if="event && event.status == 'cancelled'">
            Cancelled
          </button>
        </div>
        <div class="flex align-center">
          <button class="btn btn__outlined mr-3" @click="venueSync()">Sync Venue Details</button>
          <router-link :to="{name: 'eventtimesheets'}">
          <button class="btn btn__outlined mr-3" @click="sheets()">Timesheets</button>
          </router-link>
          <button class="btn btn__outlined mr-3" @click="shifts()">Event Shifts</button>
          <button class="btn btn__outlined mr-3" @click="placements()">Event placements</button>
          <button class="btn btn__flat" @click="goBack()"><i class="fas fa-arrow-left fa-2x"></i></button>
        </div>
      </div>
      <form ref="form" @submit.prevent>
        <Loader v-if="!eventInfo || !eventInfo.id" />
      	<div class="dashboard__container--body mt-3" v-if="eventInfo">
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

            <div class="mb-3" v-if="event && event.venue">
              <label for="venueVisibility">Vaccination Required:</label>
              <input v-if="!event.requiredVaccine" type="checkbox" v-model.trim="event.venue.requiredVaccine" id="venueVisibility" class="ml-3" />
              <input v-if="event.requiredVaccine" type="checkbox" v-model.trim="event.requiredVaccine" id="venueVisibility" class="ml-3" />
            </div>

            <div class="mb-3" v-if="venues.length > 1">
              <label for="venue">Venue: (updates on change)</label>
              <v-select
                class="mt-2"
                label="title" 
                :options="venues"
                v-model="event.venue"
                @input="updateVenue()"
                >
              </v-select>
            </div>
            <div class="mb-3" v-if="event.venue">
              <label for="clients">Clients:</label>
              <v-select
                class="mt-2"
                label="title"
                multiple
                :options="clients"
                v-model="event.venue.client"
                >
              </v-select>
            </div>

            <div class="mb-3" v-if="event.venue && tags.length > 1">
              <label for="tags">Tags:</label>
              <v-select
                class="mt-2"
                label="title" 
                :options="tags"
                multiple
                v-model="event.tags"
                >
              </v-select>
            </div>
            <div class="mb-3" v-if="event.venue && mgrs.length >= 1">
            <label for="mgrs">Managers:</label>
              <v-select
                class="mt-2"
                label="name" 
                :options="mgrs"
                multiple
                v-model="event.venue.mgrs"
                >
              </v-select>
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
              <div class="mt-2 flex" style="flex-wrap: wrap;" v-if="event.days && event.days.length >= 1">
                <button class="chip mr-2 mb-2" v-for="(day, index) in event.days" :key="day" @click="deleteDay(index)">{{day}} <i class="far fa-times-circle ml-2"></i></button>
              </div>
            </transition> 
            <transition name="fadeStop">
              <div class="mb-3" v-if="event.startDate">
                <label for="pickDate">Choose Date:</label>
                <input type="date" v-model.trim="day" id="pickDate" @change="addDay()" />
              </div>
            </transition>
          </div>

          <div class="dashboard__container--body--col" v-if="event.venue">
            <div class="flex justify-space-between align-center">
              <h3>Jobs to Staff</h3>
              
            </div>
            
            <div class="mb-3">
              <label for="pickDate">Choose Jobs:</label>
              <v-select
                class="mt-2"
                label="title" 
                :options="jobs"
                v-model="event.venue.job"
                multiple
                >
              </v-select>
            </div>
            <transition name="fadeStop">
              <div class="mb-3" v-if="event.venue.job && event.venue.job.length >= 1">
                <div v-for="job in event.venue.job" class="mb-3 flex justify-space-between">
                  <input type="text" readonly v-model.trim="job.title" />
                  <input class="ml-3" type="number" step=".01" placeholder="pay rate" v-model.trim="job.rate" />
                  <input class="ml-3" type="text" placeholder="new label" v-model.trim="job.label" />
                  <div class="ml-3">
                    <label for="tipped">Tipped?</label>
                    <input class="ml-3" type="checkbox" v-model="job.tipped" id="tipped" />
                  </div>
                  <!-- <button class="btn btn__accent btn__small ml-3">save</button> -->
                </div>
              </div>
            </transition>
          </div>

          <!-- <div class="dashboard__container--body--col" v-if="event.venue">
            <div class="mb-3" v-if="clients.length >= 1">
              <h3>Client</h3>
              <v-select
                class="mt-2"
                label="title"
                multiple
                :options="clients"
                v-model="event.venue.client"
                >
              </v-select>
            </div>
          </div>
           -->
          <div class="dashboard__container--body--col">
            <h3>Attach Files</h3>

            <div class="mb-3">
              <label for="fileTitle">Details:</label>
              <input class="mb-2" placeholder="File Title" type="text" v-model.trim="fileTitle" id="fileTitle" />
              <textarea placeholder="File Description" name="fileDescription" id="fileDescription" cols="30" rows="2" v-model="fileDescription"></textarea>

              <input class="mt-3" type="file" ref="fileInputTip" accept="image/*,application/pdf,.doc" @change="previewImage">
              <progress :value="uploadValue" max="100" v-if="showBar"></progress>
              <div class="mb-3">
                <button v-if="imageData != null" class="btn btn__primary mt-3" @click="onUploadFile">
                  Upload
                  <transition name="fade">
                    <span class="ml-2" v-if="performingRequest3">
                    <i class="fa fa-spinner fa-spin"></i>
                    </span>
                  </transition>
                </button>
              </div>
              <div v-if="event.files && event.files.length >= 1">
                <vue-good-table
                  :columns="columns"
                  :rows="event.files"
                  >
                  <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field == 'url'">
                      <a :href="props.row.url" target="_blank"><i class="fas fa-external-link"></i></a>
                    </span>
                    <span v-else-if="props.column.field == 'extras'">
                      <button @click="deleteUploadedFile(props.row, props.index)">
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
          </div>

      		<div class="dashboard__container--body--col">
            <h3 class="mb-3">Background Image</h3>
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
          <div class="dashboard__container--body--col" v-if="event.venue">
            <h3>Attire</h3>
            <div class="mb-3">
              <vue-editor id="attire" v-model="event.venue.attire"></vue-editor>
            </div>
          </div>
          <div class="dashboard__container--body--col" v-if="event.venue">

            <div class="mb-3">
              <h3>Pay</h3>
              <vue-editor id="pay" v-model="event.venue.pay"></vue-editor>
            </div>
          </div>
          <div class="dashboard__container--body--col" v-if="event.venue">

            <div class="mb-3">
              <h3>Check-In Instructions</h3>
              <vue-editor id="checkin" v-model="event.venue.checkin"></vue-editor>
            </div>

          </div>

          <div class="dashboard__container--body--col" v-if="event.venue">
            <div class="mb-3">
              <h3>Parking Instructions</h3>
              <vue-editor id="parking" v-model="event.venue.parking"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col" v-if="event.venue">
            <div class="mb-3">
              <h3>Camping Instructions</h3>
              <vue-editor id="camping" v-model="event.venue.camping"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col" v-if="event.venue">
            <div class="mb-3">
              <h3>Credentials Instructions</h3>
              <vue-editor id="creds" v-model="event.venue.creds"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col" v-if="event.venue">
            <div class="mb-3">
              <h3>COVID Requirements:</h3>
              <vue-editor id="covid" v-model="event.venue.covid"></vue-editor>
            </div>
          </div>


          <div class="dashboard__container--body--col" v-if="event.venue">
            <div class="mb-3">
              <h3>Additional Notes:</h3>
              <vue-editor id="notes" v-model="event.venue.notes"></vue-editor>
            </div>
          </div>
        </div>
        <hr>
        <div class="dashboard__container--body">
          <div class="dashboard__container--body--col">
            <h2>Last Message</h2>
            <div class="mb-3 mt-1">
            </div>
            <div v-if="event.updateMessage">{{event.updateMessage}}</div>
            <div class="mt-2">
              <span v-if="event.updateStaffSent" class="caption">
                Last Sent: {{event.updateStaffSent.toDate() | moment("MMMM Do YYYY, h:mm a") }}
              </span>
            </div>
          </div>
          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <h3>Send Message to Update Staff:</h3>
              <textarea name="updateMessage" id="updateMessage" cols="20" rows="4" v-model="event.updateMessage"></textarea>
            </div>
            <button class="btn btn__outlined btn__large" @click="updateStaff()">
              Update Staff
              <transition name="fade">
                <span class="ml-2" v-if="performingRequest2">
                <i class="fa fa-spinner fa-spin"></i>
                </span>
              </transition>
            </button>
          </div>
        </div>
        <div class="dashboard__container--body">
          
          
          <!-- <div class="dashboard__container--body--col">
            <div class="mb-3">
              <div class="mb-3">
                <label for="payDate">Pay Date:</label>
                <input type="date" v-model.trim="event.payDate"  id="payDate"  />
              </div>
              <div class="mb-3">
                <label for="payProcessed">Paid and Complete:</label>
                <input type="checkbox" v-model.trim="event.paid" id="payProcessed" class="ml-3" />
              </div>
            </div>
          </div> -->

          <div class="dashboard__container--body--col" style="background: transparent;">
            <div class="flex justify-space-between">
              <!-- <button class="btn btn__outlined btn__large" @click="exportStaff()">
              export Staff

              </button> -->
              <button class="btn btn__success btn__large" @click="updateEvent()" :disabled="event.status == 'cancelled'">
              Update Event
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>

              <button class="btn btn__danger btn__large" @click="showCancellation = true" v-if="!showCancellation">
                Cancel Event
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest4">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>

              <button class="btn btn__primary btn__large" @click="showCancellation = false" v-if="showCancellation">
                No Don't Cancel
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest4">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>


              <button class="btn btn__danger btn__large" @click="cancelEvent()" v-if="showCancellation">
                Yes, Cancel Event
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest4">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>
              <button class="btn btn__success" @click="activateEvent()" v-if="event.status == 'cancelled'">
                 Activate Event
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest4">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>
              <!-- <button class="btn btn__dark" @click="deleteEvent()">delete event</button> -->
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
    showCancellation: false,
    job: '',
    // tags: ['#concert', '#comedy', '#convention', '#musicfestival', '#pga', '#nfl', '#nba', '#nhl', '#mlb', '#mls', '#minorleaguebaseball', '#ncaabasketball', '#ncaafootball'],
    multiDay: false,
    performingRequest: false,
    performingRequest2: false,
    performingRequest3: false,
    performingRequest4: false,
    imageData: null,
    fileTitle: '',
    fileDescription: '',
    uploadValue: 0,
    showBar:false,
    columns: [
      {
        label: 'Title',
        field: 'title',
      },
      {
        label: 'Description',
        field: 'description',
      },
      {
        label: 'Url',
        field: 'url',
        tdClass: 'text-right',
      },
      {
        label: '',
        field: 'extras',
        tdClass: 'text-right',
      },
    ]
  }),
  components: {
    VueEditor,
    Loader
  },
  created () {
    this.$store.dispatch("getEventFromId", this.$route.params.id);
  },
  beforeMount() {
    if (!this.venues || this.venues.length < 1) {
      this.$store.dispatch("getVenues")
    }
    if (!this.clients || this.clients.length < 1) {
      this.$store.dispatch("getClients")
    }
    if (!this.jobs || this.jobs.length < 1) {
      this.$store.dispatch("getJobsState")
    }
    if (!this.mgrs || this.mgrs.length < 1) {
      this.$store.dispatch("getMgrsState")
    }
     if (!this.tags || this.tags.length < 1) {
      this.$store.dispatch("getTagsState")
    }
  },
  computed: {
    ...mapState(['eventInfo', 'venues', 'clients', 'jobs', 'mgrs', 'tags']),
    event() {
      return this.eventInfo
    },
    backgroundUrl() {
      return this.eventInfo.photoUrl || 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/stadium.png?alt=media&token=89f2362c-d1bc-4338-a837-fad1d664c51d'
    },
  },
  methods: {
    venueSync() {
      let venueId = this.eventInfo.venueId
      fb.venuesCollection.doc(venueId).get()
      .then(doc => {
        console.log(doc.data().job)
        this.$store.dispatch('updateEventJobs', {
          eventId: this.eventInfo.id,
          venue: doc.data()
        })
      })
    },
    previewImage(event) {
      this.uploadValue=0;
      this.imageData=event.target.files[0]
    },
    onUploadFile() {
      this.showBar = true
      let event = this.event
      let fileTitle = this.fileTitle
      let fileDescription = this.fileDescription
      let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
      let storageRef = fb.storageRef.child('docs/' + rand).put(this.imageData);
      storageRef.on(`state_changed`, snapshot => {
        this.uploadValue=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
      }, error => {console.log(error.message)},
      () => {this.uploadValue=100;
        storageRef.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL)
            var docRef = fb.eventsCollection.doc(event.id)
            docRef.update({
              files: fb.firestore.FieldValue.arrayUnion({
                title: fileTitle,
                description: fileDescription,
                url: downloadURL
              })
            });
            event.files.push({
              title: fileTitle,
              description: fileDescription,
              url: downloadURL
            })
        })
        this.showBar = false
      })
      this.imageData = null
      this.fileTitle = ''
      this.fileDescription = ''
      this.$refs.fileInputTip.value=null
    },
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
    deleteUploadedFile(u, index) {
      console.log(u)
      let event = this.event
      event.files.splice(index, 1)
      this.$store.dispatch('updateEvent', event)
    },
    sheets() {
      let url = `/events/` + this.$route.params.id + `/timesheets`
      router.push(url)
    },
    shifts() {
      let url = `/events/` + this.$route.params.id + `/shifts`
      router.push(url)
    },
    placements() {
      let url = `/eventplacements/` + this.$route.params.id
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
    cancelEvent() {
      this.performingRequest4 = true
      this.showCancellation = false
      this.event.status = 'cancelled'
      this.event.published = false
      let event = this.event
      this.$store.dispatch('updateEvent', event)
      setTimeout(() => {
        this.performingRequest4 = false
      }, 500)
    },
    activateEvent() {
      this.performingRequest4 = true
      this.event.status = 'active'
      this.event.published = true
      let event = this.event
      this.$store.dispatch('updateEvent', event)
      setTimeout(() => {
        this.performingRequest4 = false
      }, 500)
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
          // let url = `/events`
          // router.push(url)
        }, 5000)
      } else {
        console.log(event)
        this.$store.dispatch('updateEvent', event)
        setTimeout(() => {
          croppa.remove()
          this.performingRequest = false
          // let url = `/events`
          // router.push(url)
        }, 2000)
      }
    }
  },
  beforeDestroy () {
    this.croppa = null
    this.imageData = null
    this.showBar = null
    this.job = null
    this.multiDay = null
    this.fileTitle = null
    this.fileDescription = null
    this.performingRequest = null
    this.performingRequest2 = null
    this.performingRequest3 = null
    this.performingRequest4 = null
    this.day = null
    this.uploadValue = null
    this.columns = null
    delete this.imageData
    delete this.day
    delete this.job
    delete this.croppa
    delete this.multiDay
    delete this.fileTitle
    delete this.fileDescription
    delete this.performingRequest
    delete this.performingRequest2
    delete this.performingRequest3
    delete this.performingRequest4
    delete this.uploadValue
    delete this.showBar
    delete this.columns
  	this.$store.dispatch('clearErrors')
    this.$store.dispatch('clearTagsState')
    this.$store.dispatch('clearEventState')
  }
}
</script>