<template>
  <div class="dashboard">
    <Loader v-if="performingRequest" />
    <div class="dashboard__container">
      <div class="dashboard__container--header mb-3">
        <h1>Events</h1>
        <span class="search flex">
          
          <input type="text" placeholder="search" v-model.trim="searchText" style="background: white; padding: 0 1rem;" class="mr-5" />
          <div v-if="searchText.length > 1">
            <button class="btn btn__accent" @click="clearSearch()">clear</button>
          </div>
          <div>
            <button class="btn btn__accent" @click="updateSearch()">submit</button>
          </div>
        
          <v-select
            label="title" 
            :options="venues"
            placeholder="choose venue"
            @input="setSelectedVenue"
            style="min-width:320px"
            >
          </v-select>


          <router-link :to="{name: 'addevent'}" class="color--text">
            <button class="btn btn__flat ml-3"><i class="fas fa-plus fa-2x"></i></button>
          </router-link>
        </span>
      </div>


      <div class="mb-3 mt-3 flex justify-space-between" v-if="(!venueEventsSearchResults || venueEventsSearchResults.length == 0) && !results && (!taggedEvents || taggedEvents.length == 0) && !showVenues && (infiniteEvents && infiniteEvents.length > 0)">
        <button class="btn btn__accent" @click="loadPrev()">Prev</button>
        <button class="btn btn__accent" @click="loadNext()">Next</button>
      </div>


      <div class="dashboard__container--bodys eventCardContainer">
        <Loader v-if="performingRequest" />
        <Loader v-if="(!infiniteEvents || infiniteEvents.length < 1)" />

        <!-- <div v-for="event in results" :key="event.id" class="eventCard" v-if="!taggedEvents || taggedEvents.length == 0 && !showVenues" @click="onRowClick(event)">
          <img :data-src="(event.photoUrl || event.venue.photoUrl)" alt="">
          <h3>{{event.title}}</h3>
          <div class="caption">{{event.startDate | moment("dddd, MMMM Do YYYY") }}<span v-if="event.endDate"> - {{event.endDate | moment("dddd, MMMM Do YYYY") }}</span><span v-if="event && event.venue && event.venue.title"> | {{event.venue.title}}</span><span v-if="event && event.venue && event.venue.address && event.venue.address.city"> | {{event.venue.address.city}}</span>
            </div>
        </div> -->

        <div v-for="event in filteredEvents" :key="event.id" class="eventCard" v-if="showSearch">
          <h3>{{event.title}}</h3>
          <div class="caption">{{event.startDate | moment("dddd, MMMM Do YYYY") }}<span v-if="event.endDate"> - {{event.endDate | moment("dddd, MMMM Do YYYY") }}</span><span v-if="event && event.venue && event.venue.title"> | {{event.venue.title}}</span><span v-if="event && event.venue && event.venue.address && event.venue.address.city"> | {{event.venue.address.city}}</span>
          </div>
          <div class="flex mt-2">
            <router-link :to="`/events/` + event.id">
              <button class="btn btn__small btn__outlined mr-3">Edit</button>
            </router-link>
            <router-link :to="`/events/` + event.id + `/timesheets`">
              <button class="btn btn__small btn__outlined mr-3" >Timesheets</button>
            </router-link>
            <router-link :to="`/events/` + event.id + `/shifts`">
              <button class="btn btn__small btn__outlined mr-3" >Shifts</button>
            </router-link>
            <router-link :to="`/eventplacements/` + event.id">
              <button class="btn btn__small btn__outlined mr-3" >Placements</button>
            </router-link>
          </div>
        </div>

        <!-- <div v-for="event in taggedEvents" :key="event.id" class="eventCard" v-if="(!venueEventsSearchResults || venueEventsSearchResults.length == 0) && !results && taggedEvents.length > 0 && !showVenues" @click="onRowClick(event)">
          <img :data-src="(event.photoUrl || event.venue.photoUrl)" alt="">
          <h3>{{event.title}}</h3>
          <div class="caption">{{event.startDate | moment("dddd, MMMM Do YYYY") }}<span v-if="event.endDate"> - {{event.endDate | moment("dddd, MMMM Do YYYY") }}</span><span v-if="event && event.venue && event.venue.title"> | {{event.venue.title}}</span><span v-if="event && event.venue && event.venue.address && event.venue.address.city"> | {{event.venue.address.city}}</span>
            </div>
        </div> -->

        <div v-for="event in infiniteEvents" :key="event.id" class="eventCard" v-if="(!venueEventsSearchResults || venueEventsSearchResults.length == 0) && !results && (!taggedEvents || taggedEvents.length == 0) && !showVenues && !showPrevNext">
          <!-- <img :data-src="(event.photoUrl || event.venue.photoUrl)" alt=""> -->
          <h3>{{event.title}}</h3>
          <div class="caption">{{event.startDate | moment("dddd, MMMM Do YYYY") }}<span v-if="event.endDate"> - {{event.endDate | moment("dddd, MMMM Do YYYY") }}</span><span v-if="event && event.venue && event.venue.title"> | {{event.venue.title}}</span><span v-if="event && event.venue && event.venue.address && event.venue.address.city"> | {{event.venue.address.city}}</span>
            </div>
          <div class="flex mt-2">
            <router-link :to="`/events/` + event.id">
              <button class="btn btn__small btn__outlined mr-3">Edit</button>
            </router-link>
            <router-link :to="`/events/` + event.id + `/timesheets`">
              <button class="btn btn__small btn__outlined mr-3" >Timesheets</button>
            </router-link>
            <router-link :to="`/events/` + event.id + `/shifts`">
              <button class="btn btn__small btn__outlined mr-3" >Shifts</button>
            </router-link>
            <router-link :to="`/eventplacements/` + event.id">
              <button class="btn btn__small btn__outlined mr-3" >Placements</button>
            </router-link>
          </div>
        </div>

        <div v-for="event in visibleEvents" :key="event.id" class="eventCard" v-if="(!venueEventsSearchResults || venueEventsSearchResults.length == 0) && !results && (!taggedEvents || taggedEvents.length == 0) && !showVenues && showPrevNext">
          <!-- <img :data-src="(event.photoUrl || event.venue.photoUrl)" alt=""> -->
          <h3>{{event.title}}</h3>
          <div class="caption">{{event.startDate | moment("dddd, MMMM Do YYYY") }}<span v-if="event.endDate"> - {{event.endDate | moment("dddd, MMMM Do YYYY") }}</span><span v-if="event && event.venue && event.venue.title"> | {{event.venue.title}}</span><span v-if="event && event.venue && event.venue.address && event.venue.address.city"> | {{event.venue.address.city}}</span>
          </div>
          <div class="flex mt-2">
            <router-link :to="`/events/` + event.id">
              <button class="btn btn__small btn__outlined mr-3">Edit</button>
            </router-link>
            <router-link :to="`/events/` + event.id + `/timesheets`">
              <button class="btn btn__small btn__outlined mr-3" >Timesheets</button>
            </router-link>
            <router-link :to="`/events/` + event.id + `/shifts`">
              <button class="btn btn__small btn__outlined mr-3" >Shifts</button>
            </router-link>
            <router-link :to="`/eventplacements/` + event.id">
              <button class="btn btn__small btn__outlined mr-3" >Placements</button>
            </router-link>
          </div>

        </div>
        
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

