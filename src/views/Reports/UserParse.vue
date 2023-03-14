<template>
	<div>

    <div class="dashboard__container pt-3">
    	<div class="dashboard__container--header mb-3">
        <div class="flex align-center">
         	<h2>Parse Users</h2>	
        </div>
      </div>

    	<div class="dashboard__container--body--col pt-3 mb-0">
        <button @click="changeUsers()">change</button>
        {{usersTotal}}
      </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'userParse',
  components: {
    Loader,
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['usersTotal']),
  },
  created () {
    this.$store.dispatch("getUsersTotal");
  },
  methods: {
    changeUsers() {
      console.log('starting')
      this.$store.dispatch("removeOldUsers");
      // fb.usersCollection.get()
      // .then((querySnapshot) => {
      //   querySnapshot.forEach((doc) => {
      //     console.log(doc.id)
      //     fb.oldUsersCollection.doc(doc.id).set(doc.data())
      //   })
      // })
      setTimeout(() => {
        this.$store.dispatch("getUsersTotal");
      }, 2000)
    },
    removeBadUsers() {
      fb.usersCollection.get()
    }
  },
  beforeDestroy () {
    this.$store.dispatch("clearUsersTotal");
  },
}
    
</script>