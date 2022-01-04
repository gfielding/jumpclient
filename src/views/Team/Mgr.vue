<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <Loader v-if="!mgr" />
      <div class="dashboard__container--header" v-if="mgr">
        <h1>Edit Employee</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <div class="dashboard__container--body">
        <div class="dashboard__container--body--col">
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
          <div class="flex justify-space-between mt-5">
            <button class="btn btn__primary" @click="updateMgr()">Update</button>
            <button class="btn btn__dark" @click="deleteMgr()">delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'mgr',
  data: () => ({
    departments: ['Staffing', 'Support', 'Payroll', 'Accounting', 'HR', 'Operations']
  }),
  computed: {
    ...mapState(['mgrInfo']),
    mgr() {
      return this.mgrInfo
    }
  },
  created () {
    this.$store.dispatch("getMgrFromId", this.$route.params.id);
  },
   components: {
    Loader,
  },
  methods: {
    updateMgr() {
      let mgr = this.mgr
      this.$store.dispatch('updateMgr', mgr)
      let url = `/team`
      router.push(url)
    },
    deleteMgr() {
      let mgr = this.mgrInfo
      this.$store.dispatch('deleteMgr', mgr.id)
      let url = `/team`
      router.push(url)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearMgrState')
    this.$store.dispatch('clearErrors')
  }
}
</script>
