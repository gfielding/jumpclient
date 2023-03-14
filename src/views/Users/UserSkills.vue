<template>
  <div class="dashboard__container" v-if="user">
    <div class="dashboard__container--body">
      <div class="dashboard__container--body--col">
        <ProfileSkills :user="user" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import ProfileSkills from '@/components/Profile/ProfileSkills.vue'

export default {
  props: ['user'],
  name: 'userSkills',
  computed: {
    ...mapState(['currentUser', 'userProfile']),
  },
  components: {
    Loader,
    ProfileSkills
  },
}

</script>