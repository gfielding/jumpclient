<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Clients</h1>
        <span class="flex align-center">
          <button class="btn btn__outlined" @click="showAll = true" v-if="!showAll">All Clients</button>
          <button class="btn btn__outlined" @click="showAll = false" v-if="showAll">My Clients</button>
          <router-link :to="{name: 'addclient'}" class="color--text">
          <button class="btn btn__flat"><i class="fas fa-plus fa-2x"></i></button>
        </router-link>
        </span>
        
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!clients || clients.length == 0" />
        <div class="flex" v-if="clients && clients.length >= 1" style="width:100%;">
          <vue-good-table
            v-if="showAll"
            :columns="columns"
            :rows="clients"
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
          </vue-good-table>
          <vue-good-table
            v-if="!showAll"
            :columns="columns"
            :rows="myClients"
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
          </vue-good-table>
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
  name: 'clients',
  data: () => ({
    search: '',
    showAll: true,
    columns: [
      {
        label: 'title',
        field: 'title',
      },
      {
        label: 'Account Manager',
        field: 'accountrep.name',
      },
      {
        label: 'Status',
        field: 'status',
      },
    ]
  }),
  components: {
    Loader,
  },
  created () {
    if (!this.clients || this.clients.length < 1) {
      this.$store.dispatch("getClients")
    }
  },
  computed: {
    ...mapState(['clients', 'currentUser']),
    myClients: function() {
      return this.clients.filter(client => {
        if (client.accountrep) {
          return client.accountrep.userId == this.currentUser.uid
        } else {
          return false
        }
        
      })
    }
  },
  methods: {
    onRowClick(params) {
      let url = `/clients/` + params.row.id
      console.log(url)
      router.push(url)
    }
  },
}
</script>