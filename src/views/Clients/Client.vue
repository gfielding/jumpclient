<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <Loader v-if="!client" />
      <div class="dashboard__container--header" v-if="client">
        <h1>Edit Client</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <div class="dashboard__container--body">
        <div class="dashboard__container--body--col">
          <form ref="form" @submit.prevent>
            <div class="mb-3">
              <label for="title">Client Name:</label>
              <input type="text" v-model.trim="client.title" id="title" />
            </div>
            <div class="mb-3">
              <label for="desc">Client Description:</label>
              <textarea name="desc" id="desc" cols="30" rows="10" v-model="client.description"></textarea>
            </div>
            <div class="flex justify-space-between mt-2">
              <button class="btn btn__primary" @click="updateClient()">Update</button>
              <button class="btn btn__dark" @click="deleteClient()">delete</button>
            </div>
          </form>
        </div>
      </div>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'client',
  computed: {
    ...mapState(['clientInfo']),
    client() {
      return this.clientInfo
    }
  },
  created () {
    this.$store.dispatch("getClientFromId", this.$route.params.id);
  },
   components: {
    Loader,
  },
  methods: {
    updateClient() {
      let client = this.client
      this.$store.dispatch('updateClient', client)
      let url = `/clients`
      router.push(url)
    },
    deleteClient() {
      let client = this.clientInfo
      this.$store.dispatch('deleteClient', client.id)
      let url = `/clients`
      router.push(url)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearClientState')
    this.$store.dispatch('clearErrors')
  }
}
</script>
