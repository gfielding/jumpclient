<template>
  <div class="pt-3">
      <div class="dashboard__container--body">
        <div class="dashboard__container--body--col">
          <form ref="form" @submit.prevent>
            <div class="mb-3">
              <label for="title">Group Title:</label>
              <input type="text" v-model.trim="group.title" id="title" />
            </div>
            <div class="mb-3">
              <label for="desc">Group Description:</label>
              <textarea name="desc" id="desc" cols="30" rows="6" v-model="group.description"></textarea>
            </div>
            <button class="btn btn__primary mt-2" @click="updateGroup()">Update
              <transition name="fade">
                <span class="ml-2" v-if="performingRequest">
                <i class="fa fa-spinner fa-spin"></i>
                </span>
              </transition>
            </button>
          </form>
        </div>
        <div class="dashboard__container--body--col">
          <form ref="form" @submit.prevent>
            <div class="mb-3" v-if="(reps.length > 1) && (isOwner)">
              <label for="rep">Account Admins:</label>
              <v-select
                class="mt-2"
                label="name" 
                :options="reps"
                v-model="group.admins"
                multiple
                >
              </v-select>
            </div>
            <div class="mb-3" v-if="(reps.length > 1) && (isOwner || isAdmin)">
              <label for="rep">Account Users:</label>
              <v-select
                class="mt-2"
                label="name" 
                :options="reps"
                v-model="group.users"
                multiple
                >
              </v-select>
            </div>
            <div class="mb-3">
              <button class="btn btn__primary mt-2" @click="addUsers()">Update Users
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest2">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>
            </div>
          </form>
        </div>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
import * as moment from 'moment'

export default {
  name: 'groupEdit',
  data: () => ({
    message: '',
    showAll: true,
    performingRequest: false,
    performingRequest2: false,
  }),
  computed: {
    ...mapState(['groupUsers', 'group', 'currentUser', 'userProfile', 'groupMessages', 'mgrs']),
    clean() {
      return (!this.groupUsers || this.groupUsers.length == 0)
    },
    reps: function() {
      return this.mgrs.filter(mgr => {
        return mgr.userId
      })
    },
    isOwner: function() {
      return this.group.owner == this.currentUser.uid
    },
    isAdmin: function() {
      if (this.group && this.group.admins && this.group.admins.length > 0) {
        let array = this.group.admins
        if(array.some(person => person.id == this.currentUser.uid)){
          return true
        } else {
          return false
        }
      }
    },
    isUser: function() {
      if (this.group && this.group.users && this.group.users.length > 0) {
        if(array.some(person => person.id == this.currentUser.uid)){
          return true
        } else {
          return false
        }
      }
    }
  },
  created () {
    this.$store.dispatch("getGroupFromId", this.$route.params.id);
    if (!this.mgrs || this.mgrs.length < 1) {
      this.$store.dispatch("getMgrsState")
    }
  },
  components: {
    Loader,
  },
  methods: {
    updateGroup() {
      this.performingRequest = true
      let group = this.group
      this.$store.dispatch('updateGroup', group)
      setTimeout(() => {
        this.performingRequest = false
      }, 500)
    },
    addUsers() {
      this.performingRequest2 = true
      let group = this.group
      this.$store.dispatch('updateGroup', group)
      setTimeout(() => {
        this.performingRequest2 = false
      }, 500)
    },
    deleteGroup() {
      let group = this.group
      this.$store.dispatch('deleteGroup', group)
      setTimeout(() => {
        let url = `/groups`
        router.push(url)
      }, 500)
    },
    addUser() {

    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearGroupState')
  }
}
</script>