<template>
	<div>
		<h2>User Groups</h2>

    <div class="mb-3" v-if="user && (groups  && groups.length > 1)">
      <label for="client">Add User to a Group:</label>
      <v-select :reduce="group => group.title" :options="groups" label="title" taggable multiple push-tags v-model="user.groups" @input="updateUser()" />
    </div>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['user'],
  computed: {
    ...mapState(['groups'])
  },
  created () {
    if (!this.groups || this.groups.length < 1) {
      this.$store.dispatch("getGroups")
    }
  },
  methods: {
    async updateTags(){
      let user = this.user
      let userGroups = this.user.groups
      if (userGroups) {
        this.$store.dispatch('updateGroups', {
          groups: userGroups,
          user: user
        })
      }
    },
    updateUser() {
      let user = this.user
      let userGroups = (this.user.groups || null)
      console.log(userGroups)
      this.$store.dispatch('updateGroups', {
        groups: userGroups,
        user: user
      })
    },
  	// addClient() {
   //    let newBlack = this.newBlack
   //    let user = this.user
     
   //    if (!user.blacklist) {
   //    	user.blacklist = []
   //    } else {
   //    	user.blacklist.push(newBlack)
   //    }
   //    this.$store.dispatch('updateUser', user)
   //    this.newBlack = ''
   //  },
   //  deleteClient(index) {
   //    let user = this.user
   //    let newBlack = this.newBlack
   //    user.blacklist.splice(index, 1)
   //    this.$store.dispatch('updateUser', user)
   //  },
  },
  // created () {
  //   if (!this.clients || this.clients.length < 1) {
  //     this.$store.dispatch("getClients")
  //   }
  // },
  // computed: {
  //   ...mapState(['clients']),
  // },
  beforeDestroy () {
    this.$store.dispatch('clearUserState')
  	this.$store.dispatch('clearErrors')
  }
}
</script>