<template>
  <div class="dashboard">
    <Loader v-if="performingRequest" />
    <div class="dashboard__container">
      <div class="dashboard__container--header mb-3 eventsHeader">
        <span style="display: flex;
    width: 100%;
    justify-content: space-between;">
          <h1>Events</h1>
          <span class="flex align-center">
            <button v-tooltip="'show cancelled events'" style="padding:1rem;" class="btn btn__flat ml-3 hidden-large" @click="showCancelled = true" v-if="showCancelled == false"><i class="fa-solid fa-align-slash fa-2x"></i></button>

            <button v-tooltip="'show active events'" style="padding:1rem;" class="btn btn__flat ml-3 hidden-large" @click="showCancelled = false" v-if="showCancelled == true"><i class="fa-solid fa-align-justify fa-2x"></i></button>
            <router-link :to="{name: 'addevent'}" class="hidden-large color--text">
              <button class="btn btn__flat ml-3"><i class="fas fa-plus fa-2x"></i></button>
            </router-link>
          </span>
        </span>
        
        <span class="search flex">
          
          <input type="text" placeholder="search" v-model.trim="searchText" style="background: white; padding: 0 1rem; min-height: 38px; min-width: 120px;" class="mr-3" />
          <div style="margin:auto;" v-if="showSearch">
            <button class="btn btn__primary mr-5" @click="clearSearch()">clear</button>
          </div>
          <div style="margin:auto;" v-if="searchText.length > 2 && !showSearch">
            <button class="btn btn__accent mr-5" @click="updateSearch()">submit</button>
          </div>

          <v-select
            id="searchbox"
            label="title" 
            :options="venues"
            placeholder="choose venue"
            @input="setSelectedVenue"
            >
          </v-select>
          <button v-tooltip="'show cancelled events'" style="padding:1rem;" class="btn btn__flat ml-3 hidden-small" @click="showCancelled = true" v-if="showCancelled == false"><i class="fa-solid fa-align-slash fa-2x"></i></button>

          <button v-tooltip="'show active events'" style="padding:1rem;" class="btn btn__flat ml-3 hidden-small" @click="showCancelled = false" v-if="showCancelled == true"><i class="fa-solid fa-align-justify fa-2x"></i></button>


          <router-link :to="{name: 'addevent'}" class="hidden-small color--text">
            <button v-tooltip="'add event'" style="padding:1rem;" class="btn btn__flat ml-0"><i class="fas fa-plus fa-2x"></i></button>
          </router-link>
        </span>
      </div>


      <div class="dashboard__container--body eventCardContainer">
        <Loader v-if="performingRequest" />
        <Loader v-if="(!infiniteEvents || infiniteEvents.length < 1)" />

        <!--VENUE RESULTS-->
        <EventCard v-if="venueEventsSearchResults.length > 0 && !results && taggedEvents.length == 0 && showVenues" :events="venueEventsSearchResults" :accounting="true" :tags="tags" />
       
        <!--CANCELLED RESULTS-->
        <EventCard v-if="showCancelled" :events="cancelledEvents" :accounting="false" :tags="tags" />

        <!--SEARCH RESULTS-->
        <EventCard v-if="showSearch" :events="eventsSearchResults" :accounting="false" :tags="tags" />

        <!--INITAL-->
        <EventCard v-if="showInfinite" :events="infiniteEvents" :accounting="false" :tags="tags" />

        <!--PREV AND NEXT-->
        <EventCard v-if="(!venueEventsSearchResults || venueEventsSearchResults.length == 0) && !results && (!taggedEvents || taggedEvents.length == 0) && !showVenues && showPrevNext" :events="visibleEvents" :accounting="true" :tags="tags" />



