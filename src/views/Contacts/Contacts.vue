<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Contacts</h1>
        <router-link :to="{name: 'addcontact'}" class="color--text">
          <button class="btn btn__flat"><i class="fas fa-plus fa-2x"></i></button>
        </router-link>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!contacts || contacts.length == 0" />
        <div class="flex pt-3" v-if="contacts && contacts.length >= 1" style="width:100%;">
          <vue-good-table
            :columns="columns"
            :rows="contacts"
            compactMode
            styleClass="vgt-table condensed"
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
          <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'created'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
             
              <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
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
import * as moment from 'moment'

export default {
  name: 'contacts',
  data: () => ({
    search: '',
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
        field: 'company.title',
      },
      {
        label: 'Venue',
        field: 'venue.title',
      },
      {
        label: 'Phone',
        field: 'phone',
      },
      {
        label: 'Email',
        field: 'email',
      },
      {
        label: 'Created',
        field: 'created',
      },
    ]
  }),
  computed: {
    ...mapState(['contacts']),
  },
  components: {
    Loader,
  },
  created () {
    if (!this.contacts || this.contacts.length < 1) {
      this.$store.dispatch("getContacts")
    }
  },
  methods: {
    onRowClick(params) {
      let url = `/contacts/` + params.row.id
      console.log(url)
      router.push(url)
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMM Do YYYY')
      } else {
        return null
      }
    },
  },
}
</script>