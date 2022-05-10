<template>
  <div class="pt-3">
      <div class="dashboard__container--header">
          <ais-instant-search :search-client="searchClient" index-name="a_users" >
            <ais-search-box placeholder="Add User..." />
            <ais-state-results>
              <template slot-scope="{ state: { query } }">
                <ais-hits v-show="query.length > 0">
                  <template v-slot:item="{ item }">
                    <div>
                      <button @click="addUser(item)" class="btn btn__icon btn__flat mr-4">
                        <i class="fas fa-plus" style="color:blue;" v-if="!performingRequest"></i>
                        <i class="fa fa-spinner fa-spin" style="color:blue;" v-if="performingRequest"></i>
                      </button>
                      <p style="display: inline;">{{ item.firstName }} {{ item.lastName }} | <span v-if="item.address && item.address">{{item.address.city}} | </span>{{item.email}} | {{item.phone}}</p>
                    </div>
                  </template>
                </ais-hits>
              </template>
            </ais-state-results>
          </ais-instant-search>
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
      <!-- <hr>
      <div class="dashboard__container--body">
        <div class="dashboard__container--body--col">
          <h2>Messages</h2>

          <vue-good-table
            :columns="columns2"
            :rows="groupMessages"
            compactMode
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 10,
            }"
          >
           <template slot="table-row" slot-scope="props">
              

              <span v-if="props.column.field == 'created'">
                <span>{{formatDate(props.row.created)}}</span>
              </span>

              <span v-if="props.column.field == 'message'">
                <span>{{props.row.message}}</span>
              </span>

            </template>

            
          </vue-good-table>
        </div>
        <div class="dashboard__container--body--col" v-if="groupUsers && groupUsers.length > 0">
          <div class="mb-3">
            <h3>Send Message to Group:</h3>
            <textarea name="updateMessage" id="updateMessage" cols="20" rows="4" v-model="message"></textarea>
          </div>
          <button class="btn btn__outlined btn__large" @click="sendMessage()">
            Update Group
            <transition name="fade">
              <span class="ml-2" v-if="performingRequest2">
              <i class="fa fa-spinner fa-spin"></i>
              </span>
            </transition>
          </button>
        </div>
      </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import ExportService from "@/services/ExportService"
import algoliasearch from 'algoliasearch/lite';
import router from '@/router'
import * as moment from 'moment'

export default {
  name: 'group',
  data: () => ({
    message: '',
    showAll: true,
    performingRequest: false,
    performingRequest2: false,
    searchClient: algoliasearch(
        '0T1SIY6Y1V',
        'f03dc899fbdd294d6797791724cdb402',
      ),
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
      {
        label: 'First Name',
        field: 'firstName',
      },
      {
        label: 'Last Name',
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
      {
        label: 'DOB',
        field: 'dob',
        sortable: false,
      },
      {
        label: 'Points',
        field: 'points',
      },
      {
        label: 'Skills',
        field: 'skills',
        sortable: false,
      },
      {
        label: 'Delete',
        field: 'delete',
        sortable: false,
      }
    ]
  }),
  computed: {
    ...mapState(['groupUsers', 'group', 'currentUser', 'userProfile', 'groupMessages']),
    clean() {
      return (!this.groupUsers || this.groupUsers.length == 0)
    },
    isAdmin() {
      return this.group.admins.some(person => person.userId == this.currentUser.uid)
    },
    isUser() {
      return this.group.users.some(person => person.userId == this.currentUser.uid)
    }
  },
  components: {
    Loader,
  },
  created () {
    this.$store.dispatch("getGroupFromId", this.$route.params.id);
  },
  methods: {
    addUser(item) {
      console.log(item)
      let group = this.group
      this.performingRequest = true;
      this.$store.dispatch("addUserToGroup", {
        id: item.objectID,
        group: this.group
      })
      setTimeout(() => {
        this.performingRequest = false;
        document
        .querySelectorAll('.ais-SearchBox-input')
        .forEach((e) => (e.value = ''))
        document.querySelectorAll('.ais-Hits-item').forEach((e) => e.remove())
      }, 250)
    },
    deleteUser(item) {
      console.log(item)
      this.$store.dispatch("removeUserFromGroup", {
        group: this.group,
        userId: item.id
      })
    },
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
        groupId: this.group.id,
        groupUsers: this.groupUsers,
        message: this.message,
        from: this.userProfile.twilioNumber || null
      }
      this.$store.dispatch('updateGroupStaff', newMessage)
      setTimeout(() => {
          this.performingRequest2 = false,
          this.message = ''
      }, 1000)
    },
    // updateStaff() {
    //   let group = this.group
    //   this.$store.dispatch('updateGroupStaff', group)
    // },
    updateGroup() {
      let group = this.group
      this.$store.dispatch('updateGroup', group)
    },
    deleteGroup() {
      let group = this.group
      this.$store.dispatch('deleteGroup', group)
      setTimeout(() => {
        let url = `/groups`
        router.push(url)
      }, 1000)
    },
    exportGroup() {
      let logFields = {
          user: this.currentUser.email,
          export: 'Group Export',
          group: this.group.id
      }
      this.$store.dispatch('sendExportLog', logFields)
      const exportHeaders = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "DOB",
        "Skills",
      ]
      const exportItems = [];
      for (var key in this.groupUsers) {

        function mySkillsFunction(groupUsers) {
          let skillsArray = []
          groupUsers[key].skills.forEach(sk => {
            skillsArray.push(sk.title)
          })
          console.log(skillsArray)
          return skillsArray.toString()
        }

        exportItems.push([
          this.groupUsers[key].firstName,
          this.groupUsers[key].lastName,
          this.groupUsers[key].email,
          this.groupUsers[key].phone,
          this.groupUsers[key].dob,
          mySkillsFunction(this.groupUsers)
          
        ])
      }
      console.log(exportItems)
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    onRowClick(params) {
      let url = `/users/` + params.row.id
      router.push(url)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearGroupState')
  }
}
</script>