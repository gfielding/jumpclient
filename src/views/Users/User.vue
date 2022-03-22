<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <span class="flex">
        <h1 v-if="user && user.firstName && user.lastName">{{user.firstName}} {{user.lastName}}</h1>
        <star-rating :read-only="true" :star-size="30" v-if="user && user.rating" v-model="user.rating" class="ml-5"></star-rating>
        <span v-if="user && user.points" class="flex align-center ml-5">
          <span class="points animated-box">
            {{user.points}}
          </span>
        </span>
        <Rewards v-if="user" :user="user" />
        </span>
        <span>
          <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
        </span>
      </div>
      <ProfileSkills :user="user" class="mb-1" v-if="user" />
      <div class="caption mb-2 ml-2" v-if="user && user.id">UID #{{user.id}}</div>
      <div class="dashboard__container--body" v-if="user">
        <div class="dashboard__container--body--col">
          <ProfileImage :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <h2 class="mb-3">I-9 Verifications</h2>
          <ProfileVerifications :user="user" :verifications="userVerifications" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileStatus :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileSSN :userProfile="userProfile" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileBlacklist :user="user" />
        </div>
        
        <div class="dashboard__container--body--col">
          <ProfileMessagingProfile :user="user" />
        </div>
        <!-- <div class="dashboard__container--body--col">
          <ProfileMessagingPay :user="user" />
        </div>
         <div class="dashboard__container--body--col">
          <ProfileMessagingAvailability :user="user" />
        </div> -->
        <div class="dashboard__container--body--col">
          <ProfileTags :user="user" :userProfile="userProfile" />
        </div>
        
        <div class="dashboard__container--body--col">
          <ProfileContact :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileSocial :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileAddress :user="user" />
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
          <MessageTable :messages="userMessages" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileMessage :user="user" :admin="userProfile" />
        </div>
      </div>

      <hr>
      <div class="dashboard__container--body" v-if="user">
        <div class="dashboard__container--body--col">
          <ReviewsTable :reviews="reviews" />
        </div>
        <div class="dashboard__container--body--col">
          <UserReview :user="user" :me="userProfile" />
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
      <hr>

      <div class="dashboard__container--body" v-if="user">
        <div class="dashboard__container--body--col">
          <UserEvents :events="userEvents" />
        </div>
        <div class="dashboard__container--body--col">
          <UserAssignments :assignments="userAssignments" />
        </div>
      </div>


    </div>

    <Loader v-if="!user" />

  </div>
</template>

<script>
import { mapState } from 'vuex'
import StarRating from 'vue-star-rating'
import Loader from '@/components/Loader.vue'
import ProfileImage from '@/components/Profile/ProfileImage.vue'
import ProfileContact from '@/components/Profile/ProfileContact.vue'
import ProfileAddress from '@/components/Profile/ProfileAddress.vue'
import ProfileSSN from '@/components/Profile/ProfileSSN.vue'
import ProfileEmergency from '@/components/Profile/ProfileEmergency.vue'
import ProfileBio from '@/components/Profile/ProfileBio.vue'
import ProfileSocial from '@/components/Profile/ProfileSocial.vue'
import ProfileCerts from '@/components/Profile/ProfileCerts.vue'
import ProfileSkills from '@/components/Profile/ProfileSkills.vue'
import ProfileBlacklist from '@/components/Profile/ProfileBlacklist.vue'
import ProfileTags from '@/components/Profile/ProfileTags.vue'
import Verification from '@/components/Profile/Verification.vue'
import ProfileStatus from '@/components/Profile/ProfileStatus.vue'
import ProfileMessage from '@/components/Profile/ProfileMessage.vue'
import MessageTable from '@/components/Profile/MessageTable.vue'
import ProfileMessagingProfile from '@/components/Profile/ProfileMessagingProfile.vue'
// import ProfileMessagingPay from '@/components/Profile/ProfileMessagingPay.vue'
import ProfileMessagingAvailability from '@/components/Profile/ProfileMessagingAvailability.vue'
import UserNote from '@/components/Profile/UserNote.vue'
import UserReview from '@/components/Profile/UserReview.vue'
import NotesTable from '@/components/Profile/NotesTable.vue'
import ReviewsTable from '@/components/Profile/ReviewsTable.vue'
import UserEvents from '@/components/Profile/UserEvents.vue'
import UserAssignments from '@/components/Profile/UserAssignments.vue'
import Rewards from '@/components/Rewards.vue'
import ProfileVerifications from '@/components/Profile/ProfileVerifications.vue'
import router from '@/router'

export default {
  name: 'user',
  computed: {
    ...mapState(['userInfo', 'reviews', 'userNotes', 'userProfile', 'userEvents', 'userVerifications', 'userAssignments', 'groups', 'userMessages']),
    user() {
      return this.userInfo
    }
  },
  created () {
    this.$store.dispatch("getUserFromId", this.$route.params.id);
    if (!this.groups || this.groups.length < 1) {
      this.$store.dispatch("getGroups")
    }
  },
  components: {
    Loader,
    StarRating,
    ProfileImage,
    ProfileContact,
    ProfileAddress,
    ProfileEmergency,
    ProfileBio,
    ProfileSocial,
    ProfileSSN,
    ProfileCerts,
    ProfileSkills,
    ProfileBlacklist,
    ProfileStatus,
    ProfileMessagingProfile,
    // ProfileMessagingPay,
    ProfileMessagingAvailability,
    UserNote,
    NotesTable,
    UserReview,
    ReviewsTable,
    UserEvents,
    UserAssignments,
    ProfileTags,
    ProfileMessage,
    MessageTable,
    Rewards,
    Verification,
    ProfileVerifications
  },
  methods: {
    goBack() {
      router.go(-1)
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