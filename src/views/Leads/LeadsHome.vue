<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Staff Leads</h1>
        <span> 
          <router-link :to="`/leads/markets`">
            <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': markets, 'btn__outlined btn__small': !markets }">Manage Markets</button>
          </router-link>
          <router-link :to="`/leads/add`">
            <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': enterNewLead, 'btn__outlined btn__small': !enterNewLead }">Add New Lead</button>
          </router-link>
          <router-link :to="`/leads/all`">
            <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': allLeads, 'btn__outlined btn__small': !allLeads }">All Leads</button>
          </router-link>
          <router-link :to="`/leads/hidden`">
            <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': archivedLeads, 'btn__outlined btn__small': !archivedLeads }">Hidden Leads</button>
          </router-link>
          <router-link :to="`/leads/my`">
            <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': myLeads, 'btn__outlined btn__small': !myLeads }">My Leads</button>
          </router-link>
          <button class="btn btn__outlined btn__small" @click="goBack()"><i class="fas fa-arrow-left"></i></button>
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
  name: 'leadsHome',
  // data: () => ({
  //   allLeads: true
  // }),
  computed: {
    // ...mapState(['clientInfo', 'clientNotes']),
    allLeads() {
      return this.$route.name == 'allLeads';
    },
    archivedLeads() {
      return this.$route.name == 'archivedLeads';
    },
    myLeads() {
      return this.$route.name == 'myLeads';
    },
    markets() {
      return this.$route.name == 'markets';
    },
    enterNewLead() {
      return this.$route.name == 'enterNewLead';
    },
  },
  created () {
    this.$store.dispatch("getMarketetingLeads")
  },
   components: {
    Loader,
  },
  methods: {
    goBack() {
      router.go(-1)
    },
  },
  destroyed () {
    this.$store.dispatch('clearMarketingLeads')
  }
}
</script>