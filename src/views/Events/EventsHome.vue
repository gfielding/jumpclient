<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <!-- <Loader v-if="!events" /> -->
      <div class="dashboard__container--header">
        <h1>Events Home</h1>

        <span class="flex align-center">
          <!-- <router-link to="/eventshome/2022-02">
            <button class="btn  ml-3">Feb</button>
          </router-link> -->
          <button class="btn  ml-3" @click="prev">prev</button>
          <div class="mb-3">
            <label for="status">Choose Month:</label>
            <v-select
              class="mt-2"
              label="title" 
              :clearable=false
              :options="months"
              v-model="activeMonth"
              @input="setSelected"
              >
            </v-select>
          </div>
          <button class="btn  ml-3" @click="next">Next</button>
        </span>
        
      </div>
      <router-view :key="$route.params.id" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'eventsHome',
   data: () => ({
    activeMonth: '',
    months: [
      {
        title: "Jan 2022",
        value: "2022-01"
      },
      {
        title: "Feb 2022",
        value: "2022-02"
      },
      {
        title: "Mar 2022",
        value: "2022-03"
      },
      {
        title: "Apr 2022",
        value: "2022-04"
      },
      {
        title: "May 2022",
        value: "2022-05"
      },
      {
        title: "Jun 2022",
        value: "2022-06"
      }
    ]
  }),
  computed: {
    plus() {
      var last2 = this.$route.params.id.slice(-2);
      var integer = parseFloat(last2);
      return integer + 1
    },
    minus() {
      var last2 = this.$route.params.id.slice(-2);
      var integer = parseFloat(last2);
      var newNumber = (integer - 1).toString()
    }
  },
   components: {
    Loader,
  },
  methods: {
    next() {
      let url = `/eventshome/` + this.plus
      router.push(url)
    },
    prev() {
      let url = `/eventshome/` + this.minus
      router.push(url)
    },
    goBack() {
      router.go(-1)
    },
    setSelected(value) {
      let url = `/eventshome/` + value.value
      this.activeMonth = ''
      router.push(url)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('clearEventsState')
    this.$store.dispatch('clearErrors')
  }
}
</script>