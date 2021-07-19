<template>
  <div id="app">
    <Nav v-if="showNav" :userProfile="currentUser" />
    <router-view/>
    <transition name="fade">
      <div v-if="errorMessage" class="errorMessage" >
      {{errorMessage}}
      <button @click="close" class="btn btn__flat"><i class="far fa-times-circle fa-2x"></i></button>
      </div>
    </transition>
    <Footer />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default {
  components: {
    Nav,
    Footer
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
  computed: {
    ...mapState(['currentUser', 'errorMessage']),
    showNav() {
      if (this.currentUser) {
        return Object.keys(this.currentUser).length > 1 || false
      } else {
        return false
      }
    }
  },
}
</script>