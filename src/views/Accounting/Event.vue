<template>
	<div class="dashboard">
    <div class="dashboard__container">
    	<Loader v-if="!event" />
      <div class="dashboard__container--header" v-if="event">
        <div class="flex align-center justify-space-between align-center" style="width:100%;">
          <h1>{{event.title}}</h1>
          <span style="display: flex; align-items:center;">
          	<button class="btn btn__large btn__success mr-3" @click="requestInvoice()" v-if="!event.invoiceRequested">
  						Request New Invoice
  						<transition name="fade">
			          <span class="ml-2" v-if="performingRequest4">
			          <i class="fa fa-spinner fa-spin"></i>
			          </span>
			        </transition>
  					</button>
  					<button class="btn btn__large btn__danger mr-3" v-if="event.invoiceRequested">Invoice Requested</button>
  					<button class="btn btn__large btn__dark mr-3" @click="cancelRequest()">Cancel Request</button>
  					 <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
          </span>
         
        </div>
      </div>
      <div class="dashboard__container--body">
      	<div class="dashboard__container--body--col">
      		<div class="dashboard__container--body--col--inner">
	  				<div class="mb-3">
	  					<h2>Event Details</h2>
	  					<h5 class="mt-3">Date</h5>
	  					<div >{{event.startDate | moment("dddd, MMMM Do YYYY") }}<span v-if="event.endDate"> - {{event.endDate | moment("dddd, MMMM Do YYYY") }}</span>
	  					</div>
	  					<h5 class="mt-3">Venue</h5>
	  					<h4 v-if="event.venue && event.venue.title">{{event.venue.title}}</h4>
	  					<div v-if="event.venue && event.venue.address">{{event.venue.address.city}}, {{event.venue.address.state}}</div>
	  					<h5 class="mt-3">Pay</h5>
	  					<div v-if="event.pay" v-html="event.pay"></div>
	  					<h5 class="mt-3">Jobs</h5>
	  					<div v-for="(job, index) in event.jobs" :key="job.title">{{job.title}}</div>
	  					<!-- <button class="chipDark mr-2 mb-2" v-for="(job, index) in event.jobs" :key="job.title">{{job.title}}</button> -->
	  				</div>
	  			</div>
	  			<div class="dashboard__container--body--col--inner" style="
	  			margin-top:3.2rem;">
	  				<h2 class="mb-2">Event Timesheets</h2>

	  				<div class="mb-3" v-if="event.timesheetsUrl">
	  					<a :href="event.timesheetsUrl" target="_blank">{{event.timesheetsUrl}}</a>

	  				</div>
	  				<div class="mb-3">
	  					<label for="turl">Timesheets Link from Drive</label>
	  					<input type="text" v-model="timesheetsUrl" id="turl" />
	  					<button class="btn btn__small btn__primary mt-3" @click="newUrl()">Submit
	  						<transition name="fade">
				          <span class="ml-2" v-if="performingRequest3">
				          <i class="fa fa-spinner fa-spin"></i>
				          </span>
				        </transition>
	  					</button>
	  				</div>
	  				<div class="mb-3">
	  					<Loader v-if="!eventShifts || eventShifts.length == 0" />
	        <vue-good-table
	          :columns="columns2"
	          :rows="eventShifts"
	          styleClass="vgt-table striped"
	          :search-options="{
	            enabled: true,
	            placeholder: 'Search this table',
	          }"
	          :pagination-options="{
	            enabled: true,
	            mode: 'records',
	            perPage: 20,
	          }"
	          @on-row-click="onRowClick"
	        >
	          <template slot="table-row" slot-scope="props">
	            <span v-if="props.column.field == 'payrollComplete'">
	              <span v-if="props.row.payrollComplete">
	                <i class="fas fa-check"></i>
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
  			<div class="dashboard__container--body--col">
  				<div class="dashboard__container--body--col--inner">
  				<h2>Event Invoicing Status</h2>
  				<label>Status:</label>
  				<div class="mb-4">
	  				<v-select
	            class="mt-2"
	            label="status" 
	            :options="evStatuses"
	            v-model="event.invoiceStatus"
	            @input="updateEvent()"
	            >
	          </v-select>
          </div>
          <hr>
          <h3 class="mb-3">Invoices</h3>
  				<div v-if="event.invoices && event.invoices.length >= 1">
	          <vue-good-table
	            :columns="columns"
	            :rows="event.invoices"
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
  				<hr>
  				<h3>New Invoice</h3>
  				<input class="mt-3" type="file" ref="fileInputTip" accept="image/*,application/pdf,.doc" @change="previewImage">
  				<div class="mb-2">
            <label for="Date">Invoice Date:</label>
            <input type="date" v-model.trim="newInvoice.date"  id="Date"  />
          </div>
          <div class="mb-3">
            <label for="note">Invoice Note:</label>
            <input type="text" v-model.trim="newInvoice.note" />
          </div>
          <div class="mb-3">
            <label for="note">Invoice Status:</label>
            <v-select
              class="mt-2"
              label="status" 
              :options="statuses"
              v-model="newInvoice.status"
              >
            </v-select>
          </div>
          <progress :value="uploadValue" max="100" v-if="showBar"></progress>
            <div class="mb-3">
              <button v-if="imageData != null" class="btn btn__primary mt-3" @click="onUploadFile">
                Upload Invoice
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest3">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>
            </div>
           <!-- <button class="btn btn__primary mt-3" @click="onAddInvoice()">
			     	Add Invoice
			     		<transition name="fade">
			          <span class="ml-2" v-if="performingRequest">
			          <i class="fa fa-spinner fa-spin"></i>
			          </span>
			        </transition>
			     </button> -->
  			</div>
  			<div class="dashboard__container--body--col--inner" style="margin-top:3.2rem;">
  				<h2>Add Accounting Note</h2>
  				<div class="mb-3">
  					<label for="inote">Add Note</label>
  					<textarea name="" id="inote" cols="30" rows="5" v-model="newNote"></textarea>
  					<button class="btn btn__small btn__primary mt-3" @click="addNewNote()">Submit
  						<transition name="fade">
			          <span class="ml-2" v-if="performingRequest2">
			          <i class="fa fa-spinner fa-spin"></i>
			          </span>
			        </transition>
  					</button>
  				</div>
  			</div>
  			<div class="dashboard__container--body--col--inner" style="margin-top:3.2rem;">
  				<h2>Accounting Notes</h2>
  				<div class="mb-3">
  					<vue-good-table
	            :columns="columns3"
	            :rows="accountingNotes"
	            >
	            <template slot="table-row" slot-scope="props">
	              <span>
	                {{props.formattedRow[props.column.field]}}
	              </span>
	            </template>
	          </vue-good-table>
  				</div>
  			</div>
  			</div>
      </div>
    </div>
	</div>
