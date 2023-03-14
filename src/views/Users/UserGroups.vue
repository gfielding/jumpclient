<template>
  <div class="dashboard__container" v-if="user">
    <div class="dashboard__container--body flex flex-wrap" v-if="user && user.groups">

      <vue-good-table
        :columns="columns"
        @on-row-click="onRowClick"
        :rows="userGroups"
        styleClass="vgt-table condensed"
        >
        <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'created'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
              <span v-else-if="props.column.field == 'owner'">
                <span v-if="props.row.owner">
                  {{props.row.owner.firstName}}
                </span>
                <span v-if="props.row.owner">
                  {{props.row.owner.lastName}}
                </span>
              </span>
              <span v-else-if="props.column.field == 'applicants'">
                <span v-if="props.row.applicants" style="color:green;">
                  {{props.row.applicants.length}}
                </span>
              </span>
              <span v-else-if="props.column.field == 'members'">
                <span v-if="props.row.members">
                  {{props.row.members.length}}
                </span>
              </span>
              <span v-else-if="props.column.field == 'admins'">
                <span v-if="props.row.admins && props.row.admins.length > 0">
                  <button class="btn btn__small chip mr-2" v-for="(item, index) in props.row.admins" :key="item.id">{{item.name}}</button>
                </span>
              </span>
              <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
      </vue-good-table>

     
      <Loader v-if="(!user.groups || user.groups.length == 0)" />
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
import router from '@/router'
import Loader from '@/components/Loader.vue'

export default {
  props: ['user'],
  data: () => ({ 
    columns: [
      {
        label: 'Title',
        field: 'title',
      },
      {
        label: 'Admins',
        field: 'admins',
      },
      {
        label: 'Members',
        field: 'members',
      },
    ],
  }),
  name: 'userGroups',
  computed: {
    ...mapState(['groups', 'userProfile']),
    userGroups() {
      return this.groups.filter(item => {
        return (item.members && item.members.includes(this.user.id))
      })
    }
  },
  created () {
    if (!this.groups || this.groups.length < 1) {
      this.$store.dispatch("getGroups")
    }
  },
  components: {
    Loader,
  },
  methods: {
    onRowClick(params) {
      let url = `/groups/` + params.row.id
      console.log(url)
      router.push(url)
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY, hh:mm a')
      } else {
        return null
      }
    },
  }
}

</script>