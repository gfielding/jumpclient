<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Reports</h1>
        <span class="flex align-center">
          <router-link :to="{name: 'payrollSubmissions'}">
            <button class="btn btn__small mr-3" v-bind:class="{ 'btn__dark': isPayrollQueue, 'btn__outlined': !isPayrollQueue }">Payroll Queue</button>
          </router-link>
          <!-- <router-link :to="{name: 'evereeUsersWithoutExternalId'}">
            <button class="btn btn__small mr-3" v-bind:class="{ 'btn__dark': isEvereeUsersWithoutExternalId, 'btn__outlined': !isEvereeUsersWithoutExternalId }">EvereeUsersWithoutExternalId</button>
          </router-link> -->
          <!-- <router-link :to="{name: 'userParse'}">
            <button class="btn  ml-3" v-bind:class="{ 'btn__dark': isUserParse, 'btn__outlined': !isUserParse }">User Parse</button>
          </router-link> -->
          <!-- <router-link :to="{name: 'clientContacts'}">
            <button class="btn  ml-3" v-bind:class="{ 'btn__dark': isContacts, 'btn__outlined': !isContacts }">Contacts</button>
          </router-link>
          <router-link :to="{name: 'clientNotes'}">
            <button class="btn  ml-3" v-bind:class="{ 'btn__dark': isNotes, 'btn__outlined': !isNotes }">Notes</button>
          </router-link>
           <router-link :to="{name: 'clientVenues'}">
            <button class="btn  ml-3" v-bind:class="{ 'btn__dark': isVenues, 'btn__outlined': !isVenues }">Venues</button>
          </router-link>
          <router-link :to="{name: 'clientFiles'}">
            <button class="btn  ml-3" v-bind:class="{ 'btn__dark': isFiles, 'btn__outlined': !isFiles }">Files</button>
          </router-link> -->
          <button class="btn btn__outlined btn__small" @click="goBack()"><i class="fas fa-arrow-left"></i></button>
        </span>
        
      </div>
      <router-view :key="$route.params.id" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'

export default {
  name: 'reportsHome',
  computed: {
    ...mapState(['currentUser', 'userProfile']),
    isPayrollQueue() {
      return this.$route.name == 'payrollQueue';
    },
    isEvereeUsersWithoutExternalId() {
      return this.$route.name == 'evereeUsersWithoutExternalId';
    },


    
    // isUserParse() {
    //   return this.$route.name == 'userParse';
    // },
    // isSummary() {
    //   return this.$route.name == 'client';
    // },
    // isNotes() {
    //   return this.$route.name == 'clientNotes';
    // },
    // isVenues() {
    //   return this.$route.name == 'clientVenues';
    // },
    // isFiles() {
    //   return this.$route.name == 'clientFiles';
    // }
  },
  methods: {
    goBack() {
      router.go(-1)
    },
  }
}
</script>