<template>
	<div class="home">
		<div class="home__container">
			<img src="https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/MVPTriangleText.svg?alt=media&token=518da9ea-28e1-4f7c-9d89-fc13c303c62b" alt="">
			<router-link :to="{name: 'login'}">
				<button class="btn mt-4 btn__primary">Sign Up / Login</button>
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