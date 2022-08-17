<template>
	<div>
		<h2>Leave a Review</h2>
    <star-rating clearable @rating-selected ="setRating" :star-size="30" :show-rating="false"></star-rating>
		<label for="review">Review:</label>
     <textarea name="review" id="review" cols="30" rows="6" v-model="review"></textarea>
     <button class="btn btn__primary mt-3" @click="onAddReview()">
     	Add Review
     		<transition name="fade">
          <span class="ml-2" v-if="performingRequest">
          <i class="fa fa-spinner fa-spin"></i>
          </span>
        </transition>
     </button>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating'

export default {
  props: ['user', 'me'],
  data: () => ({
    performingRequest: false,
    review: '',
    rating: 0
  }),
  components: {
    StarRating
  },
  methods: {
    setRating: function(rating){
      this.rating = rating;
    },
  	onAddReview() {
  		this.performingRequest = true
      let name = this.me.firstName + ' ' + this.me.lastName
  		let theReview = {
  			review: this.review,
        rating: this.rating,
  			userId: this.user.id,
        submittedBy: name
  		}
  		this.$store.dispatch('addUserReview', theReview)
  		setTimeout(() => {
  				this.review = ''
          this.rating = 0
          this.performingRequest = false
      }, 1000)
  	}
  },
  beforeDestroy () {
    this.$store.dispatch('clearUserState')
    this.$store.dispatch('clearErrors')
  }
}
</script>