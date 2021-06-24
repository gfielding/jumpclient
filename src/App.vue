<template>
  <div id="app">
    <Nav v-if="showNav" :userProfile="userProfile" />
    <router-view/>
    <transition name="fade">
      <div v-if="errorMessage" class="errorMessage">
      {{errorMessage}}
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Nav from '@/components/Nav'

export default {
  components: {
    Nav
  },
  watch:{
    $route (to, from){
      this.$store.dispatch('clearErrors')
    }
  }, 
  computed: {
    ...mapState(['userProfile', 'errorMessage']),
    showNav() {
      return Object.keys(this.userProfile).length > 1
    }
  },
}
</script>