<template>
  <div class="dashboard__container" v-if="user">
    
    <div class="dashboard__container--body">
        <div class="dashboard__container--body--col">
          <ProfileMessage :user="user" :admin="userProfile" />
        </div>
        <div class="dashboard__container--body--col">
          <ProfileMessagingProfile :user="user" />
          <ProfileMessagingPay :user="user" />
          <ProfileMessagingCerts :user="user" />
        </div>
      </div>

    <div class="dashboard__container--body">
      <div class="dashboard__container--body--col" v-if="(userMessages && userMessages.length > 0)" style="width:100%;">
        <MessageTable :messages="userMessages" />
      </div>
    </div>

<Loader v-if="(!userMessages && userMessages.length == 0)" />

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
import ProfileMessage from '@/components/Profile/ProfileMessage.vue'
import MessageTable from '@/components/Profile/MessageTable.vue'
import ProfileMessagingProfile from '@/components/Profile/ProfileMessagingProfile.vue'
import ProfileMessagingPay from '@/components/Profile/ProfileMessagingPay.vue'
import ProfileMessagingCerts from '@/components/Profile/ProfileMessagingCerts.vue'

export default {
  props: ['user'],
  name: 'userMessages',
  computed: {
    ...mapState(['currentUser', 'userProfile', 'userMessages']),
  },
  created () {
    this.$store.dispatch('getUserMessages', this.$route.params.id)
  },
  components: {
    Loader,
    ProfileMessage,
    MessageTable,
    ProfileMessagingProfile,
    ProfileMessagingPay,
    ProfileMessagingCerts
  },
}

</script>