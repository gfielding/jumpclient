<template>
	<div>
		<h2 class="mb-3">Social Info</h2>
    <div class="mb-3">
      <div class="flex align-center justify-space-between">
        <label for="instagram">Instagram Username: <i class="far fa-clipboard"
          v-clipboard:copy="user.instagram"
      v-clipboard:success="onCopy"
          ></i></label>
        <div v-if="user.instagram">
          <a :href="`https://instagram.com/` + user.instagram" target="_blank">
            <button class="btn btn__small btn__primary btn__flat mb-2">Test Link <i class="fas fa-external-link ml-2"></i></button>
          </a>
        </div>
      </div>
      <input type="text" placeholder="mvpeventstaffing" v-model.trim="user.instagram" id="instagram" @change="updateUser()"
      />
    </div>
    <div class="mb-3">
      <div class="flex align-center justify-space-between">
        <label for="facebook">Facebook Username: <i class="far fa-clipboard"
          v-clipboard:copy="user.facebook"
      v-clipboard:success="onCopy"
          ></i></label>
        <div v-if="user.facebook">
          <a :href="`https://facebook.com/` + user.facebook" target="_blank">
            <button class="btn btn__small btn__primary btn__flat mb-2">Test Link <i class="fas fa-external-link ml-2"></i></button>
          </a>
        </div>
      </div>
      <input type="text" placeholder="mvpeventstaffing" v-model.trim="user.facebook" id="facebook" @change="updateUser()"
      />
    </div>
    <div class="mb-3">
      <div class="flex align-center justify-space-between">
        <label for="linkedin">LinkedIn Username: <i class="far fa-clipboard"
          v-clipboard:copy="user.linkedin"
      v-clipboard:success="onCopy"
          ></i></label>
        <div v-if="user.linkedin">
          <a :href="`https://www.linkedin.com/in/` + user.linkedin" target="_blank">
            <button class="btn btn__small btn__primary btn__flat mb-2">Test Link <i class="fas fa-external-link ml-2"></i></button>
          </a>
        </div>
      </div>
      <input type="text" placeholder="mvpeventstaffing" v-model.trim="user.linkedin" id="linkedin" @change="updateUser()"
      />
    </div>
	</div>
</template>

<script>
export default {
  props: ['user'],
  methods: {
    onCopy: function (e) {
      alert('Copied to Clipboard')
    },
    updateUser(){
      let user = this.user
      this.$store.dispatch('updateTheUser', user)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearUserState')
    this.$store.dispatch('clearErrors')
  }
}
</script>