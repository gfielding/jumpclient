<template>
    <div class="sideNav">
      <div class="sideNav__container">
        <div class="sideNav__menu">
          <!-- <div class="sideNav__menu--item">
            <router-link :to="{name: 'dashboard'}">Dashboard</router-link>
          </div> -->
          <!-- <div class="sideNav__menu--item">
            <router-link :to="{name: 'profile'}">Profile</router-link>
          </div> -->
          <!-- <div class="sideNav__menu--item">
            <a @click="logout()">logout</a>
          </div> -->
          <!-- <div class="sideNav__menu--item">
            <img :src="pic" alt="" class="avatar">
          </div> -->
          <div class="nav__menu--item">
            <div class="nav__logo">
              <router-link to="/dashboard" style="width:100%;">
                <span style="text-transform: none; font-size: 3.6rem;
    font-weight: 300;">J<em>u</em>mp</span>
              </router-link>
            </div>
            
          </div>

          
          <div class="nav__menu--item">
            <router-link :to="{name: 'users'}">
              users <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div class="nav__menu--item">
            <router-link :to="{name: 'events'}">
              events <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <!-- <div class="nav__menu--item">
            <router-link :to="{name: 'weeks'}">
              jobs <i class="fas fa-chevron-right"></i>
            </router-link>
          </div> -->
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
            <router-link :to="{name: 'evereeContractors'}">
              Contractors <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>

          <div class="nav__menu--item">
            <router-link :to="{name: 'clients'}">
              Customers <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>

          <div class="nav__menu--item">
            <router-link :to="{name: 'contacts'}">
              Contacts <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>


   <!--        <div class="nav__menu--item dropdown">
            <span>Customers</span>
            <div class="dropdown-content">
              <div class="mb-3">
                
              </div>
              <div class="mb-3">
                <router-link :to="{name: 'contacts'}">
                  leads <i class="fas fa-chevron-right"></i>
                </router-link>
              </div>
              <div class="mb-3">
                <router-link :to="{name: 'clientAccess'}">
                  client portal access <i class="fas fa-chevron-right"></i>
                </router-link>
              </div>
            </div>
          </div>
 -->
          <div class="nav__menu--item">
            <router-link :to="{name: 'leadsHome'}">
              Marketing Leads <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
<!--           <div class="nav__menu--item dropdown">
            <span>Marketing</span>
            <div class="dropdown-content">
              <div class="mb-3">
                <router-link :to="{name: 'leadsHome'}">
                  Leads <i class="fas fa-chevron-right"></i>
                </router-link>
              </div>
             <div class="mb-3">
                <router-link :to="{name: 'markets'}">
                  Markets <i class="fas fa-chevron-right"></i>
                </router-link>
              </div>
              <div class="mb-3">
                <router-link :to="{name: 'enterNewLead'}">
                  Add New Lead <i class="fas fa-chevron-right"></i>
                </router-link>
              </div>
            </div>
          </div> -->
          <!-- <div class="nav__menu--item">
            <router-link :to="{name: 'shiftLeads'}">
              Shift Leads <i class="fas fa-chevron-right"></i>
            </router-link>
          </div> -->
         
          
          
        
          

          <div class="nav__menu--item">
            <router-link :to="{name: 'team'}">
              company roster<i class="fas fa-chevron-right"></i>
            </router-link>
          </div>

          <div class="nav__menu--item">
            <router-link :to="{name: 'reportsHome'}">
              reports <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          

          
         
          
          <!-- <div class="nav__menu--item dropdown">
            <span>App Text</span>
            <div class="dropdown-content">
              <div class="mb-3">
                <router-link :to="{name: 'tags'}">
                  tags <i class="fas fa-chevron-right"></i>
                </router-link>
              </div>
              <div class="mb-3">
                <router-link :to="{name: 'faqs'}">
                  faqs <i class="fas fa-chevron-right"></i>
                </router-link>
              </div>
              <div class="mb-3">
                <router-link :to="{name: 'jobs'}">
                  jobs <i class="fas fa-chevron-right"></i>
                </router-link>
              </div>
              <div class="mb-3">
                <router-link :to="{name: 'pageText'}">
                  Page Text <i class="fas fa-chevron-right"></i>
                </router-link>
              </div>
            </div>
          </div> -->
          <!-- <div class="nav__menu--item dropdown">
            <span>Internal Documents</span>
            <div class="dropdown-content">
              <div class="mb-3">
                <router-link :to="{name: 'internalDocuments'}">
                  Internal Documents <i class="fas fa-chevron-right"></i>
                </router-link>
              </div>
            </div>
          </div> -->
         <!--  <div class="nav__menu--item">
            <router-link :to="{name: 'reportsHome'}">
              Reports <i class="fas fa-chevron-right"></i>
            </router-link>
          </div> -->

          
          
          <!-- <div class="nav__menu--item">
            <router-link :to="{name: 'verifications'}">
              verifications <i class="fas fa-chevron-right"></i>
            </router-link>
          </div> -->
          <!-- <div class="nav__menu--item dropdown">
            <span>Accounting</span>
            <div class="dropdown-content">
              <div class="mb-3">
                <router-link :to="{name: 'allPayroll'}">
                  payroll <i class="fas fa-chevron-right"></i>
                </router-link>
              </div>
           
            </div>
          </div> -->

         
          <div class="nav__menu--item">
            <a @click="logout()">logout</a>
          </div>




          
        </div>

      </div>
      <div class="nav__menu--item">
            © Jump Staffing, 2023
          </div>
    </div>
</template>

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