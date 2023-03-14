<template>
    <div class="mb-3">
      <div class="caption">User ID: {{user.id}}</div>
      <span class="flex align-center">
    		<h4>Employee Info</h4>
       
      </span>

		<div class="mb-3">
      <label for="firstName">First Name:</label>
      <input type="text" placeholder="" v-model.trim="user.firstName" id="firstName" @change="updateUser()" />
    </div>
    <div class="mb-3">
      <label for="lastName">Last Name:</label>
      <input type="text" placeholder="" v-model.trim="user.lastName" id="lastName" @change="updateUser()"/>
    </div>
    <div class="mb-3">
    	<div class="flex align-center justify-space-between">
    		<label for="email">Email: <i class="far fa-clipboard"></i></label>
        <a :href="`mailto:` + user.email" target="_blank">
          <button class="btn btn__small btn__primary btn__flat mb-2">Send Email <i class="fas fa-external-link ml-2"></i></button>
        </a>
    	</div>
      <input type="email" autocomplete="email" placeholder="" v-model.trim="user.email" id="email" readonly 
      v-clipboard:copy="user.email"
      v-clipboard:success="onCopy"
      />
    </div>
  
    <div class="mb-3">
    	<div class="flex align-center justify-space-between">
	      <label for="phone">Cell Phone: <i class="far fa-clipboard"></i></label>
        <span>
        <span v-if="user.phoneVerified == 'approved'" class="caption mb-2 mr-5">verified <i style="color: green" class="fas fa-check"></i></span>
        <a :href="'sms:' + user.phone">
          <button class="btn btn__small btn__primary btn__flat mb-2">Send Text <i class="fas fa-external-link ml-2"></i></button>
        </a>
        </span>
	      
	    </div>
      <input type="phone" autocomplete="tel" placeholder="" v-model.trim="user.phone" v-mask="'(###) ###-####'" placeholder="(999) 999-9999" id="phone" readonly 
      v-clipboard:copy="user.phone"
      v-clipboard:success="onCopy"
      />

      <!-- <i class="fa-solid fa-copy"></i> -->

    </div>

    
    
    <div class="mb-3">
      <label for="dob">Date of Birth:</label>
      <input type="date" placeholder="" v-model.trim="user.dob" id="dob" @change="updateUser" />
    </div>

      <!-- <div class="mb-3">
      <label for="shirtsize">Shirt Size (unisex):</label>
      <select v-model="user.shirtsize" @change="updateUser()">
        <option v-for="option in options" v-bind:value="option">
          {{option}}
        </option>
      </select>
    </div>
 -->
    </div>
    <!-- <div class="dashboard__container--body--col">

     
      <span class="flex align-center justify-space-between">
        <h2 class="mb-3">Employee Status</h2>
        <button class="btn btn__danger btn__flat" @click="docHold()" v-if="user && !user.docHold">
          Doc Hold
          <transition name="fade">
            <span class="ml-2" v-if="performingRequest">
            <i class="fa fa-spinner fa-spin"></i>
            </span>
          </transition>
        </button>
        <button class="btn btn__success btn__flat" @click="removeHold()" v-if="user && user.docHold">
          Reactivate
          <transition name="fade">
            <span class="ml-2" v-if="performingRequest">
            <i class="fa fa-spinner fa-spin"></i>
            </span>
          </transition>
        </button>
      </span>

      <span class="flex justify-flex-end caption" v-if="user && user.docHold && user.docHoldCreated">
       On Hold: {{formatDate(user.docHoldCreated)}}
      </span>
    

    <div class="caption mb-2 bold" v-if="user && user.id">UID #{{user.id}}
      </div>
      <div class="caption mb-5 bold" v-if="user && joined">
        Signed Up: {{joined | moment("dddd, MMMM Do YYYY") }}
      </div>

    <div class="mb-5 mt-1 flex align-center" v-if="user && user.payrollSubmitted">
