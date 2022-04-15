<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Dashboard</h1>
      </div>
      <div class="dashboard__container--body pt-3" v-if="userProfile">
        <!-- <div class="dashboard__container--body--col">
          <Recap />
        </div> -->
        <!-- <button @click="updateSocials()">Update Socials</button> -->
        <!-- <button @click="updateAllEvents()">Update All Events</button> -->

       <!--  <button @click="updateAllApplications()">Update All Applications</button> -->


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
import Recap from '@/components/Recap.vue'
const fb = require('../firebaseConfig.js')

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
    Recap
  },
  methods: {
    updateSocials() {
      console.log('updating')
      fb.usersCollection.where("ssn", "!=", null).orderBy("ssn").limit(10000)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          let social = doc.data().ssn
          fb.assignmentsCollection.where("userId", "==", doc.id)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(doc.id, " => ", doc.data());
              fb.assignmentsCollection.doc(doc.id).update({
                fileId: social || ''
              })
            })
          })
        });
      })
    },
    updateAllEvents() {
      console.log('updating')
      this.$store.dispatch("updateAllEvents")
    },
    updateAllApplications() {
      console.log('updating')
      this.$store.dispatch("updateAllApplications")
    }
  },
  // created () {
  //   if (!this.userProfile) {
  //     this.$store.dispatch("getUserProfile");
  //   }
  // },

}
</script>