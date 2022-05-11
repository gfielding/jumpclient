<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Enter New Lead</h1>
        <router-link :to="{name: 'marketingLeads'}" class="color--text">
          <button class="btn btn__flat">All Leads</button>
        </router-link>
      </div>
      <div class="dashboard__container--body pt-3">
      	<div class="dashboard__container--body--col">
          <form ref="form">
            <div class="mb-3">
              <label for="first">First Name:</label>
              <input type="text" v-model.trim="lead.first" id="first" />
            </div>
            <div class="mb-3">
              <label for="last">Last Name:</label>
              <input type="text" v-model.trim="lead.last" id="last" />
            </div>
            <div class="mb-3">
			    		<label for="email">Email:</label>
				      <input type="email" v-model.trim="lead.email" id="email" />
				    </div>
				    <div class="mb-3">
				      <label for="phone">Cell Phone:</label>
			        <input type="phone"  placeholder="" v-model.trim="lead.phone" v-mask="'(###) ###-####'" placeholder="(999) 999-9999" id="phone" />
			      </div>
            <div class="mb-3">
              <label for="market">Market:</label>
              <v-select
                label="city" 
                :options="markets"
                v-model="lead.market"
                >
              </v-select>
            </div>
            <div class="mb-3">
              <label for="market">Positions:</label>
              <v-select
                label="title" 
                :options="jobs"
                v-model="lead.jobs"
                multiple
                >
              </v-select>
            </div>
            <div class="mb-3">
              <label for="source">Source:</label>
              <v-select
                label="city" 
                :options="sources"
                v-model="lead.source"
                >
              </v-select>
            </div>
            <div class="flex justify-space-between mt-3">
              <button class="btn btn__primary" @click.prevent="addLead()" :disabled="!valid">
              	Add Lead
              	<transition name="fade">
                  <span class="ml-2" v-if="performingRequest">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'enterNewLead',
  data: () => ({
    lead: {},
    performingRequest: false,
    sources: [
    	'Indeed', 'Facebook', 'LinkedIn', 'Craigslist', 'Other'
    ]
  }),
  computed: {
    ...mapState(['markets', 'userProfile', 'jobs']),
    valid() {
    	if (this.lead.source && this.lead.market && this.lead.first && this.lead.last && (this.lead.phone || this.lead.email)) {
    		return true
    	}
    }
  },
  components: {
    Loader,
  },
  created () {
    if (!this.markets || this.markets.length < 1) {
      this.$store.dispatch("getMarketsState")
    }
    if (!this.jobs || this.jobs.length < 1) {
      this.$store.dispatch("getJobsState")
    }
  },
  methods: {
  	addLead() {
  		this.performingRequest = true
  		let store = this.$store
  		this.lead.addedBy = this.userProfile.firstName + ' ' + this.userProfile.lastName
  		this.lead.status = 'New'
  		this.lead.marketId = this.lead.market.id
      store.dispatch('addLead', this.lead)
  		setTimeout(() => {
        this.performingRequest = false
        this.lead = {}
      }, 1000)
  	}
  }

}
	
</script>