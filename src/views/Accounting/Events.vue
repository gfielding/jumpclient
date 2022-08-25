<template>
  <div class="dashboard">
    <Loader v-if="performingRequest || events.length == 0" />
    <div class="dashboard__container">
      <div class="dashboard__container--header eventsHeader">
        <span style="display: flex;
    width: 100%;
    justify-content: space-between;">
          <h1>Event Accounting</h1>
        </span>
        
        <span class="search flex">
          
          <input v-if="showIncomplete || showSearch" type="text" placeholder="search" v-model.trim="searchText" style="background: white; padding: 0 1rem; min-height: 38px; min-width: 120px;" class="mr-3" />
          <input v-if="showComplete || showSearchComplete" type="text" placeholder="search" v-model.trim="searchCompleteText" style="background: white; padding: 0 1rem; min-height: 38px; min-width: 120px;" class="mr-3" />
          <!-- <div style="margin:auto;" v-if="showSearch">
            <button class="btn btn__primary mr-5" @click="clearSearch()">clear</button>
          </div> -->
          <!-- <div style="margin:auto;" v-if="searchText.length > 1 && !showSearch">
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
        </span>
      </div>


      <div class="dashboard__container--body eventCardContainer">
        <Loader v-if="performingRequest" />

        <!--Incomplete-->
        <EventCard v-if="showIncomplete" :events="filteredEvents" :accounting="true" />
        <!--Partial-->
        <EventCard v-if="showPartial" :events="partialEvents" :accounting="true" />
        <!--Complete-->
        <EventCard v-if="showComplete" :events="filteredCompleteEvents" :accounting="true" />
        <!--Cancelled-->
        <EventCard v-if="showCancelled" :events="eventsCancelled" :accounting="true" />
        <!--Search-->
        <!-- <EventCard v-if="showSearch" :events="filteredEvents" :accounting="true" /> -->
        <!--SearchComplete-->
        <!-- <EventCard v-if="showSearchComplete" :events="filteredCompleteEvents" :accounting="true" /> -->
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
    showSearch: false,
    showSearchComplete: false,
    searchText: '',
    searchCompleteText: '',
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
    this.$store.dispatch("getAccountingEvents1")
    // window.addEventListener("scroll", this.handleScroll, false);
  },
  async mounted() {
    this.$store.dispatch("getAccountingEvents2")
  },
  computed: {
     ...mapState(['events', 'completeEvents', 'partialEvents', 'eventsCancelled']),
    // ...mapState(['infiniteEvents', 'cancelledEvents', 'prevInfiniteEvents', 'nextInfiniteEvents', 'lastVisibleEventSnapShot', 'firstVisibleEventSnapShot', 'allEvents', 'venues', 'venueEventsSearchResults', 'tags']),
    // ...mapState(['events2021', 'events2022']),
    filteredEvents() {
      if (this.searchText && this.searchText.length > 3) {
        return this.events.filter(
          (x => x.title.toLowerCase().includes(this.searchText.toLowerCase())) || 
          (x => x.venueInfo.title.toLowerCase().includes(this.searchText.toLowerCase())) || 
          (x => x.venueInfo.address.city.toLowerCase().includes(this.searchText.toLowerCase()))
        )
        // return this.showSearchedEvents()
      } else {
        return this.events
      }
    },
    filteredCompleteEvents() {
      if (this.searchCompleteText && this.searchCompleteText.length > 3) {
        return this.completeEvents.filter(
          (x => x.title.toLowerCase().includes(this.searchCompleteText.toLowerCase())) || 
          (x => x.venueInfo.title.toLowerCase().includes(this.searchCompleteText.toLowerCase())) || 
          (x => x.venueInfo.address.city.toLowerCase().includes(this.searchCompleteText.toLowerCase()))
        )
        
      } else {
        return this.completeEvents
      }
    },
    // searchCount() {
    //   if (this.searchText && this.searchText.length > 3) {
    //     return this.showSearchedEvents()
    //   }
    // },
    // searchCompleteCount() {
    //   if (this.searchCompleteText && this.searchCompleteText.length > 3) {
    //     return this.showSearchedCompleteEvents()
    //   }
    // }
  },
  components: {
    Loader,
    EventCard
  },
  methods: {
    showCompleteEvents() {
      this.performingRequest = true
      this.showComplete = true
      this.showCancelled = false
      this.showSearch = false
      this.showPartial = false
      this.showIncomplete = false
      this.showSearchComplete = false
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    showPartialEvents() {
      this.performingRequest = true
      this.showComplete = false
      this.showCancelled = false
      this.showSearch = false
      this.showPartial = true
      this.showIncomplete = false
      this.showSearchComplete = false
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    showIncompleteEvents() {
      this.performingRequest = true
      this.showComplete = false
      this.showCancelled = false
      this.showSearch = false
      this.showPartial = false
      this.showIncomplete = true
      this.showSearchComplete = false
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    showCancelledEvents() {
      this.performingRequest = true
      this.showComplete = false
      this.showCancelled = true
      this.showSearch = false
      this.showPartial = false
      this.showIncomplete = false
      this.showSearchComplete = false
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
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