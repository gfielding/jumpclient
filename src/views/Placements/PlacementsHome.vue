<template>
	<div class="dashboard">
    <div class="dashboard__container">
    	<div class="flex justify-space-between">
    		<div class="dashboard__container--body--col hidden-small">
    			<p>Unplaced By Date</p>
	    		<v-select
		        class="mt-2"
		        :options="eventDays"
		        v-model="selected"
		        @input="setSelected"
		      >
		      </v-select>
		    </div>
		    <div class="dashboard__container--body--col">
		    	<p>By Event</p>
		      <v-select
		        class="mt-2"
		        label="title" 
		        :options="events"
		        v-model="selectedEvent"
		        @input="setSelectedEvent" 
		      >
			      <template #option="{ title, startDate, venue }">
			      	<span v-if="title">
				      	<span>{{ title }} </span>, {{startDate | moment("ddd, MMM Do YYYY")}}</span>
				      </span>
				    </template>
		      </v-select>
		    </div>
				<!-- <router-link :to="{name: 'placements'}">
					<button class="btn btn__outlined mr-3">
						No Preference
					</button>
				</router-link>
				<router-link :to="{name: 'eventplacements'}">
					<button class="btn btn__outlined">
						By Event
					</button>
				</router-link> -->
			</div>
			<router-view :key="$route.params.id" />
		</div>	
	</div>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'
import * as moment from 'moment'

	export default {
  	name: 'placementshome',
  	data: () => ({
			selected: '',
			selectedEvent: '',
		}),
  	created () {
	    if (!this.eventDays || this.eventDays.length < 1) {
	      this.$store.dispatch("getEvents")
	    }
	    // this.$store.dispatch("getUsersPerDay")
	  },
	  watch: {
	    '$route' (to, from) {
	      this.selected = ''
				this.selectedEvent = ''
	    }
	  },
		methods: {
	  	setSelected(value) {
	  		console.log(value)
	  		let url = `/placements/day/` + value
	  		router.push(url)
	  	},
	  	setSelectedEvent(value) {
	  		console.log(value)
	  		let url = `/placements/event/` + value.id
	  		router.push(url)
	  	},
	  },
	  computed: {
    ...mapState(['currentUser', 'eventDays', 'events']),
  	},
  	beforeDestroy () {
  		this.selected = ''
			this.selectedEvent = ''
			delete this.selected
			delete this.selectedEvent
	    this.$store.dispatch('clearPlacementsHome')
	    console.log(this)
	  }
	}
</script>