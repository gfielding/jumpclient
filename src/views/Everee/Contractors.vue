<template>
  <div class="dashboard">
    <Loader v-if="!evereeContractors || !Array.isArray(evereeContractors)" />
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Everee Contractors</h1>
      </div>
      <!-- <button @click="updateAccounts()">Update Users</button> -->
      <button @click="updateWorkerIds()">Update Ids</button>
      <div class="dashboard__container--body">
        
        <div v-if="evereeContractors && evereeContractors.length >= 1" class="mb-5 w100">
        <vue-good-table
          :columns="columns"
          :rows="evereeContractors"
           styleClass="vgt-table condensed"
          :search-options="{
            enabled: true,
            placeholder: 'Search this table',
          }"
          :pagination-options="{
            enabled: true,
            mode: 'records',
            perPage: 25,
          }"
          @on-row-click="onRowClick"
          
        >
        <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'bankAccounts'">
              <span v-if="props.row.bankAccounts && props.row.bankAccounts[0]">{{props.row.bankAccounts[0].bankName}}</span>
            </span>
<!--             <span v-else-if="props.column.field == 'depositsAmount'">
              <span v-if="props.row.deposits">{{props.row.deposits[0].amount.amount}}</span>
            </span> -->

            
            <span v-else>
              {{props.formattedRow[props.column.field]}}
            </span>
          </template>
      </vue-good-table>
      </div>

       <!--  <iframe v-if="iframaData && (iframaData != null)" 
          :src="iframaData" 
          >
        </iframe> -->
      </div>
    </div>
  </div>
</template>


<script>
import firebase from 'firebase/app';
import { mapState } from 'vuex'
import router from '@/router'
import Loader from '@/components/Loader.vue'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'evereeContractors',
  data: () => ({ 
    columns: [
      {
        label: 'First Name',
        field: 'firstName',
      },
      {
        label: 'Last Name',
        field: 'lastName',
      },
      {
        label: 'Email',
        field: 'email',
      },
      {
        label: 'Employment Type',
        field: 'employmentType',
      },
      {
        label: 'Onboarding Status',
        field: 'onboardingStatus',
      },
      {
        label: 'Bank Name',
        field: 'bankAccounts',
      },
      {
        label: 'Everee Id',
        field: 'workerId',
      },
      // {
      //   label: 'externalWorkerId',
      //   field: 'externalWorkerId',
      // },

    ]
  }),
  components: {
    Loader,
  },
  created () {
    this.$store.dispatch("getEvereeContractors")
  },
  computed: {
    ...mapState(['currentUser', 'evereeContractors']),
  },
  methods: {
    updateWorkerIds() {
      this.evereeContractors.forEach(contractor => {
        if (contractor.externalWorkerId) {
          fb.usersCollection.doc(contractor.externalWorkerId).update({
            workerId: contractor.workerId
          })
        }
      })
    },
    updateAccounts() {
      let usersArray = []
      this.evereeContractors.forEach(contractor => {
        if (contractor.onboardingComplete) {
          usersArray.push(contractor)
        }
      })
        usersArray.forEach(user => {
          fb.usersCollection.doc(user.externalWorkerId).get()
          .then(doc => {
            if (!doc.data().evereeOnboardingComplete) {
              console.log(doc.data().id)
              fb.usersCollection.doc(doc.data().id)
              .update({
                evereeOnboardingComplete: true
              })
            }
          })

          
        })
    },
    // getEvereeContractors() {
    //   const getEvereeContractors = firebase.functions().httpsCallable('getEvereeContractors')
    //   getEvereeContractors()
    //   .then(result => {
    //     if (result && result.data) {
    //       this.iframaData = result.data.url
    //       console.log(result.data)
    //     }
    //   })
    // },
    onRowClick(params) {
      let url = `/users/` + params.row.externalWorkerId
      router.push(url)
    },
  },
  destroyed() {
    this.$store.dispatch("clearEvereeContractors")
  }
}
</script>