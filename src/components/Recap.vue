<template>
  <div>
   Recap
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'

export default {
  data() {
    return {
      performingRequest: false,
    }
  },
  computed: {
    ...mapState(['myRecaps', 'userProfile']),
  },
  created() {
    this.$store.dispatch("getMyRecaps")
  },
  components: {
    Loader,
  }
}
</script>