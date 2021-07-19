<template>
	<div>
		<h2 class="mb-3">Social Info</h2>
    <div class="mb-3">
      <div class="flex align-center justify-space-between">
        <label for="instagram">Instagram Username:</label>
        <div v-if="user.instagram">
          <a :href="`https://instagram.com/` + user.instagram" target="_blank">
            <button class="btn btn__small btn__primary btn__flat mb-2">Test Link <i class="fas fa-external-link ml-2"></i></button>
          </a>
        </div>
      </div>
      <input type="text" placeholder="mvpeventstaffing" v-model.trim="user.instagram" id="instagram" readonly />
    </div>
    <div class="mb-3">
      <div class="flex align-center justify-space-between">
        <label for="facebook">Facebook Username:</label>
        <div v-if="user.facebook">
          <a :href="`https://facebook.com/` + user.facebook" target="_blank">
            <button class="btn btn__small btn__primary btn__flat mb-2">Test Link <i class="fas fa-external-link ml-2"></i></button>
          </a>
        </div>
      </div>
      <input type="text" placeholder="mvpeventstaffing" v-model.trim="user.facebook" id="facebook" readonly />
    </div>
	</div>
</template>

<script>
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