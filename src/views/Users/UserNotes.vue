<template>
  <div class="dashboard__container" v-if="user">
    <div class="dashboard__container--body" v-if="user">
      <div class="dashboard__container--body--col">
        
        <UserNote :user="user" :me="userProfile" />
      </div>
    </div>
    <div class="dashboard__container--body" v-if="user">
      <NotesTable :notes="userNotes" />
    </div>
<Loader v-if="(userNotes && userNotes.length == 0)" />

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
import NotesTable from '@/components/Profile/NotesTable.vue'
import UserNote from '@/components/Profile/UserNote.vue'

export default {
  props: ['user'],
  name: 'userNotes',
  computed: {
    ...mapState(['currentUser', 'userProfile', 'userNotes']),
  },
  created () {
    this.$store.dispatch('getUserNotes', this.$route.params.id)
  },
  components: {
    Loader,
    UserNote,
    NotesTable
  },
}

</script>