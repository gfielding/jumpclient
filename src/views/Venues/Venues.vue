<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Venues</h1>
        <span class="flex align-center">
          <button class="btn btn__outlined mr-3" @click="exportAll()">export all</button>
        
        <router-link :to="{name: 'addvenue'}" class="color--text">
          <button class="btn btn__flat"><i class="fas fa-plus fa-2x"></i></button>
        </router-link>
        </span>
      </div>
      <div class="dashboard__container--body pt-3">
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
              perPage: 20,
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
import ExportService from "@/services/ExportService"
import router from '@/router'
import * as moment from 'moment'

export default {
  name: 'venues',
  data: () => ({
    columns: [
      {
        label: 'Name',
        field: 'title',
      },
      {
        label: 'Followers',
        field: 'followers',
      },
      {
        label: 'City',
        field: 'address.city',
        thClass: 'hidden-small',
        tdClass: 'hidden-small',
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
      router.push(url)
    },
    exportAll() {
      const exportHeaders = [
        "ID",
        "Title",
        "Address",
        "Street",
        "City",
        "State",
        "Zip Code",
        "Created",
      ]
      const exportItems = [];
      for (var key in this.venues) {
        exportItems.push([
          this.venues[key].id,
          this.venues[key].title,
          this.venues[key].email,
          this.venues[key].address.street_number,
          this.venues[key].address.street,
          this.venues[key].address.city,
          this.venues[key].address.state,
          this.venues[key].address.zip,
          moment.unix(this.venues[key].created.seconds).format('MM/DD/YYYY'),
        ])
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
  },
  created () {
    if (!this.venues || this.venues.length < 1) {
      this.$store.dispatch("getVenues")
    }
  },
  beforeDestroy () {
    this.$store.dispatch('clearVenuesState')
  }
}
</script>