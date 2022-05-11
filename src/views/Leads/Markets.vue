<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Markets</h1>
        <!-- <router-link :to="{name: 'addjob'}" class="color--text">
          <button class="btn btn__flat"><i class="fas fa-plus fa-2x"></i></button>
        </router-link> -->
      </div>
      <div class="dashboard__container--body pt-3">
      	<div class="dashboard__container--body--col">
          <form ref="form">
            <div class="mb-3">
              <label for="city">Market City:</label>
              <input type="text" v-model.trim="market.city" id="city" />
            </div>
            <div class="mb-3">
              <label for="state">Market State:</label>
              <input type="text" v-model.trim="market.state" id="state" />
            </div>
           <!--  <div class="mb-3">
              <label for="desc">Job Description:</label>
              <textarea name="desc" id="desc" cols="30" rows="10" v-model="job.description"></textarea>
            </div> -->
            <div class="flex justify-space-between mt-2">
              <button class="btn btn__primary" @click.prevent="addMarket()">Add Market</button>
            </div>
          </form>
        </div>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!markets || markets.length == 0 || performingRequest" />
        <div class="flex pt-3" v-if="markets && markets.length >= 1" style="width:100%;">
          <vue-good-table
            :columns="columns"
            :rows="markets"
            :pagination-options="{
              enabled: false,
              mode: 'records',
              perPage: 20,
            }"
          >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'city'">
              <span v-if="props.row.city">{{props.row.city}}</span>
            </span>
            <span v-else-if="props.column.field == 'state'">
              <span v-if="props.row.state">{{props.row.state}}</span>
            </span>
            <span v-else-if="props.column.field == 'managers'">
              <v-select
                label="name" 
                :options="mgrs"
                multiple
                v-model="props.row.mgrs"
                @input="updateMgrs(props.row)"
                >
              </v-select>
            </span>
            <span v-else-if="props.column.field == 'request'">
            	<button v-if="!props.row.request" class="ma-2 btn btn__small btn__flat" @click="request(props.row)">Request</button>
            	<button v-tooltip="'cancel'" v-if="props.row.request" class="ma-2 btn btn__small btn__success" @click="cancelRequest(props.row)">Requested</button>
            </span>
            <span v-else-if="props.column.field == 'indeed'">
            	<button v-if="!props.row.indeed" class="ma-2 btn btn__small btn__flat" @click="indeed(props.row)">Inactive</button>
            	<button v-tooltip="'cancel'" v-if="props.row.indeed" class="ma-2 btn btn__small btn__success" @click="cancelIndeed(props.row)">Active</button>
            </span>
            <span v-else-if="props.column.field == 'facebook'">
            	<button v-if="!props.row.facebook" class="ma-2 btn btn__small btn__flat" @click="facebook(props.row)">Inactive</button>
            	<button v-tooltip="'cancel'" v-if="props.row.facebook" class="ma-2 btn btn__small btn__success" @click="cancelFacebook(props.row)">Active</button>
            </span>
            <span v-else-if="props.column.field == 'linkedIn'">
            	<button v-if="!props.row.linkedIn" class="ma-2 btn btn__small btn__flat" @click="linkedIn(props.row)">Inactive</button>
            	<button v-tooltip="'cancel'" v-if="props.row.linkedIn" class="ma-2 btn btn__small btn__success" @click="cancelLinkedIn(props.row)">Active</button>
            </span>
            <span v-else-if="props.column.field == 'craigslist'">
            	<button v-if="!props.row.craigslist" class="ma-2 btn btn__small btn__flat" @click="craigslist(props.row)">Inactive</button>
            	<button v-tooltip="'cancel'" v-if="props.row.craigslist" class="ma-2 btn btn__small btn__success" @click="cancelCraigslist(props.row)">Active</button>
            </span>
            <span v-else-if="props.column.field == 'other'">
            	<button v-if="!props.row.other" class="ma-2 btn btn__small btn__flat" @click="other(props.row)">Inactive</button>
            	<button v-tooltip="'cancel'" v-if="props.row.other" class="ma-2 btn btn__small btn__success" @click="cancelOther(props.row)">Active</button>
            </span>
            <!-- <span v-else-if="props.column.field == 'link'">
              <router-link :to="`/users/` + props.row.id" target="_blank">
                <i class="fas fa-external-link ml-3 mr-3"></i>
              </router-link>
            </span>
            <span v-else-if="props.column.field == 'delete'">
              <button class="btn btn__icon" v-tooltip="'delete'" @click="removeEntry(props.row)">
                <i class="fas fa-times ml-3 mr-2"></i>
              </button>
            </span> -->
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
const fb = require('../../firebaseConfig.js')

