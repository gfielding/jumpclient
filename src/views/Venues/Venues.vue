<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header mb-3 eventsHeader">
        <span style="display: flex;
          width: 100%;
          justify-content: space-between;">
          <h1>Venues</h1>
        <!--   <span>
            <button class="btn btn__outlined mr-3" @click="exportAll()">export all</button>
            <router-link :to="{name: 'addvenue'}" class="color--text">
              <button class="btn btn__flat"><i class="fas fa-plus fa-2x"></i></button>
            </router-link>
          </span> -->
        </span>
        <span class="search flex">
          <input type="text" placeholder="search" v-model.trim="searchText" style="background: white; padding: 0 1rem; min-height: 38px; min-width: 120px;" class="mr-3" />
            <div>
              <button class="btn btn__outlined mr-3" @click="exportAll()">export all</button>
            </div>
            <router-link :to="{name: 'addvenue'}" class="color--text">
              <button class="btn btn__flat"><i class="fas fa-plus fa-2x"></i></button>
            </router-link>

          <!-- <div style="margin:auto;" v-if="showSearch">
            <button class="btn btn__primary mr-5" @click="clearSearch()">clear</button>
          </div>
          <div style="margin:auto;" v-if="searchText.length > 1 && !showSearch">
            <button class="btn btn__accent mr-5" @click="updateSearch()">submit</button>
          </div> -->
        </span>
        
      </div>
      <div class="dashboard__container--body eventCardContainer">
        <Loader v-if="!venues || venues.length == 0" />
        <div v-for="venue in filteredVenues" :key="venue.id" class="eventCard">
          <!-- <img :data-src="(event.photoUrl || event.venue.photoUrl)" alt=""> -->
          <span class="flex align-center">
            <h3>{{venue.title}}</h3> <span v-if="venue.featured"><i style="color: gold" class="fa-solid fa-star ml-3"></i></span>
          </span>
          <div class="caption"><span v-if="venue && venue.address && venue.address.city  && venue.address.state">{{venue.address.city}}, {{venue.address.state}} | Followers: {{venue.followers}}</span>
            </div>
          <div class="flex mt-2">
            <div class="flex flex-wrap">
              <router-link :to="`/venues/` + venue.id">
                <button class="btn btn__small btn__outlined mr-3">Edit</button>
              </router-link>
              <router-link :to="`/venues/` + venue.id + `/qr`">
                <button class="btn btn__small btn__outlined mr-3" >QR Code</button>
              </router-link>
            </div>
          </div>
        </div>











        <!-- <vue-good-table
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
        </vue-good-table> -->
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
      {
        label: 'Featured',
        field: 'featured',
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
      let logFields = {
          user: this.currentUser.email,
          export: 'All (Venues) Export',
      }
      this.$store.dispatch('sendExportLog', logFields)
      const exportHeaders = [
        "ID",
        "Title",
        "Clients",
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
          this.venues[key].client,
          this.venues[key].email,
          this.venues[key].address.street_number,
          this.venues[key].address.street,
          this.venues[key].address.city,
          this.venues[key].address.state,
          this.venues[key].address.zip,
          moment.unix(this.venues[key].created.seconds).format('MM/DD/YYYY'),
        ])
        console.log(exportItems)
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
  // beforeDestroy () {
  //   this.$store.dispatch('clearVenuesState')
  // }
}
</script>