<template>
  <div>
	<div class="mt-3 whiteBack">
    <h4>Ask to Upload Food Handler Cert</h4>
		<div class="mb-1 mt-0">
			 <span v-if="user.updateCertsFoodReminderSent" class="caption">
        Last Sent: {{user.updateCertsFoodReminderSent.toDate() | moment("MMMM Do YYYY, h:mm a") }}
        </span>
		</div>
		 <div>
      <button class="btn btn__outlined btn__small" @click="onTextCertsFood()">
      	Text
     	 	<transition name="fade">
          <span class="ml-2" v-if="performingRequest2">
          <i class="fa fa-spinner fa-spin"></i>
          </span>
        </transition>
      </button>
      <button class="ml-3 btn btn__outlined btn__small" @click="onEmailCertsFood()">
      	Email
      	<transition name="fade">
          <span class="ml-2" v-if="performingRequest1">
          <i class="fa fa-spinner fa-spin"></i>
          </span>
        </transition>
      </button>
    </div>
  </div>
  <div class="mt-3 whiteBack">
    <h4>Ask to Upload Alcohol Awareness Cert</h4>
    <div class="mb-1 mt-0">
       <span v-if="user.updateCertsAlcoholReminderSent" class="caption">
        Last Sent: {{user.updateCertsAlcoholReminderSent.toDate() | moment("MMMM Do YYYY, h:mm a") }}
        </span>
    </div>
     <div>
      <button class="btn btn__outlined btn__small" @click="onTextCertsAlcohol()">
        Text
        <transition name="fade">
          <span class="ml-2" v-if="performingRequest2">
          <i class="fa fa-spinner fa-spin"></i>
          </span>
        </transition>
      </button>
      <button class="ml-3 btn btn__outlined btn__small" @click="onEmailCertsAlcohol()">
        Email
        <transition name="fade">
          <span class="ml-2" v-if="performingRequest1">
          <i class="fa fa-spinner fa-spin"></i>
          </span>
        </transition>
      </button>
    </div>
</div>
	</div>
</template>

<script>
export default {
  props: ['user'],
  data: () => ({
    performingRequest1: false,
    performingRequest2: false,
    performingRequest3: false,
    performingRequest4: false,
  }),
  methods: {
  	onEmailCertsFood () {
  		this.performingRequest1 = true
  		let newEmail = {
        name: this.user.firstName,
        email: this.user.email,
        userId: this.user.id,
        type: 'updateCertsFood'
      }
      this.$store.dispatch('updateCertsFoodEmail', newEmail)
      setTimeout(() => {
          this.performingRequest1 = false
      }, 1000)
  	},
  	onTextCertsFood () {
  		this.performingRequest2 = true
      let newText = {
        name: this.user.firstName,
        phone: this.user.phone,
        userId: this.user.id,
        type: 'updateCertsFood'
      }
  		this.$store.dispatch('updateCertsFoodText', newText)
  		setTimeout(() => {
          this.performingRequest2 = false
      }, 1000)
  	},
    onEmailCertsAlcohol () {
      this.performingRequest3 = true
      let newEmail = {
        name: this.user.firstName,
        email: this.user.email,
        userId: this.user.id,
        type: 'updateCertsAlcohol'
      }
      this.$store.dispatch('updateCertsAlcoholEmail', newEmail)
      setTimeout(() => {
          this.performingRequest3 = false
      }, 1000)
    },
    onTextCertsAlcohol () {
      this.performingRequest4 = true
      let newText = {
        name: this.user.firstName,
        phone: this.user.phone,
        userId: this.user.id,
        type: 'updateCertsAlcohol'
      }
      this.$store.dispatch('updateCertsAlcoholText', newText)
      setTimeout(() => {
          this.performingRequest4 = false
      }, 1000)
    }
  },
  beforeDestroy () {
  	this.performingRequest1 = null
    this.performingRequest2 = null
    delete this.performingRequest1
    delete this.performingRequest2
    this.performingRequest3 = null
    this.performingRequest4 = null
    delete this.performingRequest3
    delete this.performingRequest4
  }
}
</script>