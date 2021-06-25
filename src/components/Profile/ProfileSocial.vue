<template>
	<div>
		<h2 class="mb-3">Social Info</h2>
    <div class="mb-3">
      <div class="flex align-center justify-space-between">
        <label for="instagram">Instagram Username:</label>
        <div v-if="userProfile.instagram">
          <a :href="`https://instagram.com/` + userProfile.instagram" target="_blank">
            <button class="btn btn__small btn__primary btn__flat mb-2">Test Link <i class="fas fa-external-link ml-2"></i></button>
          </a>
        </div>
      </div>
      <input type="text" placeholder="mvpeventstaffing" v-model.trim="userProfile.instagram" id="instagram" @change="updateProfile()"/>
    </div>
    <div class="mb-3">
      <div class="flex align-center justify-space-between">
        <label for="facebook">Facebook Username:</label>
        <div v-if="userProfile.facebook">
          <a :href="`https://facebook.com/` + userProfile.facebook" target="_blank">
            <button class="btn btn__small btn__primary btn__flat mb-2">Test Link <i class="fas fa-external-link ml-2"></i></button>
          </a>
        </div>
      </div>
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