export default {
  name: 'events',
  data: () => ({
    searchText: '',
    results: null,
    showSearch: false,
    activeTag: '',
    showPrevNext: false,
    showVenues: false,
    visibleEvents: [],
    performingRequest: false,
  }),
  // created () {
  //   this.$store.dispatch("get2022Events")
  // },
  created () {
    this.$store.dispatch("getInfiniteEvents")
    // window.addEventListener("scroll", this.handleScroll, false);
    
  },
  async mounted() {
    this.$store.dispatch("getVenues")
  },
  computed: {
    ...mapState(['infiniteEvents', 'prevInfiniteEvents', 'nextInfiniteEvents', 'lastVisibleEventSnapShot', 'firstVisibleEventSnapShot', 'allEvents', 'taggedEvents', 'venues', 'venueEventsSearchResults']),
    // ...mapState(['events2021', 'events2022']),
    filteredEvents() {
      return this.allEvents.filter(
        (x => x.title.toLowerCase().includes(this.searchText.toLowerCase())) || 
        (x => x.venueInfo.title.toLowerCase().includes(this.searchText.toLowerCase())) || 
        (x => x.venueInfo.address.city.toLowerCase().includes(this.searchText.toLowerCase()))
      )
    }
  },
  components: {
    Loader,
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
    loadPrev() {
      this.visibleEvents = []
      this.$store.dispatch("getPrevInfiniteEvents")
      this.performingRequest = true
      this.showPrevNext = true
      this.visibleEvents.push(...this.prevInfiniteEvents);
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    loadNext() {
      this.visibleEvents = []
      this.$store.dispatch("getNextInfiniteEvents")
      this.performingRequest = true
      this.showPrevNext = true
      this.visibleEvents.push(...this.nextInfiniteEvents);
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    setSelectedVenue(value) {
      this.showPrevNext = false
      this.showVenues = true
      this.showSearch = false
      this.performingRequest = true
      this.activeTag = ''
      this.searchText = ''
      if (value && value.id) {
        this.$store.dispatch("getVenueEventsSearchResults", value.id)
      }
      if (!value) {
        this.$store.dispatch("clearVenueEventsSearchResults")
        this.showVenues = false
      }
      setTimeout(() => {
        this.performingRequest = false
      }, 5000)
    },
    // onRowClick(item) {
    //   let url = `/events/` + item.slug
    //   console.log(url)
    //   router.push(url)
    // },
    // loadMore() {
    //   this.performingRequest = true
    //   this.$store.dispatch("getNextInfiniteEvents")
    //   // this.visibleEvents = this.infiniteEvents.concat(this.nextInfiniteEvents)
    //   // this.visibleEvents.push(this.nextInfiniteEvents)
    //   this.visibleEvents.push(...this.nextInfiniteEvents);
    //   this.performingRequest = false
    // },
    // handleScroll(event) {
    //   let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
    //   if (bottomOfWindow) {
    //     // let next = this.visibleEvents[this.visibleEvents.length - 1]
    //     this.performingRequest = true
    //     this.$store.dispatch("getNextInfiniteEvents")
    //     // this.visibleEvents = this.infiniteEvents.concat(this.nextInfiniteEvents)
    //     // this.visibleEvents.push(this.nextInfiniteEvents)
    //     this.visibleEvents.push(...this.nextInfiniteEvents);
    //     this.performingRequest = false
    //   }
    // },
    clearTags() {
      this.activeTag = ''
      this.$store.dispatch("clearTaggedEvents")
    },
    choseTag(tag){
      this.performingRequest = true
      this.searchText = ''
      this.showVenues = false
      this.showSearch = false
      this.activeTag = tag
      this.$store.dispatch("getTaggedEvents", tag)
      setTimeout(() => {
        this.performingRequest = false
      }, 5000)
    },
    clearSearch() {
      this.performingRequest = true
      this.searchText = ''
      this.showSearch = false
      this.visibleEvents.push(...this.infiniteEvents);
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    updateSearch() {
      this.performingRequest = true
      this.activeTag = ''
      this.showVenues = false
      this.showPrevNext = false
      this.showSearch = true
      this.$store.dispatch("clearTaggedEvents")
      if (this.searchText.length >= 1) {
        this.results = this.filteredEvents
      }
      
      setTimeout(() => {
        this.performingRequest = false
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
  beforeDestroy () {
    this.performingRequest = false
    this.is2021 = false
    this.is2022 = false
    this.showAll = false
    this.columns = false
    delete this.is2021
    delete this.is2022
    delete this.showAll
    delete this.columns
    delete this.performingRequest
    console.log(this)
    this.$store.dispatch('clearEventsState')
  },
  // destroyed() {
  //   window.removeEventListener("scroll", this.handleScroll);
  // },
}
</script>