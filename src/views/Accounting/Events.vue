<template>
  <div class="dashboard">
    <Loader v-if="performingRequest || events.length == 0" />
    <div class="dashboard__container">
      <div class="dashboard__container--header eventsHeader">
        <span style="display: flex;
    width: 100%;
    justify-content: space-between;">
          <h1>Event Accounting</h1>
          <!-- <router-link :to="{name: 'addevent'}" class="hidden-large color--text">
            <button class="btn btn__flat ml-3"><i class="fas fa-plus fa-2x"></i></button>
          </router-link> -->
        </span>
        
        <span class="search flex">
          
          <!-- <input type="text" placeholder="search" v-model.trim="searchText" style="background: white; padding: 0 1rem; min-height: 38px; min-width: 120px;" class="mr-3" />
          <div style="margin:auto;" v-if="showSearch">
            <button class="btn btn__primary mr-5" @click="clearSearch()">clear</button>
          </div>
          <div style="margin:auto;" v-if="searchText.length > 1 && !showSearch">
            <button class="btn btn__accent mr-5" @click="updateSearch()">submit</button>
          </div> -->

          <!-- <v-select
            id="searchbox"
            label="title" 
            :options="venues"
            placeholder="choose venue"
            @input="setSelectedVenue"
            >
          </v-select> -->
          <button v-tooltip="'show incomplete'" style="padding:1rem;" class="btn btn__flat ml-3" @click="showIncompleteEvents()"><i class="fas fa-square fa-2x" style="color:#d9534f;"></i></i></button>
          <button v-tooltip="'show partial'" style="padding:1rem;" class="btn btn__flat ml-3" @click="showPartialEvents()"><i class="fas fa-square fa-2x" style="color:#f0ad4e;"></i></i></button>
          <button v-tooltip="'show complete'" style="padding:1rem;" class="btn btn__flat ml-3" @click="showCompleteEvents()"><i class="fas fa-square fa-2x" style="color:#5cb85c;"></i></i></button>
          <button v-tooltip="'show cancelled events'" style="padding:1rem;" class="btn btn__flat ml-3" @click="showCancelledEvents()"><i class="fa-solid fa-align-slash fa-2x"></i></button>
          
          
          


         <!--  <router-link :to="{name: 'addevent'}" class="hidden-small color--text">
            <button v-tooltip="'add event'" style="padding:1rem;" class="btn btn__flat ml-0"><i class="fas fa-plus fa-2x"></i></button>
          </router-link> -->
        </span>
      </div>


      <div class="dashboard__container--body eventCardContainer">
        <Loader v-if="performingRequest" />
        <!-- <Loader v-if="(!infiniteEvents || infiniteEvents.length < 1)" /> -->

        <!--VENUE RESULTS-->
        <!-- <div v-for="event in venueEventsSearchResults" :key="event.id" class="eventCard" v-if="venueEventsSearchResults.length > 0 && !results && taggedEvents.length == 0 && showVenues">
          <span class="flex align-center">
            <h3 v-bind:class="{ strike: event.status == 'cancelled' }">{{event.title}}</h3>
            <div class="caption">{{event.startDate | moment("dddd, MMMM Do YYYY") }}<span v-if="event.endDate"> - {{event.endDate | moment("dddd, MMMM Do YYYY") }}</span><span v-if="event && event.venue && event.venue.title"> | {{event.venue.title}}</span><span v-if="event && event.venue && event.venue.address && event.venue.address.city"> | {{event.venue.address.city}}</span>
            </div>


              <span v-if="event.invoiceStatus == 'complete'">
                <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#5cb85c;"></i>
              </span>
              <span v-if="event.invoiceStatus == 'partial'">
                <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#f0ad4e;"></i>
              </span>
              <span v-if="!event.invoiceStatus">
                <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#d9534f;"></i>
              </span>


          </span>
          <div class="flex mt-2">
            <div class="flex flex-wrap">
              <router-link :to="`/events/` + event.id">
                <button class="btn btn__small btn__outlined mr-3 mb-3">Edit</button>
              </router-link>
              <router-link :to="`/events/` + event.id + `/timesheets`">
                <button class="btn btn__small btn__outlined mr-3 mb-3" >Timesheets</button>
              </router-link>
              <router-link :to="`/events/` + event.id + `/shifts`">
                <button class="btn btn__small btn__outlined mr-3 mb-3" >Shifts</button>
              </router-link>
              <router-link :to="`/eventplacements/` + event.id">
                <button class="btn btn__small btn__outlined mr-3 mb-3" >Placements</button>
              </router-link>
              <router-link :to="`/events/` + event.id + `/checkin`">
                <button class="btn btn__small btn__outlined mr-3 mb-3" >Check-In</button>
              </router-link>

            </div>
          </div>
        </div> -->


        <!--CANCELLED RESULTS-->
        <!-- <div v-for="event in cancelledEvents" :key="event.id" class="eventCard" v-if="showCancelled">
          <span class="flex align-center">
            <h3 v-bind:class="{ strike: event.status == 'cancelled' }">{{event.title}}</h3>
            <div class="caption">{{event.startDate | moment("dddd, MMMM Do YYYY") }}<span v-if="event.endDate"> - {{event.endDate | moment("dddd, MMMM Do YYYY") }}</span><span v-if="event && event.venue && event.venue.title"> | {{event.venue.title}}</span><span v-if="event && event.venue && event.venue.address && event.venue.address.city"> | {{event.venue.address.city}}</span>
            </div>


              <span v-if="event.invoiceStatus == 'complete'">
                <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#5cb85c;"></i>
              </span>
              <span v-if="event.invoiceStatus == 'partial'">
                <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#f0ad4e;"></i>
              </span>
              <span v-if="!event.invoiceStatus">
                <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#d9534f;"></i>
              </span>


          </span>
        </div> -->

        <!--SEARCH RESULTS-->
        <!-- <div v-for="event in filteredEvents" :key="event.id" class="eventCard" v-if="showSearch">
          <span class="flex align-center">
            <h3 v-bind:class="{ strike: event.status == 'cancelled' }">{{event.title}}</h3>
            <div class="caption">{{event.startDate | moment("dddd, MMMM Do YYYY") }}<span v-if="event.endDate"> - {{event.endDate | moment("dddd, MMMM Do YYYY") }}</span><span v-if="event && event.venue && event.venue.title"> | {{event.venue.title}}</span><span v-if="event && event.venue && event.venue.address && event.venue.address.city"> | {{event.venue.address.city}}</span>
            </div>


              <span v-if="event.invoiceStatus == 'complete'">
                <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#5cb85c;"></i>
              </span>
              <span v-if="event.invoiceStatus == 'partial'">
                <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#f0ad4e;"></i>
              </span>
              <span v-if="!event.invoiceStatus">
                <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#d9534f;"></i>
              </span>


          </span>
        </div> -->

        <!--Incomplete-->
        <EventCard v-if="showIncomplete" :events="events" :accounting="true" />
        <!--Partial-->
        <EventCard v-if="showPartial" :events="partialEvents" :accounting="true" />
        <!--Complete-->
        <EventCard v-if="showComplete" :events="completeEvents" :accounting="true" />
        <!--Cancelled-->
        <EventCard v-if="showCancelled" :events="eventsCancelled" :accounting="true" />

        <!--PREV AND NEXT-->
        <!-- <div v-for="event in visibleEvents" :key="event.id" class="eventCard" v-if="(!venueEventsSearchResults || venueEventsSearchResults.length == 0) && !results && (!taggedEvents || taggedEvents.length == 0) && !showVenues && showPrevNext">
          <h3 v-bind:class="{ strike: event.status == 'cancelled' }">{{event.title}}</h3>
          <div class="caption">{{event.startDate | moment("dddd, MMMM Do YYYY") }}<span v-if="event.endDate"> - {{event.endDate | moment("dddd, MMMM Do YYYY") }}</span><span v-if="event && event.venue && event.venue.title"> | {{event.venue.title}}</span><span v-if="event && event.venue && event.venue.address && event.venue.address.city"> | {{event.venue.address.city}}</span>
          </div>
          <div class="flex mt-2">
            <div class="flex flex-wrap">
              <router-link :to="`/events/` + event.id">
                <button class="btn btn__small btn__outlined mr-3 mb-3">Edit</button>
              </router-link>
              <router-link :to="`/events/` + event.id + `/timesheets`">
                <button class="btn btn__small btn__outlined mr-3 mb-3" >Timesheets</button>
              </router-link>
              <router-link :to="`/events/` + event.id + `/shifts`">
                <button class="btn btn__small btn__outlined mr-3 mb-3" >Shifts</button>
              </router-link>
              <router-link :to="`/eventplacements/` + event.id">
                <button class="btn btn__small btn__outlined mr-3 mb-3" >Placements</button>
              </router-link>
              <router-link :to="`/events/` + event.id + `/checkin`">
                <button class="btn btn__small btn__outlined mr-3 mb-3" >Check-In</button>
              </router-link>

            </div>
          </div>
        </div> -->

      <!-- <div class="mb-3 mt-3 flex justify-space-between" v-if="showInfinite || showPrevNext">
        <button class="btn btn__accent" @click="loadPrev()">Prev</button>
        <button class="btn btn__accent" @click="loadNext()">Next</button>
      </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped type="text/css">
