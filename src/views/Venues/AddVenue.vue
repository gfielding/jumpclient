<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Add Venue</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <form ref="form" @submit.prevent>
      	<div class="dashboard__container--body">
      		<div class="dashboard__container--body--col">
      			<div class="flex flex-column align-center mb-5">
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
    					<label>
				        <gmap-autocomplete
				          @place_changed="setPlace" :options="{fields: ['geometry', 'address_components']}" placeholder="Address">
				        </gmap-autocomplete>
				      </label>
    				</div>
    				<transition name="fade">
    					<div v-if="place">
		    				<div class="mb-3">
		    					<label for="venueName">Venue Name:</label>
	      					<input type="text" v-model.trim="place.name" id="venueName" />
		    				</div>
		    				<div class="mb-3">
		    					<label for="venueVisibility">Visible:</label>
	      					<input type="checkbox" v-model.trim="place.visible" id="venueVisibility" class="ml-3" />
		    				</div>
	    				</div>
	    			</transition>
      		</div>
      		<div class="dashboard__container--body--col">
      			<gmap-map
              :center="center"
              :zoom="12"
              style="width:100%;  height: 400px;"
              v-if="place"
            >
            <gmap-marker
              v-if="marker"
              v-model="marker"
              :position="marker.position"
              @click="center=marker.position"
            ></gmap-marker>
            </gmap-map>
      		</div>
      		<div class="dashboard__container--body--col">
      			<div class="mb-3">
              <label for="details">Venue Details:</label>
              <vue-editor id="details" v-model.trim="place.details" placeholder="General uses, parking, staff entrance, etc."></vue-editor>
            </div>
      		</div>
      		
      		<div class="dashboard__container--body--col">
      			<transition name="fade">
		    			<button v-if="place" class="btn btn__primary" @click="addVenue()">Add Venue
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>
		    		</transition>
      		</div>
      	</div>
      </form>
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
  name: 'addvenue',
  data: () => ({
    center: { lat: 45.508, lng: -73.587 },
    marker: {},
    address: {},
    place: {},
    currentPlace: null,
    croppa: {},
    performingRequest:false,
  }),
  components: {
    Loader,
    VueEditor
  },
  computed: {
    backgroundUrl() {
      return 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/stadium.png?alt=media&token=89f2362c-d1bc-4338-a837-fad1d664c51d'
    }
  },
  methods: {
  	onFileTypeMismatch(file) {
      alert('Invalid file type. Please choose a jpeg or png file.')
    },
    onFileSizeExceed(file) {
      alert('Please choose a file smaller than 2MB')
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
    goBack() {
      router.go(-1)
    },
    addVenue() {
    	this.performingRequest = true
    	let place = this.place
    	let center = this.center
    	let address = this.address
    	let store = this.$store
    	let newVenue = {
    		address: address,
    		title: place.name,
    		center: center,
    		visible: place.visible || false,
    		details: place.details || null
    	}
    	console.log(newVenue)
    	let croppa = this.croppa

    	if (croppa.hasImage()) {
        croppa.generateBlob(
          blob => {
            let croppaURL
            let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
            let picRef = fb.storageRef.child('eventImages/' + rand)
            picRef.put(blob).then((snap) => {
              picRef.getDownloadURL().then(function(croppaURL) {
                console.log('File available at', croppaURL)
                newVenue.photoUrl = croppaURL
                store.dispatch('addVenue', newVenue)
              })
            })
          }
        )
        setTimeout(() => {
          this.performingRequest = false
          croppa.remove()
          let url = `/venues`
          router.push(url)
        }, 5000)
      } else {
        store.dispatch('addVenue', newVenue)
        setTimeout(() => {
          this.performingRequest = false
          let url = `/venues`
          router.push(url)
        }, 2000)
      }
    }
  },
  beforeDestroy () {
  	this.$store.dispatch('clearErrors')
    console.log(this)
  }
}
</script>