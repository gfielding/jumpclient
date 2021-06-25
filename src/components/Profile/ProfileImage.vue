<template>
	<div>
		<form @submit.prevent>
  		<h2 class="mb-3">Update Profile Image</h2>
      <div class="flex flex-column align-center">
  			<div class="avatar-wrapper" :style="{ backgroundImage: 'url(' + backgroundUrl + ')' }">
  				<croppa 
          v-model="croppa"
          :prevent-white-space="true"
          :width="280"
          :height="280"
          accept=".jpeg,.png,.jpg,.svg"
          :file-size-limit="2048000"
          :quality="4"
          :placeholder="'Update Image'"
          placeholder-color="white"
          initial-size="cover"
          :remove-button-size="32"
          @image-remove="showSetButton = false"
          @loading-end="showSetButton = true"
          @file-size-exceed="onFileSizeExceed"
          @file-type-mismatch="onFileTypeMismatch"
        >
        </croppa>
  			</div>
        <p class="caption mt-3">jpg or png file. 2MB max</p>
      </div>
      <div class="flex justify-center mt-5" v-if="showSetButton">
        <button class="btn btn__primary btn__large mb-5" @click="saveProfileImage()">
          Save Image
          <transition name="fade">
            <span class="ml-2" v-if="performingRequest">
            <i class="fa fa-spinner fa-spin"></i>
            </span>
          </transition>
        </button>
      </div>
    </form>
	</div>
</template>

<script>
const fb = require('../../firebaseConfig.js')

export default {
  props: ['userProfile'],
  data: () => ({
  	performingRequest: false,
  	croppa: {},
  	showSetButton: false,
  }),
  computed: {
  	backgroundUrl() {
  		return this.userProfile.photoUrl || 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/avatar%20copy.png?alt=media&token=966c07c4-125a-490f-81be-4e2d26bf33fa'
  	}
  },
  methods: {
    onFileTypeMismatch(file) {
      alert('Invalid file type. Please choose a jpeg or png file.')
    },
    onFileSizeExceed(file) {
      alert('Please choose a file smaller than 2MB')
    },
  	saveProfileImage() {
  		this.performingRequest = true
      let croppa = this.croppa
      let user = this.userProfile
      let store = this.$store
      if (croppa.hasImage()) {
        console.log('getting')
        croppa.generateBlob(
          blob => {
            let croppaURL
            let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
            let picRef = fb.storageRef.child('profileImages/' + rand)
            picRef.put(blob).then((snap) => {
              picRef.getDownloadURL().then(function(croppaURL) {
                console.log('File available at', croppaURL)
                store.dispatch('updateUser', {
                	photoUrl: croppaURL,
                })
              })
            })
          }
        )
        setTimeout(() => {
	        this.performingRequest = false
	        this.showSetButton = false
	        croppa.remove()
	      }, 3000)
      }
    },
  }
}
</script>