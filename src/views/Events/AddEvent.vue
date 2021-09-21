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
            <div class="mb-3" v-if="venues.length > 1">
              <label for="venue">Venue:</label>
              <v-select
                class="mt-2"
                label="title" 
                :options="venues"
                v-model="event.venue"
                >
              </v-select>
            </div>
            <div class="mb-3" v-if="clients.length >= 1 && event.venue">
              <label for="client">Client:</label>
              <v-select
                class="mt-2"
                label="title" 
                :options="clients"
                multiple
                v-model="event.venue.client"
                >
              </v-select>
            </div>
            <div class="mb-3" v-if="jobss.length >= 1 && event.venue">
            <label for="pickDate">Choose Jobs:</label>
              <v-select
                class="mt-2"
                label="title" 
                :options="jobss"
                multiple
                v-model="event.venue.job"
                >
              </v-select>
            </div>
            <div class="mb-3" v-if="mgrs.length >= 1 && event.venue">
            <label for="pickDate">Managers:</label>
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
          <div class="dashboard__container--body--col" v-if="event.venue">

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
          <div class="dashboard__container--body--col" v-if="event.venue">

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

          <!-- <div class="dashboard__container--body--col">
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
          </div> -->

          <!-- <div class="dashboard__container--body--col">

            <h3>Jobs to Staff</h3>
            <transition name="fadeStop">
              <div class="mb-2 mt-2 flex" v-if="event.jobs && event.jobs.length >= 1">
                <button class="chip mr-2" v-for="(job, index) in event.jobs" :key="job.id" @click="deleteJob(index)">{{job.title}} <i class="far fa-times-circle ml-2"></i></button>
              </div>
            </transition> 
            <transition name="fadeStop">
              <div class="mb-3">
                
              </div>
            </transition>
          </div>
 -->
          <div class="dashboard__container--body--col" v-if="event.venue">

            <div class="mb-3">
              <label for="checkin">Check-In Details:</label>
              <vue-editor id="checkin" v-model="event.venue.checkin"></vue-editor>
            </div>

      		</div>

          <div class="dashboard__container--body--col" v-if="event.venue">
            <div class="mb-3">
              <label for="parking">Parking Details:</label>
              <vue-editor id="parking" v-model="event.venue.parking"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col" v-if="event.venue">
            <div class="mb-3">
              <label for="camping">Camping Details:</label>
              <vue-editor id="camping" v-model="event.venue.camping"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col" v-if="event.venue">
            <div class="mb-3">
              <label for="creds">Credentials Details:</label>
              <vue-editor id="creds" v-model="event.venue.creds"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col" v-if="event.venue">
            <div class="mb-3">
              <label for="covid">COVID Requirements:</label>
              <vue-editor id="covid" v-model="event.venue.covid"></vue-editor>
            </div>
          </div>

      		<div class="dashboard__container--body--col" v-if="event.venue">
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
          <div class="dashboard__container--body--col" v-if="event.venue">

            <div class="mb-3">
              <label for="attire">Attire:</label>
              <vue-editor id="attire" v-model="event.venue.attire"></vue-editor>
            </div>

            </div>
          <div class="dashboard__container--body--col" v-if="event.venue">

            <div class="mb-3">
              <label for="pay">Pay:</label>
              <vue-editor id="pay" v-model="event.venue.pay"></vue-editor>
            </div>

            </div>
          <div class="dashboard__container--body--col" v-if="event.venue">

            <div class="mb-3">
              <label for="notes">Additional Notes:</label>
              <vue-editor id="notes" v-model="event.venue.notes"></vue-editor>
            </div>
            </div>
          <div class="dashboard__container--body--col"  style="background: transparent;" v-if="event.venue">
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
    imageData: null,
    fileTitle: '',
    fileDescription: '',
    uploadValue: 0,
    showBar:false,
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
    if (!this.mgrs || this.mgrs.length < 1) {
      this.$store.dispatch("getMgrsState")
    }
  },
  computed: {
    ...mapState(['venues', 'clients', 'jobs', 'mgrs']),
    backgroundUrl() {
      return this.event.photoUrl || 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/stadium.png?alt=media&token=89f2362c-d1bc-4338-a837-fad1d664c51d'
    },
    jobss() {
      return this.jobs
    },
    year() {
      return moment(this.event.startDate).format('YYYY')
    },
    month() {
      return moment(this.event.startDate).format('M')
    },
    dday() {
      return moment(this.event.startDate).format('D')
    },
    slug() {
      if (this.event.title && this.year) {
        return this.event.title.replace(/[^\w ]+/g,'').replace(/ +/g,'-').toLowerCase() + `-` + this.month + `-` + this.dday + `-` + this.year
      }
    }
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
    deleteUploadedFile(u, index) {
      console.log(u)
      let event = this.event
      event.files.splice(index, 1)
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