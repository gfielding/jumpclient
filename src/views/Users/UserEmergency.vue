<template>
  <div class="dashboard__container" v-if="user">
    <div class="dashboard__container--body">
      <div class="dashboard__container--body--col">
        <ProfileEmergency :user="user" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import ProfileEmergency from '@/components/Profile/ProfileEmergency.vue'

export default {
  props: ['user'],
  name: 'userEmergency',
  computed: {
    ...mapState(['currentUser', 'userProfile']),
  },
  components: {
    Loader,
    ProfileEmergency
  },
}

</script>