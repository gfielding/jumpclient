<template>
  <div class="pt-3">
  <!-- <form ref="form" @submit.prevent v-if="client">
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
  </form> -->
    <div class="dashboard__container--body">
      <!-- <div class="dashboard__container--body--col"> -->
      <div class="flex" v-if="clientContacts && clientContacts.length >= 1" style="width:100%;">
          <vue-good-table
            :columns="columns"
            :rows="clientContacts"
            compactMode
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 10,
            }"
            @on-row-click="onRowClick"
          >
          <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'created'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
             
              <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
          </vue-good-table>
        </div>

        <!-- <div class="dashboard__container--body--col" v-for="(contact, index) in client.contacts">
          <div class="flex justify-space-between">
            <span>
              <div><h3>{{contact.name}}</h3>
                <div v-if="contact.title">{{contact.title}}</div>
                <div v-if="contact.location">{{contact.location}}</div>
                <div v-if="contact.venue">{{contact.venue.title}}</div>
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
          
        </div> -->
      <!-- </div> -->
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
import * as moment from 'moment'

export default {
  name: 'clientContacts',
  data: () => ({
    selected: '',
    performingRequest: false,
    columns: [
      {
        label: 'Name',
        field: 'name',
      },
      {
        label: 'Title',
        field: 'title',
      },
      {
        label: 'Company',
        field: 'company.title',
      },
      {
        label: 'Venue',
        field: 'venue.title',
      },
      {
        label: 'Phone',
        field: 'phone',
      },
      {
        label: 'Email',
        field: 'email',
      },
      {
        label: 'Created',
        field: 'created',
      },
    ]
  }),
  computed: {
    ...mapState(['clientInfo', 'contacts', 'clientContacts']),
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
  mounted () {
    console.log(this)
  },
   components: {
    Loader,
  },
  methods: {
    onRowClick(params) {
      let url = `/contacts/` + params.row.id
      console.log(url)
      router.push(url)
    },
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
      let client = this.clientInfo
      console.log(value)
      client.contacts.push(value)
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
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMM Do YYYY')
      } else {
        return null
      }
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearClientState')
    this.$store.dispatch('clearErrors')
  }
}
</script>

