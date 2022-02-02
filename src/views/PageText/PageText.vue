<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <Loader v-if="!pageText" />
      <div class="dashboard__container--header" v-if="pageText">
        <h1>Edit Page Text</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <form ref="form" @submit.prevent>
        <div class="dashboard__container--body">
          <div class="dashboard__container--body--col">
            <h2>About Us</h2>
            <div class="mb-3">
              <vue-editor id="about" v-model="pageText.aboutUs" required></vue-editor>
            </div>
          </div>
          <div class="dashboard__container--body--col">
            <h2>General Inquiries</h2>
            <div class="mb-3">
              <vue-editor id="desc" v-model="pageText.generalInquiries" required></vue-editor>
            </div>
          </div>
          <div class="dashboard__container--body--col">
            <h2>Payroll Department</h2>
            <div class="mb-3">
              <vue-editor id="desc" v-model="pageText.payrollDepartment" required></vue-editor>
            </div>
          </div>
          <div class="dashboard__container--body--col">
            <h2>Staff Support</h2>
            <div class="mb-3">
              <vue-editor id="desc" v-model="pageText.staffSupport" required></vue-editor>
            </div>
          </div>
          <div class="dashboard__container--body--col">
            <h2>Human Resources</h2>
            <div class="mb-3">
              <vue-editor id="desc" v-model="pageText.humanResources" required></vue-editor>
            </div>
          </div>
        </div>
        <div class="flex justify-space-between mt-2">
          <button class="btn btn__primary" @click="updatePageText()">Update</button>
        </div>
      </form>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import { VueEditor } from "vue2-editor";
import router from '@/router'

export default {
  name: 'pageText',
  computed: {
    ...mapState(['pageText']),
  },
  created () {
    this.$store.dispatch("getPageText");
  },
   components: {
    Loader,
    VueEditor
  },
  methods: {
    updatePageText() {
      let pageText = this.pageText
      this.$store.dispatch('updatePageText', pageText)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearPageText')
    this.$store.dispatch('clearErrors')
  }
}
</script>