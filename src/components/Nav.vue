<template>
  <header>
    <div class="nav">
      <div class="nav__container">
        <div class="nav__logo">
          <router-link to="/">
            <SVG_TriangleLogo />
            MVP Event Staffing
          </router-link>
        </div>
        <div class="nav__menu">
          <div class="nav__menu--item">
            <router-link :to="{name: 'dashboard'}">Dashboard</router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'profile'}">Profile</router-link>
          </div>
          <div class="nav__menu--item">
            <a @click="logout()">logout</a>
          </div>
          <div class="nav__menu--item">
            <img :src="pic" alt="" class="avatar">
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import SVG_TriangleLogo from '@/assets/svgs/SVG_TriangleLogo.vue'

export default {
  props: ['userProfile'],
  computed: {
    pic () {
      return this.userProfile.photoUrl || 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/avatar%20copy.png?alt=media&token=966c07c4-125a-490f-81be-4e2d26bf33fa'
    }
  },
  components: {
    SVG_TriangleLogo
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>