<!--         <div v-for="event in cancelledEvents" :key="event.id" class="eventCard" v-if="showCancelled">
          <span class="flex align-center">
            <h3 v-bind:class="{ strike: event.status == 'cancelled' }">{{event.title}}</h3>
            <button v-if="event.published" class="btn btn__icon ml-5" @click="unpublish(event)">
              <i class="fas fa-eye" style="color:#5cb85c;"></i>
            </button>
            <button v-if="!event.published" class="btn btn__icon ml-5" @click="publish(event)">
              <i class="fas fa-eye-slash" style="color:#d9534f;"></i>
            </button>
            <button v-if="((!event.status || event.status != 'cancelled') && !event.showCancel)" class="btn btn__icon ml-5" @click="showCancel(event)">
              <i class="fas fa-times" style="color:#d9534f;"></i>
            </button>
            <button v-if="event.showCancel && event.status != 'cancelled'" class="btn btn__small btn__primary ml-3" @click="cancelCancel(event)">
              don't cancel event
            </button>
            <button v-if="event.showCancel && event.status != 'cancelled'" class="btn btn__small btn__danger ml-3" @click="cancel(event)">
              cancel event
            </button>
            <button v-if="event.status == 'cancelled'" class="btn btn__small btn__success ml-3" @click="activate(event)">
              activate
            </button>
          </span>
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
            <div class="flex">
              <v-select
                  label="title" 
                  :options="tags"
                  multiple
                  v-model="event.tags"
                  @input="setTag(event)"
                  style="min-width: 160px;"
                  >
                </v-select>
            </div>
          </div>
        </div> -->

        <!--SEARCH RESULTS-->
        <!-- <div v-for="event in eventsSearchResults" :key="event.id" class="eventCard" v-if="showSearch">
          <span class="flex align-center">
            <h3 v-bind:class="{ strike: event.status == 'cancelled' }">{{event.title}}</h3>
            <button v-if="event.published" class="btn btn__icon ml-5" @click="unpublish(event)">
              <i class="fas fa-eye" style="color:#5cb85c;"></i>
            </button>
            <button v-if="!event.published" class="btn btn__icon ml-5" @click="publish(event)">
              <i class="fas fa-eye-slash" style="color:#d9534f;"></i>
            </button>
            <button v-if="((!event.status || event.status != 'cancelled') && !event.showCancel)" class="btn btn__icon ml-5" @click="showCancel(event)">
              <i class="fas fa-times" style="color:#d9534f;"></i>
            </button>
            <button v-if="event.showCancel && event.status != 'cancelled'" class="btn btn__small btn__primary ml-3" @click="cancelCancel(event)">
              don't cancel event
            </button>
            <button v-if="event.showCancel && event.status != 'cancelled'" class="btn btn__small btn__danger ml-3" @click="cancel(event)">
              cancel event
            </button>
            <button v-if="event.status == 'cancelled'" class="btn btn__small btn__success ml-3" @click="activate(event)">
              activate
            </button>
          </span>
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
            <div class="flex"> -->
              <!-- <button class="btn btn__small btn__flat" style="color:blue !important;" v-for="tag in event.tags" :key="tag.id">
                {{tag.title}}
              </button>
              <v-select
                  label="title" 
                  :options="tags"
                  multiple
                  v-model="event.tags"
                  @input="setTag(event)"
                  style="min-width: 160px;"
                  >
                </v-select>
            </div>
          </div>
        </div> -->

        <!-- <div v-for="event in taggedEvents" :key="event.id" class="eventCard" v-if="(!venueEventsSearchResults || venueEventsSearchResults.length == 0) && !results && taggedEvents.length > 0 && !showVenues" @click="onRowClick(event)">
          <img :data-src="(event.photoUrl || event.venue.photoUrl)" alt="">
          <h3>{{event.title}}</h3>
          <div class="caption">{{event.startDate | moment("dddd, MMMM Do YYYY") }}<span v-if="event.endDate"> - {{event.endDate | moment("dddd, MMMM Do YYYY") }}</span><span v-if="event && event.venue && event.venue.title"> | {{event.venue.title}}</span><span v-if="event && event.venue && event.venue.address && event.venue.address.city"> | {{event.venue.address.city}}</span>
            </div>
        </div> -->


