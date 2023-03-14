<template>
	<div class="mt-3 whiteBack">
    <h4>Ask to Complete Payroll</h4>
		<div class="mb-1 mt-0">
			 <span v-if="user.updatePayrollReminderSent" class="caption">
        Last Sent: {{user.updatePayrollReminderSent.toDate() | moment("MMMM Do YYYY, h:mm a") }}
        </span>
		</div>
		 <div>
      <button class="btn btn__outlined btn__small" @click="onTextPayroll">
      	Text
     	 	<transition name="fade">
          <span class="ml-2" v-if="performingRequest2">
          <i class="fa fa-spinner fa-spin"></i>
          </span>
        </transition>
      </button>
      <button class="ml-3 btn btn__outlined btn__small" @click="onEmailPayroll">
      	Email
      	<transition name="fade">
          <span class="ml-2" v-if="performingRequest1">
          <i class="fa fa-spinner fa-spin"></i>
          </span>
        </transition>
      </button>
    </div>

	</div>
</template>

<script>
export default {
  props: ['user'],
  data: () => ({
    performingRequest1: false,
    performingRequest2: false,
  }),
  methods: {
  	onEmailPayroll () {
  		this.performingRequest1 = true
  		let newEmail = {
        name: this.user.firstName,
        email: this.user.email,
        userId: this.user.id,
        type: 'updatePayroll'
      }
      this.$store.dispatch('updatePayrollEmail', newEmail)
      setTimeout(() => {
          this.performingRequest1 = false
      }, 1000)
  	},
  	onTextPayroll () {
  		this.performingRequest2 = true
      let newText = {
        name: this.user.firstName,
        phone: this.user.phone,
        userId: this.user.id,
        type: 'updatePayroll'
      }
  		this.$store.dispatch('updatePayrollText', newText)
  		setTimeout(() => {
          this.performingRequest2 = false
      }, 1000)
  	}
  },
  beforeDestroy () {
  	this.performingRequest1 = null
    this.performingRequest2 = null
    delete this.performingRequest1
    delete this.performingRequest2
  }
}
</script>