<template>
	<div>
		<h2>Add Timesheets Note</h2>
		<label for="note">Note:</label>
     <textarea name="note" id="note" cols="30" rows="10" v-model="note"></textarea>
     <button class="btn btn__primary mt-3" @click="onAddNote()">
     	Add Note
     		<transition name="fade">
          <span class="ml-2" v-if="performingRequest">
          <i class="fa fa-spinner fa-spin"></i>
          </span>
        </transition>
     </button>
  </div>
</template>

<script>
export default {
  props: ['event', 'me'],
  data: () => ({
    performingRequest: false,
    note: '',
  }),
  methods: {
  	onAddNote() {
  		this.performingRequest = true
      let name = this.me.firstName + ' ' + this.me.lastName
  		let theNote = {
  			note: this.note,
  			eventId: this.event.id,
        submittedBy: name
  		}
  		this.$store.dispatch('addEventTimesheetNote', theNote)
  		setTimeout(() => {
  				this.note = ''
          this.performingRequest = false
      }, 1000)
  	}
  }
}
</script>