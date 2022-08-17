<template>
  <div class="dashboard">
    <div class="dashboard__container" :class="{ held: docHeld }" v-if="user">
      <div class="dashboard__container--header mb-3">
        <span class="flex">
        <h1 :class="{ danger: dnr }" v-if="user && user.firstName && user.lastName">{{user.firstName}} {{user.lastName}}</h1>
        </span>
        <span class="flex align-center">
          <button class="btn btn__outlined mr-3" @click="goPayroll()">Pay History</button>
          <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
        </span>
      </div>

      <div class="dashboard__container--body" v-if="user">
        <div class="dashboard__container--body--col">
          <UserEvents :events="userEvents" />
        </div>
        <div class="dashboard__container--body--col">
          <UserAssignments :assignments="userAssignments" />
        </div>
      </div>


    </div>

    <Loader v-if="(userEvents && userEvents.length == 0)" />

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
import Loader from '@/components/Loader.vue'
import UserAssignments from '@/components/Profile/UserAssignments.vue'
import UserEvents from '@/components/Profile/UserEvents.vue'
import router from '@/router'

export default {
  name: 'userAssignments',
  computed: {
    ...mapState(['currentUser', 'userInfo', 'userAssignments', 'userEvents']),
    user() {
      return this.userInfo
    },
    dnr() {
     if (this.user && this.user.blacklist && this.user.blacklist.length >= 1) {
      return true
     }
    },
    docHeld() {
      if (this.user && this.user.docHold) {
        return true
      }
    },
    // joined() {
    //   if(this.user && this.user.created) {
    //     return new Date(this.user.created.seconds*1000)
    //     console.log(this.currentUser.metaData)
    //   }
    // }
  },
  created () {
    this.$store.dispatch("getUserFromId", this.$route.params.id);
    // if (!this.groups || this.groups.length < 1) {
    //   this.$store.dispatch("getGroups")
    // }
  },
  components: {
    Loader,
    UserAssignments,
    UserEvents
  },
  methods: {
    goBack() {
      router.go(-1)
    },
    goEvents() {
      let url = `/users/` + this.$route.params.id + `/assignments`
      router.push(url)
    },
    goPayroll() {
      let url = `/users/` + this.$route.params.id + `/payroll`
      router.push(url)
    },
  },
  beforeDestroy() {
    this.$store.dispatch('clearUserState')
    this.$store.dispatch('clearErrors')
    console.log(this)
  }
}

</script>

<style lang="scss" scoped>

</style>