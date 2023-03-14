<template>
  <div class="dashboard__container" v-if="user">
    <div class="dashboard__container--body" v-if="user">

      <!-- <div v-if="workerFiles" class="mb-5 w100">
        <h4>Files</h4>
        {{workerFiles}}
      </div>
      <div v-if="unpaidPayables" class="mb-5 w100">
        <h4>Unpaid Payables</h4>
        {{unpaidPayables}}
      </div> -->
      <div v-if="workerPayHistory && workerPayHistory.items && workerPayHistory.items.length >= 1" class="mb-5 w100">
        <h4 class="mb-2">Pay History</h4>
        <vue-good-table
          :columns="columnsPayHistory"
          :rows="workerPayHistory.items"
           styleClass="vgt-table condensed"
          :search-options="{
            enabled: false,
            placeholder: 'Search this table',
          }"
          :pagination-options="{
            enabled: true,
            mode: 'records',
            perPage: 25,
          }"
          
        >
        <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'payableNotes'">
              <span v-if="props.row.payableNotes">{{props.row.payableNotes[0]}}</span>
            </span>
            <span v-else-if="props.column.field == 'deposits'">
              <span v-if="props.row.deposits">{{props.row.deposits[0].destinationLabel}}</span>
            </span>
            <span v-else-if="props.column.field == 'depositsAmount'">
              <span v-if="props.row.deposits">{{props.row.deposits[0].amount.amount}}</span>
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
import firebase from 'firebase/app';

export default {
  props: ['user'],
  name: 'userPayHistory',
  data: () => ({ 
    iframaData: null,
    columnsPayHistory: [
      {
        label: 'Event/Job',
        field: 'payableNotes',
      },
      {
        label: 'Stub Date',
        field: 'payStubDate',
      },
      {
        label: 'Pay Date',
        field: 'payDate',
      },
      {
        label: 'Gross Earnings',
        field: 'grossEarnings.amount',
      },
      {
        label: 'Net Earnings',
        field: 'netEarnings.amount',
      },
      {
        label: 'Deposited To',
        field: 'deposits',
      },
      {
        label: 'Deposit Amount',
        field: 'depositsAmount',
      },
    ]

  }),
  mounted() {
    
  },
  methods: {
    // retrieveByExternalId() {
    //   const retrieveByExternalId = firebase.functions().httpsCallable('retrieveByExternalId')
    //   retrieveByExternalId({
    //     id: this.$route.params.id
    //   })
    //   .then(result => {
    //     console.log(result.data)
    //   })
    // },

  },
  computed: {
    ...mapState(['currentUser', 'userProfile', 'userContractorPayProfile', 'workerFiles', 'unpaidPayables', 'workerPayHistory']),
  },
  // created () {
  //   this.retrieveByExternalId()
  // },
  components: {
    Loader,
  },
}

</script>