<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Jobs</h1>
        <router-link :to="{name: 'addjob'}" class="color--text">
          <button class="btn btn__flat"><i class="fas fa-plus fa-2x"></i></button>
        </router-link>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!jobs || jobs.length == 0" />
        <div class="flex pt-3" v-if="jobs && jobs.length >= 1">
          <vue-good-table
            :columns="columns"
            :rows="jobs"
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
  name: 'jobs',
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
    ...mapState(['jobs']),
  },
  components: {
    Loader,
  },
  created () {
    if (!this.jobs || this.jobs.length < 1) {
      this.$store.dispatch("getJobsState")
    }
  },
  methods: {
    onRowClick(params) {
      let url = `/positions/` + params.row.id
      console.log(url)
      router.push(url)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('clearJobsState')
  }
}
</script>