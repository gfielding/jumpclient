<template>
	<div>
		<h2 class="mb-3">Upload Certfications</h2>
    <div class="mb-3">
      <h3>Alcohol Awareness Certification</h3>
      <p>Employees who will be working with alcohol will need a valid alcohol awareness certificate. You can get one online from <a href="https://www.tipsalcohol.com/concessions-course.html" target="_blank">TIPS Alcohol</a>, <a href="https://www.abc.ca.gov/education/register-for-licensee-training/register-for-online-lead-training/" target="_blank">LEAD</a>, or <a href="https://www.servsafe.com/ServSafe-Alcohol" target="_blank">ServSafe</a>.</p>

      <a :href="userProfile.certTips" v-if="userProfile.certTips" target="_blank" class="caption">View Your Certificate <i class="fas fa-external-link ml-1 mt-2"></i></a>

      <input class="mt-3" type="file" ref="fileInputTip" accept="image/*,application/pdf,.doc" @change="previewImage">

      <progress :value="uploadValue" max="100" v-if="showBar"></progress>
      <div>
        <button v-if="imageData != null" class="btn btn__primary mt-3" @click="onUploadTips">Upload</button>
      </div>
    </div>
    <div class="mb-3">
      <h3>Food-Handler's Certification</h3>
      <p>Some states require food handler's certifications for any staff working in a food prep area, as a server, or as a cashier where there is food served. Please check with your local state to see if a cert is required.</p>
      <a :href="userProfile.certFood" v-if="userProfile.certFood" target="_blank" class="caption">View Your Certificate <i class="fas fa-external-link ml-1 mt-2"></i></a>

      <input class="mt-3" type="file" ref="fileInputFood" accept="image/*,application/pdf,.doc" @change="previewImageFood">

      <progress :value="uploadValueFood" max="100" v-if="showBarFood"></progress>
      <div>
        <button v-if="imageDataFood != null" class="btn btn__primary mt-3" @click="onUploadFood">Upload</button>
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
    uploadValueFood: 0,
    showBarFood:false,
    imageDataFood: null,
  }),
  methods: {
    previewImage(event) {
      this.uploadValue=0;
      this.imageData=event.target.files[0]
    },
    onUploadTips() {
      this.showBar = true
      let userProfile = this.userProfile

      userProfile.certTips=null

      let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
      let storageRef = fb.storageRef.child('docs/' + rand).put(this.imageData);
      storageRef.on(`state_changed`, snapshot => {
        this.uploadValue=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
      }, error => {console.log(error.message)},
      () => {this.uploadValue=100;
        storageRef.snapshot.ref.getDownloadURL().then((url) => {

          userProfile.certTips=url

          this.$store.dispatch('updateUser', userProfile)
        })
        this.showBar = false
      })
      this.imageData = null
      this.$refs.fileInputTip.value=null
    },
    previewImageFood(event) {
      this.uploadValueFood=0;
      this.imageDataFood=event.target.files[0]
    },
    onUploadFood() {
      this.showBarFood = true
      let userProfile = this.userProfile

      userProfile.certFood=null

      let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
      let storageRef = fb.storageRef.child('docs/' + rand).put(this.imageDataFood);
      storageRef.on(`state_changed`, snapshot => {
        this.uploadValue=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
      }, error => {console.log(error.message)},
      () => {this.uploadValue=100;
        storageRef.snapshot.ref.getDownloadURL().then((url) => {

          userProfile.certFood=url

          this.$store.dispatch('updateUser', userProfile)
        })
        this.showBarFood = false
      })
      this.imageDataFood = null
      this.$refs.fileInputFood.value=null
    },
  }
}
</script>