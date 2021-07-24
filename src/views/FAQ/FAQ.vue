<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <Loader v-if="!faq" />
      <div class="dashboard__container--header" v-if="faq">
        <h1>Edit FAQ</h1>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <div class="dashboard__container--body">
        <div class="dashboard__container--body--col">
          <form ref="form" @submit.prevent>
            <div class="mb-3">
              <label for="title">Question:</label>
              <input type="text" v-model.trim="faq.question" id="title" />
            </div>
            <div class="mb-3">
              <label for="desc">answer:</label>
              <vue-editor id="desc" v-model="faq.answer" required></vue-editor>
            </div>
            <div class="flex justify-space-between mt-2">
              <button class="btn btn__primary" @click="updateFaq()">Update</button>
              <button class="btn btn__dark" @click="deleteFaq()">delete</button>
            </div>
          </form>
        </div>
      </div>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import { VueEditor } from "vue2-editor";
import router from '@/router'

export default {
  name: 'faq',
  computed: {
    ...mapState(['faqInfo']),
    faq() {
      return this.faqInfo
    }
  },
  created () {
    this.$store.dispatch("getFaqFromId", this.$route.params.id);
  },
   components: {
    Loader,
    VueEditor
  },
  methods: {
    updateFaq() {
      let faq = this.faq
      this.$store.dispatch('updateFaq', faq)
      let url = `/faqs`
      router.push(url)
    },
    deleteFaq() {
      let faq = this.faqInfo
      this.$store.dispatch('deleteFaq', faq.id)
      let url = `/faqs`
      router.push(url)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearFaqState')
    this.$store.dispatch('clearErrors')
  }
}
</script>
