<template>
  <header>
    <div class="nav">
      <div class="nav__container">
        <div class="nav__logo">
          <router-link to="/dashboard">
            <SVG_TriangleLogo />
            MVP ADMIN
          </router-link>
        </div>
        <div class="nav__menu">
          <!-- <div class="nav__menu--item desktop">
            <router-link :to="{name: 'dashboard'}">Dashboard</router-link>
          </div> -->
          <!-- <div class="nav__menu--item desktop">
            <router-link :to="{name: 'profile'}">Profile</router-link>
          </div> -->
          <!-- <div class="nav__menu--item desktop">
            <a @click="logout()">logout</a>
          </div> -->
          <!-- <div class="nav__menu--item desktop">
            <img :src="pic" alt="" class="avatar">
          </div> -->
          <div class="nav__menu--item desktop">
            <router-link :to="{name: 'clients'}">
              clients
            </router-link>
          </div>
          <div class="nav__menu--item desktop">
            <router-link :to="{name: 'events'}">
              events
            </router-link>
          </div>
          <!-- <div class="nav__menu--item desktop">
            <router-link :to="{name: 'series'}">
              series
            </router-link>
          </div> -->
          <div class="nav__menu--item desktop">
            <router-link :to="{name: 'jobs'}">
              jobs
            </router-link>
          </div>
          <div class="nav__menu--item desktop">
            <router-link :to="{name: 'users'}">
              users
            </router-link>
          </div>
          <div class="nav__menu--item desktop">
            <router-link :to="{name: 'venues'}">
              Venues
            </router-link>
          </div>
          <div class="nav__menu--item desktop">
            <router-link :to="{name: 'placements'}">
              placements
            </router-link>
          </div>
          <!-- <div class="nav__menu--item">
            <router-link :to="{name: 'eventplacements'}">
              placements by event
            </router-link>
          </div> -->
          <div class="nav__menu--item desktop">
            <router-link :to="{name: 'shifts'}">
              timesheets
            </router-link>
          </div>
          <div class="nav__menu--item desktop">
            <router-link :to="{name: 'faqs'}">
              faqs
            </router-link>
          </div>
          <div class="nav__menu--item desktop">
            <a @click="logout()">logout</a>
          </div>
          <div class="nav__menu--item mobile">
            <a @click="showSideNav()">
              <i class="fal fa-bars fa-2x" v-show="!showSide"></i>
              <i class="fal fa-times fa-2x" v-show="showSide"></i>
            </a>
          </div>

          
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div class="sideNav" v-show="showSide">
        <div class="nav__menu--item justify-flex-end pr-5">
            <a @click="showSideNav()">
              <i class="fal fa-times fa-2x" v-show="showSide"></i>
            </a>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'dashboard'}">Dashboard</router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'clients'}">
              clients
            </router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'events'}">
              events
            </router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'jobs'}">
              jobs
            </router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'users'}">
              users
            </router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'venues'}">
              Venues
            </router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'placements'}">
              placements
            </router-link>
          </div>
          <!-- <div class="nav__menu--item">
            <router-link :to="{name: 'eventplacements'}">
              placements by event
            </router-link>
          </div> -->
          <div class="nav__menu--item">
            <router-link :to="{name: 'shifts'}">
              timesheets
            </router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'faqs'}">
              faqs
            </router-link>
          </div>
          <div class="nav__menu--item">
            <a @click="logout()">logout</a>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script>
import SVG_TriangleLogo from '@/assets/svgs/SVG_TriangleLogo.vue'

export default {
  props: ['userProfile'],
  data: () => ({
    showSide: false,
  }),
  computed: {
    pic () {
      return this.userProfile.photoUrl || 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/avatar%20copy.png?alt=media&token=966c07c4-125a-490f-81be-4e2d26bf33fa'
    }
  },
  watch:{
    $route (to, from){
      this.showSide = false
    }
  },
  components: {
    SVG_TriangleLogo
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
    showSideNav() {
      this.showSide = !this.showSide
    }
  }
}
</script>