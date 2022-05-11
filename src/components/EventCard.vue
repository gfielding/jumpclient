<template>
	<div>
		<div v-for="event in events" :key="event.id" class="eventCard">
	    <span class="flex align-center">
	      <h3 v-bind:class="{ strike: event.status == 'cancelled' }">{{event.title}}</h3>
	      <span class="ml-3" v-if="accounting && event.invoiceStatus == 'complete'" v-tooltip="'complete'">
          <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#5cb85c;"></i>
        </span>
        <span class="ml-3" v-if="accounting && event.invoiceStatus == 'partial'" v-tooltip="'partial'">
          <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#f0ad4e;"></i>
        </span>
        <span class="ml-3" v-if="accounting && !event.invoiceStatus" v-tooltip="'incomplete'">
          <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#d9534f;"></i>
        </span>
        <span v-if="event.timesheetsUrl && accounting">
        	<a :href="event.timesheetsUrl" target="_blank" class="ml-3">Open Timesheets in Drive <i class="fas fa-external-link"></i></a>
        </span>
        <button v-if="!accounting && event.published" class="btn btn__icon ml-5" @click="unpublish(event)">
          <i class="fas fa-eye" style="color:#5cb85c;"></i>
        </button>
        <button v-if="!accounting && !event.published" class="btn btn__icon ml-5" @click="publish(event)">
          <i class="fas fa-eye-slash" style="color:#d9534f;"></i>
        </button>
        <button v-if="!accounting && ((!event.status || event.status != 'cancelled') && !event.showCancel)" class="btn btn__icon ml-5" @click="showCancel(event)">
          <i class="fas fa-times" style="color:#d9534f;"></i>
        </button>
        <button v-if="!accounting && event.showCancel && event.status != 'cancelled'" class="btn btn__small btn__primary ml-3" @click="cancelCancel(event)">
          don't cancel event
        </button>
        <button v-if="!accounting && event.showCancel && event.status != 'cancelled'" class="btn btn__small btn__danger ml-3" @click="cancel(event)">
          cancel event
        </button>
        <button v-if="!accounting && event.status == 'cancelled'" class="btn btn__small btn__success ml-3" @click="activate(event)">
          activate
        </button>
    	</span>
      <div class="caption">{{event.startDate | moment("dddd, MMMM Do YYYY") }}<span v-if="event.endDate"> - {{event.endDate | moment("dddd, MMMM Do YYYY") }}</span><span v-if="event && event.venue && event.venue.title"> | {{event.venue.title}}</span><span v-if="event && event.venue && event.venue.address && event.venue.address.city"> | {{event.venue.address.city}}<span v-if="event.venue && event.venue.mgrs && event.venue.mgrs.length > 0"> | <span v-for="mgr in event.venue.mgrs" class="mr-3">{{mgr.name}}</span></span></span>
      </div>
      <div class="flex mt-2">
        <div class="flex flex-wrap">
          <router-link :to="`/events/` + event.id">
            <button class="btn btn__small btn__outlined mr-3 mb-1">Edit</button>
          </router-link>
          <router-link :to="`/events/` + event.id + `/timesheets`">
            <button class="btn btn__small btn__outlined mr-3 mb-1" >Timesheets</button>
          </router-link>
          <router-link :to="`/events/` + event.id + `/shifts`">
            <button class="btn btn__small btn__outlined mr-3 mb-1" >Shifts</button>
          </router-link>
          <router-link :to="`/eventplacements/` + event.id">
            <button class="btn btn__small btn__outlined mr-3 mb-1" >Placements</button>
          </router-link>
          <router-link :to="`/events/` + event.id + `/checkin`">
            <button class="btn btn__small btn__outlined mr-3 mb-1" >Check-In</button>
          </router-link>
          <router-link :to="`/accounting/events/` + event.id" target="_blank" v-if="accounting">
            <button class="btn btn__small btn__primary mr-3 mb-1" >Accounting</button>
          </router-link>

        </div>
      <!-- </div>
      <div class="flex" v-if="!accounting && tags && tags.length > 0"> -->
       <!--  <button class="btn btn__small btn__flat" style="color:blue !important;" v-for="tag in event.tags" :key="tag.id">
          {{tag.title}}
        </button> -->
        <v-select
         v-if="!accounting && tags && tags.length > 0"
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
  </div>
</template>

<script>
const fb = require('../firebaseConfig.js')

export default {
	props: ['events', 'accounting', 'tags'],
  methods: {
    unpublish(event) {
      event.published = false
      fb.eventsCollection.doc(event.id).update({
        published: false
      })
    },
    publish(event) {
      console.log(event)
      event.published = true
      fb.eventsCollection.doc(event.id).update({
        published: true
      })
    },
    showCancel(event) {
      event.showCancel = true
      fb.eventsCollection.doc(event.id).update({
        showCancel: true
      })
    },
    cancelCancel(event) {
      event.showCancel = false
      fb.eventsCollection.doc(event.id).update({
        showCancel: false
      })
    },
    cancel(event) {
        event.status = 'cancelled',
        event.published = false
      fb.eventsCollection.doc(event.id).update({
        status: 'cancelled',
        published: false
      })
    },
    activate(event) {
      event.status = 'active'
      event.published = true
      fb.eventsCollection.doc(event.id).update({
        status: 'active'
      })
    },
    setTag(value) {
      this.$store.dispatch('updateEvent', value)
    },
  },
}
</script>