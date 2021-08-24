<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <Loader v-if="!venue" />
      <div class="dashboard__container--header" v-if="venue">
        <h1>{{venue.title}}</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <form ref="form" @submit.prevent>
      	<div class="dashboard__container--body" v-if="venue">
      		<div class="dashboard__container--body--col">
    				<!-- <div class="mb-3">
    					<label>
				        <gmap-autocomplete
				          @place_changed="setPlace" :options="{fields: ['geometry', 'address_components']}" placeholder="Address">
				        </gmap-autocomplete>
				      </label>
    				</div> -->
            <div class="flex flex-column align-center">
              <div class="event-wrapper" :style="{ backgroundImage: 'url(' + backgroundUrl + ')' }">
                <croppa 
                v-model="croppa"
                :prevent-white-space="true"
                :width="300"
                :height="100"
                accept=".jpeg,.png,.jpg,.svg"
                :file-size-limit="2048000"
                :quality="6"
                :placeholder="'Upload Image'"
                placeholder-color="white"
                initial-size="cover"
                :remove-button-size="32"
                @file-size-exceed="onFileSizeExceed"
                @file-type-mismatch="onFileTypeMismatch"
              >
              </croppa>
              </div>
              <p class="caption mt-3">jpg or png file. 2MB max</p>
            </div>

    				<div class="mb-3">
    					<label for="venueName">Venue Name:</label>
    					<input type="text" v-model.trim="venue.title" id="venueName" />
    				</div>
    				<div class="mb-3">
    					<label for="venueVisibility">Visibile:</label>
    					<input type="checkbox" v-model.trim="venue.visible" id="venueVisibility" class="ml-3" />
    				</div>
      		</div>
          
      		<div class="dashboard__container--body--col">
      			<gmap-map v-if="venue && venue.center" class="mb-5" :center="venue.center" :zoom="12"  style="width: 100%; height: 300px">
              <GmapMarker
                :position="venue.center"
                :clickable="false"
              >
              </GmapMarker>
            </gmap-map>
      		</div>
          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="details">Venue Details:</label>
              <vue-editor id="details" v-model.trim="venue.details" placeholder="General uses, parking, staff entrance, etc."></vue-editor>
            </div>
          </div>
          <div class="dashboard__container--body--col" style="background: transparent;">
            <div class="flex justify-space-between">
              <button class="btn btn__primary btn__large" @click="updateVenue()">
                Update Venue
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>
              <button class="btn btn__dark" @click="deleteVenue()">delete</button>
            </div>
          </div>
      	</div>
      </form>
      <div class="dashboard__container--body" v-if="venueEvents && venueEvents.length >= 1">
        <h3>Events for this Venue</h3>
         <vue-good-table
            :columns="columns"
            :rows="venueEvents"
            compactMode
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 10,
            }"
            @on-row-click="onRowClick"
          >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'startDate'">
              {{props.row.startDate | moment("ddd, MMM Do YYYY") }}
              <span v-if="props.row.endDate">
                  - {{props.row.endDate | moment("ddd, MMM Do YYYY") }}
              </span>
            </span>
             <span v-else>
              {{props.formattedRow[props.column.field]}}
            </span>
          </template>
        </vue-good-table>
      </div>
    </div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
import { VueEditor } from "vue2-editor";
const fb = require('../../firebaseConfig.js')

export default {
  name: 'venue',
  data: () => ({
    center: { lat: 45.508, lng: -73.587 },
    marker: {},
    address: {},
    place: '',
    currentPlace: null,
    performingRequest: false,
    croppa: {},
    columns: [
      {
        label: 'Event',
        field: 'title',
      },
      {
        label: 'Date',
        field: 'startDate',
      },
    ]
  }),
   computed: {
    ...mapState(['venueInfo', 'venueEvents']),
    venue() {
      return this.venueInfo
    },
    backgroundUrl() {
      return this.venue.photoUrl || 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/stadium.png?alt=media&token=89f2362c-d1bc-4338-a837-fad1d664c51d'
    }
  },
  created () {
    this.$store.dispatch("getVenueFromId", this.$route.params.id);
  },
   components: {
    Loader,
    VueEditor
  },
  methods: {
    onFileTypeMismatch(file) {
      alert('Invalid file type. Please choose a jpeg or png file.')
    },
    onFileSizeExceed(file) {
      alert('Please choose a file smaller than 2MB')
    },
    onRowClick(params) {
      let url = `/events/` + params.row.id
      console.log(url)
      router.push(url)
    },
    setPlace(place) {
      this.currentPlace = place
        if (this.currentPlace) {
          const marker = {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
          };
          this.marker = {position: marker}
          this.place = this.currentPlace
          this.center = marker;
          this.currentPlace = null;
        }
        if (place.address_components) {
          var components = place.address_components;
          for (var i = 0, component; component = components[i]; i++) {
          if (component.types[0] == 'street_number') {
              this.address.street_number = component['long_name'];
          }
          if (component.types[0] == 'route') {
              this.address.street = component['long_name'];
          }
          if (component.types[0] == 'locality') {
              this.address.city = component['long_name'];
          }
          if (component.types[0] == 'administrative_area_level_1') {
              this.address.state = component['short_name'];
          }
          if (component.types[0] == 'country') {
              this.address.country = component['short_name'];
          }
          if (component.types[0] == 'postal_code') {
              this.address.zip = component['short_name'];
          }
        }
      }
    },
    addVenue() {
    	let place = this.place
    	let center = this.center
    	let address = this.address
    	let newVenue = {
    		address: address,
    		title: place.name,
    		center: center,
    		visible: place.visible
    	}
    	console.log(newVenue)
    	this.$store.dispatch('addVenue', newVenue)
    },
    updateVenue() {
      this.performingRequest = true
      let venue = this.venueInfo
      let croppa = this.croppa
      let store = this.$store
      if (croppa.hasImage()) {
        croppa.generateBlob(
          blob => {
            let croppaURL
            let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
            let picRef = fb.storageRef.child('venueImages/' + rand)
            picRef.put(blob).then((snap) => {
              picRef.getDownloadURL().then(function(croppaURL) {
                console.log('File available at', croppaURL)
                venue.photoUrl = croppaURL
                store.dispatch('updateVenue', venue)
              })
            })
          }
        )
        setTimeout(() => {
          this.performingRequest = false
          croppa.remove()
          let url = `/venues`
          router.push(url)
        }, 2000)
      } else {
        console.log(venue)
        this.$store.dispatch('updateVenue', venue)
        setTimeout(() => {
          croppa.remove()
          this.performingRequest = false
          let url = `/venues`
          router.push(url)
        }, 2000)
      }
    },
    deleteVenue() {
      let venue = this.venueInfo
      this.$store.dispatch('deleteVenue', venue.id)
      let url = `/venues`
      router.push(url)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearVenueState')
  	this.$store.dispatch('clearErrors')
    console.log(this)
  }
}
</script>