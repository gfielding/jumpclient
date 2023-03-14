<template>
	<div class="whiteBack">
    <h4 class="mb-3">Emergency Contacts</h4>
		<div class="mb-3">
      <label for="name1">Emergency Contact Name:</label>
      <input type="text" placeholder="Spouse, friend, etc." v-model.trim="user.emergency1name" id="name1" readonly />
    </div>
    <div class="mb-3">
      <label for="phone1">Emergency Contact Cell Phone:</label>
      <input type="phone1" placeholder="" v-model.trim="user.emergency1phone" v-mask="'(###) ###-####'" placeholder="(999) 999-9999" id="phone" readonly />
    </div>
    <div class="mb-3">
      <label for="name2">Emergency Contact Name:</label>
      <input type="text" placeholder="Spouse, friend, etc." v-model.trim="user.emergency2name" id="name2" readonly />
    </div>
    <div class="mb-3">
      <label for="phone2">Emergency Contact Cell Phone:</label>
      <input type="phone2" placeholder="" v-model.trim="user.emergency2phone" v-mask="'(###) ###-####'" placeholder="(999) 999-9999" id="phone" readonly />
    </div>
	</div>
</template>

<script>
export default {
  props: ['user'],
}
</script>