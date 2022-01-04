<template>
  <div class="pt-3">
      <div class="dashboard__container--body" v-if="isAdmin && isUser">
        
        <div class="dashboard__container--body--col" v-if="groupUsers && groupUsers.length > 0">
          <div class="mb-3">
            <h3>Send Message to Group:</h3>
            <textarea name="updateMessage" id="updateMessage" cols="20" rows="4" v-model="message"></textarea>
          </div>
          <button class="btn btn__outlined btn__large" @click="sendMessage()">
            Send message
            <transition name="fade">
              <span class="ml-2" v-if="performingRequest2">
              <i class="fa fa-spinner fa-spin"></i>
              </span>
            </transition>
          </button>
        </div>
      </div>
      <div class="dashboard__container--body">
        <div class="dashboard__container--body--col" style="width:100%;">
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
  name: 'groupMessages',
  data: () => ({
    message: '',
    showAll: true,
    performingRequest2: false,
    columns2: [
      {
        label: 'Created',
        field: 'created',
        width: '132px',
      },
      {
        label: 'message',
        field: 'message',

      },
    ],
  }),
  computed: {
    ...mapState(['group', 'currentUser', 'userProfile', 'groupMessages', 'groupUsers']),
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
    goBack() {
      router.go(-1)
    },
  },
}
</script>