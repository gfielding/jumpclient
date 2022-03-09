<template>
  <div class="dashboard">
    <Loader v-if="performingRequest" />
    <div class="dashboard__container pt-2">
      <!-- <Loader v-if="!events" /> -->
      <div class="topheader dashboard__container--header flex align-center justify-space-between mb-3">
        <h1 class="mt-3">Events</h1>
        
          <!-- <router-link to="/eventshome/2022-02">
            <button class="btn  ml-3">Feb</button>
          </router-link> -->
          <span class="flex" v-if="!showDate">
            <v-select
            class="mt-3"
              label="title" 
              :clearable=false
              :options="months"
              placeholder="choose month"
              @input="setSelected"
              style="min-width:240px"
              >
            </v-select>
          </span>
          <span class="flex mt-3" v-if="showDate">
            <button class="btn btn__primary mr-3" @click="prev">prev</button>
            <h3>{{date | moment("MMMM, YYYY") }}</h3>
            <!-- <div class="mb-3">
              <label for="status">Choose Month:</label>
              <v-select
                class="mt-2"
                label="title" 
                :clearable=false
                :options="months"
    
                @input="setSelected"
                >
              </v-select>
            </div> -->
            <button class="btn btn__primary ml-3 mt-3" @click="next">Next</button>
          </span>
          <div>
            <v-select
              class="mt-3"
              label="title" 
              :clearable=false
              :options="venues"
              placeholder="choose venue"
              @input="setSelectedVenue"
              style="min-width:240px"
              >
            </v-select>
          </div>
          <router-link :to="{name: 'addevent'}" class="color--text">
            <button class="btn btn__flat ml-3"><i class="fas fa-plus fa-2x"></i></button>
          </router-link>

      </div>
      <router-view :key="$route.params.id" />
    </div>
  </div>
</template>

<style scoped>
  .topheader {
    flex-direction: row;
  }
  @media only screen and (max-width: 899px) {
    .topheader {
      flex-direction: column;
    }
  }
</style>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
import * as moment from 'moment'

export default {
  name: 'eventsHome',
   data: () => ({
    performingRequest: false,
    showDate: true,
    months: [
      {  
        title: "August 2021",
        value: "2021-08"
      },
      {
        title: "September 2021",
        value: "2021-09"
      },
      {
        title: "October 2021",
        value: "2021-10"
      },
      {
        title: "November 2021",
        value: "2021-11"
      },
      {
        title: "December 2021",
        value: "2021-12"
      },
      {
        title: "January 2022",
        value: "2022-01"
      },
      {
        title: "February 2022",
        value: "2022-03"
      },
      {
        title: "March 2022",
        value: "2022-03"
      },
      {
        title: "April 2022",
        value: "2022-04"
      },
      {
        title: "May 2022",
        value: "2022-05"
      },
      {
        title: "June 2022",
        value: "2022-06"
      },
      {
        title: "August 2022",
        value: "2022-08"
      },
      {
        title: "September 2022",
        value: "2022-09"
      },
      {
        title: "October 2022",
        value: "2022-10"
      },
      {
        title: "November 2022",
        value: "2022-11"
      },
      {
        title: "December 2022",
        value: "2022-12"
      },
    ]
  }),
  created () {
    if (!this.venues || this.venues.length < 1) {
      this.$store.dispatch("getVenues")
    }
  },
  // async mounted() {
  //   this.setSelected(this.$route.params.id)
  // },
  computed: {
    ...mapState(['venues']),
    date() {
      if (this.$route.params.id.length > 10) {
        return this.showDate = false
      } else {
        return this.$route.params.id
      }
    },
    plus() {
      let id = this.$route.params.id
      var last2 = id.slice(-2);
      var first4 = id.slice(0,4);

      var integer = parseFloat(last2);
      var integer1 = parseFloat(first4);

      var next4 = (integer1 + 1).toString()

      var madeupname = (integer + 1).toString().padStart(2,'0')
      if (madeupname < 13) {
        return first4 + `-` + madeupname
      } 
      if (madeupname = 13) {
        return next4 + `-` + `01`
      } 
    },
    minus() {
      let id = this.$route.params.id
      var first4 = id.slice(0,4);
      var last2 = id.slice(-2);
      var integer1 = parseFloat(first4);
      var next4 = (integer1 - 1).toString()
      var integer = parseFloat(last2);
      var madeupname = (integer - 1).toString().padStart(2,'0')
      if (madeupname >= 1) {
        return first4 + `-` + madeupname
      }
      if (madeupname == 0) {
        return next4 + `-` + `12`
      } 
    }
  },
   components: {
    Loader,
  },
  methods: {
    next() {
      this.performingRequest = true
      let url = `/events/` + this.plus
      router.push(url)
      setTimeout(() => {
        this.performingRequest = false
        router.push(url)
      }, 1000)
    },
    prev() {
      this.performingRequest = true
      let url = `/events/` + this.minus
      setTimeout(() => {
        this.performingRequest = false
        router.push(url)
      }, 1000)
    },
    goBack() {
      router.go(-1)
    },
    setSelectedVenue(value) {
      this.performingRequest = true
      let url = `/events/venue/` + value.id
      setTimeout(() => {
        this.performingRequest = false
        router.push(url)
      }, 1000)
    },
    setSelected(value) {
      this.performingRequest = true
      let url = `/events/` + value.value
      setTimeout(() => {
        this.performingRequest = false
        router.push(url)
      }, 1000)
    }
  },
  // beforeDestroy () {
  //   this.$store.dispatch('clearEventsState')
  //   this.$store.dispatch('clearErrors')
  // }
}
</script>