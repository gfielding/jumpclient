<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1 v-if="user && user.firstName && user.lastName">{{user.firstName}} {{user.lastName}}</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <ProfileSkills :user="user" class="mb-1" v-if="user" />
      <div class="caption mb-2 ml-2">UID #{{user.id}}</div>
      <div class="dashboard__container--body" v-if="user">
        <div class="dashboard__container--body--col">
          <ProfileImage :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileStatus :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileBlacklist :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileMessagingProfile :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileMessagingPay :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileMessagingAvailability :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileContact :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileAddress :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileSocial :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileBio :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileEmergency :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileCerts :user="user" />
        </div>
      </div>

      <hr>

      <div class="dashboard__container--body" v-if="user">
        <div class="dashboard__container--body--col">
          <NotesTable :notes="userNotes" />
        </div>
        <div class="dashboard__container--body--col">
          <UserNote :user="user" :me="userProfile" />
        </div>
      </div>


    </div>

    <Loader v-if="!user" />

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
import ProfileBlacklist from '@/components/Profile/ProfileBlacklist.vue'
import ProfileStatus from '@/components/Profile/ProfileStatus.vue'
import ProfileMessagingProfile from '@/components/Profile/ProfileMessagingProfile.vue'
import ProfileMessagingPay from '@/components/Profile/ProfileMessagingPay.vue'
import ProfileMessagingAvailability from '@/components/Profile/ProfileMessagingAvailability.vue'
import UserNote from '@/components/Profile/UserNote.vue'
import NotesTable from '@/components/Profile/NotesTable.vue'
import router from '@/router'

export default {
  name: 'user',
  computed: {
    ...mapState(['userInfo', 'userNotes', 'userProfile']),
    user() {
      return this.userInfo
    }
  },
  created () {
    this.$store.dispatch("getUserFromId", this.$route.params.id);
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
    ProfileSkills,
    ProfileBlacklist,
    ProfileStatus,
    ProfileMessagingProfile,
    ProfileMessagingPay,
    ProfileMessagingAvailability,
    UserNote,
    NotesTable
  },
  methods: {
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy() {
    this.$store.dispatch('clearUserState')
    this.$store.dispatch('clearErrors')
  }
}

</script>

<style lang="scss" scoped>

</style>