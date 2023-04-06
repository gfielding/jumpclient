<template>
	<div>
  	<div class="dashboard__container--body--col pt-3 mb-0" style="width:100%;">
      <button class="btn btn__primary" @click="updateIds()">Update Ids</button>
      <vue-good-table
          :columns="columns"
          :rows="evereeUsersWithoutExternalId"
          styleClass="vgt-table striped"
          :search-options="{
            enabled: true,
            placeholder: 'Search this table',
          }"
          :pagination-options="{
            enabled: true,
            mode: 'records',
            perPage: 10,
          }"
          >
      </vue-good-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'evereeUsersWithoutExternalId',
  components: {
    Loader,
  },
  data() {
    return {
      columns: [
        {
          label: 'id',
          field: 'id',
        },
        {
          label: 'First',
          field: 'firstName',
        },
        {
          label: 'Last',
          field: 'lastName',
        },
        {
          label: 'Phone',
          field: 'phone',
        },
        {
          label: 'Email',
          field: 'email',
        },

      ]
    }
  },
  computed: {
    ...mapState(['evereeUsersWithoutExternalId']),
  },
  created () {
    this.$store.dispatch("getEvereeUsersWithoutExternalId");
  },
  methods: {
    updateIds() {
      console.log('starting')
      this.$store.dispatch("updateExternalIds");
    },
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
    this.$store.dispatch("clearEvereeUsersWithoutExternalId");
  },
}
    
</script>