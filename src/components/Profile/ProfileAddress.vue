<template>
	<div class="whiteBack">
    <h4 class="mb-2">Address</h4>
    
      <div v-if="user.address && Object.keys(user.address).length >= 1">
      <div class="caption bold">{{user.firstName}} {{user.lastName}}</div>
        <div class="caption">{{user.address.street_number}} {{user.address.street}} <span v-if="user.address.unit">#{{user.address.unit}}</span><br />{{user.address.city}}, {{user.address.state}} {{user.address.zip}}</div>
      </div>

	</div>
</template>

<script>
export default {
  props: ['user'],
}
</script>