export default {
  name: 'markets',
  data: () => ({
    market: {},
    performingRequest: false,
    columns: [
    	{
        label: 'Request Leads',
        field: 'request',
        width: '110px',
      },
      {
        label: 'City',
        field: 'city',
      },
      {
        label: 'State',
        field: 'state',
      },
      {
        label: 'Assign',
        field: 'managers',
        width: '320px',
      },
      {
        label: 'Indeed',
        field: 'indeed',
      },
      {
        label: 'LinkedIn',
        field: 'linkedIn',
      },
      {
        label: 'Facebook',
        field: 'facebook',
      },
      {
        label: 'Craigslist',
        field: 'craigslist',
      },
      {
        label: 'Other',
        field: 'other',
      },
    ]
  }),
  computed: {
    ...mapState(['markets', 'mgrs']),
  },
  components: {
    Loader,
  },
  created () {
    if (!this.markets || this.markets.length < 1) {
      this.$store.dispatch("getMarketsState")
    }
    if (!this.mgrs || this.mgrs.length < 1) {
      this.$store.dispatch("getMgrsState")
    }
  },
  methods: {
  	request(row) {
  		console.log(row)
  		fb.marketsCollection.doc(row.id).update({
  			request: true
  		})
  	},
  	cancelRequest(row) {
			fb.marketsCollection.doc(row.id).update({
  			request: false
  		})
  	},
  	indeed(row) {
  		fb.marketsCollection.doc(row.id).update({
  			indeed: true
  		})
  	},
  	cancelIndeed(row) {
			fb.marketsCollection.doc(row.id).update({
  			indeed: false
  		})
  	},
  	facebook(row) {
  		fb.marketsCollection.doc(row.id).update({
  			facebook: true
  		})
  	},
  	cancelFacebook(row) {
			fb.marketsCollection.doc(row.id).update({
  			facebook: false
  		})
  	},
  	linkedIn(row) {
  		fb.marketsCollection.doc(row.id).update({
  			linkedIn: true
  		})
  	},
  	cancelLinkedIn(row) {
			fb.marketsCollection.doc(row.id).update({
  			linkedIn: false
  		})
  	},
  	other(row) {
  		fb.marketsCollection.doc(row.id).update({
  			other: true
  		})
  	},
  	cancelOther(row) {
			fb.marketsCollection.doc(row.id).update({
  			other: false
  		})
  	},
  	craigslist(row) {
  		fb.marketsCollection.doc(row.id).update({
  			craigslist: true
  		})
  	},
  	cancelCraigslist(row) {
			fb.marketsCollection.doc(row.id).update({
  			craigslist: false
  		})
  	},
  	updateMgrs(row) {
  		fb.marketsCollection.doc(row.id).update(row)
  	},
  	addMarket() {
  		this.performingRequest = true
  		let store = this.$store
      store.dispatch('addMarket', this.market)
  		// fb.marketsCollection.add(this.market)
  		setTimeout(() => {
        this.performingRequest = false
        this.market = {}
      }, 1000)
  	}
    // onRowClick(params) {
    //   let url = `/jobs/` + params.row.id
    //   console.log(url)
    //   router.push(url)
    // }
	},
  beforeDestroy () {
  	// this.$store.dispatch('clearMgrsState')
   //  this.$store.dispatch('clearMarketsState')
  }
}
</script>