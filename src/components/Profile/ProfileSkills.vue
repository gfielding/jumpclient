<template>
	<div class="mb-5">
    <h4 class="mb-2">Job Skills</h4>
    <div>
      <v-select :options="jobs" label="title" taggable multiple v-model="user.skills" @input="updateProfile()" />

       <!--  <v-select :reduce="group => jobs.title" :options="jobs" label="title" taggable multiple push-tags v-model="user.skills" @input="updateUser()" /> -->


    </div>

      <!-- <div class="flex mb-3 align-start" v-for="(job, index) in jobs" :key="job.id">
        <div class="inline" style="width:2.4rem;">
          <input class="mb-0 mt-2" type="checkbox" :id="index" :value="job" v-model="user.skills"  @change="updateProfile()">
        </div>
        <div class="flex flex-column" style="width:calc(100% - 2.4rem);">
          <h5 :for="index">{{job.title}}</h5>
          <p class="caption">
            {{job.description}}
          </p>
        </div>
      </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['user'],
  computed: {
    ...mapState(['jobs']),
  },
  created () {
    if (!this.jobs || this.jobs.length < 1) {
      this.$store.dispatch("getJobsState")
    }
  },
  methods: {
    updateProfile(){
      let user = this.user
      // let userSkills = (this.user.skills || null)
      console.log(user.skills)
      this.$store.dispatch('updateTheUser', user)
      // this.$store.dispatch('updateSkills', {
      //   skills: userSkills,
      //   user: user
      // })
    }
  }
}
</script>