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
              <div class="mb-3">
                <label for="title">Group Title:</label>
                <input class="mb-5" type="text" v-model.trim="group.title" id="title" />

                <label for="groupVisible">Visible on Website:</label>
                <input type="checkbox" v-model.trim="group.visible" id="groupVisible" class="mb-5 ml-3" />
                <div>
              <label for="location">Location (Ex: Monterey, CA):</label>
              <input type="text" v-model.trim="group.location" id="location" class="mb-5"  />
              </div>
              <label for="pickDate">Specify Jobs:</label>
              <v-select
                class="mt-2 mb-5"
                label="title" 
                :options="jobs"
                v-model="group.job"
                multiple
                >
              </v-select>

                <label for="desc">Group Description:</label>
                <textarea name="desc" id="desc" cols="30" rows="10" v-model="group.description"></textarea>
              </div>

              

            
          </div>
          <div class="dashboard__container--body--col">
            <div class="mb-3" v-if="(reps.length >= 1)">
              <label for="rep">Account Admins:</label>
              <v-select
                class="mt-2 mb-5"
                label="name" 
                :options="reps"
                v-model="group.admins"
                multiple
                >
              </v-select>

              <label for="rep">Account Users:</label>
              <v-select
              v-if="(reps.length >= 1)"
                class="mt-2"
                label="name" 
                :options="reps"
                v-model="group.users"
                multiple
                >
              </v-select>
            </div>
            <div class="mb-3">
              <button class="btn btn__primary mt-2" @click="addGroup()">Create Group
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>
              <!-- <button class="btn btn__primary mt-2" @click="addUsers()">Update Users
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest2">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button> -->
            </div>
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
      description: '',
      visible: false
    },
    performingRequest: false,
  }),
  computed: {
    ...mapState(['currentUser','jobs', 'mgrs']),
    reps: function() {
      return this.mgrs.filter(mgr => {
        return mgr.userId
      })
    },
  },
  created () {
    if (!this.mgrs || this.mgrs.length < 1) {
      this.$store.dispatch("getMgrsState")
    }
    if (!this.jobs || this.jobs.length < 1) {
      this.$store.dispatch("getJobsState")
    }
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