<template>
	<div class="whiteBack">
    <h4 class="mb-0">Employee Onboarding</h4>
    <div class="caption mb-3" v-if="userEmployeePayProfile && userEmployeePayProfile.workerId">Everee ID: {{userEmployeePayProfile.workerId}}</div>
    <span class="flex justify-space-between">
    <button class="btn btn__warning btn__small mb-3" v-show="userEmployeePayProfile && userEmployeePayProfile.workerId && (userEmployeePayProfile.onboardingStatus && userEmployeePayProfile.onboardingStatus == 'IN_PROGRESS')">Employee In Progress
    </button>
    <button class="btn btn__danger btn__small mb-3" v-show="userEmployeePayProfile && userEmployeePayProfile.workerId && (userEmployeePayProfile.onboardingStatus && userEmployeePayProfile.onboardingStatus == 'NOT_STARTED')">Not Started
    </button>
    <button class="btn btn__success btn__small mb-3" v-show="userEmployeePayProfile && userEmployeePayProfile.workerId && userEmployeePayProfile.onboardingComplete">Employee  <i class="fas fa-check ml-2" style="color:white"></i>
    </button>
    </span>
    <div class="mt-3" v-if="(!userEmployeePayProfile || !userEmployeePayProfile.workerId)">
      <button class="btn btn__outlined-primary btn__small" @click="onboardEmployee()">
        Onboard As Employee
        <transition name="fade">
          <span class="ml-2" v-if="performingRequest">
          <i class="fa fa-spinner fa-spin"></i>
          </span>
        </transition>
      </button>
    </div>

	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['user', 'userEmployeePayProfile'],
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