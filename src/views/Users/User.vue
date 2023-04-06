<template>
  <div class="dashboard">
    <div class="dashboard__container pb-0" :class="{ held: docHeld }" v-if="user">
      <div class="dashboard__container--header pt-2 pb-2 only-xs">
        <div class="flex justify-space-between">
        <span>
        <star-rating :read-only="true" :star-size="30" v-if="user && user.rating" v-model="user.rating"></star-rating>
        </span>
         <button class="btn btn__outlined btn__small mb-3" @click="goBack()"><i class="fas fa-arrow-left"></i></button>
         </div>
      </div>
      <div class="dashboard__container--header pt-2 pb-2">
     
          <span class="flex align-center justify-start">
            <span style="position: relative;">
              <img :src="pic" alt="" class="avatar"workerId
              style="margin-right:1rem; height:6rem; width:auto; margin-bottom:0; ">

              <span class="fa-stack fa-2x statusCheck" v-show="userContractorPayProfile && userContractorPayProfile.workerId && userContractorPayProfile.onboardingComplete">
                <i class="fa-solid fa-circle fa-stack-2x" style="color:#00C897;"></i>
                <i class="fa-solid fa-check fa-stack-1x fa-inverse" style="color:white;"></i>
              </span>

              <span class="fa-stack fa-2x statusCheck" v-show="userContractorPayProfile && userContractorPayProfile.workerId && (userContractorPayProfile.onboardingStatus && userContractorPayProfile.onboardingStatus == 'IN_PROGRESS')">
                <i class="fa-solid fa-circle fa-stack-2x" style="color:#f0ad4e;"></i>
                <i class="fa-solid fa-check fa-stack-1x fa-inverse" style="color:white;"></i>
              </span>

              <span class="fa-stack fa-2x statusCheck" v-show="userContractorPayProfile && userContractorPayProfile.workerId && (userContractorPayProfile.onboardingStatus && userContractorPayProfile.onboardingStatus == 'NOT_STARTED')">
                <i class="fa-solid fa-circle fa-stack-2x" style="color:#d9534f;"></i>
                <i class="fa-solid fa-check fa-stack-1x fa-inverse" style="color:white;"></i>
              </span>

              

              <!-- <i class="fas fa-check ml-2" style="color:#00C897"></i> -->
            </span>
            <span class="align-start flex flex-column">
             <span class="flex align-center justify-start">

              <h1 class="pb-1 pt-0 pr-5" :class="{ danger: dnr }" v-if="user && user.firstName && user.lastName">{{user.firstName}} {{user.lastName}} 
                
              </h1>

             <!--  <button class="btn btn__letter" v-if="user.branchOnboard">C</button>
              <button class="btn btn__letter" v-if="user.employeeOnboard">E</button> -->

              <star-rating :read-only="true" :star-size="30" v-if="user && user.rating" v-model="user.rating" class="ml-5 hidden-xs"></star-rating>

          
              <span v-if="user && user.points" class="flex align-center ml-5">
                <span class="points animated-box">
                  {{user.points}}
                </span>
              </span>

            </span>
            <i class="italic" v-if="user.tagline">{{user.tagline}}</i>
            
            </span>

          </span>
         

        <span class="flex ">
          <button class="btn btn__outlined btn__small mb-3 hidden-xs" @click="goBack()"><i class="fas fa-arrow-left"></i></button>
          
          <!-- <Rewards v-if="user" :user="user" /> -->
        </span>

      </div>
      <span class="flex align-start flex-wrap">
          <router-link :to="`/users/${$route.params.id}/details`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isDetails, 'btn__outlined btn__small': !isDetails }">Details</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/certs`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isCerts, 'btn__outlined btn__small': !isCerts }">Certs</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/groups`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isGroups, 'btn__outlined btn__small': !isGroups }">Groups</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/id`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isId, 'btn__outlined btn__small': !isId }">User ID</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/skills`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isSkills, 'btn__outlined btn__small': !isSkills }">Skills</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/payroll`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isPayroll, 'btn__outlined btn__small': !isPayroll }">Payroll</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/assignments`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isAssignments, 'btn__outlined btn__small': !isAssignments }">Assignments</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/notes`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isNotes, 'btn__outlined btn__small': !isNotes }">Notes</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/reviews`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isReviews, 'btn__outlined btn__small': !isReviews }">Ratings & Reviews</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/gallery`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isGallery, 'btn__outlined btn__small': !isGallery }">Gallery</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/messages`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isMessages, 'btn__outlined btn__small': !isMessages }">messages</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/emergency`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isEmergency, 'btn__outlined btn__small': !isEmergency }">Emergency Contacts</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/payhistory`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isPayHistory, 'btn__outlined btn__small': !isPayHistory }">Pay History</button>
          </router-link>
          <router-link :to="`/users/${$route.params.id}/backgroundcheck`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isBackgroundCheck, 'btn__outlined btn__small': !isBackgroundCheck }">Background Check</button>
          </router-link>
          <!-- <router-link :to="`/users/${$route.params.id}/everee`">
            <button class="btn btn__small mr-3 mt-3" v-bind:class="{ 'btn__dark': isEveree, 'btn__outlined btn__small': !isEveree }">Everee Data</button>
          </router-link> -->


          <a :href="user.picture" v-if="user.picture" target="_blank">
            <button class="btn btn__small btn__outlined mr-3 mt-3">Resumé <i class="fas fa-external-link ml-3"></i></button>
          </a>
          <!-- <button class="btn btn__dark mr-3" @click="deleteUser()">Delete</button> -->
        </span>
    </div>
    <router-view :key="$route.params.id" :user="user" :dnr="dnr" :docHeld="docHeld" />
    <Loader v-if="(!user || !user.id)" />
  </div>
