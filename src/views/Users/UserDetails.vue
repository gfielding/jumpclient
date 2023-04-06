<template>
  <div class="dashboard__container" :class="{ held: docHeld }">
    <div class="dashboard__container--body" v-if="user">
      <div class="dashboard__container--body--col">
        
        <ProfileContact :user="user" :currentUser="currentUser" />
        
      </div>
      <div class="dashboard__container--body--col">
        <ProfileOnboard :user="user" :userContractorPayProfile="userContractorPayProfile" class="mb-5" />

        <ProfileEmployeeOnboard :user="user" :userEmployeePayProfile="userEmployeePayProfile" class="mb-5" />

        <ProfileAddress :user="user" class="mb-5" />
        <!-- <ProfileSkills :user="user" /> -->
        <!-- <ProfileId :user="user" /> -->
        <!-- <ProfileTags :user="user" :userProfile="userProfile" /> -->
        <!-- <ProfileCerts :user="user" /> -->
        <ProfileBlacklist :user="user" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import StarRating from 'vue-star-rating'
import Loader from '@/components/Loader.vue'
import ProfileContact from '@/components/Profile/ProfileContact.vue'
import ProfileAddress from '@/components/Profile/ProfileAddress.vue'
import ProfileEmployeeOnboard from '@/components/Profile/ProfileEmployeeOnboard.vue'
import ProfileOnboard from '@/components/Profile/ProfileOnboard.vue'
import ProfileBlacklist from '@/components/Profile/ProfileBlacklist.vue'
import Rewards from '@/components/Rewards.vue'
import router from '@/router'

export default {
  props: ['user', 'dnr', 'docHeld',],
  name: 'userDetails',
  computed: {
    ...mapState(['currentUser', 'userInfo', 'userProfile', 'userVerifications', 'userContractorPayProfile', 'userEmployeePayProfile']),
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
    ProfileContact,
    ProfileAddress,
    ProfileOnboard,
    ProfileEmployeeOnboard,
    // ProfileEmergency,
    ProfileBlacklist,
   
    // UserNote,
    // NotesTable,
    // UserReview,
    // ReviewsTable,
    
    // ProfileMessage,
    // MessageTable,
    Rewards,
  },
}

</script>