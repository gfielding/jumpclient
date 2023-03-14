<template>
  <div class="dashboard__container" v-if="user">
    <div class="dashboard__container--body flex flex-wrap" v-if="user && user.certs">

      <vue-good-table
        :columns="columns"
        :rows="user.certs"
        styleClass="vgt-table condensed"
        >
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'url'">
            <a :href="props.row.url" target="_blank">View <i class="fas fa-external-link"></i></a>
          </span>
          <span v-else-if="props.column.field == 'extras'">

              <i class="far fa-trash" @click="deleteUploadedFile(props.row, props.index)"></i>

          </span>
          <!-- <span v-else>
            {{props.formattedRow[props.column.field]}}
          </span> -->
        </template>
      </vue-good-table>

     
      <Loader v-if="(!user.certs || user.certs.length == 0)" />
    </div>
  </div>
</template>

<style scoped>
  .galleryImage {
    width: calc(33.33% - 2rem);
    height: auto;
  }
</style>


<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'

export default {
  props: ['user'],
  data: () => ({ 
    columns: [
      {
        label: 'Type',
        field: 'type',
        sortable: false
      },
      {
        label: 'Url',
        field: 'url',
        sortable: false
      },
      {
        label: 'Delete',
        field: 'extras',
        sortable: false
      },
    ]
  }),
  name: 'userCerts',
  computed: {
    ...mapState(['currentUser', 'userProfile']),
    certs() {
      return this.user.certs
    }
  },
  components: {
    Loader,
  },
  methods: {
    deleteUploadedFile(u, index) {
      console.log(u)
      let userProfile = this.userProfile
      userProfile.certs.splice(index, 1)
      this.$store.dispatch('updateUser', userProfile)
    },
  }
}

</script>