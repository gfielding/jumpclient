<template>
	<div>
    <h2 class="mb-3">Emergency Contacts</h2>
		<div class="mb-3">
      <label for="name1">Emergency Contact Name:</label>
      <input type="text" placeholder="Spouse, friend, etc." v-model.trim="userProfile.emergency1name" id="name1" @change="updateProfile()"/>
    </div>
    <div class="mb-3">
      <label for="phone1">Emergency Contact Cell Phone:</label>
      <input type="phone1" placeholder="" v-model.trim="userProfile.emergency1phone" v-mask="'(###) ###-####'" placeholder="(999) 999-9999" id="phone" @change="updateProfile()"/>
    </div>
    <div class="mb-3">
      <label for="name2">Emergency Contact Name:</label>
      <input type="text" placeholder="Spouse, friend, etc." v-model.trim="userProfile.emergency2name" id="name2" @change="updateProfile()"/>
    </div>
    <div class="mb-3">
      <label for="phone2">Emergency Contact Cell Phone:</label>
      <input type="phone2" placeholder="" v-model.trim="userProfile.emergency2phone" v-mask="'(###) ###-####'" placeholder="(999) 999-9999" id="phone" @change="updateProfile()"/>
    </div>
	</div>
</template>

<script>
export default {
  props: ['userProfile'],
  methods: {
    updateProfile(){
    	let userProfile = this.userProfile
    	this.$store.dispatch('updateUser', userProfile)
    },
  }
}
</script>