<template>
	<div v-if="user && user.tagline">
    <div class="flex justify-space-between align-center">
      <div class="mb-3">
        <h4 class="mb-2">Tagline</h4>
        <input type="text" placeholder="" v-model.trim="user.tagline" id="tagline" readonly />
      </div>
    </div>
	</div>
</template>

<script>

export default {
  props: ['user'],
}
</script>