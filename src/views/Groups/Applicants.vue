<template>
  <div class="pt-3">
    <!-- <div class="dashboard__container--header">
      <h2>New Applicants</h2>
    </div> -->
    <div class="dashboard__container--body pt-3" style="width:100%;">
      <vue-good-table
              :columns="columns"
              :rows="groupApplications"
               styleClass="vgt-table c"
              :search-options="{
                enabled: true,
                placeholder: 'Search this table',
              }"
              :pagination-options="{
                enabled: true,
                mode: 'records',
                perPage: 20,
              }"
            >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'photoUrl'">
                <span v-if="props.row.photoUrl">
                  <img :src="(props.row.photoUrl || `https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/avatar%20copy.png?alt=media&token=966c07c4-125a-490f-81be-4e2d26bf33fa`)" alt="" style="width: 3.5rem; height:3.5rem; border-radius: 50%; padding: 0.25rem;">
                </span>
              </span>
              <span v-else-if="props.column.field == 'fullName'">
                <router-link :to="'/users/' + props.row.id" class="darkLink">
                  <h5>
                  {{props.row.firstName}} {{props.row.lastName}}
                  </h5>
                </router-link>
                <div class="flex justify-flex-start mt-0">
                  <star-rating :read-only="true" :star-size="12" v-if="props.row && props.row.rating" v-model="props.row.rating" class="caption"></star-rating>
                  <span v-if="props.row && props.row.points" class="caption flex align-center">
                    {{props.row.points}} Points
                  </span>
                </div>
                <div class="flex justify-flex-start mt-0 mb-2 caption">
                  {{props.row.dob | moment("MMMM Do YYYY") }}
                </div>
              </span>
              <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.id" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>
              <span v-else-if="props.column.field == 'skills'">

                <span v-for="sk in props.row.skills" class="caption">
                   {{sk.title}} | 
                </span>
              </span>


              <span v-else-if="props.column.field == 'actions'">

                <span v-if="isWaitlisted(props.row)">
                  <button class="icon" v-tooltip="'accept application'" @click.prevent="acceptUser(props.row, props.index)">
                    <i class="fa-solid fa-circle-check fa-2x mr-4" style="color: green"></i>
                  </button>
                </span>

                <span v-if="!isWaitlisted(props.row)">

                  <button class="icon" v-tooltip="'accept application'" @click.prevent="acceptUser(props.row, props.index)">
                    <i class="fa-solid fa-circle-check fa-2x mr-4" style="color: green"></i>
                  </button>

                  <button class="icon" v-tooltip="'hold application'" @click.prevent="holdUser(props.row, props.index)">
                    <i class="fa-solid fa-triangle-exclamation fa-2x mr-4" style="color: goldenrod"></i>
                  </button>


                  <button class="icon" v-tooltip="'delete user'" @click.prevent="deleteUser(props.row, props.index)">
                    <i class="fa-solid fa-octagon-exclamation fa-2x" style="color: red"></i>
                  </button>
                  
                </span>



                

              </span>


               <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
          </vue-good-table>
    </div>
</div>
</template>

<style scoped>
  .fa-solid {
    opacity: 0.7;
  }
  .fa-solid:hover {
    opacity: 1;
  }
</style>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
// import algoliasearch from 'algoliasearch/lite';
import router from '@/router'
import * as moment from 'moment'

export default {
  name: 'groupApplicants',
  data: () => ({
    message: '',
    showAll: true,
    performingRequest: false,
    performingRequest2: false,
    columns: [
      {
        field: 'photoUrl',
        sortable: false,
        width:'42px',
        tdClass: 'text-center',
      },
      {
        label: '',
        field: 'fullName',
        sortable: false,
        width:'140px',
      },
      {
        label: 'Phone',
        field: 'phone',
        sortable: false,
        width:'120px',
      },
      {
        label: 'Skills',
        field: 'skills',
        sortable: false,
      },
      {
        label: 'Actions',
        field: 'actions',
        sortable: false,
        width:'140px',
      }
    ]
  }),
  computed: {
    ...mapState(['group', 'currentUser', 'userProfile', 'groupApplications', 'groupWaitlist']),
  },
  components: {
    Loader,
  },
  created () {
    // this.$store.dispatch("getGroupFromId", this.$route.params.id);
    // this.$store.dispatch("getGroupApplications", this.$route.params.id);
  },
  methods: {
    // addUser(item) {
    //   console.log(item)
    //   let group = this.group
    //   this.performingRequest = true;
    //   this.$store.dispatch("addUserToGroup", {
    //     id: item.objectID,
    //     group: this.group
    //   })
    //   setTimeout(() => {
    //     this.performingRequest = false;
    //     document
    //     .querySelectorAll('.ais-SearchBox-input')
    //     .forEach((e) => (e.value = ''))
    //     document.querySelectorAll('.ais-Hits-item').forEach((e) => e.remove())
    //   }, 250)
    // },
    isWaitlisted(user) {
      console.log(user)
      console.log(this.groupWaitlist)
      if (!this.groupWaitlist || this.groupWaitlist.length == 0) {
        return false
      } else if (this.groupWaitlist.includes(user)) {
        return true
      } else {
        return false
      }
    },
    acceptUser(item, index) {
      this.$store.dispatch("acceptUserToGroup", {
        user: item,
        group: this.group
      })
      let groupApplications = this.groupApplications
      groupApplications.splice(index, 1)
    },
    holdUser(item, index) {
      this.$store.dispatch("waitlistUserToGroup", {
        user: item,
        group: this.group
      })
      let groupApplications = this.groupApplications
      groupApplications.splice(index, 1)
    },
    deleteUser(item, index) {
      this.$store.dispatch("removeUserApplicationFromGroup", {
        group: this.group,
        user: item
      })
      let groupApplications = this.groupApplications
      groupApplications.splice(index, 1)
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY')
      } else {
        return null
      }
    },
    // sendMessage () {
    //   this.performingRequest2 = true
    //   let newMessage = {
    //     groupId: this.group.id,
    //     groupUsers: this.groupUsers,
    //     message: this.message,
    //     from: this.userProfile.twilioNumber || null
    //   }
    //   this.$store.dispatch('updateGroupStaff', newMessage)
    //   setTimeout(() => {
    //       this.performingRequest2 = false,
    //       this.message = ''
    //   }, 1000)
    // },
    // updateStaff() {
    //   let group = this.group
    //   this.$store.dispatch('updateGroupStaff', group)
    // },
    updateGroup() {
      let group = this.group
      this.$store.dispatch('updateGroup', group)
    },
    onRowClick(params) {
      let url = `/users/` + params.row.id
      router.push(url)
    },
    // goBack() {
    //   router.go(-1)
    // },
  }
}
</script>