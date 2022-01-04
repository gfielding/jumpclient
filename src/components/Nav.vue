<template>
  <header>
    <div class="nav hidden-large">
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
   <!--        <div class="nav__menu--item desktop">
            
          </div>
          <div class="nav__menu--item desktop dropdown">
            <span>Sales</span>
            <div class="dropdown-content">
              <div class="mb-3">
                <router-link :to="{name: 'clients'}">
                  clients
                </router-link>
              </div>
              <div class="mb-3">
                <router-link :to="{name: 'contacts'}">
                  contacts
                </router-link>
              </div>
            </div>
          </div>
          <div class="nav__menu--item desktop dropdown">
            <span>Accounting</span>
            <div class="dropdown-content">
              <div class="mb-3">
                <router-link :to="{name: 'accountingEvents'}">
                  Event Accounting
                </router-link>
              </div>
              <div class="mb-3">
                <router-link :to="{name: 'payrollHelp'}">
                  Payroll Help
                </router-link>
              </div>
              <div class="mb-3">
                <router-link :to="{name: 'shifts'}">
                  timesheets
                </router-link>
              </div>
            </div>
          </div>
          <div class="nav__menu--item desktop dropdown">
            <span>HR</span>
            <div class="dropdown-content">
              <div class="mb-3">
                <router-link :to="{name: 'team'}">
                  directory
                </router-link>
              </div>
              <div class="mb-3">
                <router-link :to="{name: 'opr'}">
                  opr
                </router-link>
              </div>
            </div>
          </div>
          <div class="nav__menu--item desktop dropdown">
            <span>Staff</span>
            <div class="dropdown-content">
              <div class="mb-3">
                <router-link :to="{name: 'users'}">
                  users
                </router-link>
              </div>
              <div class="mb-3">
                <router-link :to="{name: 'groups'}">
                  groups
                </router-link>
              </div>
            </div>
          </div>
          <div class="nav__menu--item desktop dropdown">
            <span>Settings</span>
            <div class="dropdown-content">
              <div class="mb-3">
                <router-link :to="{name: 'jobs'}">
                  jobs
                </router-link>
              </div>
              <div class="mb-3">
                <router-link :to="{name: 'faqs'}">
                  faqs
                </router-link>
              </div>
            </div>
          </div>

          <div class="nav__menu--item desktop">
            <router-link :to="{name: 'events'}">
              events
            </router-link>
          </div>


          <div class="nav__menu--item desktop">
            <router-link :to="{name: 'venues'}">
              Venues
            </router-link>
          </div>
          <div class="nav__menu--item desktop">
            <router-link :to="{name: 'placementshome'}">
              placements
            </router-link>
          </div>
         
          <div class="nav__menu--item desktop">
            <a @click="logout()">logout</a>
          </div> -->
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
      <div class="sideNav" v-show="showSide" style="right:0; top:0; position: fixed; z-index: 999; justify-content: flex-start; padding-top:1rem;">
        <div class="nav__menu--item justify-flex-end">
            <a @click="showSideNav()" style="width:100%; justify-content: flex-end !important;">
              <i class="fal fa-times fa-2x" v-show="showSide"></i>
            </a>
          </div>
         

          <div class="nav__menu--item">
            <router-link :to="{name: 'events'}">
              events <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'placementshome'}">
              placements <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'users'}">
              users <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'groups'}">
              groups <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'venues'}">
              Venues <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'team'}">
              company <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          
        
          <div class="nav__menu--item">
            <router-link :to="{name: 'clients'}">
              clients <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'contacts'}">
              contacts <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>

          
         
          
          

          <div class="nav__menu--item">
            <router-link :to="{name: 'faqs'}">
              faqs <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'jobs'}">
              jobs <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>

          
          <!-- <div class="nav__menu--item">
            <router-link :to="{name: 'series'}">
              series
            </router-link>
          </div> -->

          <div class="nav__menu--item">
            <router-link :to="{name: 'userReports'}">
              Reports <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>

          
          
          <div class="nav__menu--item">
            <router-link :to="{name: 'opr'}">
              opr <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div class="nav__menu--item dropdown">
            <span>Accounting</span>
            <div class="dropdown-content">
              <div class="mb-3">
                <router-link :to="{name: 'accountingEvents'}">
                  Event Accounting <i class="fas fa-chevron-right"></i>
                </router-link>
              </div>
              <div class="mb-3">
                <router-link :to="{name: 'payrollHelp'}">
                  Payroll Help <i class="fas fa-chevron-right"></i>
                </router-link>
              </div>
              <div class="mb-3">
                <router-link :to="{name: 'shifts'}">
                  timesheets <i class="fas fa-chevron-right"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
  .dropdown {
  position: relative;
  display: inline-block;
  color: #d0d0d0;
  transition: 0.2s ease all;
}

.dropdown-content {
  display: none;
  position: relative;
  background-color: #212121;
  width:96%;
  transition: 0.2s ease all;
}
.dropdown:hover .dropdown-content {
  display: block;
  padding-top: 1rem;
  transition: 0.2s ease all;
}
</style>

<script>
import SVG_TriangleLogo from '@/assets/svgs/SVG_TriangleLogo.vue'

export default {
  props: ['userProfile'],
  data: () => ({
    showSide: false,
    accDrop: false,
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