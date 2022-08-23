<template>
  <div class="dashboard">
    <div class="dashboard__container pb-0" :class="{ held: docHeld }" v-if="user">
      <div class="dashboard__container--header">
        <span class="flex">
        <h1 :class="{ danger: dnr }" v-if="user && user.firstName && user.lastName">{{user.firstName}} {{user.lastName}}</h1>
        <star-rating :read-only="true" :star-size="30" v-if="user && user.rating" v-model="user.rating" class="ml-5"></star-rating>
        <span v-if="user && user.points" class="flex align-center ml-5">
          <span class="points animated-box">
            {{user.points}}
          </span>
        </span>
        <Rewards v-if="user" :user="user" />
        </span>
        <span class="flex align-center">
          <router-link :to="`/users/${$route.params.id}/details`">
            <button class="btn  ml-3" v-bind:class="{ 'btn__dark': isDetails, 'btn__outlined': !isDetails }">Details</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/payroll`">
            <button class="btn  ml-3" v-bind:class="{ 'btn__dark': isPayroll, 'btn__outlined': !isPayroll }">Payroll</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/assignments`">
            <button class="btn  ml-3" v-bind:class="{ 'btn__dark': isAssignments, 'btn__outlined': !isAssignments }">Assignments</button>
          </router-link>
        </span>
      </div>
    </div>
    <router-view :key="$route.params.id" :user="user" :dnr="dnr" :docHeld="docHeld" />
    <Loader v-if="(!user || !user.id)" />
  </div>
</template>

<style scoped>
  .held {
    opacity: 0.8;
    filter: grayscale(100%);
  }
</style>

<script>
import { mapState } from 'vuex'
import StarRating from 'vue-star-rating'
import Loader from '@/components/Loader.vue'
import Rewards from '@/components/Rewards.vue'
import router from '@/router'

export default {
  name: 'userHome',
  computed: {
    ...mapState(['currentUser', 'userInfo']),
    user() {
      return this.userInfo
    },
    docHeld() {
      if (this.user && this.user.docHold) {
        return true
      }
    },
    dnr() {
     if (this.user && this.user.blacklist && this.user.blacklist.length >= 1) {
      return true
     }
    },
    isDetails() {
      return this.$route.name == 'userDetails';
    },
    isPayroll() {
      return this.$route.name == 'userPayroll';
    },
    isAssignments() {
      return this.$route.name == 'userAssignments';
    }
  },
  created () {
    this.$store.dispatch("getUserFromId", this.$route.params.id);
  },
  async mounted () {
    this.$store.dispatch('getUserNotes', this.$route.params.id)
    this.$store.dispatch('getUserMessages', this.$route.params.id)
    this.$store.dispatch('getUserReviews', this.$route.params.id)
    this.$store.dispatch('getUserEvents', this.$route.params.id)
    this.$store.dispatch('getUserAssignments', this.$route.params.id)
    this.$store.dispatch('getUserVerifications', this.$route.params.id)
    this.$store.dispatch('getUserPayroll', this.$route.params.id)
  },
  components: {
    Loader,
    StarRating,
    Rewards,
  },
  destroyed() {
    // this.$store.dispatch('clearUserState')
    this.$store.dispatch('clearErrors')
    console.log('destroyed')
  }
}

</script>