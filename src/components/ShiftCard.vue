<template>
	<div>
		<div v-for="(shift, i) in shifts" :key="i" class="eventCard">
	    <span class="flex align-center">
	      <h3 v-bind:class="{ strike: shift.status == 'cancelled' }">{{shift.position.title}} / {{shift.staff}}</h3>
    	</span>
      <h5>
        {{shift.event}}
      </h5>
      <div class="caption">
        {{ [ shift.startTime, "HH:mm" ] | moment("hh:mm A") }} - {{ [ shift.endTime, "HH:mm" ] | moment("hh:mm A") }}
      </div>
     <!--  <div class="caption">{{event.startDate | moment("dddd, MMMM Do YYYY") }}<span v-if="(event.endDate && (event.endDate != event.startDate))"> - {{event.endDate | moment("dddd, MMMM Do YYYY") }}</span><span v-if="event && event.venue && event.venue.title"> | {{event.venue.title}}</span><span v-if="event && event.venue && event.venue.address && event.venue.address.city"> | {{event.venue.address.city}}<span v-if="event.venue && event.venue.mgrs && event.venue.mgrs.length > 0"> | <span v-for="mgr in event.venue.mgrs" class="mr-3">{{mgr.name}}</span></span></span>
      </div> -->
      <div class="flex mt-2">
        <div class="flex flex-wrap">
          <router-link :to="`/events/` + shift.eventId">
            <button class="btn btn__small btn__outlined mr-3 mb-1">Edit Event</button>
          </router-link>
          <router-link :to="`/events/` + shift.eventId + `/shifts`">
            <button class="btn btn__small btn__outlined mr-3 mb-1">Edit Shift</button>
          </router-link>
          <router-link :to="`/events/` + shift.eventId + `/placement`">
            <button class="btn btn__small btn__outlined mr-3 mb-1">Placements</button>
          </router-link>
          <!-- <router-link :to="`/events/` + event.id + `/timesheets`">
            <button class="btn btn__small btn__outlined mr-3 mb-1" >Timesheets</button>
          </router-link>
          <router-link :to="`/events/` + event.id + `/shifts`">
            <button class="btn btn__small btn__outlined mr-3 mb-1" >Shifts</button>
          </router-link>
          <router-link :to="`/events/` + event.id + `/placement`">
            <button class="btn btn__small btn__outlined mr-3 mb-1" >Placements</button>
          </router-link>
          <router-link :to="`/events/` + event.id + `/checkin`">
            <button class="btn btn__small btn__outlined mr-3 mb-1" >Check-In</button>
          </router-link>
          <router-link :to="`/events/` + event.id + `/files`">
            <button class="btn btn__small btn__outlined mr-3 mb-1" >Files</button>
          </router-link> -->
          <!-- <router-link :to="`/accounting/events/` + event.id" target="_blank" v-if="accounting">
            <button class="btn btn__small btn__primary mr-3 mb-1" >Accounting</button>
          </router-link> -->

        </div>
      <!-- </div>
      <div class="flex" v-if="!accounting && tags && tags.length > 0"> -->
       <!--  <button class="btn btn__small btn__flat" style="color:blue !important;" v-for="tag in event.tags" :key="tag.id">
          {{tag.title}}
        </button> -->
        
      </div>
	  </div>
  </div>
</template>

<script>
const fb = require('../firebaseConfig.js')

export default {
	props: ['shifts'],
  // methods: {
  //   unpublish(event) {
  //     event.published = false
  //     fb.eventsCollection.doc(event.id).update({
  //       published: false
  //     })
  //   },
  //   publish(event) {
  //     console.log(event)
  //     event.published = true
  //     fb.eventsCollection.doc(event.id).update({
  //       published: true
  //     })
  //   },
  //   showCancel(event) {
  //     event.showCancel = true
  //     fb.eventsCollection.doc(event.id).update({
  //       showCancel: true
  //     })
  //   },
  //   cancelCancel(event) {
  //     event.showCancel = false
  //     fb.eventsCollection.doc(event.id).update({
  //       showCancel: false
  //     })
  //   },
  //   cancel(event) {
  //       event.status = 'cancelled',
  //       event.published = false
  //     fb.eventsCollection.doc(event.id).update({
  //       status: 'cancelled',
  //       published: false
  //     })
  //   },
  //   activate(event) {
  //     event.status = 'active'
  //     event.published = true
  //     fb.eventsCollection.doc(event.id).update({
  //       status: 'active'
  //     })
  //   },
  //   setTag(value) {
  //     this.$store.dispatch('updateEvent', value)
  //   },
  // },
}
</script>