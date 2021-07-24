<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Add FAQ</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <form ref="form" @submit.prevent>
        <div class="dashboard__container--body">
          <div class="dashboard__container--body--col">
            <form ref="form" @submit.prevent>
              <div class="mb-3">
                <label for="question">Question:</label>
                <input type="text" v-model.trim="freq.question" id="question" />
              </div>
              <div class="mb-3">
                <label for="desc">Answer:</label>
                <vue-editor id="desc" v-model="freq.answer" required></vue-editor>
              </div>

              <button class="btn btn__primary mt-2" @click="addFaq()">
                Add FAQ
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
import { VueEditor } from "vue2-editor";

export default {
  name: 'addfaq',
  data: () => ({
    freq: {},
    performingRequest: false,
  }),
  components: {
    VueEditor
  },
  methods: {
    addFaq() {
      this.performingRequest = true
      let freq = this.freq
      let store = this.$store
      store.dispatch('addFaq', freq)
      setTimeout(() => {
        let url = `/faqs`
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
    delete this.freq
    this.$store.dispatch('clearErrors')
  }
}
</script>