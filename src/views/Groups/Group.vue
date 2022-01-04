<template>
  <div class="pt-3">
      <div class="dashboard__container--header">
        <span>
          <!-- <button class="btn btn__outlined mr-3" @click="deleteGroup()" :disabled="!clean">delete group</button> -->
          <button class="btn btn__outlined mr-3" @click="exportGroup()">export group</button>
        </span>
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
              @on-row-click="onRowClick"
            >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'skills'">
                <span v-for="sk in props.row.skills">
                   {{sk.title}} | 
                </span>
              </span>
              <span v-else-if="props.column.field == 'published'">
                <span v-if="props.row.published">
                  <i class="fas fa-eye"></i>
                </span>
                <span v-else>
                  <i class="fas fa-eye-slash"></i>
                </span>
              </span>
              <span v-else-if="props.column.field == 'paid'">
                <span v-if="props.row.paid">
                  <i class="fas fa-check"></i>
                </span>
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
import router from '@/router'
import * as moment from 'moment'

export default {
  name: 'group',
  data: () => ({
    message: '',
    showAll: true,
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
      }
    ]
  }),
  computed: {
    ...mapState(['groupUsers', 'group', 'currentUser', 'userProfile', 'groupMessages']),
    clean() {
      return (!this.groupUsers || this.groupUsers.length == 0)
    },
    isAdmin: function() {
      if (this.group && this.group.admins && this.group.admins.length > 0) {
        let array = this.group.admins
        if(array.some(person => person.id == this.currentUser.uid)){
          return true
        } else {
          return false
        }
      }
    },
    isUser: function() {
      if (this.group && this.group.users && this.group.users.length > 0) {
        if(array.some(person => person.id == this.currentUser.uid)){
          return true
        } else {
          return false
        }
      }
    }
  },
  components: {
    Loader,
  },
  created () {
    this.$store.dispatch("getGroupFromId", this.$route.params.id);
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