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
                  <label for="venueFeatured">Featured:</label>
                  <input type="checkbox" v-model.trim="place.featured" id="venueFeatured" class="ml-3" />
                </div>
		    				<div class="mb-3">
		    					<label for="venueVisibility">Visible:</label>
	      					<input type="checkbox" v-model.trim="place.visible" id="venueVisibility" class="ml-3" />
		    				</div>
                <div class="mb-3">
                  <label for="venueVisibility">Vaccination Required:</label>
                  <input type="checkbox" v-model.trim="place.requiredVaccine" id="venueVisibility" class="ml-3" />
                </div>
                <div class="mb-3" v-if="clients.length >= 1">
                  <label for="client">Default Client:</label>
                  <v-select
                    class="mt-2"
                    label="title" 
                    :options="clients"
                    multiple
                    v-model="place.client"
                    >
                  </v-select>
                  <label for="pickDate">Default Jobs:</label>
                    <v-select
                      class="mt-2"
                      label="title" 
                      :options="jobs"
                      multiple
                      v-model="place.job"
                      >
                    </v-select>
                    <label for="client">Select Managers:</label>
                    <v-select
                      class="mt-2"
                      label="name" 
                      multiple
                      :options="mgrs"
                      v-model="place.mgrs"
                      >
                    </v-select>
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

          <!-- <div class="dashboard__container--body--col">
            <h3>Attach Files</h3>

            <div class="mb-3">
              <label for="fileTitle">Details:</label>
              <input class="mb-2" placeholder="File Title" type="text" v-model.trim="fileTitle" id="fileTitle" />
              <textarea placeholder="File Description" name="fileDescription" id="fileDescription" cols="30" rows="2" v-model="fileDescription"></textarea>

              <input class="mt-3" type="file" ref="fileInputTip" accept="image/*,application/pdf,.doc" @change="previewImage">
              <progress :value="uploadValue" max="100" v-if="showBar"></progress>
              <div class="mb-3">
                <button v-if="imageData != null" class="btn btn__primary mt-3" @click="onUploadFile">
                  Upload
                  <transition name="fade">
                    <span class="ml-2" v-if="performingRequest3">
                    <i class="fa fa-spinner fa-spin"></i>
                    </span>
                  </transition>
                </button>
              </div>
              <div v-if="place.files && place.files.length >= 1">
                <vue-good-table
                  :columns="columns"
                  :rows="place.files"
                  >
                  <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field == 'url'">
                      <a :href="props.row.url" target="_blank"><i class="fas fa-external-link"></i></a>
                    </span>
                    <span v-else-if="props.column.field == 'extras'">
                      <button @click="deleteUploadedFile(props.row, props.index)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </span>
                    <span v-else>
                      {{props.formattedRow[props.column.field]}}
                    </span>
                  </template>
                </vue-good-table>
              </div>
            </div>
          </div> -->
          
      		<div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="checkin">Check-In Details:</label>
              <vue-editor id="checkin" v-model="place.checkin"></vue-editor>
            </div>

          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="parking">Parking Details:</label>
              <vue-editor id="parking" v-model="place.parking"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="camping">Camping Details:</label>
              <vue-editor id="camping" v-model="place.camping"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="creds">Credentials Details:</label>
              <vue-editor id="creds" v-model="place.creds"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="covid">COVID Requirements:</label>
              <vue-editor id="covid" v-model="place.covid"></vue-editor>
            </div>
          </div>
          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="attire">Attire:</label>
              <vue-editor id="attire" v-model="place.attire"></vue-editor>
            </div>

            </div>
          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="pay">Pay:</label>
              <vue-editor id="pay" v-model="place.pay"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="pay">Additional Notes:</label>
              <vue-editor id="pay" v-model="place.notes"></vue-editor>
            </div>
          </div>
      		
      		<div class="dashboard__container--body--col" style="background: transparent;">
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
    place: {
      visible: true,
      job:[],
      client:[],
    },
    currentPlace: null,
    croppa: {},
    performingRequest:false,
  }),
  components: {
    Loader,
    VueEditor
  },
  created () {
    if (!this.clients || this.clients.length < 1) {
      this.$store.dispatch("getClients")
    }
    if (!this.jobs || this.jobs.length < 1) {
      this.$store.dispatch("getJobsState")
    }
    if (!this.mgrs || this.mgrs.length < 1) {
      this.$store.dispatch("getMgrsState")
    }
  },
  computed: {
    ...mapState(['jobs', 'clients', 'mgrs']),
    backgroundUrl() {
      return 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/stadium.png?alt=media&token=89f2362c-d1bc-4338-a837-fad1d664c51d'
    }
  },
  methods: {
    // previewImage(event) {
    //   this.uploadValue=0;
    //   this.imageData=event.target.files[0]
    // },
    // onUploadFile() {
    //   this.showBar = true
    //   let event = this.event
    //   let fileTitle = this.fileTitle
    //   let fileDescription = this.fileDescription
    //   let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
    //   let storageRef = fb.storageRef.child('docs/' + rand).put(this.imageData);
    //   storageRef.on(`state_changed`, snapshot => {
    //     this.uploadValue=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
    //   }, error => {console.log(error.message)},
    //   () => {this.uploadValue=100;
    //     storageRef.snapshot.ref.getDownloadURL().then((downloadURL) => {
    //       console.log('File available at', downloadURL)
    //         var docRef = fb.eventsCollection.doc(event.id)
    //         docRef.update({
    //           files: fb.firestore.FieldValue.arrayUnion({
    //             title: fileTitle,
    //             description: fileDescription,
    //             url: downloadURL
    //           })
    //         });
    //         event.files.push({
    //           title: fileTitle,
    //           description: fileDescription,
    //           url: downloadURL
    //         })
    //     })
    //     this.showBar = false
    //   })
    //   this.imageData = null
    //   this.fileTitle = ''
    //   this.fileDescription = ''
    //   this.$refs.fileInputTip.value=null
    // },
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
    		visible: place.visible,
    		checkin: place.checkin || null,
        parking: place.parking || null,
        camping: place.camping || null,
        creds: place.creds || null,
        covid: place.covid || null,
        attire: place.attire || null,
        pay: place.pay || null,
        notes: place.notes || null,
        job: place.job || null,
        client: place.client || null,
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
    this.performingRequest = false
    let place = null
    let center = null
    let address = null
    let store = null
    console.log(this)
  }
}
</script>