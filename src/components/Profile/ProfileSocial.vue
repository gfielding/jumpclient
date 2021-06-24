<template>
	<div>
		<h2 class="mb-3">Social Info</h2>
    <div class="mb-3">
      <label for="instagram">Instagram Username:</label>
      <input type="text" placeholder="mvpeventstaffing" v-model.trim="userProfile.instagram" id="instagram" @change="updateProfile()"/>
    </div>
    <div class="mb-3">
      <label for="facebook">Facebook Username:</label>
      <input type="text" placeholder="mvpeventstaffing" v-model.trim="userProfile.facebook" id="facebook" @change="updateProfile()"/>
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