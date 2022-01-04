<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Add Group</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <form ref="form" @submit.prevent>
        <div class="dashboard__container--body">
          <div class="dashboard__container--body--col">
            <form ref="form" @submit.prevent>
              <div class="mb-3">
                <label for="title">Group Title:</label>
                <input type="text" v-model.trim="group.title" id="title" />
              </div>
              <div class="mb-3">
                <label for="desc">Group Description:</label>
                <textarea name="desc" id="desc" cols="30" rows="10" v-model="group.description"></textarea>
              </div>

              <button class="btn btn__primary mt-2" @click="addGroup()">Create Group
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
  name: 'addgroup',
  data: () => ({
    group: {
      title: '',
      description: ''
    },
    performingRequest: false,
  }),
  computed: {
    ...mapState(['currentUser',]),
  },
  methods: {
    addGroup() {
      this.performingRequest = true
      let group = this.group
      let store = this.$store
      group.owner = this.currentUser.uid
      store.dispatch('addGroup', group)

      setTimeout(() => {
        this.performingRequest = false
        group = {}
        let url = `/groups`
        router.push(url)
      }, 1000)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.group = {}
    this.performingRequest = null
    delete this.performingRequest
    this.$store.dispatch('clearErrors')
  }
}
</script>