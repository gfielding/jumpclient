<template>
	<div class="white_back">
		<div id="printMe" class="pa-5">
			<h1>MVP Check-In / Check-Out</h1>
			<h2 v-if="venueInfo">{{venueInfo.title}}</h2>
			<vue-qr v-if="venueInfo" :text="`https://mvpeventstaffing.com/checkinout/` + venueInfo.id" :size="300" style="margin:auto;"></vue-qr>
			<p>Scan this QR code and open the link to sign in and out of your shift</p>
		</div>
		<div>
			<button class="btn ma-2 btn__primary" @click="print()">Print</button>
			<button class="btn ma-2 btn__outlined" @click="goBack">Go Back</button>
		</div>
	</div>
</template>

<style scoped type="text/css">
	.white_back {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: column;
		text-align:center;
		margin: 0 auto;
		height: 100vh;
	}
	#printMe {
		display:flex;
		margin: 0 auto;
		flex-direction: column;
     justify-content:center;
     align-items:center;
	}
	h1 {
		margin-top: 2vh;
		margin-bottom: 1vh;
	}
	h2 {
		margin-bottom: 2vh;
	}
	p {
		margin-top: 2vh;
	}
</style>
<script>
import { mapState } from 'vuex'
import router from '@/router'
import Loader from '@/components/Loader.vue'

export default {
  name: 'venueQR',
  data () {
    return {
      output: null
    }
  },
  computed: {
    ...mapState(['venueInfo'])
  },
  created () {
    this.$store.dispatch("getVenueFromId", this.$route.params.id);
  },
  methods: {
    async print () {
      // Pass the element id here
      await this.$htmlToPaper('printMe');
    },
    goBack() {
	    this.$store.dispatch('clearVenueState')
	    router.go(-1)
	  },
  },

}
</script>