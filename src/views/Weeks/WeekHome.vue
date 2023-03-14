<template>
<div class="dashboard">
    <Loader v-if="!eventInfo || !eventInfo.id" />
    <div class="dashboard__container pb-0" v-if="eventInfo && eventInfo.id">
      <div class="dashboard__container--header">
        <div class="flex align-center">
          <span>
          <h1 v-if="eventInfo && eventInfo.title" class="pb-1">{{eventInfo.title}}</h1>
          <span v-if="eventInfo && eventInfo.venue && eventInfo.venue.title">
            <p>{{eventInfo.venue.title}}<span v-if="eventInfo.venue && eventInfo.venue.address"> | {{eventInfo.venue.address.city}}, {{eventInfo.venue.address.state}}</span> | {{eventInfo.startDate | moment("ddd, MMM Do YYYY") }}<span v-if="eventInfo.endDate"> - {{eventInfo.endDate | moment("ddd, MMM Do YYYY") }}</span></p>
          </span>
          </span>
        </div>
        <div class="flex align-center flex-wrap justify-flex-end">
          <button class="btn btn__outlined btn__small" @click="goBack()"><i class="fas fa-arrow-left"></i></button>
        </div>

      </div>
      <span class="flex align-start flex-wrap">
        <router-link :to="`/jobs/${$route.params.id}`">
          <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': isEvent, 'btn__outlined btn__small': !isEvent }">Edit</button>
        </router-link>
        <router-link :to="`/jobs/${$route.params.id}/checkin`">
          <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': isCheckin, 'btn__outlined btn__small': !isCheckin }">Check-In</button>
        </router-link>
        <router-link :to="`/jobs/${$route.params.id}/shifts`">
          <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': isShifts, 'btn__outlined btn__small': !isShifts }">Shifts</button>
        </router-link>
        <router-link :to="`/jobs/${$route.params.id}/placement`">
          <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': isPlacement, 'btn__outlined btn__small': !isPlacement }">Placements</button>
        </router-link>
        <router-link :to="`/jobs/${$route.params.id}/timesheets`">
          <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': isTimesheets, 'btn__outlined btn__small': !isTimesheets }">Timesheets</button>
        </router-link>
        <router-link :to="`/jobs/${$route.params.id}/files`">
          <button class="btn btn__small mr-3 mb-2" v-bind:class="{ 'btn__dark': isFiles, 'btn__outlined btn__small': !isFiles }">Files</button>
        </router-link>
        </span>
    </div>
    <router-view :key="$route.params.id" :eventInfo="eventInfo"  />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'weekHome',
  computed: {
    ...mapState(['currentUser', 'weekInfo']),
    eventInfo() {
      return this.weekInfo
    },
    isEvent() {
      return this.$route.name == 'weekDetails';
    },
    isCheckin() {
      return this.$route.name == 'weekCheckin';
    },
    isShifts() {
      return this.$route.name == 'weekshifts';
    },
    isPlacement() {
      return this.$route.name == 'weekplacement';
    },
    isTimesheets() {
      return this.$route.name == 'weektimesheets';
    },
    isFiles() {
      return this.$route.name == 'weekFiles';
    },
  },
  created () {
    this.$store.dispatch("getWeekFromId", this.$route.params.id);
  },
  components: {
    Loader,
  },
  methods: {
    goBack() {
      router.go(-1)
    },
  },
  destroyed() {
    this.$store.dispatch('clearErrors')
    console.log('destroyed')
  }
}

</script>