<template>
	<div class="home">
		<div class="home__container">
			<h1>j<em>u</em>mp</h1>
			<router-link :to="{name: 'login'}">
				<button class="btn mt-4 btn__ghost">Enter</button>
			</router-link>
		</div>
	</div>
</template>

<style scoped>
	.home__container {
		color:white;
	}
</style>

<script>
// import SVG_TriangleTextLogo from '@/assets/svgs/SVG_TriangleTextLogo.vue'
import { mapState } from 'vuex'
import router from '@/router'

export default {
	name: 'home',
	components: {
		// SVG_TriangleTextLogo
	},
	computed: {
    ...mapState(['currentUser']),
  },
	mounted () {
		if (this.currentUser) {
			this.$router.push('/dashboard')
		}
  }
}
</script>