<template>
  <div class="pt-3">

  <Loader v-if="!clientAccess || clientAccess.length == 0" />
  <div class="dashboard__container--body" v-if="clientAccess.length > 0">
      <vue-good-table
        :columns="columns"
        :rows="clientAccess"
        styleClass="vgt-table condensed"
        :search-options="{
          enabled: true,
          placeholder: 'Search this table',
        }"
        :pagination-options="{
          enabled: true,
          mode: 'records',
          perPage: 50,
        }"
        @on-row-click="onRowClick"
        >
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'link'">
            <router-link :to="`/clientaccess/` + props.row.id">
              <i class="fas fa-external-link ml-3 mr-3"></i>
            </router-link>
          </span>
          <span v-else-if="props.column.field == 'name'">
            {{props.row.firstName}} {{props.row.lastName}}
          </span>
          <span v-else-if="props.column.field == 'comp'">
            <span v-for="(item, index) in props.row.company">{{item.title}}  </span>
          </span>
          <span v-else-if="props.column.field == 'ven'">
            <button class="chip mr-2" v-for="(item, index) in props.row.venue">{{item.title}}  </button>
          </span>
          <span v-else>
            {{props.formattedRow[props.column.field]}}
          </span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script>
import * as moment from 'moment'
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'clientAccess',
  data() {
    return {
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
          field: 'comp',
        },
        {
          label: 'Venues',
          field: 'ven',
        },
        {
          label: 'Phone',
          field: 'phone',
          sortable: false
        },
        {
          label: 'Email',
          field: 'email',
          sortable: false
        },
        // {
        //   label: 'Rating',
        //   field: 'rating',
        // },
        // {
        //   label: 'Skills',
        //   field: 'skills',
        // },
        // {
        //   label: 'Blacklist',
        //   field: 'blacklist',
        // },
        // {
        //   label: 'Vaxed',
        //   field: 'vax',
        // },
        // {
        //   label: 'city',
        //   field: 'address.city',
        // },
        // {
        //   label: 'state',
        //   field: 'address.state',
        // },
      ]
    };
  },
  created () {
    if (!this.clientAccess || this.clientAccess.length < 1) {
      this.$store.dispatch("getClientAccess")
    }
  },
  computed: {
    ...mapState(['userProfile', 'currentUser', 'clientAccess']),
  },
  methods: {
    onRowClick(params) {
      let url = `/access/clients/` + params.row.id
      router.push(url)
    },
  },
  components: {
    Loader,
  },
  beforeDestroy () {
    this.$store.dispatch("clearClientAccess")
  }
}
</script>