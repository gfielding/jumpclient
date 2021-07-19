<template>
	<div v-if="user.skills && user.skills.length >= 1">
    <button class="chipDark mr-2 mb-2" v-for="(skill, index) in user.skills" :key="index">{{skill.title || skill.name}}</button>
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