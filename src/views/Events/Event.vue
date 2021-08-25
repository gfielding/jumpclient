<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <div class="flex align-center">
          <h1>Edit Event</h1>
          <button class="btn btn__large btn__success ml-5" v-if="event && event.published">
            Published
          </button>
          <button class="btn btn__large btn__warning ml-5" v-if="event && !event.published">
            Draft
          </button>
        </div>
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

          <div class="dashboard__container--body--col" v-if="event.venue">

            <h3>Jobs to Staff</h3>
            <transition name="fadeStop">
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
            </transition>
          </div>

          <div class="dashboard__container--body--col" v-if="event.venue">
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
          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <h3>Send Message to Update Staff:</h3>
              <textarea name="updateMessage" id="updateMessage" cols="30" rows="4" v-model="event.updateMessage"></textarea>
            </div>
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
          <div class="dashboard__container--body--col">
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
          </div>

          <div class="dashboard__container--body--col" style="background: transparent;">
            <div class="flex justify-space-between">
              <!-- <button class="btn btn__outlined btn__large" @click="exportStaff()">
              export Staff

              </button> -->
              <button class="btn btn__primary btn__large" @click="updateEvent()">
              Update Event
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest">
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
    job: '',
    multiDay: false,
    performingRequest: false,
    performingRequest2: false,
    performingRequest3: false,
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
    this.fileTitle = null
    this.fileDescription = null
    this.performingRequest = null
    this.performingRequest2 = null
    this.performingRequest4 = null
    this.day = null
    delete this.day
    delete this.croppa
    delete this.multiDay
    delete this.fileTitle
    delete this.fileDescription
    delete this.performingRequest
    delete this.performingRequest2
    delete this.performingRequest3
  	this.$store.dispatch('clearErrors')
    this.$store.dispatch('clearEventState')
  }
}
</script>