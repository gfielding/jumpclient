<template>
  <div id="app">
    <Nav :userProfile="(userProfile && userProfile.id)" />
    <!-- <keep-alive  max="2" :exclude="['day','user', 'event', 'venue', 'shift', 'eventplacement', 'addfaq', 'shift', 'placements']">
      <router-view :key="$route.fullPath"></router-view> 
    </keep-alive> -->

    <div class="app-wrapper">
      <div class="nav-wrapper hidden-small" v-if="(userProfile && userProfile.id)">
        <SideNav :userProfile="(userProfile && userProfile.id)" />
      </div>

     <!--  <keep-alive  max="5" :include="['users', 'events', 'shifts', 'accountingEvents', 'groups', 'eventplacements', 'accountingEventsTable']">
        <router-view :key="$route.fullPath"></router-view> 
      </keep-alive> -->
     <!--  <keep-alive  max="3" :include="['eventsHome', 'eventsByMonth']">
        
      </keep-alive> -->
      <keep-alive  max="3" :include="['users', 'groups']">
        <router-view :key="$route.fullPath"></router-view> 
      </keep-alive>
     <!--  <router-view :key="$route.fullPath"></router-view>  -->
    </div>

   <!--  <keep-alive include="users, events" max="1"> 
      <router-view/>
    </keep-alive> -->
    
    <transition name="fade">
      <div v-if="errorMessage" class="errorMessage" >
      {{errorMessage}}
      <button @click="close" class="btn btn__flat"><i class="far fa-times-circle fa-2x"></i></button>
      </div>
    </transition>
    <Footer class="hidden-large" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Nav from '@/components/Nav'
import SideNav from '@/components/SideNav'
import Footer from '@/components/Footer'
import router from '@/router'

export default {
  components: {
    Nav,
    Footer,
    SideNav
  },
  watch:{
    $route (to, from){
      this.$store.dispatch('clearErrors')
      if (!this.userProfile || (this.userProfile && !this.userProfile.id)) {
        this.userCheck()
      }
    }
  },


  methods: {
    close() {
      this.$store.dispatch('clearErrors')
    },
    logout() {
      this.$store.dispatch('logout')
    },
    userCheck() {
      console.log('usercheck')
      this.$store.dispatch("getUserProfile");
    }
  },
  // beforeMount(){
  //   this.cred()
  // },
  mounted() {
    if (!this.userProfile) {
      this.$store.dispatch("getUserProfile");
    }
    // this.$store.dispatch("getInfiniteEvents")
    // this.$store.dispatch("getVenues")
    // this.carlyCheck()
  },
  computed: {
    ...mapState(['currentUser', 'errorMessage', 'userProfile']),
    showNav() {
      if (this.currentUser) {
        return Object.keys(this.currentUser).length > 1 || false
      } else {
        return false
      }
    },
    // carlyCheck() {
    //   if (this.currentUser && ((this.currentUser.email == 'carly@mvpeventstaffing.com') || (this.currentUser.email == 'crystal@mvpeventstaffing.com'))) {
    //     this.logout()
    //   } else {

    //   }
    // }
    
    
  },
}
</script>