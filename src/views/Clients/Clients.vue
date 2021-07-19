<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Clients</h1>
        <router-link :to="{name: 'addclient'}" class="color--text">
          <button class="btn btn__flat"><i class="fas fa-plus fa-2x"></i></button>
        </router-link>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!clients || clients.length == 0" />
        <div class="flex pt-3" v-if="clients && clients.length >= 1" style="width:100%;">
          <vue-good-table
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
    columns: [
      {
        label: 'title',
        field: 'title',
      },
      {
        label: 'Description',
        field: 'description',
      },
    ]
  }),
  computed: {
    ...mapState(['clients']),
  },
  components: {
    Loader,
  },
  created () {
    if (!this.clients || this.clients.length < 1) {
      this.$store.dispatch("getClients")
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