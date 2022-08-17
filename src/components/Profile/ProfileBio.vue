<template>
	<div>
    <div class="flex justify-space-between align-center">
  		<h2 class="mb-3">Bio</h2>

      
    
      <div>
        <button v-if="!user.bio || !user.picture" class="btn btn__small btn__primary btn__flat mb-2" @click="requestBio()">Request</button>
        <a :href="user.picture" v-if="user.picture" target="_blank">
          <button class="btn btn__small btn__outlined mb-2">View Resumé <i class="fas fa-external-link ml-2"></i></button>
        </a>

        <span class="flex justify-flex-end caption" v-if="user.BioReminderSent">
          {{formatDate(user.BioReminderSent)}}
        </span>
      </div>

    </div>
		<div class="mb-3">
      <div v-html="user.bio"> 
      </div>
    </div>
	</div>
</template>

<script>
import * as moment from 'moment'

export default {
  props: ['user'],
  methods: {
    requestBio() {
      let newText = {
        name: this.user.firstName,
        phone: this.user.phone,
        userId: this.user.id,
        type: 'requestBio'
      }
      this.$store.dispatch('requestBioText', newText)
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MM Do YYYY, hh:mm a')
      } else {
        return null
      }
    },
  },

  beforeDestroy () {
    this.$store.dispatch('clearUserState')
    this.$store.dispatch('clearErrors')
  }
}
</script>