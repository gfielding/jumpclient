<template>
	<div class="modal-mask">
		<div class="modal-wrapper">
      <div class="modal-container">
      	
        <div class="modal-body pa-4" v-click-outside="onClickOutside">
        	<div v-if="sheet">
        		<div class="flex justify-space-between align-center mb-2">
        			<h4>Anything we should know?</h4>
        			<button @click="$emit('close')">
			         <i class="fas fa-times mr-1"></i>
			        </button>
        		</div>
        		<form ref="form" @submit.prevent>
        			<div class="mb-3">
	    					<label for="regHours">Regular Hours:</label>
	    					<input type="number" v-model.trim="sheet.regHours" id="regHours" />
	    				</div>
        		</form>

        		{{sheet.firstName}}
						</div>
						<!-- <textarea name="know" id="know" cols="30" rows="10" placeholder="Who you are traveling with, if you would be late, etc." v-model.lazy="firstData.note"></textarea>
					
					<button class="btn btn__outlined mt-3" @click="onUpdateNote">
						Save Note
						<transition name="fade">
				      <span class="ml-2" v-if="performingRequest">
				      <i class="fa fa-spinner fa-spin"></i>
				      </span>
				    </transition>
					</button> -->
        </div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
const fb = require('../../firebaseConfig.js')

export default {
  props: ['sheet'],
  data: () => ({
  	performingRequest: false,
  }),
  computed: {
  	// dayNote () {
  	// 	return this.userAvailableData.filter(data => {
  	// 		return data.day == this.day
  	// 	})
  	// },
  	// firstData () {
  	// 	return this.dayNote[0] || null
  	// }
  },
  methods: {
  	onClickOutside (event) {
  		this.$emit('close')
     },
  	// onUpdateNote: function () {
  	// 	this.performingRequest = true
  	// 	let data = this.firstData
  	// 	console.log(data)
  	// 	fb.userDaysCollection.doc(this.firstData.id).update(data)
			// setTimeout(() => {
   //      this.performingRequest = false
   //      this.$emit('close')
   //    }, 1000)
   //  },
  },
}
</script>