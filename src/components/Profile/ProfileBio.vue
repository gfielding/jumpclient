<template>
	<div>
    <div class="flex justify-space-between align-center">
  		<h3 class="mb-3">Bio</h3>
<!-- 
      
    
      <div>
        <button v-if="!user.bio || !user.picture" class="btn btn__small btn__primary btn__flat mb-2" @click="requestBio()">Request</button>
        

        <span class="flex justify-flex-end caption" v-if="user.BioReminderSent">
          {{formatDate(user.BioReminderSent)}}
        </span>
      </div>
 -->
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
}
</script>