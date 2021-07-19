<template>
	<div>
		<h2 class="mb-3">Certfications</h2>
    <div class="mb-3">
      <h4>Alcohol Awareness Certification</h4>
      <!-- <p>Employees who will be working with alcohol will need a valid alcohol awareness certificate. You can get one online from <a href="https://www.tipsalcohol.com/concessions-course.html" target="_blank">TIPS Alcohol</a>, <a href="https://www.abc.ca.gov/education/register-for-licensee-training/register-for-online-lead-training/" target="_blank">LEAD</a>, or <a href="https://www.servsafe.com/ServSafe-Alcohol" target="_blank">ServSafe</a>.</p>
 -->
      <a :href="user.certTips" v-if="user.certTips" target="_blank" class="caption">View Certificate <i class="fas fa-external-link ml-1 mt-2"></i></a>

      <!-- <input class="mt-3" type="file" ref="fileInputTip" accept="image/*,application/pdf,.doc" @change="previewImage">

      <progress :value="uploadValue" max="100" v-if="showBar"></progress>
      <div>
        <button v-if="imageData != null" class="btn btn__primary mt-3" @click="onUploadTips">Upload</button>
      </div> -->
    </div>
    <div class="mb-3">
      <h4>Food-Handler's Certification</h4>
      <!-- <p>Some states require food handler's certifications for any staff working in a food prep area, as a server, or as a cashier where there is food served. Please check with your local state to see if a cert is required.</p> -->
      <a :href="user.certFood" v-if="user.certFood" target="_blank" class="caption">View Certificate <i class="fas fa-external-link ml-1 mt-2"></i></a>

    <!--   <input class="mt-3" type="file" ref="fileInputFood" accept="image/*,application/pdf,.doc" @change="previewImageFood">

      <progress :value="uploadValueFood" max="100" v-if="showBarFood"></progress>
      <div>
        <button v-if="imageDataFood != null" class="btn btn__primary mt-3" @click="onUploadFood">Upload</button>
      </div> -->
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