<!-- v-if="(!venueEventsSearchResults || venueEventsSearchResults.length == 0) && !results && (!taggedEvents || taggedEvents.length == 0) && !showVenues && !showPrevNext" -->
        
        <!--INITIAL LOAD-->
        <!-- <div v-for="event in infiniteEvents" :key="event.id" class="eventCard" v-if="showInfinite">
          <img :data-src="(event.photoUrl || event.venue.photoUrl)" alt="">
          <span class="flex align-center">
            <h3 v-bind:class="{ strike: event.status == 'cancelled' }">{{event.title}}</h3>
            <button v-if="event.published" class="btn btn__icon ml-5" @click="unpublish(event)">
              <i class="fas fa-eye" style="color:#5cb85c;"></i>
            </button>
            <button v-if="!event.published" class="btn btn__icon ml-5" @click="publish(event)">
              <i class="fas fa-eye-slash" style="color:#d9534f;"></i>
            </button>
            <button v-if="((!event.status || event.status != 'cancelled') && !event.showCancel)" class="btn btn__icon ml-5" @click="showCancel(event)">
              <i class="fas fa-times" style="color:#d9534f;"></i>
            </button>
            <button v-if="event.showCancel && event.status != 'cancelled'" class="btn btn__small btn__primary ml-3" @click="cancelCancel(event)">
              don't cancel event
            </button>
            <button v-if="event.showCancel && event.status != 'cancelled'" class="btn btn__small btn__danger ml-3" @click="cancel(event)">
              cancel event
            </button>
            <button v-if="event.status == 'cancelled'" class="btn btn__small btn__success ml-3" @click="activate(event)">
              activate
            </button>
          </span>
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
            <div class="flex"> -->
              <!-- <button class="btn btn__small btn__flat" style="color:blue !important;" v-for="tag in event.tags" :key="tag.id">
                {{tag.title}}
              </button> -->
             <!--  <v-select
                  label="title" 
                  :options="tags"
                  multiple
                  v-model="event.tags"
                  @input="setTag(event)"
                  style="min-width: 160px;"
                  >
                </v-select>
            </div>
          </div>
        </div> -->

        <!--PREV AND NEXT-->
