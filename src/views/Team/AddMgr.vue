<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Add Manager</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <form ref="form" @submit.prevent>
        <div class="dashboard__container--body">
          <div class="dashboard__container--body--col">
            <div>
            <div class="mb-3">
              <label for="title">Name:</label>
              <input type="text" v-model.trim="mgr.name" id="title" />
            </div>
            <div class="mb-3">
            <label>Location</label>
              <input type="text" v-model.trim="mgr.location" id="title" />
            </div>
            <div class="mb-3">
              <div class="flex align-center justify-space-between">
                <label for="phone">Cell Phone:</label>
              </div>
              <input type="phone" placeholder="" v-model.trim="mgr.phone" v-mask="'(###) ###-####'" placeholder="(999) 999-9999" id="phone" />
            </div>
            <div class="mb-3">
              <div class="flex align-center justify-space-between">
                <label for="phone">Email:</label>
              </div>
              <input type="email" autocomplete="email" placeholder="" v-model.trim="mgr.email" id="email" />
            </div>
            <div class="mb-3">
            <label for="mgrs">Department:</label>
            <select v-model="mgr.dpt" id="client">
              <option v-for="d in departments">
                {{d}}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <div class="flex align-center justify-space-between">
              <label for="title">Title:</label>
            </div>
            <input type="text" placeholder="" v-model.trim="mgr.title" id="title" />
          </div>
            <button class="btn btn__primary mt-2" @click="addMgr()">
              Add Manager
              <transition name="fade">
                <span class="ml-2" v-if="performingRequest">
                <i class="fa fa-spinner fa-spin"></i>
                </span>
              </transition>
            </button>
          </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'

export default {
  name: 'addmgr',
  data: () => ({
    croppa: {},
    mgr: {},
    performingRequest:false,
    departments: ['Staffing', 'Support', 'Payroll', 'Accounting', 'HR', 'Operations']
  }),
  methods: {
    
    addMgr() {
      this.performingRequest = true
      let mgr = this.mgr
      let store = this.$store
      store.dispatch('addMgr', mgr)
      setTimeout(() => {
        let url = `/team`
        router.push(url)
        this.performingRequest = false
      }, 1000)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.performingRequest = false
    delete this.performingRequest
    delete this.mgr
    this.$store.dispatch('clearErrors')
  }
}
</script>