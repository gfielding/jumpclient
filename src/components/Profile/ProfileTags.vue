<template>
  <div class="whiteBack mb-5">
		<h4 class="mb-2">User Groups</h4>
    <div v-if="user && (user.groups && user.groups.length >= 1)">
      <div>
      <button class="chip mr-2 mb-2" v-for="(item, index) in userGroups" :key="item.id">{{item.title}}</button>
      <!-- <v-select :options="groups" label="title" taggable multiple v-model="user.groups" readonly /> -->
      </div>
    </div>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['user'],
  computed: {
    ...mapState(['groups']),
    userGroups() {
      return this.groups.filter(item => {
        return (item.members && item.members.includes(this.user.id))
      })
    }
  },
  created () {
    if (!this.groups || this.groups.length < 1) {
      this.$store.dispatch("getGroups")
    }
  },
}
</script>