<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <div class="flex align-center mb-5">
          <h1>Preview Info Email</h1>
        </div>
        <div class="flex align-center">

          <button class="btn btn__outlined btn__small mb-3" @click="goBack()"><i class="fas fa-arrow-left"></i></button>
        </div>
      </div>
      <Loader v-if="!event || !event.id" />
      <form ref="form" v-if="event && event.id" @submit.prevent style="margin:auto; max-width: 640px; background: white;">
        
        <div v-if="event">
          <img v-if="(event.photoUrl || (event.venue && event.venue.photoUrl) || venueInfo.photoUrl)" :src="(event.photoUrl || event.venue.photoUrl || venueInfo.photoUrl)" alt="" style="width:100%;">
          <div class="pa-3">
            <h1 v-if="event.title">Congratulations NAME! Your shift has been assigned to work as a JOB at {{event.title}} on DATE from START to END</h1>

            <div>
              <hr>
              <label for="eventIntro">Add an Intro Paragraph:</label>
              <textarea cols="30" rows="2" id="eventIntro" v-model="event.intro"></textarea>

              <transition name="fade">
                <button v-if="event && event.intro && event.intro.length > 5" class="btn btn__small btn__success mt-3" @click="updateEvent()">Submit</button>
              </transition>
            </div>

            <div v-if="((event && event.requiredVaccine) || (venueInfo && venueInfo.requiredVaccine))">
              <hr>
              <h3>Covid-19 Vaccination is Required</h3>
              <div>Please bring proof of vaccination with you or you will not be able to work.</div>
            </div>
            <div v-if="event && event.venue && event.venue.title">
              <hr>
              <h3>Location: {{event.venue.title}}</h3>
              <div>{{event.venue.address.street_number}} {{event.venue.address.street}} <span v-if="event.venue.address.unit">#{{event.venue.address.unit}}</span><br />{{event.venue.address.city}}, {{event.venue.address.state}} {{event.venue.address.zip}}</div>
            </div>
            <div v-if="event && event.venue && event.venue.mgrs && event.venue.mgrs.length >= 1">
              <hr>
              <h3 v-if="event.venue.mgrs.length == 1">Your Manager</h3>
              <h3 v-if="event.venue.mgrs.length > 1">Your Managers</h3>
              <div v-for="(item, index) in event.venue.mgrs" :key="index" class="mb-3">
                <h4>{{item.name}}</h4>
                <p><span v-if="item.phone"><a :href="`tel:${item.phone}`">{{item.phone}}</a><br /></span>
                <a :href="`mailto:${item.email}`">{{item.email}}</a></p>
              </div>
            </div>
            <div v-if="((event && event.venue && event.venue.attire) || (venueInfo && venueInfo.attire))">
              <hr>
              <h3>What to Wear</h3>
              <div v-if="event.venue.attire" v-html="event.venue.attire"></div>
              <div v-if="!event.venue.attire && (venueInfo && venueInfo.attire)" v-html="venueInfo.attire"></div>
            </div>

            <div v-if="((event && event.venue && event.venue.checkin) || (venueInfo && venueInfo.checkin))">
              <hr>
              <h3>Check-In Instructions</h3>
              <div v-if="event.venue.checkin" v-html="event.venue.checkin"></div>
              <div v-if="!event.venue.checkin && (venueInfo && venueInfo.checkin)" v-html="venueInfo.checkin"></div>
            </div>

            <div v-if="((event && event.venue && event.venue.parking) || (venueInfo && venueInfo.parking))">
              <hr>
              <h3>Parking Details</h3>
              <div v-if="event.venue.parking" v-html="event.venue.parking"></div>
              <div v-if="!event.venue.parking && (venueInfo && venueInfo.parking)" v-html="venueInfo.parking"></div>
            </div>

            <div v-if="((event && event.venue && event.venue.creds) || (venueInfo && venueInfo.creds))">
              <hr>
              <h3>Credentials (wristbands)</h3>
              <div v-if="event.venue.creds" v-html="event.venue.creds"></div>
              <div v-if="!event.venue.creds && (venueInfo && venueInfo.creds)" v-html="venueInfo.creds"></div>
            </div>


            <div v-if="((event && event.venue && event.venue.camping) || (venueInfo && venueInfo.camping))">
              <hr>
              <h3>Camping Details</h3>
              <div v-if="event.venue.camping" v-html="event.venue.camping"></div>
              <div v-if="!event.venue.camping && (venueInfo && venueInfo.camping)" v-html="venueInfo.camping"></div>
            </div>

            <div v-if="((event && event.venue && event.venue.notes) || (venueInfo && venueInfo.notes))">
              <hr>
              <h3>Additional Notes</h3>
              <div v-if="event.venue.notes" v-html="event.venue.notes"></div>
              <div v-if="!event.venue.notes && (venueInfo && venueInfo.notes)" v-html="venueInfo.notes"></div>
            </div>


            <div v-if="((event.files && event.files.length >= 1) || (venueInfo && venueInfo.files && venueInfo.files.length >= 1))">
              <hr>
              <h3>Attachments</h3>
              <div v-if="event.files && event.files.length >= 1">
                <div v-for="(item, index) in event.files" :key="index + `a`">
                  <div class="flex justify-space-between align-center pt-3 mb-3" style="border-top:1px solid rgba(0,0,0,0.1);">
                    <h5>{{item.title}}</h5>
                    <a :href="item.url" target="_blank">
                      <button class="btn btn__outlined btn__small">
                        View Attachment<i class="fas fa-external-link ml-2"></i>
                      </button>
                    </a>
                  </div>
                </div>
              </div>
              <div v-if="venueInfo && venueInfo.files && venueInfo.files.length >= 1">
                <div v-for="(item, index) in venueInfo.files" :key="index + `b`">
                  <div class="flex justify-space-between align-center pt-3 mb-3" style="border-top:1px solid rgba(0,0,0,0.1);">
                    <h5>{{item.title}}</h5>
                    <a :href="item.url" target="_blank">
                      <button class="btn btn__outlined btn__small">
                        View Attachment<i class="fas fa-external-link ml-2"></i>
                      </button>
                    </a>
                  </div>
                </div>
              </div>
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
import router from '@/router'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'eventemail',
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
    Loader
  },
  created () {
    this.$store.dispatch("getEventFromIdOnly", this.$route.params.id);
  },
  mounted() {
    this.$store.dispatch("getVenueFromIdWithoutEvents", this.eventInfo.venueId);
  },
  computed: {
    ...mapState(['eventInfo', 'venueInfo']),
    event() {
      return this.eventInfo
    },
    backgroundUrl() {
      return this.eventInfo.photoUrl || 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/stadium.png?alt=media&token=89f2362c-d1bc-4338-a837-fad1d664c51d'
    },
  },
  methods: {
    updateEvent() {
      let event = this.event
      this.$store.dispatch('updateEvent', event)
    },
    goBack() {
      router.go(-1)
    },
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
    this.$store.dispatch('clearEventState')
    console.log(this)
  }
}
</script>