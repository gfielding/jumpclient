<template>
  <div class="dashboard__container" v-if="user && backgroundCheck">
    <div class="dashboard__container--body">
      <div class="dashboard__container--body--col">
        <div class="whiteBack">
          <h4 class="mb-3">Background Check Details</h4>
          <div class="mb-1" v-if="backgroundCheck.created">Created: {{formatDate(backgroundCheck.created)}}</div>
          <div class="mb-1" v-if="backgroundCheck.orderedBy">Created By: {{backgroundCheck.orderedBy.firstName}} {{backgroundCheck.orderedBy.lastName}}</div>
          <div class="mb-1" v-if="backgroundCheck.company">Company: {{backgroundCheck.company}}</div>
          <div class="mb-1" v-if="backgroundCheck.type">Type: {{backgroundCheck.type}}</div>
          <div class="mt-3 mb-3">
            <label for="">Status:</label>
            <v-select
              :options="statuses"
              v-model="backgroundCheck.status"
              @input="updateCheck()"
              :clearable="false"
              >
            </v-select>
          </div>
          <div class="mb-3">
            <label for="response">Response:</label>
            <input @input="updateCheck()" type="text" placeholder="" v-model.trim="backgroundCheck.response" id="response" />
          </div>
          <div class="mb-3">
            <label for="notes">Note:</label>
            <textarea name="notes" id="notes" cols="30" rows="6" v-model="backgroundCheck.notes"></textarea>
            <button class="btn btn__primary mt-3" @click="addNote()">
              Update Note
                <transition name="fade">
                  <span class="ml-2" v-if="performingRequest">
                  <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </transition>
             </button>

          </div>
         <!--  <form @submit.prevent>
            <div class="mb-3">
              <label for="company">Company Ordered From:</label>
              <input type="text" placeholder="Checkr, etc" v-model.trim="check.company" id="company" />
            </div>
            <div class="mb-3">
              <label for="type">Order Type:</label>
              <input type="text" placeholder="Checkr, etc" v-model.trim="check.type" id="type" />
            </div>
            <button v-if="check.type && check.company" class="btn btn__primary mt-3" @click="addCheck()">Add Check
              <transition name="fade">
                <span class="ml-2" v-if="performingRequest">
                <i class="fa fa-spinner fa-spin"></i>
                </span>
              </transition>
            </button>
          </form> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import * as moment from 'moment'

export default {
  props: ['user'],
  name: 'backgroundCheck',
  data: () => ({
    performingRequest: false,
    statuses: ['Ordered', 'Cancelled', 'Passed', 'Failed', 'Under Review'],
  }),
  created() {
    this.$store.dispatch('getBackgroundCheck', this.$route.params.ic)
  },
  computed: {
    ...mapState(['currentUser', 'userProfile', 'backgroundCheck']),
  },
  components: {
    Loader,
  },
  methods: {
    updateCheck() {
      this.$store.dispatch('updateCheck', this.backgroundCheck)
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY')
      } else {
        return null
      }
    },
    addNote() {
      this.performingRequest = true
      this.$store.dispatch('updateCheck', this.backgroundCheck)
      setTimeout(() => {
          this.performingRequest = false
      }, 1000)
    }
  },
  destroyed() {
    this.$store.dispatch('clearBackgroundCheck')
  }
}

</script>