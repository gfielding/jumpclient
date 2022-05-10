<template>
  <div class="pt-3">
      <div class="dashboard__container--header">
          <button class="btn btn__outlined mr-3" @click="exportGroup()">export group</button>
      </div>
      <div class="dashboard__container--body pt-3">
          <vue-good-table
              :columns="columns"
              :rows="groupUsers"
               styleClass="vgt-table striped"
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
              <!-- <span v-if="props.column.field == 'extras'">
                <span v-if="(props.row)">
                  <span v-for="u in filteredInfo(props.row)" style="display:flex; justify-content: space-evenly;">
                    
  
                    <span v-if="u.points" style="display:inline; color:#0d3fd1;" class="ml-2 mr-2">
                      {{u.points}}
                    </span>

                    <span v-if="u.rating" style="display:inline; color:#c5950d;" class="ml-2 mr-2">
                      {{u.rating}}
                    </span>
                  </span>
                </span>
              </span> -->
              <!-- <span v-if="props.column.field == 'jobs'">
                <span v-if="(props.row)">
                  <span v-for="u in filteredInfo(props.row)">
                    <span v-if="u && u.skills && u.skills.length > 0" style="display:inline;">
                      <v-popover>
                        <i class="fad fa-briefcase"></i>
                        <template slot="popover">
                        <span v-for="z in u.skills">{{z.title}} / </span>
                      </template>
                      </v-popover>
                    </span>
                  </span>
                </span>
              </span> -->
              <span v-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.id" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>
              <span v-if="props.column.field == 'skills'">
                <span v-for="sk in props.row.skills">
                   {{sk.title}} | 
                </span>
              </span>
              <span v-else-if="props.column.field == 'delete'">
                <button class="icon" v-tooltip="'delete instance'" @click="deleteUser(props.row)">
                  <i class="fas fa-trash ml-2 mr-2"></i>
                </button>
              </span>
               <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
          </vue-good-table>
       
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import ExportService from "@/services/ExportService"
import router from '@/router'
import * as moment from 'moment'

export default {
  name: 'followersGroup',
  data: () => ({
    message: '',
    showAll: true,
    performingRequest: false,
    performingRequest2: false,
    columns2: [
      {
        label: 'Created',
        field: 'created',
      },
      {
        label: 'message',
        field: 'message',
      },
    ],
    columns: [
      {
        label: 'Link',
        field: 'link',
        sortable: false,
      },
      // {
      //   label: '',
      //   field: 'extras',
      // },
      // {
      //   label: '',
      //   field: 'jobs',
      // },
      {
        label: 'First Name',
        field: 'name',
      },
      // {
      //   label: 'Last Name',
      //   field: 'lastName',
      // },
      {
        label: 'Phone',
        field: 'phone',
      },
      {
        label: 'Email',
        field: 'email',
      },
      // {
      //   label: 'DOB',
      //   field: 'dob',
      //   sortable: false,
      // },
      // {
      //   label: 'Points',
      //   field: 'points',
      // },
      // {
      //   label: 'Skills',
      //   field: 'skills',
      //   sortable: false,
      // },
    ]
  }),
  computed: {
    ...mapState(['followersGroupUsers', 'followersGroup', 'currentUser', 'userProfile', 'followersGroupMessages']),
    group() {
      return this.followersGroup
    },
    groupUsers() {
      return this.followersGroupUsers
    },
    groupMessages() {
      return this.followersGroupMessages
    },
    clean() {
      return (!this.followersGroupUsers || this.followersGroupUsers.length == 0)
    },
    isAdmin() {
      return this.followersGroup.admins.some(person => person.userId == this.currentUser.uid)
    },
    isUser() {
      return this.followersGroup.users.some(person => person.userId == this.currentUser.uid)
    }
  },
  components: {
    Loader,
  },
  created () {
    this.$store.dispatch("getFollowersGroupFromId", this.$route.params.id);
  },
  methods: {
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY')
      } else {
        return null
      }
    },
    sendMessage () {
      this.performingRequest2 = true
      let newMessage = {
        groupId: this.followersGroup.id,
        groupUsers: this.followersGroupUsers,
        message: this.message,
        from: this.userProfile.twilioNumber || null
      }
      this.$store.dispatch('updateGroupStaff', newMessage)
      setTimeout(() => {
          this.performingRequest2 = false,
          this.message = ''
      }, 1000)
    },
    exportGroup() {
          let logFields = {
          user: this.currentUser.email,
          export: 'Followers Group Export',
          group: this.followersGroup.id
      }
      this.$store.dispatch('sendExportLog', logFields)
      const exportHeaders = [
        "First Name",
        "Email",
        "Phone",
      ]
      const exportItems = [];
      for (var key in this.groupUsers) {

        exportItems.push([
          this.groupUsers[key].name,
          this.groupUsers[key].email,
          this.groupUsers[key].phone,
        ])
      }
      console.log(exportItems)
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearFollowersGroupState')
  }
}
</script>