<template>
  <div class="dashboard__container" :class="{ held: docHeld }">
      <div class="dashboard__container--body" v-if="user">
        <div class="dashboard__container--body--col">
          <ProfileImage :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileId :user="user" />
        </div>
      </div>
      <div v-if="user">
        <ProfileContact :user="user" :currentUser="currentUser" />
      </div>
        <!-- <div class="dashboard__container--body--col">
          <ProfileContact :user="user" />
        </div> -->
      <div class="dashboard__container--body" v-if="user">
        <!-- <div class="dashboard__container--body--col">
          <ProfileStatus :user="user" />
        </div> -->
        <!-- <div class="dashboard__container--body--col" v-if="currentUser && (currentUser.email == 'greg@mvpeventstaffing.com' || 'katy@mvpeventstaffing.com' || 'tai@mvpeventstaffing.com')">
          <ProfileSSN :userProfile="user" />
        </div> -->

        <div class="dashboard__container--body--col">
          <ProfileBio :user="user" />
        </div>
        
        
        <div class="dashboard__container--body--col">
          <ProfileSocial :user="user" />
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
        
        
        <!-- <div class="dashboard__container--body--col">
          <ProfileAddress :user="user" />
        </div> -->
        <div class="dashboard__container--body--col">
          <ProfileSkills :user="user" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileTags :user="user" :userProfile="userProfile" />
        </div>
        
        <div class="dashboard__container--body--col">
          <ProfileEmergency :user="user" />
        </div>
         <div class="dashboard__container--body--col">
          <h2 class="mb-3">I-9 Verifications</h2>
          <ProfileVerifications :user="user" :verifications="userVerifications" />
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
import ProfileImage from '@/components/Profile/ProfileImage.vue'
import ProfileId from '@/components/Profile/ProfileId.vue'
import ProfileContact from '@/components/Profile/ProfileContact.vue'
import ProfileAddress from '@/components/Profile/ProfileAddress.vue'
// import ProfileSSN from '@/components/Profile/ProfileSSN.vue'
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
// import UserEvents from '@/components/Profile/UserEvents.vue'
// import UserAssignments from '@/components/Profile/UserAssignments.vue'
import Rewards from '@/components/Rewards.vue'
import ProfileVerifications from '@/components/Profile/ProfileVerifications.vue'
import router from '@/router'

export default {
  props: ['user', 'dnr', 'docHeld'],
  name: 'userDetails',
  computed: {
    ...mapState(['currentUser', 'userInfo', 'reviews', 'userNotes', 'userProfile', 'userVerifications', 'userMessages']),
    // docHeld() {
    //   if (this.user && this.user.docHold) {
    //     return true
    //   }
    // },
    // dnr() {
    //  if (this.user && this.user.blacklist && this.user.blacklist.length >= 1) {
    //   return true
    //  }
    // }
    // joined() {
    //   if(this.user && this.user.created) {
    //     return new Date(this.user.created.seconds*1000)
    //     console.log(this.currentUser.metaData)
    //   }
    // }
  },
  components: {
    Loader,
    StarRating,
    ProfileImage,
    ProfileId,
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
    ProfileMessagingAvailability,
    UserNote,
    NotesTable,
    UserReview,
    ReviewsTable,
    ProfileTags,
    ProfileMessage,
    MessageTable,
    Rewards,
    Verification,
    ProfileVerifications
  },
}

</script>