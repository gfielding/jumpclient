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
        <span v-if="event.timesheetsUrl">
        	<a :href="event.timesheetsUrl" target="_blank" class="ml-3">Open Timesheets in Drive <i class="fas fa-external-link"></i></a>
        </span>
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
      </div>
	  </div>
  </div>
</template>

<script>
export default {
	props: ['events', 'accounting']
}
</script>