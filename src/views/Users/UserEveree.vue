<template>
  <div class="dashboard__container" v-if="user">
    <div class="dashboard__container--body" v-if="user">
      <iframe v-if="iframaData && (iframaData != null)" 
        :src="iframaData" 
        >
      </iframe>
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import firebase from 'firebase/app';

export default {
  props: ['user'],
  name: 'userEveree',
  data: () => ({ 
    iframaData: null,
  }),
  methods: {
    createComponentSession() {
      const createComponentSession = firebase.functions().httpsCallable('createComponentSession')
      createComponentSession({
        id: this.$route.params.id
      })
      .then(result => {
        this.iframaData = result.data.url
        console.log(result.data)
      })
    },
  },
  computed: {
    ...mapState(['currentUser', 'userProfile']),
  },
  created () {
    this.createComponentSession()
  },
}

</script>