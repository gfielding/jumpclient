<template>
	<div>
    <h4 class="mb-0">Contractor Onboarding</h4>
    <div class="caption mb-3" v-if="userContractorPayProfile && userContractorPayProfile.workerId">Everee ID: {{userContractorPayProfile.workerId}}</div>
    <span class="flex justify-space-between">
    <button class="btn btn__warning btn__small mb-3" v-show="userContractorPayProfile && userContractorPayProfile.workerId && (userContractorPayProfile.onboardingStatus && userContractorPayProfile.onboardingStatus == 'IN_PROGRESS')">Contractor In Progress
    </button>
    <button class="btn btn__danger btn__small mb-3" v-show="userContractorPayProfile && userContractorPayProfile.workerId && (userContractorPayProfile.onboardingStatus && userContractorPayProfile.onboardingStatus == 'NOT_STARTED')">Not Started
    </button>
    <button class="btn btn__success btn__small mb-3" v-show="userContractorPayProfile && userContractorPayProfile.workerId && userContractorPayProfile.onboardingComplete">Contractor  <i class="fas fa-check ml-2" style="color:white"></i>
    </button>

    </span>
    <!-- <div class="mt-3">
      <button class="btn btn__outlined-primary btn__small" @click="onboardEmployee()">
        Onboard As Employee
        <transition name="fade">
          <span class="ml-2" v-if="performingRequest">
          <i class="fa fa-spinner fa-spin"></i>
          </span>
        </transition>
      </button>
    </div> -->

	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['user', 'userContractorPayProfile'],
  data: () => ({
    performingRequest: false,
  }),
  methods: {
    onboardEmployee() {
      this.performingRequest = true
      let user = this.user
      this.$store.dispatch('onboardEmployee', user)
      setTimeout(() => {
        this.performingRequest = false
      }, 500)
    },
  }
}
</script>