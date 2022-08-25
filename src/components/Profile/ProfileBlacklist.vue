<template>
	<div>
		<h2>DNR'd By Clients</h2>
    <transition name="fadeStop">
      <div class="mb-2 mt-2 flex" v-if="user && user.blacklist && user.blacklist.length >= 1">
        <button class="chip mr-2" v-for="(item, index) in user.blacklist" :key="index" @click="deleteClient(index)">{{item.title}} <i class="far fa-times-circle ml-2"></i></button>
      </div>
    </transition> 

    <div class="mb-3">
      <label for="client">Choose Client:</label>
      <select v-model="newBlack" id="client" @change="addClient()">
        <option v-for="client in clients" v-bind:value="client">
          {{client.title}}
        </option>
      </select>
    </div>
	</div>

</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['user'],
  data: () => ({
  	newBlack: '',
  }),
  methods: {
  	addClient() {
      let newBlack = this.newBlack
      let user = this.user
      // let blacklist = this.blacklist
      // blacklist.push(newBlack)
      // user.blacklist = blacklist
      if (!user.blacklist) {
      	user.blacklist = []
        user.blacklist.push(newBlack)
      } else {
      	user.blacklist.push(newBlack)
      }
      this.$store.dispatch('updateUser', user)
      this.newBlack = ''
    },
    deleteClient(index) {
      let user = this.user
      let newBlack = this.newBlack
      user.blacklist.splice(index, 1)
      this.$store.dispatch('updateUser', user)
    },
  },
  created () {
    if (!this.clients || this.clients.length < 1) {
      this.$store.dispatch("getClients")
    }
  },
  computed: {
    ...mapState(['clients']),
  },
  beforeDestroy () {
  	this.newBlack = ''
  	delete this.newBlack
  }
}
</script>