.dashboard__container {
  width: calc(100% - 4rem);
}
.max {
  width:calc(100% - 3.2rem);
}
table.vgt-table td {
  padding: 0 !important;
}
input, textarea {
  padding: 0.4rem 0;
}
</style>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import EventCard from '@/components/EventCard.vue'
import router from '@/router'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'accountingEvents',
  data: () => ({
    showIncomplete: true,
    showPartial: false,
    showComplete: false,
    showCancelled: false,
    // searchText: '',
    // results: null,
    // showInfinite: true,
    // showPrevNext: false,
    // showVenues: false,
    // showSearch: false,
    
    // activeTag: '',
    // visibleEvents: [],
    performingRequest: false,
  }),
  // created () {
  //   this.$store.dispatch("get2022Events")
  // },
  created () {
    this.$store.dispatch("getEvents")
    this.$store.dispatch("getVenues")
    // window.addEventListener("scroll", this.handleScroll, false);
    
  },
  computed: {
     ...mapState(['events', 'completeEvents', 'partialEvents', 'eventsCancelled', 'venues']),
    // ...mapState(['infiniteEvents', 'cancelledEvents', 'prevInfiniteEvents', 'nextInfiniteEvents', 'lastVisibleEventSnapShot', 'firstVisibleEventSnapShot', 'allEvents', 'venues', 'venueEventsSearchResults', 'tags']),
    // ...mapState(['events2021', 'events2022']),
    // filteredEvents() {
    //   if (this.searchText && this.searchText.length > 3) {
    //     return this.allEvents.filter(
    //       (x => x.title.toLowerCase().includes(this.searchText.toLowerCase())) || 
    //       (x => x.venueInfo.title.toLowerCase().includes(this.searchText.toLowerCase())) || 
    //       (x => x.venueInfo.address.city.toLowerCase().includes(this.searchText.toLowerCase()))
    //     )
    //   }
    // }
  },
  components: {
    Loader,
    EventCard
  },
  methods: {
    showCompleteEvents() {
      this.showComplete = true
      this.showCancelled = false
      this.showPartial = false
      this.showIncomplete = false
    },
    showPartialEvents() {
      this.showComplete = false
      this.showCancelled = false
      this.showPartial = true
      this.showIncomplete = false
    },
    showIncompleteEvents() {
      this.showComplete = false
      this.showCancelled = false
      this.showPartial = false
      this.showIncomplete = true
    },
    showCancelledEvents() {
      this.showComplete = false
      this.showCancelled = true
      this.showPartial = false
      this.showIncomplete = false
    },
    // clearSearch() {
    //   this.performingRequest = true
    //   this.showInfinite = true
    //   this.showCancelled = false
    //   this.searchText = ''
    //   this.showSearch = false
    //   this.visibleEvents.push(...this.infiniteEvents);
    //   setTimeout(() => {
    //     this.performingRequest = false
    //   }, 1000)
    // },
    // updateSearch() {
    //   this.performingRequest = true
    //   this.activeTag = ''
    //   this.showVenues = false
    //   this.showInfinite = false
    //   this.showPrevNext = false
    //   this.showSearch = true
    //   this.$store.dispatch("clearTaggedEvents")
    //   if (this.searchText.length >= 1) {
    //     this.results = this.filteredEvents
    //   }
      
    //   setTimeout(() => {
    //     this.performingRequest = false
    //   }, 5000)
    // },
  },
  beforeDestroy () {
    this.showIncomplete = true
    this.showPartial = false
    this.showComplete = false
    this.showCancelled = false
    delete this.showIncomplete
    delete this.showPartial
    delete this.showComplete
    delete this.showCancelled
    delete this.performingRequest
    this.$store.dispatch('clearEvents')
  },
  // destroyed() {
  //   window.removeEventListener("scroll", this.handleScroll);
  // },
}
</script>