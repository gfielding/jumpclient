<template>
  <div id="app">
    <SiteNav v-if="showNav"></SiteNav>
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
import SiteNav from '@/components/SiteNav'

export default {
  components: {
    SiteNav
  },
  computed: {
    ...mapState(['userProfile', 'errorMessage']),
    showNav() {
      return Object.keys(this.userProfile).length > 1
    }
  },
}
</script>