<template>
  <div class="dashboard__container" v-if="user">
    
    <div class="dashboard__container--body">
        <div class="dashboard__container--body--col">
          <UserReview :user="user" :me="userProfile" />
        </div>
      </div>

    <div class="dashboard__container--body">
      <div class="dashboard__container--body--col" v-if="(reviews && reviews.length > 0)" style="width:100%;">
        <ReviewsTable :reviews="reviews"  />
      </div>
    </div>

<Loader v-if="(!reviews && reviews.length == 0)" />

    </div>

</template>

<style scoped>
  .held {
    opacity: 0.8;
    filter: grayscale(100%);
  }
</style>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import ReviewsTable from '@/components/Profile/ReviewsTable.vue'
import UserReview from '@/components/Profile/UserReview.vue'

export default {
  props: ['user'],
  name: 'userReviews',
  computed: {
    ...mapState(['currentUser', 'userProfile', 'reviews']),
  },
  created () {
    this.$store.dispatch('getUserReviews', this.$route.params.id)
  },
  components: {
    Loader,
    UserReview,
    ReviewsTable
  },
}

</script>