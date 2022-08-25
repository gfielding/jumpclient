<template>
  <div class="dashboard__container" :class="{ held: docHeld }" v-if="user">
    <div class="dashboard__container--body" v-if="user">
      <div class="dashboard__container--body--col">
        <UserEvents :events="userEvents" />
      </div>
      <div class="dashboard__container--body--col">
        <UserAssignments :assignments="userAssignments" />
      </div>
    </div>
<Loader v-if="(userEvents && userEvents.length == 0)" />

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
import UserAssignments from '@/components/Profile/UserAssignments.vue'
import UserEvents from '@/components/Profile/UserEvents.vue'

export default {
  props: ['user', 'dnr', 'docHeld'],
  name: 'userAssignments',
  computed: {
    ...mapState(['currentUser', 'userAssignments', 'userEvents']),
  },
  components: {
    Loader,
    UserAssignments,
    UserEvents
  },
}

</script>