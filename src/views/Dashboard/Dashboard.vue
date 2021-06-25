<template>
  <div>
    <router-view :key="$route.params.id" />
  </div>
</template>

<script>

export default {
  name: 'dashboard',
}
</script>

<style lang="scss" scoped>

</style>