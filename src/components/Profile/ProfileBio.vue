<template>
	<div>
		<h2 class="mb-3">Tell Us About Yourself</h2>
		<div class="mb-3">
      <vue-editor id="bio" v-model.trim="userProfile.bio" placeholder="Education, experience, job history, interests, etc..." @change="updateProfile()" :editor-toolbar="customToolbar"></vue-editor>
    </div>
    <div class="mb-3">
      <h3>Upload your resumé</h3>
      <a :href="userProfile.picture" v-if="userProfile.picture" target="_blank" class="caption">View Your Resumé <i class="fas fa-external-link ml-1 mt-2"></i></a>


      <input type="file" ref="file" accept="image/*,.pdf" @change="previewImage" class="mt-3">

      <!-- <div class="mt-3">
        <button class="btn btn__primary" @click="$refs.file.click()">Choose File <i class="far fa-folder-open ml-3"></i></button>
      </div> -->


      <progress :value="uploadValue" max="100" v-if="showBar"></progress>
      <div>
        <button v-if="imageData != null" class="btn btn__primary mt-3" @click="onUpload">Upload</button>
      </div>
    </div>
	</div>
</template>

<script>
const fb = require('../../firebaseConfig.js')
import { VueEditor } from "vue2-editor";

export default {
  props: ['userProfile'],
  data: () => ({ 
    imageData: null,
    uploadValue: 0,
    showBar:false,
    picture: null,
    customToolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
    ]
  }),
  components: {
    VueEditor,
  },
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
      this.$refs.file.value=null
    }
  }
}
</script>