<!--         <div v-for="event in visibleEvents" :key="event.id" class="eventCard" v-if="(!venueEventsSearchResults || venueEventsSearchResults.length == 0) && !results && (!taggedEvents || taggedEvents.length == 0) && !showVenues && showPrevNext">
          <img :data-src="(event.photoUrl || event.venue.photoUrl)" alt="">
          <span class="flex align-center">
            <h3 v-bind:class="{ strike: event.status == 'cancelled' }">{{event.title}}</h3>
            <button v-if="event.published" class="btn btn__icon ml-5" @click="unpublish(event)">
              <i class="fas fa-eye" style="color:#5cb85c;"></i>
            </button>
            <button v-if="!event.published" class="btn btn__icon ml-5" @click="publish(event)">
              <i class="fas fa-eye-slash" style="color:#d9534f;"></i>
            </button>
            <button v-if="((!event.status || event.status != 'cancelled') && !event.showCancel)" class="btn btn__icon ml-5" @click="showCancel(event)">
              <i class="fas fa-times" style="color:#d9534f;"></i>
            </button>
            <button v-if="event.showCancel" class="btn btn__small btn__primary ml-3" @click="cancelCancel(event)">
              don't cancel event
            </button>
            <button v-if="event.showCancel" class="btn btn__small btn__danger ml-3" @click="cancel(event)">
              cancel event
            </button>
            <button v-if="event.status == 'cancelled'" class="btn btn__small btn__success ml-3" @click="activate(event)">
              activate
            </button>
          </span>
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
            <div class="flex">
              <v-select
                  label="title" 
                  :options="tags"
                  multiple
                  v-model="event.tags"
                  @input="setTag(event)"
                  style="min-width: 160px;"
                  >
                </v-select>
            </div>
          </div>

        </div> -->
        
      </div>

      <div class="mb-3 mt-3 flex justify-space-between" v-if="showInfinite || showPrevNext">
        <button class="btn btn__accent" @click="loadPrev()">Prev</button>
        <button class="btn btn__accent" @click="loadNext()">Next</button>
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
import router from '@/router'
import EventCard from '@/components/EventCard.vue'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'eventsOLD',
  data: () => ({
    searchText: '',
    results: null,
    showInfinite: true,
    showPrevNext: false,
    showVenues: false,
    showSearch: false,
    showCancelled: false,
    activeTag: '',
    visibleEvents: [],
    performingRequest: false,
    performingRequest2: false,
  }),
  // created () {
  //   this.$store.dispatch("get2022Events")
  // },
  created () {
    // this.$store.dispatch("getInfiniteEvents")
    // if (!this.venues || this.venues.length < 1) {
    //   this.$store.dispatch("getVenues")
    // }
    if (!this.infiniteEvents || this.infiniteEvents.length < 1) {
      this.$store.dispatch("getInfiniteEvents")
    }
    
  },
  async mounted() {
    this.$store.dispatch("getTagsState")
    // this.$store.dispatch("getVenues")
  },
  computed: {
    ...mapState(['infiniteEvents', 'cancelledEvents', 'prevInfiniteEvents', 'nextInfiniteEvents', 'lastVisibleEventSnapShot', 'firstVisibleEventSnapShot', 'venues', 'venueEventsSearchResults', 'tags', 'taggedEvents', 'eventsSearchResults']),
    // ...mapState(['events2021', 'events2022']),
    // eventsSearchResults() {
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
  // mounted() {
  //   this.$store.dispatch("getNextInfiniteEvents")
  //   this.$store.dispatch("getPrevInfiniteEvents")
  // },
  methods: {
    // loadInit() {
    //   this.performingRequest = true
    //   this.visibleEvents.push(...this.infiniteEvents);
    //   setTimeout(() => {
    //     this.$store.dispatch("getNextInfiniteEvents")
    //     this.$store.dispatch("getPrevInfiniteEvents")
    //     this.performingRequest = false
    //   }, 1000)
    // },
    unpublish(event) {
      this.performingRequest = true
      event.published = false
      fb.eventsCollection.doc(event.id).update({
        published: false
      })
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    publish(event) {
      console.log(event)
      this.performingRequest = true
      event.published = true
      fb.eventsCollection.doc(event.id).update({
        published: true
      })
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    showCancel(event) {
      this.performingRequest = true
      event.showCancel = true
      fb.eventsCollection.doc(event.id).update({
        showCancel: true
      })
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    cancelCancel(event) {
      this.performingRequest = true
      event.showCancel = false
      fb.eventsCollection.doc(event.id).update({
        showCancel: false
      })
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    cancel(event) {
      this.performingRequest = true
        event.status = 'cancelled',
        event.published = false
      fb.eventsCollection.doc(event.id).update({
        status: 'cancelled',
        published: false
      })
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    activate(event) {
      this.performingRequest = true
      event.status = 'active'
      event.published = true
      fb.eventsCollection.doc(event.id).update({
        status: 'active'
      })
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    updateEvent(event) {
      this.$store.dispatch('updateEvent', event)
    },
    setTag(value) {
      this.$store.dispatch('updateEvent', value)
    },
    loadPrev() {
      this.visibleEvents = []
      this.$store.dispatch("getPrevInfiniteEvents")
      this.performingRequest = true
      this.showPrevNext = true
      this.searchText = ''
      this.showCancelled = false
      this.showInfinite = false
      this.visibleEvents.push(...this.prevInfiniteEvents);
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    loadNext() {
      this.visibleEvents = []
      this.$store.dispatch("getNextInfiniteEvents")
      this.performingRequest = true
      this.searchText = ''
      this.showInfinite = false
      this.showCancelled = false
      this.showPrevNext = true
      this.visibleEvents.push(...this.nextInfiniteEvents);
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    setSelectedVenue(value) {
      this.showPrevNext = false
      this.showVenues = true
      this.showInfinite = false
      this.showCancelled = false
      this.showSearch = false
      this.performingRequest = true
      this.activeTag = ''
      this.searchText = ''
      if (value && value.id) {
        this.$store.dispatch("getVenueEventsSearchResults", value.id)
          setTimeout(() => {
          this.performingRequest = false
        }, 2500)
      }
      if (!value) {
        this.$store.dispatch("clearVenueEventsSearchResults")
        this.showVenues = false
        this.performingRequest = true
        this.showInfinite = true
        this.searchText = ''
        this.showSearch = false
        this.visibleEvents.push(...this.infiniteEvents);
        setTimeout(() => {
          this.performingRequest = false
        }, 1000)
      }
      
    },
    clearTags() {
      this.activeTag = ''
      this.$store.dispatch("clearTaggedEvents")
    },
    choseTag(tag){
      this.performingRequest = true
      this.showInfinite = false
      this.searchText = ''
      this.showVenues = false
      this.showCancelled = false
      this.showSearch = false
      this.activeTag = tag
      this.$store.dispatch("getTaggedEvents", tag)
      setTimeout(() => {
        this.performingRequest = false
      }, 5000)
    },
    clearSearch() {
      this.performingRequest = true
      this.showInfinite = true
      this.showCancelled = false
      this.searchText = ''
      this.showSearch = false
      this.visibleEvents.push(...this.infiniteEvents);
      this.$store.dispatch("clearSearchEvents")
      
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    showCancelledEvents() {
      this.performingRequest = true
      this.activeTag = ''
      this.searchText = ''
      this.showVenues = false
      this.showCancelled = true
      this.showInfinite = false
      this.showPrevNext = false
      this.showSearch = false
      this.$store.dispatch("clearTaggedEvents")
      // if (this.searchText.length >= 1) {
      //   this.results = this.eventsSearchResults
      // }
      
      setTimeout(() => {
        this.performingRequest = false
      }, 5000)
    },
    updateSearch() {
      this.performingRequest2 = true
      this.activeTag = ''
      this.showVenues = false
      this.showInfinite = false
      this.showPrevNext = false
      this.showSearch = true
      this.$store.dispatch("clearTaggedEvents")

      if (this.searchText.length >= 2) {
        // this.results = this.eventsSearchResults
        this.$store.dispatch("searchEvents", this.searchText)
      }
      
      setTimeout(() => {
        this.performingRequest2 = false
      }, 5000)
    },
    // show2021() {
    //   this.performingRequest = true
    //   this.is2022 = false
    //   this.$store.dispatch('clear2022EventsState')
    //   this.$store.dispatch("get2021Events")
      
    //   setTimeout(() => {
        
    //     this.is2021 = true
    //     this.performingRequest = false
    //   }, 2000)
    // },
    // show2022() {
    //   this.performingRequest = true
    //   this.is2021 = false
    //   this.$store.dispatch('clear2021EventsState')
    //   this.$store.dispatch("get2022Events")
      
    //   setTimeout(() => {
        
    //     this.is2022 = true
    //     this.performingRequest = false
    //   }, 2000)
    // },
  },
  destroyed () {
    this.performingRequest = false
    this.searchText = false
    this.results = null
    this.showInfinite = false
    this.showSearch = false
    this.activeTag = ''
    this.showPrevNext = false
    this.showVenues = false
    this.visibleEvents = []
    delete this.searchText
    delete this.results
    delete this.showInfinite
    delete this.showSearch
    delete this.activeTag
    delete this.showPrevNext
    delete this.showVenues
    delete this.visibleEvents
    delete this.performingRequest
    console.log(this)
    this.$store.dispatch('clearEventsState')
  },
  // destroyed() {
  //   window.removeEventListener("scroll", this.handleScroll);
  // },
}
</script>