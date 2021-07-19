<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <Loader v-if="!job" />
      <div class="dashboard__container--header" v-if="job">
        <h1>Edit Job</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <div class="dashboard__container--body">
        <div class="dashboard__container--body--col">
          <form ref="form" @submit.prevent>
            <div class="mb-3">
              <label for="title">Job Title:</label>
              <input type="text" v-model.trim="job.title" id="title" />
            </div>
            <div class="mb-3">
              <label for="desc">Job Description:</label>
              <textarea name="desc" id="desc" cols="30" rows="10" v-model="job.description"></textarea>
            </div>
            <div class="flex justify-space-between mt-2">
              <button class="btn btn__primary" @click="updateJob()">Update</button>
              <button class="btn btn__dark" @click="deleteJob()">delete</button>
            </div>
          </form>
        </div>
      </div>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'job',
  computed: {
    ...mapState(['jobInfo']),
    job() {
      return this.jobInfo
    }
  },
  created () {
    this.$store.dispatch("getJobFromId", this.$route.params.id);
  },
   components: {
    Loader,
  },
  methods: {
    updateJob() {
      let job = this.job
      this.$store.dispatch('updateJob', job)
      let url = `/jobs`
      router.push(url)
    },
    deleteJob() {
      let job = this.jobInfo
      this.$store.dispatch('deleteJob', job.id)
      let url = `/jobs`
      router.push(url)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearJobState')
    this.$store.dispatch('clearErrors')
  }
}
</script>
