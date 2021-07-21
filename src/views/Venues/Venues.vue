<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Venues</h1>
        <router-link :to="{name: 'addvenue'}" class="color--text">
          <button class="btn btn__flat"><i class="fas fa-plus fa-2x"></i></button>
        </router-link>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!venues || venues.length == 0" />
        <vue-good-table
            :columns="columns"
            :rows="venues"
            styleClass="vgt-table striped"
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
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'venues',
  data: () => ({
    columns: [
      {
        label: 'Name',
        field: 'title',
      },
      {
        label: 'City',
        field: 'address.city',
      },
      {
        label: 'State',
        field: 'address.state',
      },
      {
        label: 'Visible',
        field: 'visible',
      },
    ]
  }),
  computed: {
    ...mapState(['venues']),
  },
  components: {
    Loader,
  },
  methods: {
    onRowClick(params) {
      let url = `/venues/` + params.row.id
      console.log(url)
      router.push(url)
    }
  },
  created () {
    if (!this.venues || this.venues.length < 1) {
      this.$store.dispatch("getVenues")
    }
  }
}
</script>