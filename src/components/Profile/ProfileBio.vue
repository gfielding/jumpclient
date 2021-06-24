<template>
	<div>
		<h2 class="mb-3">Tell Us About Yourself</h2>
		<div class="mb-3">
      <label for="bio">Bio:</label>
      <textarea name="bio" id="bio" cols="30" rows="10" v-model.trim="userProfile.bio" @change="updateProfile()" placeholder="Education, experience, job history, interests, etc..."></textarea>
    </div>
    <div class="mb-3">
      <h3>Upload your resumé</h3>
      <a :href="userProfile.picture" v-if="userProfile.picture" target="_blank">View Your Resumé <i class="fas fa-external-link ml-1"></i></a>
      <input type="file" accept="image/*,.pdf" @change="previewImage" class="upload">
      <progress :value="uploadValue" max="100" v-if="showBar"></progress>
      <div>
        <button v-if="imageData != null" class="btn btn__primary" @click="onUpload">Upload</button>
      </div>
    </div>
	</div>
</template>

<script>
const fb = require('../../firebaseConfig.js')

export default {
  props: ['userProfile'],
  data: () => ({ 
    imageData: null,
    uploadValue: 0,
    showBar:false,
    picture: null,
  }),
  methods: {
    updateProfile(){
    	let userProfile = this.userProfile
    	this.$store.dispatch('updateUser', userProfile)
    },
    previewImage(event) {
      this.uploadValue=0;
      this.picture=null
      this.imageData=event.target.files[0]
    },
    onUpload() {
      this.showBar = true
      let userProfile = this.userProfile
      userProfile.picture=null
      let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
      let storageRef = fb.storageRef.child('docs/' + rand).put(this.imageData);
      storageRef.on(`state_changed`, snapshot => {
        this.uploadValue=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
      }, error => {console.log(error.message)},
      () => {this.uploadValue=100;
        storageRef.snapshot.ref.getDownloadURL().then((url) => {
          userProfile.picture=url
          this.$store.dispatch('updateUser', userProfile)
        })
        this.showBar = false
      })
      this.imageData = null
    }
  }
}
</script>