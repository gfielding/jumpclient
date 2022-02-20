<template>
  <div id="app">
    <Nav :userProfile="currentUser" />
    <!-- <keep-alive  max="2" :exclude="['day','user', 'event', 'venue', 'shift', 'eventplacement', 'addfaq', 'shift', 'placements']">
      <router-view :key="$route.fullPath"></router-view> 
    </keep-alive> -->

    <div class="app-wrapper">
      <div class="nav-wrapper hidden-small" v-if="currentUser">
        <SideNav :userProfile="currentUser" />
      </div>

     <!--  <keep-alive  max="5" :include="['users', 'events', 'shifts', 'accountingEvents', 'groups', 'eventplacements', 'accountingEventsTable']">
        <router-view :key="$route.fullPath"></router-view> 
      </keep-alive> -->
      <keep-alive  max="3" :include="['events', 'shifts', 'accountingEvents', 'groups', 'eventplacements']">
        <router-view :key="$route.fullPath"></router-view> 
      </keep-alive>
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
    }
  },
  methods: {
    close() {
      this.$store.dispatch('clearErrors')
    }
  },
  // beforeMount(){
  //   this.cred()
  // },
  // async mounted() {
  //   if (!this.userProfile) {
  //     this.$store.dispatch("getUserProfile");
  //   }
  // },
  computed: {
    ...mapState(['currentUser', 'errorMessage', 'userProfile']),
    showNav() {
      if (this.currentUser) {
        return Object.keys(this.currentUser).length > 1 || false
      } else {
        return false
      }
    },
    
  },
}
</script>