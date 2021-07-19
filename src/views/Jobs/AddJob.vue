<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Add Job</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <form ref="form" @submit.prevent>
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

              <button class="btn btn__primary mt-2" @click="addJob()">
                Add Job
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>

            </form>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'

export default {
  name: 'addjob',
  data: () => ({
    job: {},
    performingRequest: false,
  }),
  methods: {
    addJob() {
      this.performingRequest = true
      let job = this.job
      let store = this.$store
      store.dispatch('addJob', job)
      setTimeout(() => {
        let url = `/jobs`
        router.push(url)
        this.performingRequest = false
      }, 1000)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.event = null
    this.performingRequest = false
    delete this.performingRequest
    delete this.job
    this.$store.dispatch('clearErrors')
  }
}
</script>