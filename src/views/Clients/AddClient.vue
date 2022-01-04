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
            <div class="mb-3">
              <label for="title">Client Name:</label>
              <input type="text" v-model.trim="client.title" id="title" />
            </div>
            
            <div class="mb-3">
              <label for="desc">Client Description:</label>
              <textarea name="desc" id="desc" cols="30" rows="10" v-model="client.description"></textarea>
            </div>

          </div>
          <div class="dashboard__container--body--col">

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

            <!-- <div class="mb-3" v-if="contacts.length > 0">
              <label for="contacts">Add Contacts:</label>
              <v-select
                class="mt-2"
                label="name" 
                :options="contacts"
                :value="selected"
                @input="pushContact"
                >
              </v-select>
            </div> -->

            <div class="mt-3" v-for="(contact, index) in client.contacts">
              <hr>
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

            <button class="btn btn__primary mt-5" @click="addClient()">
              Add Client
              <transition name="fade">
                <span class="ml-2" v-if="performingRequest">
                <i class="fa fa-spinner fa-spin"></i>
                </span>
              </transition>
            </button>
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
    selected: '',
    performingRequest: false,
    client: {
      contacts:[],
    },
    statuses: ['New', 'Qualified Lead', 'Not Interested', 'Closed', 'Cancelled'],
  }),
  created () {
    if (!this.mgrs || this.mgrs.length < 1) {
      this.$store.dispatch("getMgrsState")
    }
    if (!this.contacts || this.contacts.length < 1) {
      this.$store.dispatch("getContacts")
    }
  },
  computed: {
    ...mapState(['mgrs', 'contacts']),
    reps: function() {
      return this.mgrs.filter(mgr => {
        return mgr.userId
      })
    }
  },
  methods: {
    remove(index) {
      console.log(index)
      this.client.contacts.splice(index, 1);
    },
    open(contact) {
      let url = `/contacts/` + contact.id
      router.push(url)
    },
    pushContact(value) {
      console.log(value)
      this.client.contacts.push(value)
      this.selected = null
    },
    addClient() {
      this.performingRequest = true
      let client = this.client
      let store = this.$store
      store.dispatch('addClient', client)
      setTimeout(() => {
        this.performingRequest = false
        let url = `/clients`
        router.push(url)
      }, 1000)
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