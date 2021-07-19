<template>
	<div>
		<div v-for="(day, index) in days">
			<router-link :to="`/placements/` + day">
				{{day | moment("dddd, MMMM Do YYYY") }}
			</router-link>
			
		</div>
	</div>
</template>

<script>
export default {
  props: ['currentUser', 'days'],
};
</script>