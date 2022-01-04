<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Payroll Help</h1>
        <span>
          <button class="btn btn__outlined" @click="showAll = true" v-if="!showAll">Show Open</button>
          <button class="btn btn__outlined" @click="showAll = false" v-if="showAll">Show Closed</button>
        </span>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!payrollHelp || payrollHelp.length == 0" />
        <vue-good-table
           v-if="showAll"
            :columns="columns"
            :rows="openHelp"
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
          <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'startDate'">
                {{props.row.startDate | moment("MMM Do, YYYY") }}
                <span v-if="props.row.endDate">
                    - {{props.row.endDate | moment("MMM Do, YYYY") }}
                </span>
              </span>
              <span v-else-if="props.column.field == 'complete'">
                <input type="checkbox" v-model.trim="props.row.closed" id="check" class="ml-3" @change="markAdded(props.row)" />
              </span>
              
              
               <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
        </vue-good-table>
        <vue-good-table
             v-if="!showAll"
              :columns="columns"
              :rows="closedHelp"
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
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'startDate'">
                {{props.row.startDate | moment("MMM Do, YYYY") }}
                <span v-if="props.row.endDate">
                    - {{props.row.endDate | moment("MMM Do, YYYY") }}
                </span>
              </span>
              <span v-else-if="props.column.field == 'complete'">
                <input type="checkbox" v-model.trim="props.row.closed" id="check" class="ml-3" @change="markRemoved(props.row)" />
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
import router from '@/router'

export default {
  name: 'payrollHelp',
  data: () => ({
    showAll: true,
    columns: [
      {
        label: 'Mark Complete',
        field: 'complete',
      },
      {
        label: 'Event',
        field: 'event.title',
      },
      {
        label: 'Date',
        field: 'event.startDate',
      },
      {
        label: 'Name',
        field: 'name',
      },
      {
        label: 'Manager',
        field: 'manager',
      },
      {
        label: 'Phone',
        field: 'phone',
      },
      {
        label: 'Summary',
        field: 'summary',
      },
    ]
  }),
  computed: {
    ...mapState(['payrollHelp']),
    openHelp: function() {
      return this.payrollHelp.filter(item => {
        return (!item.closed)
      })
    },
    closedHelp: function() {
      return this.payrollHelp.filter(item => {
        return item.closed
      })
    }
  },
  components: {
    Loader,
  },
  methods: {
    markAdded(p) {
      this.$store.dispatch("closePH", p)
    },
    markRemoved(p) {
      this.$store.dispatch("openPH", p)
    },
    onRowClick(params) {
      let url = `/accounting/events/` + params.row.id
      console.log(url)
      // router.push(url)
    }
  },
  created () {
    if (!this.payrollHelp || this.payrollHelp.length < 1) {
      this.$store.dispatch("getPayrollHelp")
    }
  }
}
</script>