<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <Loader v-if="!group" />
      <div class="dashboard__container--header" v-if="group">
        <div v-if="venue">
        <h1>{{venue.title}}</h1>
        </div>
        <span class="flex align-center">
          <router-link :to="{name: 'followersGroup'}">
            <button class="btn" v-bind:class="{ 'btn__dark': isMembers, 'btn__outlined': !isMembers }">Members</button>
          </router-link>
          <router-link :to="{name: 'followersGroupMessages'}">
            <button class="btn ml-3" v-bind:class="{ 'btn__dark': isMessages, 'btn__outlined': !isMessages }">Messages</button>
          </router-link>
          <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
        </span>
        
      </div>
      <router-view :key="$route.params.id" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'followersGroupHome',
  computed: {
    ...mapState(['followersGroup', 'currentUser', 'followersGroupUsers', 'venueInfo']),
    venue() {
      return this.venueInfo
    },
    group() {
      return this.followersGroup
    },
    isMessages() {
      return this.$route.name == 'followersGroupMessages';
    },
    isMembers() {
      return this.$route.name == 'followersGroup';
    },
  },
  created () {
    this.$store.dispatch("getFollowersGroupFromId", this.$route.params.id);
    this.$store.dispatch("getVenueFromId", this.$route.params.id);
  },
  components: {
    Loader,
  },

  methods: {
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearFollowersGroupState')
    this.$store.dispatch('clearErrors')
  }
}
</script>