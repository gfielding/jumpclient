<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Choose Day</h1>
      </div>
      
    		<Loader v-if="!eventDays || eventDays.length < 1" />
    		<DaysList :days="eventDays" :usersPerDay="usersPerDay" />
    </div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import DaysList from '@/components/Placements/DaysList.vue'
import Loader from '@/components/Loader.vue'

export default {
  name: 'placements',
  computed: {
    ...mapState(['currentUser', 'userProfile', 'eventDays', 'usersPerDay']),
  },
  created () {
    if (!this.eventDays || this.eventDays.length < 1) {
      this.$store.dispatch("getEvents")
    }
    this.$store.dispatch("getUsersPerDay")
  },
  components: {
    DaysList,
    Loader
  },
  beforeDestroy () {
    this.$store.dispatch("clearPlacementsState")
    console.log(this)
  }
};
</script>