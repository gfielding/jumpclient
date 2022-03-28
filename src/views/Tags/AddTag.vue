<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Add Tag</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <form ref="form" @submit.prevent>
        <div class="dashboard__container--body">
          <div class="dashboard__container--body--col">
            <form ref="form" @submit.prevent>
              <div class="mb-3">
                <label for="title">Title:</label>
                <input type="text" v-model.trim="tag.title" id="title" />
              </div>
              <div class="mb-3">
                <label for="featured">Featured:</label>
                <input type="checkbox" v-model.trim="tag.featured" id="featured" class="ml-3" />
              </div>

              <button class="btn btn__primary mt-2" @click="addTag()">
                Add Tag
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
  name: 'addtag',
  data: () => ({
    tag: {},
    performingRequest: false,
  }),
  methods: {
    addTag() {
      this.performingRequest = true
      let tag = this.tag
      let store = this.$store
      store.dispatch('addTag', tag)
      setTimeout(() => {
        let url = `/tags`
        router.push(url)
        this.performingRequest = false
      }, 1000)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.tag = null
    this.performingRequest = false
    delete this.performingRequest
    delete this.tag
    this.$store.dispatch('clearErrors')
  }
}
</script>