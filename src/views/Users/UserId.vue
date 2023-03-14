<template>
  <div class="dashboard__container" v-if="user">
    <div class="dashboard__container--body flex flex-wrap" v-if="user">
      <img class="pa-3 galleryImage" :src="user.id_card_path" />
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
  name: 'userId',
  computed: {
    ...mapState(['currentUser', 'userProfile']),
  },
  components: {
    Loader,
  },
}

</script>