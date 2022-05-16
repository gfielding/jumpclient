<template>
	<div class="modal-mask">
		<div class="modal-wrapper">
      <div class="modal-container">
      	
        <div class="modal-body pa-4" v-click-outside="onClickOutside">
        	<div>
        		<div class="flex justify-space-between align-center mb-2">
        			<h3>Staff Info Email</h3>
        			<button @click="$emit('close')">
			         <i class="fas fa-times mr-1"></i>
			        </button>
        		</div>
						
						<textarea name="know" id="know" cols="30" rows="5" v-model.lazy="item.note" style="background: #efefef;"></textarea>
					</div>
					<button class="btn btn__outlined mt-3" @click="onUpdateEvent(item)">
						Save Note
						<transition name="fade">
				      <span class="ml-2" v-if="performingRequest">
				      <i class="fa fa-spinner fa-spin"></i>
				      </span>
				    </transition>
					</button>
        </div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
const fb = require('../firebaseConfig.js')

export default {
  props: ['item'],
  data: () => ({
  	performingRequest: false,
  }),
  computed: {
  },
  methods: {
  	onUpdateEvent(item) {
  		console.log(item)
  		this.performingRequest = true
      fb.eventsCollection.doc(item.id).update(item)
      setTimeout(() => {
        this.performingRequest = false
        this.$emit('close')
      }, 1000)
    },
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