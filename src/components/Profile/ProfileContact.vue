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
      <label for="phone">Cell Phone:</label>
      <input type="phone" placeholder="" v-model.trim="userProfile.phone" v-mask="'(###) ###-####'" placeholder="(999) 999-9999" id="phone" @change="updateProfile()"/>
    </div>
    <div class="mb-3">
      <label for="dob">Date of Birth:</label>
      <input type="date" placeholder="" v-model.trim="userProfile.dob" id="dob" @change="updateProfile()"/>
    </div>
	</div>
</template>

<script>
export default {
  props: ['userProfile', 'emailVerified'],
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
    }
  }
}
</script>