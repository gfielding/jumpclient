<template>
	<div class="dashboard__container--body">
		<div class="dashboard__container--body--col">
			<v-select
        class="mt-2"
        label="title" 
        :options="days"
        v-model="selected"
        @input="setSelected" 
        >
      </v-select>
			<!-- <div v-for="(day, index) in days">
				<router-link :to="`/placements/day/` + day">
					{{day | moment("dddd, MMMM Do YYYY") }}
				</router-link>
			</div> -->
		</div>
	</div>
</template>

<style scoped type="text/css">
	
</style>

<script>
import router from '@/router'

export default {
  props: ['currentUser', 'days', 'usersPerDay'],
	data: () => ({
		selected: ''
	}),
	methods: {
  	setSelected(value) {
  		console.log(value)
  		let url = `/placements/day/` + value
  		router.push(url)
  	}
  }
};
</script>