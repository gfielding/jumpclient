<template>
  <div class="pt-3">
    <div class="dashboard__container--body">
      <div class="dashboard__container--body--col">
        <ClientNote :user="client" :me="userProfile" />
      </div>
      <!-- <div class="dashboard__container--body--col">
        <NotesTable :notes="userNotes" />
      </div> -->
    </div>
    <div class="dashboard__container--body">
      <ClientNotesTable :notes="clientNotes" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
import ClientNote from '@/components/Profile/ClientNote.vue'
import ClientNotesTable from '@/components/Profile/ClientNotesTable.vue'

export default {
  name: 'clientNotes',
  computed: {
    ...mapState(['clientInfo', 'clientNotes', 'userProfile']),
    client() {
      return this.clientInfo
    },
  },
   components: {
    Loader,
    ClientNote,
    ClientNotesTable
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
