<template>
  <div>
    <button @click="$emit('close')" class="btn btn__small btn__flat">Go Back</button>
    <h2>Reset Password</h2>
    <div v-if="!showSuccess">
      <p>Enter your email to reset your password</p>
      <form @submit.prevent>
        <div class="mb-3 mt-2">
          <input v-model.trim="email" type="email" placeholder="you@email.com" />
        </div>
      </form>
      <p v-if="errorMsg !== ''" class="error">{{ errorMsg }}</p>
      <button @click="resetPassword()" class="btn btn__primary mt-3">Reset</button>
    </div>
    <p v-else>Success! Check your email for a reset link.</p>
  </div>
</template>

<script>
import { auth } from '@/firebaseConfig'
export default {
  data() {
    return {
      email: '',
      showSuccess: false,
      errorMsg: ''
    }
  },
  methods: {
    async resetPassword() {
      this.errorMsg = ''
      try {
        await auth.sendPasswordResetEmail(this.email)
        this.showSuccess = true
      } catch (err) {
        this.errorMsg = err.message
      }
    }
  }
}
</script>