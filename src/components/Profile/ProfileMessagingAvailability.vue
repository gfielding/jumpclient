<template>
	<div>
    <h2>Ask to Update Availability</h2>
		<div class="mb-3 mt-1">
			 <!-- <span v-if="user.updateAvailabilityReminderSent" class="caption">
        Last Sent: {{user.updateAvailabilityReminderSent.toDate() | moment("MMMM Do YYYY, h:mm a") }}
        </span> -->
		</div>
		 <div>
      <button class="btn btn__outlined" @click="onTextAvailability">
      	Text
     	 	<transition name="fade">
          <span class="ml-2" v-if="performingRequest2">
          <i class="fa fa-spinner fa-spin"></i>
          </span>
        </transition>
      </button>
      <button class="ml-3 btn btn__outlined" @click="onEmailAvailability">
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
  	onEmailAvailability () {
  		this.performingRequest1 = true
  		let newEmail = {
        name: this.user.firstName,
        email: this.user.email,
        userId: this.user.id,
        type: 'updateAvailability'
      }
      this.$store.dispatch('updateAvailabilityEmail', newEmail)
      setTimeout(() => {
          this.performingRequest1 = false
      }, 1000)
  	},
  	onTextAvailability () {
  		this.performingRequest2 = true
      let newText = {
        name: this.user.firstName,
        phone: this.user.phone,
        userId: this.user.id,
        type: 'updateAvailability'
      }
  		this.$store.dispatch('updateAvailabilityText', newText)
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