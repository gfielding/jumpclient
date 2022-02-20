<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <Loader v-if="!venue" />
      <div class="dashboard__container--header" v-if="venue">
        <div>
        <h1>{{venue.title}}</h1>
        Followers: <span class="caption" v-if="venueFollowers">{{venueFollowers.length}}</span>
        </div>
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
            <div class="mb-3">
              <label for="venueVisibility">Vaccination Required:</label>
              <input type="checkbox" v-model.trim="venue.requiredVaccine" id="venueVisibility" class="ml-3" />
            </div>
            <div class="mb-3" v-if="clients.length >= 1">
              <label for="client">Default Client:</label>
              <v-select
                class="mt-2"
                label="title" 
                multiple
                :options="clients"
                v-model="venue.client"
                >
              </v-select>
              <label for="pickDate">Default Jobs:</label>
                <v-select
                  class="mt-2"
                  label="title" 
                  :options="jobs"
                  multiple
                  v-model="venue.job"
                  >
                </v-select>
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
            <h3>Managers</h3>
            <div class="mb-5" v-if="mgrs.length >= 1">
              <label for="client">Select Managers:</label>
              <v-select
                class="mt-2"
                label="name" 
                multiple
                :options="mgrs"
                v-model="venue.mgrs"
                >
              </v-select>
            </div>
            <h3>Client Access</h3>
            <div class="mb-3">
              <ais-instant-search :search-client="searchClient" index-name="a_users" >
                <ais-search-box placeholder="Add a User" />
                <ais-state-results>
                  <template slot-scope="{ state: { query } }">
                    <ais-hits v-show="query.length > 0">
                      <template v-slot:item="{ item }">
                        <div>
                          <button class="btn btn__icon btn__flat mr-2 mb-2" @click="addUser(item)"><i class="fad fa-plus"></i></button>
                          <h4 style="display: inline;">{{ item.firstName }} {{ item.lastName }} | <span v-if="item.address && item.address">{{item.address.city}} | </span>{{item.email}} | {{item.phone}}</h4 style="display: inline;">
                        </div>
                      </template>
                    </ais-hits>
                  </template>
                </ais-state-results>
              </ais-instant-search>
            </div>
            
          </div>

          <div class="dashboard__container--body--col">
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
              <div v-if="venue.files && venue.files.length >= 1">
                <vue-good-table
                  :columns="columns2"
                  :rows="venue.files"
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
          </div>

          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="checkin">Check-In Details:</label>
              <vue-editor id="checkin" v-model="venue.checkin"></vue-editor>
            </div>

          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="parking">Parking Details:</label>
              <vue-editor id="parking" v-model="venue.parking"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="camping">Camping Details:</label>
              <vue-editor id="camping" v-model="venue.camping"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="creds">Credentials Details:</label>
              <vue-editor id="creds" v-model="venue.creds"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="covid">COVID Requirements:</label>
              <vue-editor id="covid" v-model="venue.covid"></vue-editor>
            </div>
          </div>
          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="attire">Attire:</label>
              <vue-editor id="attire" v-model="venue.attire"></vue-editor>
            </div>

            </div>
          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="pay">Pay:</label>
              <vue-editor id="pay" v-model="venue.pay"></vue-editor>
            </div>
          </div>

          <div class="dashboard__container--body--col">

            <div class="mb-3">
              <label for="pay">Additional Notes:</label>
              <vue-editor id="pay" v-model="venue.notes"></vue-editor>
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
              <!-- <button class="btn btn__dark" @click="deleteVenue()">delete</button> -->
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
import algoliasearch from 'algoliasearch/lite';
import 'instantsearch.css/themes/satellite-min.css'

export default {
  name: 'venue',
  data: () => ({
    searchClient: algoliasearch(
      '0T1SIY6Y1V',
      'f03dc899fbdd294d6797791724cdb402'
    ),
    center: { lat: 45.508, lng: -73.587 },
    marker: {},
    address: {},
    place: '',
    currentPlace: null,
    performingRequest: false,
    croppa: {},
    imageData: null,
    fileTitle: '',
    fileDescription: '',
    uploadValue: 0,
    showBar:false,
    columns: [
      {
        label: 'Event',
        field: 'title',
      },
      {
        label: 'Date',
        field: 'startDate',
      },
    ],
    columns2: [
      {
        label: 'Link',
        field: 'url',
      },
      {
        label: 'Title',
        field: 'title',
      },
      {
        label: 'Description',
        field: 'Description',
      },
      {
        label: '',
        field: 'extras',
      },
    ]
  }),
   computed: {
    ...mapState(['venueInfo', 'venueEvents', 'clients', 'jobs', 'mgrs', 'venueFollowers']),
    venue() {
      return this.venueInfo
    },
    backgroundUrl() {
      return this.venue.photoUrl || 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/stadium.png?alt=media&token=89f2362c-d1bc-4338-a837-fad1d664c51d'
    }
  },
  created () {
    this.$store.dispatch("getVenueFromId", this.$route.params.id);
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
   components: {
    Loader,
    VueEditor
  },
  methods: {
    deleteAccess(index) {
      let venue = this.venue
      venue.access.splice(index, 1)
      this.$store.dispatch('updateVenue', venue)
    },
    // addDay() {
    //   let venue = this.venue
    //   venue.access.push(this.item)
    //   this.$store.dispatch('updateVenue', venue)
    // },
    addUser(item) {
      let venue = this.venue
      this.$store.dispatch('updateVenueAccess', {
        venue: venue,
        user: item
      })
      document
        .querySelectorAll('.ais-SearchBox-input')
        .forEach((e) => (e.value = ''))
        document.querySelectorAll('.ais-Hits-item').forEach((e) => e.remove())
        // this.$refs.searchHits.state.hits = []
    },
    previewImage(venue) {
      this.uploadValue=0;
      this.imageData=venue.target.files[0]
    },
    onUploadFile() {
      this.showBar = true
      let venue = this.venue
      let fileTitle = this.fileTitle
      let fileDescription = this.fileDescription
      let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
      let storageRef = fb.storageRef.child('docs/' + rand).put(this.imageData);
      storageRef.on(`state_changed`, snapshot => {
        this.uploadValue=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
      }, error => {console.log(error.message)},
      () => {this.uploadValue=100;
        storageRef.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL)
            var docRef = fb.venuesCollection.doc(venue.id)
            docRef.update({
              files: fb.firestore.FieldValue.arrayUnion({
                title: fileTitle,
                description: fileDescription,
                url: downloadURL
              })
            });
            venue.files.push({
              title: fileTitle,
              description: fileDescription,
              url: downloadURL
            })
        })
        this.showBar = false
      })
      this.imageData = null
      this.fileTitle = ''
      this.fileDescription = ''
      this.$refs.fileInputTip.value=null
    },
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
      this.$store.dispatch('clearVenueState')
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