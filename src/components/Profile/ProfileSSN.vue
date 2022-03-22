<template>
	<div>
		<h2 class="mb-3">Social Security Number</h2>

		<div class="mb-3">
      <form @submit.prevent>
        <div class="flex align-center justify-space-between">
          <label for="social" class="mb-2">Enter your social security number:</label>
        </div>
        <div style="display: flex; justify-content: space-between;" class="mb-3" v-if="!showEdit">
          <input style="width: 100%;" v-mask="'###-##-####'" placeholder="###-##-####" :value="decryptedText" type="text" maxlength = "11" id="ssn2" readonly  />
        </div>

        <button class="btn btn__outlined btn__small mb-3" @click="showChange()" v-if="!showEdit">Edit</button>

        <div style="display: flex; justify-content: space-between;" class="mb-3" v-if="showEdit">
          <input style="width: 100%;" v-mask="'###-##-####'" placeholder="###-##-####" v-model.trim="ssn" type="text" maxlength = "11" id="ssn" />
        </div>

        <button class="btn btn__accent btn__small" @click="updateProfile()" v-if="showEdit" :disabled="ssn.length != 11" >update</button>
      </form>
    </div>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['userProfile'],
  data: () => ({
    ssn:'',
    encryptionKey: 'SKD433{}{[SKD433{}{[SKD433{}{[32',
    showEdit: false
  }),
  computed: {
    ...mapState([ 'currentUser']),
  },
  computed: {
    encryptedText() {
      if (this.ssn) {
        return this.$CryptoJS.AES.encrypt(this.ssn, this.encryptionKey).toString()
      }
    },
    decryptedText() {
      if (this.userProfile && this.userProfile.ssn) {
      return (this.$CryptoJS.AES.decrypt(this.userProfile.ssn, this.encryptionKey).toString(this.CryptoJS.enc.Utf8) || this.$CryptoJS.AES.encrypt(this.ssn, this.encryptionKey).toString())
      }
    }
  },
  // mounted() {
  //   this.$nextTick(() => {})
  // },
  methods: {
    showChange() {
      this.showEdit = true
    },
    updateProfile(){
    	let userProfile = this.userProfile
      userProfile.ssn = this.encryptedText
    	this.$store.dispatch('updateUser', userProfile)
      this.showEdit = false
    },
  }
}
</script>