<template>
	<div class="home">
		<div class="home__container">
			<SVG_TriangleTextLogo />
			<router-link :to="{name: 'login'}">
				<button class="btn mt-4 btn__outlined">Login</button>
			</router-link>
		</div>
	</div>
</template>

<script>
import SVG_TriangleTextLogo from '@/assets/svgs/SVG_TriangleTextLogo.vue'

export default {
	name: 'home',
	components: {
		SVG_TriangleTextLogo
	}
}
</script>