<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>OnPay Requests</h1>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!opr || opr.length == 0" />
        <div class="flex pt-3" v-if="opr && opr.length >= 1" style="width:100%;"> 
          <vue-good-table
            :columns="columns"
            :rows="opr"
            styleClass="vgt-table striped"
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
            >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'created'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
              <span v-else-if="props.column.field == 'check'">
                <input type="checkbox" v-model.trim="props.row.checked" id="check" class="ml-3" @change="markAdded(props.row)" />
                <!-- <span v-if="props.row.created">{{formatDate(props.row.created)}}</span> -->
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
import * as moment from 'moment'
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'

export default {
  name: 'oprs',
  data: () => ({
    search: '',
    columns: [
      {
        label: 'Added',
        field: 'checked',
      },
      {
        label: 'Created',
        field: 'created',
        sortable: false,
      },
      {
        label: 'First',
        field: 'firstName',
      },
      {
        label: 'Last',
        field: 'lastName',
      },
      {
        label: 'Email',
        field: 'email',
      },
      {
        label: 'Phone',
        field: 'phone',
      },
      {
        label: 'State',
        field: 'eventInfo.venue.address.state',
      },
    ]
  }),
  computed: {
    ...mapState(['opr']),
  },
  components: {
    Loader,
  },
  created () {
    if (!this.opr || this.opr.length < 1) {
      this.$store.dispatch("getOprs")
    }
  },
  methods: {
    markAdded(p) {
      this.$store.dispatch("updateOpr", p)
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY, hh:mm a')
      } else {
        return null
      }
    },
  },
  beforeDestroy () {
    this.$store.dispatch("clearOprState")
    console.log(this)
  }
}
</script>