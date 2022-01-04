<template>
  <div class="pt-3">
  <form ref="form" @submit.prevent v-if="client">
    <div class="dashboard__container--body">
      <div class="dashboard__container--body--col">
        <div class="mb-3" v-if="contacts.length > 0">
          <label for="contacts">Add Contact:</label>
          <v-select
            class="mt-2"
            label="name" 
            :options="contacts"
            :value="selected"
            @input="pushContact"
            >
          </v-select>
        </div>

      </div>
    </div>
    <div class="dashboard__container--body">
      <!-- <div class="dashboard__container--body--col"> -->

        <div class="dashboard__container--body--col" v-for="(contact, index) in client.contacts">
          <div class="flex justify-space-between">
            <span>
              <div><h3>{{contact.name}}</h3>
                <div>{{contact.title}}</div>
                <div>Cell: {{contact.phone}} / Office: {{contact.phone2}}</div>
                <div>{{contact.email}}</div>
              </div>
            </span>
            <span>
              <button class="btn btn__dark btn__small" @click="remove(index)">Remove</button>
              <button class="btn btn__primary btn__small ml-3" @click="open(contact)">
                Open
                <i class="far fa-external-link ml-2"></i>
              </button>
            </span>
          </div>
          
        </div>
      <!-- </div> -->
    </div>
  </form>
</div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'clientContacts',
  data: () => ({
    selected: '',
    performingRequest: false,
  }),
  computed: {
    ...mapState(['clientInfo', 'contacts']),
    client() {
      return this.clientInfo
    },
  },
  created () {
    this.$store.dispatch("getClientFromId", this.$route.params.id);
    if (!this.contacts || this.contacts.length < 1) {
      this.$store.dispatch("getContacts")
    }
  },
   components: {
    Loader,
  },
  methods: {
    updateClient() {
      let client = this.client
      this.$store.dispatch('updateClient', client)
    },
    deleteClient() {
      let client = this.clientInfo
      this.$store.dispatch('deleteClient', client.id)
      let url = `/clients`
      router.push(url)
    },
    pushContact(value) {
      console.log(value)
      this.client.contacts.push(value)
      this.selected = null
      setTimeout(() => {
        this.updateClient()
      }, 250)
    },
    remove(index) {
      console.log(index)
      this.client.contacts.splice(index, 1);
      setTimeout(() => {
        this.updateClient()
      }, 250)
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

