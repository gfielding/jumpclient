<template>
	<div>
    <h2 class="mb-3">Address</h2>
    
      <div v-if="user.address && Object.keys(user.address).length >= 1">
      <div class="caption bold">Current Address:</div>
        <div class="caption">{{user.address.street_number}} {{user.address.street}} <span v-if="user.address.unit">#{{user.address.unit}}</span><br />{{user.address.city}}, {{user.address.state}} {{user.address.zip}}</div>
  <!--       <hr> -->
        <!-- <div class="mb-2 mt-3">Change your address below:</div> -->

      </div>
      <!-- <div v-if="!userProfile.address || Object.keys(userProfile.address).length === 0">
        <div>Please enter your address below:</div>
      </div>

      <label>
        <gmap-autocomplete
          @place_changed="setPlace" placeholder="Address">
        </gmap-autocomplete>
      </label> -->

	</div>
</template>

<script>
export default {
  props: ['user'],
  methods: {
   
  },
  beforeDestroy () {
    this.$store.dispatch('clearUserState')
  	this.$store.dispatch('clearErrors')
  }
}
</script>