<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <Loader v-if="!group" />
      <div class="dashboard__container--header" v-if="group">
        <div>
        <h1>{{group.title}}</h1>
        <span class="caption" v-if="group.description && (currentUser.uid != group.owner)">{{group.description}}</span>
        </div>
        <span class="flex align-center">
          <button class="btn btn__outlined mr-3" @click="deleteGroup()" :disabled="!clean" v-if="isOwner">delete group</button>
          <router-link :to="{name: 'group'}">
            <button class="btn" v-bind:class="{ 'btn__dark': isMembers, 'btn__outlined': !isMembers }">Members</button>
          </router-link>
          <router-link :to="{name: 'groupEdit'}">
            <button class="btn ml-3" v-bind:class="{ 'btn__dark': isEdit, 'btn__outlined': !isEdit }" v-if="isOwner || isUser || isAdmin">Settings</button>
          </router-link>
          <router-link :to="{name: 'groupMessages'}">
            <button class="btn ml-3" v-bind:class="{ 'btn__dark': isMessages, 'btn__outlined': !isMessages }" v-if="isOwner || isUser || isAdmin">Messages</button>
          </router-link>
          <!-- <router-link :to="{name: 'clientContacts'}">
            <button class="btn  ml-3" v-bind:class="{ 'btn__dark': isContacts, 'btn__outlined': !isContacts }">Contacts</button>
          </router-link>
          <router-link :to="{name: 'clientNotes'}">
            <button class="btn  ml-3" v-bind:class="{ 'btn__dark': isNotes, 'btn__outlined': !isNotes }">Notes</button>
          </router-link>
           <router-link :to="{name: 'clientVenues'}">
            <button class="btn  ml-3" v-bind:class="{ 'btn__dark': isVenues, 'btn__outlined': !isVenues }">Venues</button>
          </router-link>
          <router-link :to="{name: 'clientFiles'}">
            <button class="btn  ml-3" v-bind:class="{ 'btn__dark': isFiles, 'btn__outlined': !isFiles }">Files</button>
          </router-link> -->
          <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
        </span>
        
      </div>
      <router-view :key="$route.params.id" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'groupHome',
  computed: {
    ...mapState(['group', 'currentUser', 'groupUsers']),
    client() {
      return this.clientInfo
    },
    clean() {
      return (!this.groupUsers || this.groupUsers.length == 0)
    },
    // isContacts() {
    //   return this.$route.name == 'clientContacts';
    // },
    isEdit() {
      return this.$route.name == 'groupEdit';
    },
    isMessages() {
      return this.$route.name == 'groupMessages';
    },
    isMembers() {
      return this.$route.name == 'group';
    },
    // isVenues() {
    //   return this.$route.name == 'clientVenues';
    // },
    // isFiles() {
    //   return this.$route.name == 'clientFiles';
    // },
    isOwner: function() {
      return this.group.owner == this.currentUser.uid
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
  created () {
    this.$store.dispatch("getGroupFromId", this.$route.params.id);
  },
  components: {
    Loader,
  },

  methods: {
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearGroupState')
    this.$store.dispatch('clearErrors')
  }
}
</script>