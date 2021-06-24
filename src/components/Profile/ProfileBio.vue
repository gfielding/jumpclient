<template>
	<div>
		<h2 class="mb-3">Tell Us About Yourself</h2>
		<div class="mb-3">
      <label for="bio">Bio:</label>
      <textarea name="bio" id="bio" cols="30" rows="10" v-model.trim="userProfile.bio" @change="updateProfile()"></textarea>
    </div>
    <div class="mb-3">
      <p>Upload your resumé.</p>
      <input type="file" accept="image/*" @change="previewImage">
      <p>Progress: {{uploadValue.toFixed()+"%"}}
        <progress :value="uploadValue" max="100"></progress>
      </p>
      <div>
        <img :src="picture" alt="" class="preview">
        <br>
        <button @click="onUpload">Upload</button>
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
    picture: null,
    uploadValue: 0
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
      this.picture=null;
      let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
      let storageRef = fb.storageRef.child('docs/' + rand).put(this.imageData);
      storageRef.on(`state_changed`, snapshot => {
        this.uploadValue=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
      }, error => {console.log(error.message)},
      () => {this.uploadValue=100;
        storageRef.snapshot.ref.getDownloadURL().then((url) => {
          this.picture=url
        })
      })
    }
  }
}
</script>