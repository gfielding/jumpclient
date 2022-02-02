<template>
	<div>
		<h2 class="mb-3">Contact Info</h2>
		<div class="mb-3">
      <label for="firstName">First Name:</label>
      <input type="text" autocomplete="given-name" placeholder="" v-model.trim="user.firstName" id="firstName" readonly/>
    </div>
    <div class="mb-3">
      <label for="lastName">Last Name:</label>
      <input type="text" autocomplete="family-name" placeholder="" v-model.trim="user.lastName" id="lastName" readonly/>
    </div>
    <div class="mb-3">
    	<div class="flex align-center justify-space-between">
    		<label for="email">Email:</label>
        <a :href="`mailto:` + user.email" target="_blank">
          <button class="btn btn__small btn__primary btn__flat mb-2">Send Email <i class="fas fa-external-link ml-2"></i></button>
        </a>
    	</div>
      <input type="email" autocomplete="email" placeholder="" v-model.trim="user.email" id="email" readonly />
    </div>
    <div class="mb-3">
    	<div class="flex align-center justify-space-between">
	      <label for="phone">Cell Phone:</label>
        <a :href="'sms:' + user.phone">
          <button class="btn btn__small btn__primary btn__flat mb-2">Send Text <i class="fas fa-external-link ml-2"></i></button>
        </a>
	      <span v-if="user.phoneVerified == 'approved'" class="caption mb-2">verified <i style="color: green" class="fas fa-check"></i></span>
	    </div>
      <input type="phone" autocomplete="tel" placeholder="" v-model.trim="user.phone" v-mask="'(###) ###-####'" placeholder="(999) 999-9999" id="phone" readonly />

      <!-- Button when number added or changed -->
      <!-- <transition name="fade">
	      <button class="btn btn__primary mt-3" v-if="showTest" @click.prevent="updatePhone">
	        Get Verification Code
	      </button>
	    </transition> -->

	    <!-- Verify Code -->
      <!-- <transition name="fade">
        <div v-if="showVerification">
        	<label for="code">Verification Code:</label>
        	<input type="text" autocomplete="one-time-code" inputmode="numeric" pattern="[0-9]*" id="code" v-model.trim="code" v-mask="'######'" placeholder="######" required @keyup="showVerifyButton = true" />
        </div>
      </transition> -->

      <!-- Button When Verify Code Added -->
      <!-- <transition name="fade">
        <button class="btn btn__primary mt-3" v-if="showVerifyButton" @click.prevent="verify">Verify</button>
      </transition> -->

      <!-- Button When Verify Error -->
      <!-- <transition name="fade">
        <div v-if="user.phoneVerified && user.phoneVerified == 'pending'">
          <button class="btn btn__primary mt-3" @click.prevent="verify">Please check your code and try again</button>
        </div>
      </transition> -->

     <!--  <transition name="fade">
        <div v-if="error">
          <p>{{error}}</p>
        </div>
      </transition> -->

    </div>
    
    <div class="mb-3">
      <label for="dob">Date of Birth:</label>
      <input type="date" placeholder="" v-model.trim="user.dob" id="dob" readonly/>
    </div>
    <div class="mb-3">
      <label for="shirtsize">Shirt Size (unisex):</label>
      <input type="text" placeholder="" v-model.trim="user.shirtsize" id="shirtsize" readonly />
    </div>
	</div>
</template>

<script>
const fb = require('../../firebaseConfig.js')

export default {
  props: ['user'],
  methods: {
  },
   beforeDestroy () {
    this.$store.dispatch('clearUserState')
    this.$store.dispatch('clearErrors')
  }
}
</script>