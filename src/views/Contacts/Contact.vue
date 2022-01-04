<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <Loader v-if="!contact" />
      <div class="dashboard__container--header">
        <h1>Edit Contact</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <form ref="form" @submit.prevent>
        <div class="dashboard__container--body">
          <div class="dashboard__container--body--col">
            <div class="mb-3">
              <label for="contact1name">Contact Name:</label>
              <input type="text" v-model.trim="contact.name" id="contactname" />
            </div>
            <div class="mb-3">
              <label for="contacttitle">Contact Title:</label>
              <input type="text" v-model.trim="contact.title" id="contacttitle" />
            </div>
            <div class="mb-3">
              <label for="contactlocation">Contact Location:</label>
              <input type="text" v-model.trim="contact.location" id="contactlocation" />
            </div>
            <div class="mb-3">
              <label for="contactphone">Cell Phone:</label>
              <input type="phone" placeholder="" v-model.trim="contact.phone" v-mask="'(###) ###-####'" placeholder="(999) 999-9999" id="contactphone" />
            </div>
            <div class="mb-3">
              <label for="contactphone2">Office Phone:</label>
              <input type="phone" placeholder="" v-model.trim="contact.phone2" v-mask="'(###) ###-####'" placeholder="(999) 999-9999" id="contactphone2" />
            </div>
            <div class="mb-3">
              <label for="contactemail">Contact Email:</label>
              <input type="text" v-model.trim="contact.email" id="contact1email" />
            </div>
          </div>
          <div class="dashboard__container--body--col">
            <div class="mb-3" v-if="venues.length > 1">
              <label for="venue">Venue:</label>
              <v-select
                class="mt-2"
                label="title" 
                :options="venues"
                v-model="contact.venue"
                required
                >
              </v-select>
            </div>
            <div class="mb-3" v-if="clients.length > 1">
              <label for="company">Company:</label>
              <v-select
                class="mt-2"
                label="title" 
                :options="clients"
                v-model="contact.company"
                required
                >
              </v-select>
            </div>
            <div class="mb-3">
              <label for="desc">Contact Description:</label>
              <textarea name="desc" id="desc" cols="30" rows="10" v-model="contact.description"></textarea>
            </div>
            <div class="flex justify-space-between mt-2">
              <button class="btn btn__primary" @click="updateContact()">
                Update
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>
              <button class="btn btn__dark" @click="deleteContact()">delete</button>
            </div>
          </div>
        </div>
        <hr>


        <div class="dashboard__container--body" v-if="contact">
          <!-- <div class="dashboard__container--body--col">
            
          </div> -->
          <div class="dashboard__container--body--col">
            <ContactNote :user="contact" :me="userProfile" />
          </div>
        </div>
        <div class="dashboard__container--body" v-if="contact">
          <div class="dashboard__container--body--col" style="width:100%;">
            <ContactNotesTable :notes="contactNotes" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'
import ContactNotesTable from '@/components/Profile/ContactNotesTable.vue'
import ContactNote from '@/components/Profile/ContactNote.vue'

export default {
  name: 'contact',
  data: () => ({
    performingRequest: false,
  }),
  computed: {
    ...mapState(['contactInfo', 'clients', 'venues', 'userProfile', 'contactNotes']),
    contact() {
      return this.contactInfo
    }
  },
  created () {
    this.$store.dispatch("getContactFromId", this.$route.params.id);
    if (!this.clients || this.clients.length < 1) {
      this.$store.dispatch("getClients")
    }
    if (!this.venues || this.venues.length < 1) {
      this.$store.dispatch("getVenues")
    }
  },
  components: {
    ContactNotesTable,
    ContactNote
  },
  methods: {
    updateContact() {
      this.performingRequest = true
      let contact = this.contact
      this.$store.dispatch('updateContact', contact)
      setTimeout(() => {
        this.performingRequest = false
      }, 250)
    },
    deleteContact() {
      let contact = this.contactInfo
      this.$store.dispatch('deleteContact', contact.id)
      let url = `/contacts`
      router.push(url)
    },
    // addContact() {
    //   this.performingRequest = true
    //   let contact = this.contact
    //   let store = this.$store
    //   store.dispatch('addContact', contact)
    //   setTimeout(() => {
    //     this.performingRequest = false
    //     contact = {}
    //     let url = `/contacts`
    //     router.push(url)
    //   }, 1000)
    // },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearContactState')
    this.$store.dispatch('clearErrors')
  }
}
</script>