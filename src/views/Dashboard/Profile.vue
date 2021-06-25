<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Profile</h1>
      </div>
      <div class="dashboard__container--body" v-if="userProfile">
        <div class="dashboard__container--body--col">
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
        </div>
        <div class="dashboard__container--body--col">
          <ProfileCerts :userProfile="userProfile" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileSkills :userProfile="userProfile" />
        </div>
      </div>
    </div>

    <Loader v-if="!userProfile" />

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
import ProfileCerts from '@/components/Profile/ProfileCerts.vue'
import ProfileSkills from '@/components/Profile/ProfileSkills.vue'

export default {
  name: 'profile',
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
    ProfileSocial,
    ProfileCerts,
    ProfileSkills
  },

}
</script>

<style lang="scss" scoped>

</style>