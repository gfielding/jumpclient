<template>
	<div>

    <div class="dashboard__container">
    	<div class="dashboard__container--body--col pt-3 mb-0">
        <div>
    		<h4>Upload Timesheets & Invoices</h4>
        <label for="fileTitle">Details:</label>
        <input class="mb-2" placeholder="File Title" type="text" v-model.trim="fileTitle" id="fileTitle" />
        <textarea placeholder="File Description" name="fileDescription" id="fileDescription" cols="30" rows="2" v-model="fileDescription"></textarea>

        <input class="mt-3" type="file" ref="fileInputTip" accept="image/*,application/pdf,.doc,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" @change="previewImage">
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
      </div>
      </div>
    </div>
    <div class="dashboard__container pt-0">
        <div v-if="event.files && event.files.length >= 1" class="whiteBack">
          <vue-good-table
            :columns="columns"
            :rows="event.files"
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



     <!--  <Loader v-if="!event || !event.id" />
    	<div class="dashboard__container--body pt-3" v-if="event">

	      <div class="dashboard__container--body--col" style="overflow: auto;">
	      	<label for="fileTitle">Upload File:</label>
			    <input class="mt-3" type="file" ref="fileInputTip" accept="image/*,application/pdf,.doc" @change="previewImage">
			    <progress :value="uploadValue" max="100" v-if="showBar"></progress>
			    <div class="mb-3">
			      <button v-if="imageData != null" class="btn btn__primary mt-3" @click="onUploadFile">
			        Upload
			        <transition name="fade">
			          <span class="ml-2" v-if="performingRequest">
			          <i class="fa fa-spinner fa-spin"></i>
			          </span>
			        </transition>
			      </button>
			    </div>

	      </div>

    	</div>
    	<div class="dashboard__container--body">
				<h3>User Notes:</h3>

				<vue-good-table
          :columns="columns"
          :rows="event.files"
          >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'url'">
              <a :href="props.row.url" target="_blank"><i class="fas fa-external-link"></i></a>
            </span>

            <span v-if="props.column.field == 'type'">
		          <span>{{props.row.type}}</span>
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
    	</div> -->
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'eventFiles',
  props: ['eventInfo'],
  components: {
    Loader,
  },
  data() {
    return {
      performingRequest: false,
      performingRequest3: false,
      imageData: null,
	    fileTitle: '',
	    fileDescription: '',
	    uploadValue: 0,
	    showBar:false,
      columns: [
      {
        label: 'url',
        field: 'url',
      },
      {
        label: 'title',
        field: 'title',
      },
      {
        label: 'description',
        field: 'description',
      },
      {
      	label: 'Delete',
        field: 'extras',
        html: true
      }
    ]
    }
  },
  // created () {
  // 	this.$store.dispatch("getEventFromId", this.$route.params.id);
  // },
  computed: {
    event() {
      return this.eventInfo
    },
    eventId() {
    	return this.eventInfo.id
    }
  },
  methods: {
  	goBack() {
      router.go(-1)
    },

    deleteUploadedFile(u, index) {
      let event = this.eventInfo
      event.files.splice(index, 1)
      this.$store.dispatch('updateEvent', event)
    },

    previewImage(event) {
      this.uploadValue=0;
      this.imageData=event.target.files[0]
    },

    onUploadFile() {
      this.showBar = true
      let event = this.event
      console.log(event)
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
            var docRef = fb.eventsCollection.doc(event.id)
            docRef.update({
              files: fb.firestore.FieldValue.arrayUnion({
                title: fileTitle,
                description: fileDescription,
                url: downloadURL
              })
            });
            this.event.files.push({
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



    updateJob() {
      console.log(event)
      let event = this.event
      this.$store.dispatch('updateEvent', event)
    },
    updateEvent(){
      let event = this.event
      console.log(event)
      this.$store.dispatch('updateEvent', event)
    },
    submitName() {
    	let event = this.event
    	this.$store.dispatch('updateEvent', event)
    	// let newName = this.newName
    	// this.event.venue.shiftNames.push(newName)
    	// this.newName = ''
    },
    addNewShift () {
      let shift = {
        position: this.newShift.job || { title: null},
        startTime: this.newShift.start || null,
        endTime: this.newShift.end || null,
        name: this.newShift.name || null,
        // location: this.newShift.location || null,
        staff: this.newShift.staffReqested,
        eventId: this.event.id,
        event: this.event.title,
        day: this.newShift.day
      }
      console.log(shift)
      fb.shiftsCollection.add(shift)
      .then(
        doc => {
          fb.shiftsCollection.doc(doc.id).update({
            id: doc.id, 
          })
        }
      )
      this.newShift = {}
      this.$store.dispatch("getEventShifts", this.eventId)
    },
    updateShift(eventShift) {
    	this.performingRequest = true
    	this.$store.dispatch("updateEventShift", eventShift)
    	setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    showDeleteShift(eventShift) {
    	eventShift.showDelete = true
    	this.$store.dispatch("updateEventShift", eventShift)
    },
    cancelDeleteShift(eventShift) {
    	eventShift.showDelete = false
    	this.$store.dispatch("updateEventShift", eventShift)
    },
    deleteShift(eventShift) {
      console.log(eventShift)
      this.$store.dispatch("deleteShift", eventShift.id)
    },
    placements() {
      let url = `/eventplacements/` + this.$route.params.id
      router.push(url)
    },
    sheets() {
      let url = `/events/` + this.$route.params.id + `/timesheets`
      router.push(url)
    },
    editEvent() {
      let url = `/events/` + this.$route.params.id
      router.push(url)
    },
    checkIn() {
      let url = `/events/` + this.$route.params.id + `/checkin`
      router.push(url)
    },
  },
  beforeDestroy () {
  	this.performingRequest = null
  	delete this.performingRequest
  	this.performingRequest3 = null
  	delete this.performingRequest3
    this.$store.dispatch("clearEventState")
  	this.$store.dispatch('clearErrors')
  }
}
</script>
