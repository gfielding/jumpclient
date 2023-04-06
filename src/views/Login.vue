<template>
  <div class="home">
    <div class="home__containerLogin text-center">
      <div>
        <router-link :to="{name: 'home'}">
         <span style="text-transform: none; font-size: 3.6rem;
    font-weight: 300;">J<em>u</em>mp</span>
        </router-link>
        <transition name="fadeStop">
          <PasswordReset v-if="showPasswordReset" @close="hidePassword()"></PasswordReset>
        </transition>
        <transition name="fadeStop">
          <div :class="{ 'signup-form': !showLoginForm }" v-if="!showPasswordReset">
            <form v-if="showLoginForm" @submit.prevent>
              <h2>Welcome Back</h2>
              <div class="mb-3 mt-2">
                <label for="email1">Email</label>
                <input v-model.trim="loginForm.email" autocomplete="email" type="text" placeholder="you@email.com" id="email1" />
              </div>
              <div class="mb-3">
                <label for="password1">Password</label>
                <input v-model.trim="loginForm.password" autocomplete="current-password" type="password" placeholder="******" id="password1" />
              </div>
              <button @click="login()" class="btn btn__ghost mt-3" :disabled="!valid">Log In</button>
              <div class="extras mt-5">
                <button class="btn btn__small btn__flat" @click="showPassword()">
                  Forgot Password
                </button>
                <!-- <button class="btn btn__small btn__flat" @click="toggleForm()">
                  Create an Account
                </button> -->
              </div>
            </form>
            <form v-else @submit.prevent>
              <h2>Sign Up To Work</h2>
              <div class="mb-3">
                <label for="firstname">First Name</label>
                <input v-model.trim="signupForm.firstname" autocomplete="given-name" type="text" placeholder="" id="firstname" required />
              </div>
              <div class="mb-3">
                <label for="lastname">Last Name</label>
                <input v-model.trim="signupForm.lastname" autocomplete="family-name" type="text" placeholder="" id="lastname" required />
              </div>
              <div class="mb-3">
                <label for="email2">Email</label>
                <input v-model.trim="signupForm.email" autocomplete="email" type="text" placeholder="you@email.com" id="email2" required />
              </div>
              <div class="mb-3">
                <label for="password2">Password</label>
                <input v-model.trim="signupForm.password" autocomplete="new-password" type="password" placeholder="min 6 characters" id="password2" required />
              </div>
              <button @click="signup()" class="btn btn__ghost mt-3" :disabled="!valid2">Sign Up</button>
              <div class="extras mt-5">
                <button class="btn btn__small btn__flat" @click="toggleForm()">
                  I already have an account
                </button>
              </div>
            </form>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import PasswordReset from '@/components/PasswordReset'

export default {
  name: 'login',
  components: {
    PasswordReset
  },
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      signupForm: {
        firstname: '',
        lastname: '',
        email: '',
        password: ''
      },
      showLoginForm: true,
      showPasswordReset: false
    }
  },
  computed: {
    valid() {
      if ((this.loginForm.email.length > 6) && (this.loginForm.password.length > 5)) {
        return true
      }
      else {
        return false
      }
    },
    valid2() {
      if ((this.signupForm.email.length > 6) && (this.signupForm.password.length > 5) && (this.signupForm.firstname.length > 0) && (this.signupForm.firstname.length > 0)) {
        return true
      }
      else {
        return false
      }
    }
  },
  methods: {
    toggleForm() {
      this.showLoginForm = !this.showLoginForm
    },
    showPassword() {
      this.showPasswordReset = true
    },
    hidePassword() {
      this.showPasswordReset = false
    },
    login() {
      this.$store.dispatch('login', {
        email: this.loginForm.email,
        password: this.loginForm.password
      })
    },
    signup() {
      this.$store.dispatch('signup', {
        email: this.signupForm.email,
        password: this.signupForm.password,
        firstName: this.signupForm.firstname,
        lastName: this.signupForm.lastname
      })
    }
  }
}
</script>