<template>
  <form ref="form" @submit.prevent v-if="client">
    <div class="dashboard__container--body pt-3">
      <div class="dashboard__container--body--col">
        <div>
          <div class="mb-3">
            <label for="title">Client Name:</label>
            <input type="text" v-model.trim="client.title" id="title" />
          </div>
          
          <div class="mb-3">
            <label for="desc">Client Description:</label>
            <textarea name="desc" id="desc" cols="30" rows="10" v-model="client.description"></textarea>
          </div>
        </div>
      </div>
      <div class="dashboard__container--body--col">
        <div>
          <div class="mb-3" v-if="statuses.length > 1">
            <label for="status">Status:</label>
            <v-select
              class="mt-2"
              label="title" 
              :options="statuses"
              v-model="client.status"
              required
              >
            </v-select>
          </div>

          <div class="mb-3" v-if="reps.length > 1">
            <label for="rep">Account Manager:</label>
            <v-select
              class="mt-2"
              label="name" 
              :options="reps"
              v-model="client.accountrep"
              required
              >
            </v-select>
          </div>

          <div class="flex justify-space-between mt-5">
            <button class="btn btn__primary" @click="updateClient()">
              Update
              <transition name="fade">
                <span class="ml-2" v-if="performingRequest">
                <i class="fa fa-spinner fa-spin"></i>
                </span>
              </transition>
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'clientSummary',
  data: () => ({
    selected: '',
    performingRequest: false,
    statuses: ['New', 'Qualified Lead', 'Not Interested', 'Closed', 'Cancelled'],
  }),
  computed: {
    ...mapState(['clientInfo','mgrs']),
    client() {
      return this.clientInfo
    },
    reps: function() {
      return this.mgrs.filter(mgr => {
        return mgr.userId
      })
    }
  },
  created () {
    this.$store.dispatch("getClientFromId", this.$route.params.id);
    if (!this.mgrs || this.mgrs.length < 1) {
      this.$store.dispatch("getMgrsState")
    }
    // if (!this.contacts || this.contacts.length < 1) {
    //   this.$store.dispatch("getContacts")
    // }
  },
   components: {
    Loader,
  },
  methods: {
    updateClient() {
      this.performingRequest = true
      let client = this.client
      this.$store.dispatch('updateClient', client)
      setTimeout(() => {
        this.performingRequest = false
      }, 250)
    },
    deleteClient() {
      let client = this.clientInfo
      this.$store.dispatch('deleteClient', client.id)
      let url = `/clients`
      router.push(url)
    },
    // pushContact(value) {
    //   console.log(value)
    //   this.client.contacts.push(value)
    //   this.selected = null
    // },
    remove(index) {
      console.log(index)
      this.client.contacts.splice(index, 1);
    },
    open(contact) {
      let url = `/contacts/` + contact.id
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
