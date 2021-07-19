<template>
	<div>
		<h2 class="mb-3">Bio</h2>
		<div class="mb-3">
      <div v-html="user.bio"> 
      </div>
     <!--  <vue-editor id="bio" v-model.trim="user.bio" placeholder="Education, experience, job history, interests, etc..." @change="updateProfile()" :editor-toolbar="customToolbar"></vue-editor> -->
    </div>
    <div class="mb-3">
      <h4>Resumé</h4>
      <a :href="user.picture" v-if="user.picture" target="_blank" class="caption">View Resumé <i class="fas fa-external-link ml-1 mt-2"></i></a>


      <!-- <input type="file" ref="file" accept="image/*,.pdf" @change="previewImage" class="mt-3"> -->

      <!-- <div class="mt-3">
        <button class="btn btn__primary" @click="$refs.file.click()">Choose File <i class="far fa-folder-open ml-3"></i></button>
      </div> -->


      <!-- <progress :value="uploadValue" max="100" v-if="showBar"></progress>
      <div>
        <button v-if="imageData != null" class="btn btn__primary mt-3" @click="onUpload">Upload</button>
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