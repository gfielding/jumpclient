<template>
<div class="dashboard">
    <Loader v-if="!eventInfo || !eventInfo.id" />
    <div class="dashboard__container pb-0" v-if="eventInfo && eventInfo.id">
      <div class="dashboard__container--header">
        <div class="flex align-center">
          <span>
          <h1 v-if="eventInfo && eventInfo.title" class="pb-1">{{eventInfo.title}}</h1>
          <span v-if="eventInfo && eventInfo.venue && eventInfo.venue.title">
            <p>{{eventInfo.venue.title}}<span v-if="eventInfo.venue && eventInfo.venue.address"> | {{eventInfo.venue.address.city}}, {{eventInfo.venue.address.state}}</span> | {{eventInfo.startDate | moment("ddd, MMM Do YYYY") }}<span v-if="eventInfo.endDate"> - {{eventInfo.endDate | moment("ddd, MMM Do YYYY") }}</span></p>
          </span>
          </span>
          <!-- <button class="btn btn__large btn__success ml-5" v-if="event && event.published" :disabled="event.cancelled">
            Published
          </button>
          <button class="btn btn__large btn__warning ml-5" v-if="event && !event.published" :disabled="event.status == 'cancelled'">
            Draft
          </button>
          <button class="btn btn__large btn__danger ml-5" v-if="event && event.status == 'cancelled'">
            Cancelled
          </button> -->
        </div>
        <div class="flex align-center flex-wrap justify-flex-end">
         <!--  <button class="btn btn__outlined btn__small mr-3" @click="venueSync()">Sync Venue Details</button>
          <button class="btn btn__outlined btn__small mr-3" @click="email()">Preview Info Email</button> -->
          <button class="btn btn__outlined btn__small" @click="goBack()"><i class="fas fa-arrow-left"></i></button>
        </div>

      </div>
      <span class="flex align-start flex-wrap">
        <router-link :to="`/events/${$route.params.id}`">
          <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': isEvent, 'btn__outlined btn__small': !isEvent }">Edit</button>
        </router-link>
        <router-link :to="`/events/${$route.params.id}/checkin`">
          <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': isCheckin, 'btn__outlined btn__small': !isCheckin }">Check-In</button>
        </router-link>
        <router-link :to="`/events/${$route.params.id}/shifts`">
          <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': isShifts, 'btn__outlined btn__small': !isShifts }">Shifts</button>
        </router-link>
        <router-link :to="`/events/${$route.params.id}/placement`">
          <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': isPlacement, 'btn__outlined btn__small': !isPlacement }">Placements</button>
        </router-link>
        <router-link :to="`/events/${$route.params.id}/timesheets`">
          <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': isTimesheets, 'btn__outlined btn__small': !isTimesheets }">Timesheets</button>
        </router-link>
        <router-link :to="`/events/${$route.params.id}/files`">
          <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': isFiles, 'btn__outlined btn__small': !isFiles }">Files</button>
        </router-link>

      
<!-- 
          <router-link :to="`/users/${$route.params.id}/details`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isDetails, 'btn__outlined btn__small': !isDetails }">Details</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/payroll`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isPayroll, 'btn__outlined btn__small': !isPayroll }">Payroll</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/assignments`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isAssignments, 'btn__outlined btn__small': !isAssignments }">Assignments</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/notes`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isNotes, 'btn__outlined btn__small': !isNotes }">Notes</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/reviews`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isReviews, 'btn__outlined btn__small': !isReviews }">Reviews</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/gallery`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isGallery, 'btn__outlined btn__small': !isGallery }">Gallery</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/messages`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isMessages, 'btn__outlined btn__small': !isMessages }">messages</button>
          </router-link>
 -->
        </span>
    </div>
    <router-view :key="$route.params.id" :eventInfo="eventInfo"  />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'eventHome',
  computed: {
    ...mapState(['currentUser', 'eventInfo']),
    isEvent() {
      return this.$route.name == 'eventDetails';
    },
    isCheckin() {
      return this.$route.name == 'eventCheckin';
    },
    isShifts() {
      return this.$route.name == 'eventshifts';
    },
    isPlacement() {
      return this.$route.name == 'eventplacement';
    },
    isTimesheets() {
      return this.$route.name == 'eventtimesheets';
    },
    isFiles() {
      return this.$route.name == 'eventFiles';
    },
    // sheets() {
    //   let url = `/events/` + this.$route.params.id + `/timesheets`
    //   router.push(url)
    // },
    // shifts() {
    //   let url = `/events/` + this.$route.params.id + `/shifts`
    //   router.push(url)
    // },
    // placements() {
    //   let url = `/eventplacements/` + this.$route.params.id
    //   router.push(url)
    // },
    // email() {
    //   let url = `/events/` + this.$route.params.id + `/email`
    //   router.push(url)
    // },
    // checkIn() {
    //   let url = `/events/` + this.$route.params.id + `/checkin`
    //   router.push(url)
    // },
    // files() {
    //   let url = `/events/` + this.$route.params.id + `/files`
    //   router.push(url)
    // }
  },
  created () {
    this.$store.dispatch("getEventFromId", this.$route.params.id);
  },
  components: {
    Loader,
  },
  methods: {
    goBack() {
      router.go(-1)
    },
  },
  destroyed() {
    this.$store.dispatch('clearErrors')
    console.log('destroyed')
  }
}

</script>