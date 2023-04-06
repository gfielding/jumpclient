<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <div>
        <h1>Client Access</h1>
        </div>
        <span class="flex align-center">
          <router-link :to="{name: 'giveClientAccess'}">
            <button class="btn btn__small mr-3" v-bind:class="{ 'btn__dark': isGiveClientAccess, 'btn__outlined': !isGiveClientAccess }">Give New Access</button>
          </router-link>
          <router-link :to="{name: 'clientAccess'}">
            <button class="btn btn__small mr-3" v-bind:class="{ 'btn__dark': isClientAccess, 'btn__outlined': !isClientAccess }">Manage Access</button>
          </router-link>

          <button class="btn btn__outlined btn__small ml-3" @click="goBack"><i class="fas fa-arrow-left"></i></button>
        </span>
        
      </div>
      <router-view :key="$route.params.id" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'clientAccessHome',
  computed: {
    ...mapState(['currentUser', 'userProfile']),
    // isContacts() {
    //   return this.$route.name == 'clientContacts';
    // },
    isClientAccess() {
      return this.$route.name == 'clientAccess';
    },
    isGiveClientAccess() {
      return this.$route.name == 'giveClientAccess';
    },

  },
  
  components: {
    Loader,
  },

  methods: {
    goBack() {
      router.go(-1)
    },
  },
  // beforeDestroy () {
  //   this.$store.dispatch('clearGroupState')
  //   this.$store.dispatch('clearErrors')
  // }
}
</script>