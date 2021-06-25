<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Dashboard</h1>
      </div>
      <Loader v-if="!userProfile" />
      <div class="dashboard__container--body pt-3" v-if="userProfile">
        <p>Please complete your <router-link :to="{name: 'profile'}">profile</router-link>. Events will be posted shortly!</p>
        <!-- <div class="dashboard__container--body--col">
          <ProfileImage :userProfile="userProfile" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileContact :userProfile="userProfile" :emailVerified="emailVerified" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileAddress :userProfile="userProfile" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileSocial :userProfile="userProfile" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileBio :userProfile="userProfile" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileEmergency :userProfile="userProfile" />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import ProfileImage from '@/components/Profile/ProfileImage.vue'
import ProfileContact from '@/components/Profile/ProfileContact.vue'
import ProfileAddress from '@/components/Profile/ProfileAddress.vue'
import ProfileEmergency from '@/components/Profile/ProfileEmergency.vue'
import ProfileBio from '@/components/Profile/ProfileBio.vue'
import ProfileSocial from '@/components/Profile/ProfileSocial.vue'

export default {
  name: 'dashHome',
  computed: {
    ...mapState(['emailVerified', 'userProfile']),
  },
  components: {
    Loader,
    ProfileImage,
    ProfileContact,
    ProfileAddress,
    ProfileEmergency,
    ProfileBio,
    ProfileSocial
  },

}
</script>

<style lang="scss" scoped>

</style>