</template>

<style scoped>
  .statusCheck {
    position: absolute;
    bottom: 0.25rem;
    right: 0.25rem;
    font-size: 1.2rem;
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
    ...mapState(['currentUser', 'userInfo', 'userContractorPayProfile']),
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
    isCerts() {
      return this.$route.name == 'userCerts';
    },
    isId() {
      return this.$route.name == 'userId';
    },
    isPayroll() {
      return this.$route.name == 'userPayroll';
    },
    isAssignments() {
      return this.$route.name == 'userAssignments';
    },
    isNotes() {
      return this.$route.name == 'userNotes';
    },
    isReviews() {
      return this.$route.name == 'userReviews';
    },
    isMessages() {
      return this.$route.name == 'userMessages';
    },
    isGallery() {
      return this.$route.name == 'userGallery';
    },
    isGroups() {
      return this.$route.name == 'userGroups';
    },
    isEmergency() {
      return this.$route.name == 'userEmergency';
    },
    isSkills() {
      return this.$route.name == 'userSkills';
    },
    isEveree() {
      return this.$route.name == 'userEveree';
    },
    isPayHistory() {
      return this.$route.name == 'userPayHistory';
    },
    isBackgroundCheck() {
      return (this.$route.name == 'userBackgroundCheck' || this.$route.name == 'backgroundCheck');
    },
    pic () {
      if (this.user) {
        return this.user.photoUrl || 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/avatar%20copy.png?alt=media&token=966c07c4-125a-490f-81be-4e2d26bf33fa'
      }
    },
  },
  created () {
    this.$store.dispatch("getUserFromId", this.$route.params.id);
  },
  async mounted () {
    this.$store.dispatch('getUserMessages', this.$route.params.id)
    this.$store.dispatch('getUserPayroll', this.$route.params.id)
  },
  methods: {
    goBack() {
      this.$store.dispatch('clearVenueState')
      router.go(-1)
    },
  },
  components: {
    Loader,
    StarRating,
    Rewards,
  },
  // methods: {
  //   deleteUser() {
  //     userInfo
  //   }
  // },
  destroyed() {
    this.$store.dispatch('clearUserState')
    this.$store.dispatch('clearErrors')
    console.log('destroyed')
  }
}

</script>