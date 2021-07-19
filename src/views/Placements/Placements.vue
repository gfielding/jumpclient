<template>
	<div class="dashboard">
		<Loader v-if="!eventDays || eventDays.length < 1" />
		<DaysList :days="eventDays" />
	</div>
</template>

<script>
import { mapState } from 'vuex'
import DaysList from '@/components/Placements/DaysList.vue'
import Loader from '@/components/Loader.vue'

export default {
  name: 'placements',
  computed: {
    ...mapState(['currentUser', 'userProfile', 'eventDays']),
  },
  created () {
    if (!this.eventDays || this.eventDays.length < 1) {
      this.$store.dispatch("getEvents")
    }
  },
  components: {
    DaysList,
    Loader
  },
  beforeDestroy () {
  }
};
</script>