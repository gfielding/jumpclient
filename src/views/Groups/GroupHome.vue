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
          <button class="btn btn__outlined mr-3" @click="deleteGroup()" :disabled="!clean" v-if="isOwner || isKaela">delete group</button>
          <router-link :to="{name: 'group'}">
            <button class="btn" v-bind:class="{ 'btn__dark': isMembers, 'btn__outlined': !isMembers }">Members</button>
          </router-link>
          <router-link :to="{name: 'groupEdit'}">
            <button class="btn ml-3" v-bind:class="{ 'btn__dark': isEdit, 'btn__outlined': !isEdit }" v-if="isOwner || isUser || isAdmin || isKaela">Settings</button>
          </router-link>
          <router-link :to="{name: 'groupMessages'}">
            <button class="btn ml-3" v-bind:class="{ 'btn__dark': isMessages, 'btn__outlined': !isMessages }" v-if="isOwner || isUser || isAdmin || isKaela">Messages</button>
          </router-link>
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
    theGroup() {
      return this.group
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
    isKaela() {
      return this.currentUser.uid == 'YjqnBY7AbUZuZWcinHab9TNiH9n1'
    },
    isMessages() {
      return this.$route.name == 'groupMessages';
    },
    isMembers() {
      return this.$route.name == 'group';
    },
    isOwner() {
      return this.group.owner == this.currentUser.uid
    },
    isAdmin() {
      if (this.group && this.group.admins) {
        return this.group.admins.some(person => person.userId == this.currentUser.uid)
      }
    },
    isUser() {
      if (this.group && this.group.users) {
        return this.group.users.some(person => person.userId == this.currentUser.uid)
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