<template>
  <div class="home">
    <div class="home__containerLogin text-center">
    <PasswordReset v-if="showPasswordReset" @close="togglePasswordReset()"></PasswordReset>
        <img src="https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/MVPTriangleText.svg?alt=media&token=518da9ea-28e1-4f7c-9d89-fc13c303c62b" alt="" class="login-logo">
      <div :class="{ 'signup-form': !showLoginForm }" class="col2">
        <form v-if="showLoginForm" @submit.prevent>
          <h1>Welcome Back</h1>
          <div>
            <label for="email1">Email</label>
            <input v-model.trim="loginForm.email" type="text" placeholder="you@email.com" id="email1" />
          </div>
          <div>
            <label for="password1">Password</label>
            <input v-model.trim="loginForm.password" type="password" placeholder="******" id="password1" />
          </div>
          <button @click="login()" class="button">Log In</button>
          <div class="extras">
            <a @click="togglePasswordReset()">Forgot Password</a>
            <a @click="toggleForm()">Create an Account</a>
          </div>
        </form>
        <form v-else @submit.prevent>
          <h1>Get Started</h1>\
          <div>
            <label for="firstname">First Name</label>
            <input v-model.trim="signupForm.firstname" type="text" placeholder="Savvy Apps" id="firstname" />
          </div>
          <div>
            <label for="lastname">Last Name</label>
            <input v-model.trim="signupForm.lastname" type="text" placeholder="Savvy Apps" id="lastname" />
          </div>
          <div>
            <label for="title">Title</label>
            <input v-model.trim="signupForm.title" type="text" placeholder="Company" id="title" />
          </div>
          <div>
            <label for="email2">Email</label>
            <input v-model.trim="signupForm.email" type="text" placeholder="you@email.com" id="email2" />
          </div>
          <div>
            <label for="password2">Password</label>
            <input v-model.trim="signupForm.password" type="password" placeholder="min 6 characters" id="password2" />
          </div>
          <button @click="signup()" class="button">Sign Up</button>
          <div class="extras">
            <a @click="toggleForm()">Back to Log In</a>
          </div>
        </form>
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
        title: '',
        email: '',
        password: ''
      },
      showLoginForm: true,
      showPasswordReset: false
    }
  },
  methods: {
    toggleForm() {
      this.showLoginForm = !this.showLoginForm
    },
    togglePasswordReset() {
      this.showPasswordReset = !this.showPasswordReset
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
        lastName: this.signupForm.lastname,
        title: this.signupForm.title
      })
    }
  }
}
</script>