</template>

<style scoped type="text/css">
	@media only screen and (max-width 899px) {
		.dashboard__container--body {
			flex-wrap: wrap;
	    display: block !important;
	  }
		.dashboard__container--body--col {
			width: 100%;
			padding: 0;
			background: transparent;
		}
	}
	@media only screen and (min-width 900px) {
		.dashboard__container--body--col {
			width: calc(50% - 1.6rem);
			padding: 0;
			background: transparent;
		}
	}
	.dashboard__container--body--col--inner {
		background: white;
		padding: 1.6rem;
	}
</style>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import { VueEditor } from "vue2-editor";
import router from '@/router'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'accountingEvent',
  data: () => ({
  	uploadValue: 0,
    showBar:false,
    timesheetsUrl: '',
    newNote: '',
    imageData: null,
  	performingRequest: false,
  	performingRequest2: false,
  	performingRequest3: false,
  	performingRequest4: false,
  	newInvoice: {
  		date: '',
  		note: '',
  		status: ''
   	},
   	statuses: ['complete', 'partial', 'additional'],
   	evStatuses: ['complete', 'partial'],
   	columns3: [
   		{
        field: 'note',
        sortable: false,
      }
   	],
   	columns: [
   		{
        field: 'url',
        tdClass: 'text-center',
        sortable: false,
      },
      {
        label: 'Date',
        field: 'date',
      },
      {
        label: 'note',
        field: 'note',
      },
      {
        label: 'status',
        field: 'status',
      },
      
      {
        label: '',
        field: 'extras',
        tdClass: 'text-center',
        sortable: false,
      },
    ],
    columns2: [
      {
        label: 'Date',
        field: 'day',
      },
      {
        label: 'Event',
        field: 'event',
      },
      {
        label: 'Staff',
        field: 'staff',
      },
      {
        label: 'Start Time',
        field: 'startTime',
      },
      {
        label: 'End Time',
        field: 'endTime',
      },
      {
        label: 'Position',
        field: 'position.title',
      },
      {
        label: 'Complete',
        field: 'payrollComplete',
        tdClass: 'text-center',
      },
    ]
  }),
  components: {
    VueEditor,
    Loader
  },
  created () {
    this.$store.dispatch("getEventFromId", this.$route.params.id);
    this.$store.dispatch("getAccountingNotes", this.$route.params.id);
  },
  computed: {
    ...mapState(['eventInfo', 'eventShifts', 'accountingNotes']),
    event() {
      return this.eventInfo
    },
  },
	methods: {
		updateEvent() {
			this.$store.dispatch('updateEvent', this.event)
		},
		requestInvoice() {
			this.performingRequest4 = true
			fb.eventsCollection.doc(this.event.id).update({
				invoiceRequested: true
			})
			setTimeout(() => {
					this.event.invoiceRequested = true
  				this.newNote = ''
          this.performingRequest4 = false
      }, 500)
		},
		cancelRequest() {
			this.event.invoiceRequested = false
			fb.eventsCollection.doc(this.event.id).update({
				invoiceRequested: false
			})
		},
		addNewNote() {
			this.performingRequest2 = true
			this.$store.dispatch('addAccountingNote', {
				note: this.newNote,
				event: this.event
			})
			setTimeout(() => {
  				this.newNote = ''
          this.performingRequest2 = false
      }, 500)
		},
		newUrl() {
			this.performingRequest3 = true
			this.event.timesheetsUrl = this.timesheetsUrl
			fb.eventsCollection.doc(this.event.id).update({
				timesheetsUrl: this.timesheetsUrl
			})
			setTimeout(() => {
  				this.timesheetsUrl = ''
  				this.performingRequest3 = false
      }, 500)
		},
		onRowClick(params) {
      let url = `/timesheets/` + params.row.id
      console.log(url)
      router.push(url)
    },
		deleteUploadedFile(u, index) {
      console.log(u)
      let event = this.event
      event.invoices.splice(index, 1)
      this.$store.dispatch('updateEvent', event)
    },
		previewImage(event) {
      this.uploadValue=0;
      this.imageData=event.target.files[0]
    },
    onUploadFile() {
      this.showBar = true
      let event = this.event
      let newInvoice = this.newInvoice
      let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
      let storageRef = fb.storageRef.child('docs/' + rand).put(this.imageData);
      storageRef.on(`state_changed`, snapshot => {
        this.uploadValue=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
      }, error => {console.log(error.message)},
      () => {this.uploadValue=100;
        storageRef.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL)
            var docRef = fb.eventsCollection.doc(event.id)
            docRef.update({
              invoices: fb.firestore.FieldValue.arrayUnion({
                date: newInvoice.date,
                note: newInvoice.note,
                status: newInvoice.status,
                url: downloadURL
              })
            });
            event.invoices.push({
              date: newInvoice.date,
              note: newInvoice.note,
              status: newInvoice.status,
              url: downloadURL
            })
        })
        this.showBar = false
      })
      this.imageData = null
      this.newInvoice = {}
      this.$refs.fileInputTip.value=null
    },
    onFileTypeMismatch(file) {
      alert('Invalid file type. Please choose a jpeg or png file.')
    },
    onFileSizeExceed(file) {
      alert('Please choose a file smaller than 2MB')
    },
		goBack() {
      router.go(-1)
    },
  	onAddInvoice() {
  		this.performingRequest = true
      let name = this.me.firstName + ' ' + this.me.lastName
  		let theNote = {
  			note: this.note,
  			userId: this.user.id,
        submittedBy: name
  		}
  		this.$store.dispatch('addUserNote', theNote)
  		setTimeout(() => {
  				this.note = ''
          this.performingRequest = false
      }, 1000)
  	}
	},
	beforeDestroy () {
		this.$store.dispatch('clearEventState')
		this.$store.dispatch('clearAccountingNotes')
		this.$store.dispatch("clearEventShifts")
	}
}
</script>