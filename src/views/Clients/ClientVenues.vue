<template>
  <div class="pt-3">
      <div class="dashboard__container--body">
        <Loader v-if="!clients || clients.length == 0" />
        <div class="flex" v-if="clients && clients.length >= 1" style="width:100%;">
           <vue-good-table
            :columns="columns"
            :rows="clientVenues"
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
  name: 'clientVenues',
  data: () => ({
    search: '',
    showAll: true,
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
  components: {
    Loader,
  },
  computed: {
    ...mapState(['clients', 'currentUser', 'clientVenues']),
  },
  methods: {
    onRowClick(params) {
      let url = `/venues/` + params.row.id
      router.push(url)
    }
  },
}
</script>