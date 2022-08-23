<template>
	<div>
    <h2>Send a Custom Message</h2>
		<div class="mb-3 mt-1">
		</div>
		 <div>
      <textarea name="mess" id="mess" cols="30" rows="5" v-model="message"></textarea>
      <button class="btn btn__primary mt-3" @click="sendMessage">
      	Send
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
export default {
  props: ['user', 'admin'],
  data: () => ({
    performingRequest: false,
    message: '',
    from: ''
  }),
  methods: {
  	sendMessage () {
  		this.performingRequest = true
  		let newMessage = {
        name: this.user.firstName,
        email: this.user.email,
        userId: this.user.id,
        phone: this.user.phone,
        message: this.message,
        from: this.admin.twilioNumber || null
      }
      this.$store.dispatch('sendUserMessage', newMessage)
      setTimeout(() => {
          this.performingRequest = false,
          this.message = ''
      }, 1000)
  	},
  },
}
</script>