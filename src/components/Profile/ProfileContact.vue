<template>
	<div>
		<h2 class="mb-3">Contact Info</h2>
		<div class="mb-3">
      <label for="firstName">First Name:</label>
      <input type="text" placeholder="" v-model.trim="userProfile.firstName" id="firstName" @change="updateProfile()"/>
    </div>
    <div class="mb-3">
      <label for="lastName">Last Name:</label>
      <input type="text" placeholder="" v-model.trim="userProfile.lastName" id="lastName" @change="updateProfile()"/>
    </div>
    <div class="mb-3">
    	<div class="flex align-center justify-space-between">
    		<label for="email">Email:</label>
    		<span v-if="emailVerified" class="caption mb-2">verified <i style="color: green" class="fas fa-check"></i></span>
    		<div v-if="!emailVerified">
    			<span class="caption">not verified</span>
    			<button class="btn btn__small btn__accent btn__flat mb-2" @click="resendVerification()">resend</button>
    		</div>
    	</div>
      <input type="email" placeholder="" v-model.trim="userProfile.email" id="email" @change="updateEmail()"/>
    </div>
    <div class="mb-3">
    	<div class="flex align-center justify-space-between">
	      <label for="phone">Cell Phone:</label>
	      <span v-if="userProfile.phoneVerified == 'approved'" class="caption mb-2">verified <i style="color: green" class="fas fa-check"></i></span>
	    </div>
      <input type="phone" placeholder="" v-model.trim="userProfile.phone" v-mask="'(###) ###-####'" placeholder="(999) 999-9999" id="phone" @keyup="showTest = true"/>

      <!-- Button when number added or changed -->
      <transition name="fade">
	      <button class="btn btn__primary mt-3" v-if="showTest" @click.prevent="updatePhone">
	        Get Verification Code
	      </button>
	    </transition>

	    <!-- Verify Code -->
      <transition name="fade">
        <div v-if="showVerification">
        	<label for="code">Verification Code:</label>
        	<input type="text" id="code" v-model.trim="code" v-mask="'######'" placeholder="######" required @keyup="showVerifyButton = true" />
        </div>
      </transition>

      <!-- Button When Verify Code Added -->
      <transition name="fade">
        <button class="btn btn__primary mt-3" v-if="showVerifyButton" @click.prevent="verify">Verify</button>
      </transition>

      <!-- Button When Verify Error -->
      <transition name="fade">
        <div v-if="userProfile.phoneVerified && userProfile.phoneVerified == 'pending'">
          <button class="btn btn__primary mt-3" @click.prevent="verify">Please check your code and try again</button>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="error">
          <p>{{error}}</p>
        </div>
      </transition>

    </div>
    
    <div class="mb-3">
      <label for="dob">Date of Birth:</label>
      <input type="date" placeholder="" v-model.trim="userProfile.dob" id="dob" @change="updateProfile()"/>
    </div>
	</div>
</template>

<script>
const fb = require('../../firebaseConfig.js')

export default {
  props: ['userProfile', 'emailVerified'],
  data: () => ({
  	showTest: false,
  	showVerification: false,
    verified: false,
    showVerify: false,
    showVerifyButton: false,
    verifyError: false,
    code: '',
    error: '',
  }),
  methods: {
    updateProfile(){
    	let userProfile = this.userProfile
    	this.$store.dispatch('updateUser', userProfile)
    },
    updateEmail() {
    	let userProfile = this.userProfile
    	this.$store.dispatch('updateUserEmail', userProfile)
    },
    resendVerification() {
    	this.$store.dispatch('resendVerificationEmail')
    },
    updatePhone () {
    	let userProfile = this.userProfile
    	this.$store.dispatch('updateUser', userProfile)
    	setTimeout(() => {
          this.showTest = false
          this.showVerification = true
      }, 2000)
    },
    unVerify: function (e) {
    	let userProfile = this.userProfile
    	this.showVerification = false
    	this.code = ''
    	this.showVerification = false
    	this.$store.dispatch('updateUser', {
    		phoneVerified: null
    	})
    },
    verify: function () {
    	this.error = ''
    	this.showTest = false
    	this.$store.dispatch('updateUser', {
    		code: this.code
    	})
      setTimeout(() => {
        this.showVerifyButton = false
        this.showVerification = false
        this.code = ''
      }, 5000)
    },
  }
}
</script>