<i class="fa-solid fa-circle-check fa-2x mr-2"  style="color: #f0ad4e;"></i>
      <span class="caption bold">Onboarding Started - {{submitted | moment("dddd, MMMM Do YYYY") }}</span>
    </div>


<div class="mb-5 mt-1 flex align-center" v-if="user && user.OnboardStatus">
<i class="fa-solid fa-circle-check fa-2x mr-2"  style="color: #5FA052;"></i>
      <span class="caption bold">Onboarding Completed - {{user.OnboardStatus}} </span>
    </div>
     
    <div  v-if="currentUser && (currentUser.email == 'greg@mvpeventstaffing.com' || 'katy@mvpeventstaffing.com' || 'tai@mvpeventstaffing.com')">
      <span class="flex align-center justify-space-between">
    <label>Social Security Number</label>
    <button v-if="!user.ssn" class="btn btn__small btn__primary btn__flat mb-2" @click="requestSSN()">Request</button>
      </span>

      <span class="flex justify-flex-end caption" v-if="user.SSNReminderSent && user.ssn">
        {{formatDate(user.SSNReminderSent)}}
      </span>

    
  </div>

  </div> -->
	</div>
</template>

<script>
const fb = require('../../firebaseConfig.js')
import * as moment from 'moment'

export default {
  props: ['user', 'currentUser'],
  data: () => ({
    options: ['X-Small', 'Small', 'Medium', 'Large', 'X-Large', '2X-Large'],
    ssn:'',
    encryptionKey: 'SKD433{}{[SKD433{}{[SKD433{}{[32',
    showEdit: false,
    performingRequest: false,
  }),
  computed: {
    joined() {
      if(this.user && this.user.created) {
        return new Date(this.user.created.seconds*1000)
      }
    },
    submitted() {
      if(this.user && this.user.payrollSubmittedStamp) {
        return new Date(this.user.payrollSubmittedStamp.seconds*1000)
      }
    },
    encryptedText() {
      if (this.ssn) {
        return this.$CryptoJS.AES.encrypt(this.ssn, this.encryptionKey).toString()
      }
    },
    decryptedText() {
      if (this.user && this.user.ssn) {
      return (this.$CryptoJS.AES.decrypt(this.user.ssn, this.encryptionKey).toString(this.CryptoJS.enc.Utf8) || this.$CryptoJS.AES.encrypt(this.ssn, this.encryptionKey).toString())
      }
    }
  },
  methods: {
    onCopy: function (e) {
      alert('Copied to Clipboard')
    },
    removeHold() {
      this.performingRequest = true
      this.user.docHold = false
      this.$store.dispatch('removeHold', this.user)
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    docHold() {
      this.performingRequest = true
      this.user.docHold = true
      this.$store.dispatch('docHold', this.user)
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    requestAddress() {
      let newText = {
        name: this.user.firstName,
        phone: this.user.phone,
        userId: this.user.id,
        type: 'requestAddress'
      }
      this.$store.dispatch('requestAddressText', newText)
    },
    requestSSN() {
      let newText = {
        name: this.user.firstName,
        phone: this.user.phone,
        userId: this.user.id,
        type: 'requestSSN'
      }
      this.$store.dispatch('requestSSNText', newText)
    },
    updateUser(){
      let user = this.user
      this.$store.dispatch('updateTheUser', user)
    },
    showChange() {
      this.showEdit = true
    },
    updateProfile(){
      let userProfile = this.user
      userProfile.ssn = this.encryptedText
      this.$store.dispatch('updateTheUser', userProfile)
      this.showEdit = false
    },
    branchOnboard() {
      this.performingRequest = true
      this.user.branchOnboard = true
      let user = this.user
      this.$store.dispatch('updateTheUser', user)
      setTimeout(() => {
        this.performingRequest = false
      }, 2000)
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY, hh:mm a')
      } else {
        return null
      }
    },
  },
}
</script>