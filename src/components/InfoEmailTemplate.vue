<template>
	<div class="modal-mask">
		<div class="modal-wrapper">
      <div class="modal-container">
      	
        <div class="modal-body" v-click-outside="onClickOutside">
        	<div>
        		<div class="flex justify-space-between align-center ma-3">
        			<h3>Preview Shift Info Email</h3>
        			<button @click="$emit('close')">
			         <i class="fas fa-times mr-1"></i>
			        </button>
        		</div>

        		<form ref="form" v-if="event && event.id" @submit.prevent style="margin:auto; max-width: 640px; background: white;">
        
        <div v-if="event">
          <img v-if="(event.photoUrl || (event.venue && event.venue.photoUrl) || venueInfo.photoUrl)" :src="(event.photoUrl || event.venue.photoUrl || venueInfo.photoUrl)" alt="" style="width:100%;">
          <div class="pa-3">
            <h1 v-if="event.title">Congratulations NAME! Your shift has been assigned to work as a JOB at {{event.title}} on DATE from START to END</h1>

            <div>
              <hr>
              <h3>Shift Intro Paragraph:</h3>
              <textarea cols="30" rows="2" id="eventInfo" v-model="shift.info"></textarea>

              <transition name="fade">
                <button v-if="shift && shift.info && shift.info.length > 5" class="btn btn__small btn__success mt-3" @click="updateShift(shift)">Update</button>
              </transition>
            </div>

            <div v-if="((event && event.requiredVaccine) || (venueInfo && venueInfo.requiredVaccine))">
              <hr>
              <h3>Covid-19 Vaccination is Required</h3>
              <div>Please bring proof of vaccination with you or you will not be able to work.</div>
            </div>
            <div v-if="event && event.venue && event.venue.title">
              <hr>
              <h3>Location: {{event.venue.title}}</h3>
              <div>{{event.venue.address.street_number}} {{event.venue.address.street}} <span v-if="event.venue.address.unit">#{{event.venue.address.unit}}</span><br />{{event.venue.address.city}}, {{event.venue.address.state}} {{event.venue.address.zip}}</div>
            </div>
            <div v-if="event && event.venue && event.venue.mgrs && event.venue.mgrs.length >= 1">
              <hr>
              <h3 v-if="event.venue.mgrs.length == 1">Your Manager</h3>
              <h3 v-if="event.venue.mgrs.length > 1">Your Managers</h3>
              <div v-for="(item, index) in event.venue.mgrs" :key="index" class="mb-3">
                <h4>{{item.name}}</h4>
                <p><span v-if="item.phone"><a :href="`tel:${item.phone}`">{{item.phone}}</a><br /></span>
                <a :href="`mailto:${item.email}`">{{item.email}}</a></p>
              </div>
            </div>
            <div v-if="((event && event.venue && event.venue.attire) || (venueInfo && venueInfo.attire))">
              <hr>
              <h3>What to Wear</h3>
              <div v-if="event.venue.attire" v-html="event.venue.attire"></div>
              <div v-if="!event.venue.attire && (venueInfo && venueInfo.attire)" v-html="venueInfo.attire"></div>
            </div>

            <div v-if="((event && event.venue && event.venue.checkin) || (venueInfo && venueInfo.checkin))">
              <hr>
              <h3>Check-In Instructions</h3>
              <div v-if="event.venue.checkin" v-html="event.venue.checkin"></div>
              <div v-if="!event.venue.checkin && (venueInfo && venueInfo.checkin)" v-html="venueInfo.checkin"></div>
            </div>

            <div v-if="((event && event.venue && event.venue.parking) || (venueInfo && venueInfo.parking))">
              <hr>
              <h3>Parking Details</h3>
              <div v-if="event.venue.parking" v-html="event.venue.parking"></div>
              <div v-if="!event.venue.parking && (venueInfo && venueInfo.parking)" v-html="venueInfo.parking"></div>
            </div>

            <div v-if="((event && event.venue && event.venue.creds) || (venueInfo && venueInfo.creds))">
              <hr>
              <h3>Credentials (wristbands)</h3>
              <div v-if="event.venue.creds" v-html="event.venue.creds"></div>
              <div v-if="!event.venue.creds && (venueInfo && venueInfo.creds)" v-html="venueInfo.creds"></div>
            </div>


            <div v-if="((event && event.venue && event.venue.camping) || (venueInfo && venueInfo.camping))">
              <hr>
              <h3>Camping Details</h3>
              <div v-if="event.venue.camping" v-html="event.venue.camping"></div>
              <div v-if="!event.venue.camping && (venueInfo && venueInfo.camping)" v-html="venueInfo.camping"></div>
            </div>

            <div v-if="((event && event.venue && event.venue.notes) || (venueInfo && venueInfo.notes))">
              <hr>
              <h3>Additional Notes</h3>
              <div v-if="event.venue.notes" v-html="event.venue.notes"></div>
              <div v-if="!event.venue.notes && (venueInfo && venueInfo.notes)" v-html="venueInfo.notes"></div>
            </div>


            <div v-if="((event.files && event.files.length >= 1) || (venueInfo && venueInfo.files && venueInfo.files.length >= 1))">
              <hr>
              <h3>Attachments</h3>
              <div v-if="event.files && event.files.length >= 1">
                <div v-for="(item, index) in event.files" :key="index + `a`">
                  <div class="flex justify-space-between align-center pt-3 mb-3" style="border-top:1px solid rgba(0,0,0,0.1);">
                    <h5>{{item.title}}</h5>
                    <a :href="item.url" target="_blank">
                      <button class="btn btn__outlined btn__small">
                        View Attachment<i class="fas fa-external-link ml-2"></i>
                      </button>
                    </a>
                  </div>
                </div>
              </div>
              <div v-if="venueInfo && venueInfo.files && venueInfo.files.length >= 1">
                <div v-for="(item, index) in venueInfo.files" :key="index + `b`">
                  <div class="flex justify-space-between align-center pt-3 mb-3" style="border-top:1px solid rgba(0,0,0,0.1);">
                    <h5>{{item.title}}</h5>
                    <a :href="item.url" target="_blank">
                      <button class="btn btn__outlined btn__small">
                        View Attachment<i class="fas fa-external-link ml-2"></i>
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
       
      </form>
						
		
					</div>
					
        </div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.modal-body form {
    padding: 2rem 0;
    margin: 0;
    text-align: left;
}

</style>

<script>
import { mapState } from 'vuex'
const fb = require('../firebaseConfig.js')

export default {
  props: ['eventInfo', 'venueInfo', 'shift'],
  data: () => ({
  	performingRequest: false,
  }),
  computed: {
  	event() {
      return this.eventInfo
    },
  },
  methods: {
  	onUpdateEvent(item) {
  		console.log(item)
  		this.performingRequest = true
      fb.eventsCollection.doc(item.id).update(item)
      setTimeout(() => {
        this.performingRequest = false
        this.$emit('close')
      }, 1000)
    },
    updateShift(shift) {
    	console.log(shift)
    	this.$store.dispatch("updateEventShift", shift)
    },
  	onClickOutside (event) {
  		this.$emit('close')
     },
  	// onUpdateNote: function () {
  	// 	this.performingRequest = true
  	// 	let data = this.firstData
  	// 	console.log(data)
  	// 	fb.userDaysCollection.doc(this.firstData.id).update(data)
			// setTimeout(() => {
   //      this.performingRequest = false
   //      this.$emit('close')
   //    }, 1000)
   //  },
  },
}
</script>