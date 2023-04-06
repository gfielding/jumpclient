<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Venues</h1>
        <span>
          <router-link :to="{name: 'addvenue'}" class="color--text">
            <button class="btn btn__outlined btn__small ml-3">Add Venue</button>
          </router-link>
          <!-- <button class="btn btn__outlined ml-3" @click="exportAll()">Export</button> -->
        </span>
        
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!venues || venues.length == 0" />
        <vue-good-table
            :columns="columns"
            :rows="venues"
            styleClass="vgt-table condensed"
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
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'visible'">
              <i class="fa-solid fa-check" v-if="props.row.visible" style="color:green;"></i>
            </span>
            <span v-else-if="props.column.field == 'client'">
              <button class="btn chip mr-2" v-for="(c, index) in props.row.client" :key="index">{{c.title}}</button>
            </span>
            <span v-else>
              {{props.formattedRow[props.column.field]}}
            </span>
          </template>
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
    searchText: '',
    showSearch: false,
    columns: [
      {
        label: 'Name',
        field: 'title',
      },
      // {
      //   label: 'Featured',
      //   field: 'featured',
      // },
      // {
      //   label: 'Followers',
      //   field: 'followers',
      // },
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
        label: 'Client',
        field: 'client',
        sortable: false
      },
    ]
  }),
  computed: {
    ...mapState(['currentUser', 'venues', 'hiddenVenues']),
    filteredVenues() {
      if (this.searchText && this.searchText.length > 2) {
        return this.venues.filter(
          (x => x.title.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (x => x.address.city.toLowerCase().includes(this.searchText.toLowerCase()))
        )
      }
      else {
        return this.venues
      }
    }
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
        // "Clients",
        "Address",
        "Street",
        "City",
        "State",
        "Zip Code",
      ]

      // let clients = (this.venues[key].client[0].title || null)

      const exportItems = [];
      for (var key in this.venues) {
        exportItems.push([
          this.venues[key].id || null,
          this.venues[key].title || null,
          // clients,
          this.venues[key].address.street_number || null,
          this.venues[key].address.street || null,
          this.venues[key].address.city || null,
          this.venues[key].address.state || null,
          this.venues[key].address.zip || null,
        ])
        
      }
      console.log(exportItems)
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