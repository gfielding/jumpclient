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
         
          <button class="btn btn__small btn__dark mr-3" @click="exportGroup()">export group</button>
      </div>
      <div class="dashboard__container--body pt-3" v-if="groupUsers && groupUsers.length >= 1">
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
              <span v-else-if="props.column.field == 'delete'">
          <!--       <button class="icon" v-tooltip="'delete user'" @click.prevent="deleteUser(props.row, props.index)">
                    <i class="fa-solid fa-octagon-exclamation fa-2x" style="color: red"></i>
                  </button> -->
                  
                <button class="icon" v-tooltip="'delete instance'" @click.prevent="deleteUser(props.row, props.index)">
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
import algoliasearch from 'algoliasearch/lite';
import StarRating from 'vue-star-rating'
import router from '@/router'
import * as moment from 'moment'

export default {
  name: 'group',
  data: () => ({
    message: '',
    activeItem: null,
    activeNote: null,
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
      // {
      //   label: 'Note',
      //   field: 'note',
      //   sortable: false,
      //   tdClass: 'text-left',
      //   width:'60px',
      // },
      {
        label: 'Phone',
        field: 'phone',
        sortable: false,
        width:'120px',
      },
      // {
      //   label: 'DOB',
      //   field: 'dob',
      //   sortable: false,
      //   width:'60px',
      // },
      {
        label: 'Skills',
        field: 'skills',
        sortable: false,
      },
      {
        label: 'Remove',
        field: 'delete',
        sortable: false,
      }
    ]
  }),
  computed: {
    ...mapState(['groupUsers', 'group', 'currentUser', 'userProfile']),
    // clean() {
    //   return (!this.groupUsers || this.groupUsers.length == 0)
    // },
    // isAdmin() {
    //   return this.group.admins.some(person => person.userId == this.currentUser.uid)
    // },
    // isUser() {
    //   return this.group.users.some(person => person.userId == this.currentUser.uid)
    // }
  },
  components: {
    Loader,
    StarRating
  },
  // created () {
  //   this.$store.dispatch("getGroupFromId", this.$route.params.id);
  // },
  methods: {
    showNote(r) {
      console.log(r)
      this.activeItem = r
    },
    closeNote(r) {
      this.activeItem = null
    },
    showItem(r) {
      console.log(r)
      this.activeNote = r
    },
    closeItem(r) {
      this.activeNote = null
    },
    // addAll() {
    //   let group = this.group
    //   this.$store.dispatch("addAllUsersToGroup", {
    //     group: this.group
    //   })
    // },
    addUser(item) {
      console.log(item)
      let group = this.group
      this.performingRequest = true;
      this.$store.dispatch("addUserToGroup", {
        user: item,
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
    deleteUser(item, index) {
      console.log(item)
      let groupUsers = this.groupUsers
      groupUsers.splice(index, 1)
      this.$store.dispatch("removeUserFromGroup", {
        group: this.group,
        user: item
      })
      // this.$store.dispatch("getGroupFromId", this.$route.params.id);
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
    // goBack() {
    //   router.go(-1)
    // },
  },
  // beforeDestroy () {
  //   this.$store.dispatch('clearGroupState')
  // }
}
</script>