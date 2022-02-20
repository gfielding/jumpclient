<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Dashboard</h1>
      </div>
      <div class="dashboard__container--body" v-if="userProfile">
        


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

    <Loader v-if="!userProfile" />

  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import firebase from 'firebase/app';

export default {
  name: 'dashboard',
  data: () => ({
    newUser: {}
  }),
  computed: {
    ...mapState(['userProfile']),
  },
  components: {
    Loader,
  },
  methods: {
    // addUser() {
    //   var createUser = firebase.functions().httpsCallable('createUser');
    //   createUser({ 
    //     email: this.newUser.email,
    //     password: this.newUser.password,
    //     displayName: this.newUser.displayName
    //   })
    //   .then((result) => {
    //     console.log(result)
    //   })
    // }
    // addUser() {
    //   var addUser = firebase.functions().httpsCallable('createUser');
    //   createUser({ data: newUser })
    //   .then(function (result) {
    //       console.log(result.data)
    //   });
    // }
  },
  // created () {
  //   if (!this.userProfile) {
  //     this.$store.dispatch("getUserProfile");
  //   }
  // },

}
</script>