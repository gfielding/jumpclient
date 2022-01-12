<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Directory</h1>
        <router-link :to="{name: 'addmgr'}" class="color--text">
          <button class="btn btn__flat"><i class="fas fa-plus fa-2x"></i></button>
        </router-link>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!mgrs || mgrs.length == 0" />
        <div class="flex pt-3" v-if="mgrs && mgrs.length >= 1" style="width:100%;">
          <vue-good-table
            :columns="columns"
            :rows="mgrs"
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'team',
  data: () => ({
    search: '',
    columns: [
      {
        label: 'name',
        field: 'name',
      },
      {
        label: 'location',
        field: 'location',
      },
      {
        label: 'department',
        field: 'dpt',
      },
      {
        label: 'phone',
        field: 'phone',
      },
      {
        label: 'email',
        field: 'email',
      },
    ]
  }),
  computed: {
    ...mapState(['mgrs']),
  },
  components: {
    Loader,
  },
  created () {
    if (!this.mgrs || this.mgrs.length < 1) {
      this.$store.dispatch("getMgrsState")
    }
  },
  methods: {
    onRowClick(params) {
      let url = `/team/` + params.row.id
      console.log(url)
      router.push(url)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('clearMgrsState')
  }
}
</script>