<template>
	<div class="dashboard__container--body">
		<div class="dashboard__container--body--col">
			<div v-for="(day, index) in days">
				<router-link :to="`/placements/` + day">
					{{day | moment("dddd, MMMM Do YYYY") }}
				</router-link>
			</div>
		</div>
	</div>
</template>

<style scoped type="text/css">
	
</style>

<script>
export default {
  props: ['currentUser', 'days', 'usersPerDay'],
};
</script>