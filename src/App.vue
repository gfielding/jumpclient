<template>
  <div id="app">
    <Nav v-if="showNav" :userProfile="userProfile" />
    <router-view/>
    <transition name="fade">
      <div v-if="errorMessage" class="errorMessage" >
      {{errorMessage}}
      <button @click="close" class="btn btn__flat"><i class="far fa-times-circle fa-2x"></i></button>
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
  methods: {
    close() {
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