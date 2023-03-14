<template>
	<div>
    <h4 class="mb-3">Onboarding</h4>
    <span class="flex justify-space-between">
    <button class="btn btn__warning btn__small mb-3" v-show="userContractorPayProfile && userContractorPayProfile.workerId && (userContractorPayProfile.onboardingStatus && userContractorPayProfile.onboardingStatus == 'IN_PROGRESS')">Contractor In Progress
    </button>
    <button class="btn btn__danger btn__small mb-3" v-show="userContractorPayProfile && userContractorPayProfile.workerId && (userContractorPayProfile.onboardingStatus && userContractorPayProfile.onboardingStatus == 'NOT_STARTED')">Not Started
    </button>
    <button class="btn btn__success btn__small mb-3" v-show="userContractorPayProfile && userContractorPayProfile.workerId && userContractorPayProfile.onboardingComplete">Contractor  <i class="fas fa-check ml-2" style="color:white"></i>
    </button>

    <!-- <button class="btn btn__outlined btn__small mb-3" v-show="user && !user.branchOnboard" @click="branchOnboard()">Onboard Contractor
    </button> -->
    <!-- <button class="btn btn__primary btn__small mb-3" v-show="user && user.branchOnboard" @click="branchOffboard()">Contractor <i class="fas fa-check ml-2" style="color:white"></i>
    </button> -->

    <!-- <button class="btn btn__outlined btn__small mb-3" v-show="user && !user.employeeOnboard" @click="employeeOnboard()">Onboard Employee
    </button> -->
   <!--  <button class="btn btn__primary btn__small mb-3" v-show="user && user.employeeOnboard" @click="employeeOffboard()">Employee <i class="fas fa-check ml-2" style="color:white"></i>
    </button> -->
    </span>

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
    branchOnboard() {
      this.performingRequest = true
      this.user.branchOnboard = true
      let user = this.user
      this.$store.dispatch('updateTheUser', user)
      setTimeout(() => {
        this.performingRequest = false
      }, 500)
    },
    branchOffboard() {
      this.performingRequest = true
      this.user.branchOnboard = false
      let user = this.user
      this.$store.dispatch('updateTheUser', user)
      setTimeout(() => {
        this.performingRequest = false
      }, 500)
    },
    employeeOnboard() {
      this.performingRequest = true
      this.user.employeeOnboard = true
      let user = this.user
      this.$store.dispatch('updateTheUser', user)
      setTimeout(() => {
        this.performingRequest = false
      }, 500)
    },
    employeeOffboard() {
      this.performingRequest = true
      this.user.employeeOnboard = false
      let user = this.user
      this.$store.dispatch('updateTheUser', user)
      setTimeout(() => {
        this.performingRequest = false
      }, 500)
    },
  }
}
</script>