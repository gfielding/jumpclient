<template>
  <div class="dashboard">
    <Loader v-if="performingRequest || (!activeShifts || activeShifts.length < 1)" />
    <div class="dashboard__container">
      <div class="dashboard__container--header mb-2 eventsHeader">
        <span style="display: flex;
    width: 100%;
    justify-content: space-between; align-items: center;">
          <h1>Shifts</h1>
          <div>
	          <button class="btn btn__outlined btn__small" @click="goBack()"><i class="fas fa-arrow-left"></i></button>
	        </div>
        </span>
      </div>

      <div class="dashboard__container--body eventCardContainer">
				<ShiftCard :shifts="activeShifts" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import ShiftCard from '@/components/ShiftCard.vue'
import router from '@/router'

export default {
  name: 'activeShifts',
  data: () => ({
    performingRequest: false,
  }),
  components: {
    Loader,
    ShiftCard
  },
  computed: {
    ...mapState(['activeShifts']),
  },
  methods: {
  	goBack() {
      router.go(-1)
    },
  },
  created () {
    this.$store.dispatch("getActiveShifts")
  },
  beforeDestroy () {
    this.$store.dispatch('clearActiveShifts')
  }
}

</script>
