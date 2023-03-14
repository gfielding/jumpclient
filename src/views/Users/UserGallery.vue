<template>
  <div class="dashboard__container" v-if="user">
    <div class="dashboard__container--body flex flex-wrap" v-if="user">
      <img v-for="(item, index) in user.pics" :src="item" alt="" class="pa-3 galleryImage">
      <Loader v-if="(user.pics && user.pics.length == 0)" />
    </div>
  </div>
</template>

<style scoped>
  .galleryImage {
    width: calc(33.33% - 2rem);
    height: auto;
  }
</style>


<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'

export default {
  props: ['user'],
  name: 'userGallery',
  computed: {
    ...mapState(['currentUser', 'userProfile']),
  },
  components: {
    Loader,
  },
}

</script>