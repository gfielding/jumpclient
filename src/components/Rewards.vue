<template>
	<div class="light">
		<select v-model="newPoints" id="client" class="ml-3" style="background:white;">
			<option :value="''" disabled selected>Add Points</option>
      <option v-for="d in options" placeholder="Add Points">
        {{d}}
      </option>
    </select>
	  <button @click="clear" class="btn btn__dark btn__small ml-3" v-if="newPoints && newPoints != null">
	  	X
	  </button>
	  <button @click="increment" class="btn btn__outlined btn__small ml-3" v-if="newPoints && newPoints != null">
	  	<span v-if="!performingRequest">Add</span>
	  	<transition name="fade">
	      <span class="ml-2" v-if="performingRequest">
	      <i class="fa fa-spinner fa-spin"></i>
	      </span>
	    </transition>
	  </button>
  </div>
</template>

<style scoped>
	.light {
		display: flex;
		align-items: center;
	}
</style>

<script>
export default {
	props:['user'],
	data() {
    return {
    	performingRequest: false,
    	newPoints: '',
    	options: [1,2,3,4,5,6,7,8,9,10],
    	placeholder: {
				type: String,
				default: "Add Points"
			},
    }
  },
  methods: {
  	clear() {
  		this.newPoints = ''
  	},
    increment() {
    	this.performingRequest = true,
      this.$store.dispatch("incrementUser", ({
        user: this.user,
        points: this.newPoints
      }));
      setTimeout(() => {
        this.performingRequest = false
        this.newPoints = ''
       }, 500)
    }
  }
}
</script>






