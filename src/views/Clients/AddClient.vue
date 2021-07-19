<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Add Client</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <form ref="form" @submit.prevent>
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

              <button class="btn btn__primary mt-2" @click="addClient()">Add Client</button>

            </form>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'

export default {
  name: 'addclient',
  data: () => ({
    client: {},
  }),
  methods: {
    addClient() {
      let client = this.client
      let store = this.$store
      store.dispatch('addClient', client)
      let url = `/clients`
      router.push(url)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.event = null
    delete this.client
    this.$store.dispatch('clearErrors')
  }
}
</script>