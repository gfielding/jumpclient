<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" v-if="userInfo">
      <div class="modal pa-3" style="position: relative;" v-click-outside="close">
        <button type="button" class="btn btn__icon" @click="close" style="position: absolute; top:1rem; right:1rem;">
          <i class="fas fa-times"></i>
        </button>
        <Loader v-if="!userInfo.firstName" />
        <div class="flex">
          <img :src="userInfo.photoUrl || `https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/avatar%20copy.png?alt=media&token=966c07c4-125a-490f-81be-4e2d26bf33fa`" alt="" style="width:60px; height: 60px; border-radius: 50%; margin-right:1rem">
          <div class="flex align-start flex-column justify-content-center">
            <h3 style="display: flex; align-items: center; line-height: 1; margin-bottom: 0.5rem;">{{userInfo.firstName}} {{userInfo.lastName}}
            <router-link :to="`/users/` + userInfo.id" target="_blank">
              <i class="fas fa-external-link ml-3" style="font-size: 1.6rem;"></i>
            </router-link></h3>
            <star-rating :read-only="true" :star-size="20" v-if="userInfo && userInfo.rating" v-model="userInfo.rating"></star-rating>
            <div>{{userInfo.phone}} | {{userInfo.email}}</div>
            <div v-if="userInfo.points">Points: <span style="color:blue;">{{userInfo.points}}</span></div>
            <div v-if="userInfo && userInfo.fullyVaccinated && userInfo.fullyVaccinated == `yes`">Vaccinated: Yes</div>
            <div v-if="userInfo && (!userInfo.fullyVaccinated || userInfo.fullyVaccinated == `no`)">Vaccinated: No</div>
            <div v-if="userInfo && userInfo.blacklist">Blacklisted: <span v-for="z in userInfo.blacklist" style="color:red;">{{z.title}}</span></div>
            <div class="mt-2" v-if="userInfo && userInfo.skills && userInfo.skills.length > 0">Skills: <button class="chip mr-2" v-for="z in userInfo.skills">{{z.title}}</button></div>
            <div class="mt-2" v-if="userInfo && userInfo.groups">Groups: <button class="chipDark mr-2" v-for="z in userInfo.groups">{{z}}</button></div>

          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
.modal-fade-enter,
.modal-fade-leave-active {
  opacity: 0;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.15s ease;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
}
.modal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  width: 40vw;
  min-width: 300px;
  z-index: 9999999;
}
.modal-header,
.modal-footer {
  padding: 5px;
  text-align: center;
}
.modal-footer {
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
}
.btn-close {
  border: none;
  font-size: 20px;
  padding: 20px;
  cursor: pointer;
  font-weight: bold;
  color: #000;
  background: transparent;
  text-align: right;
}
.btn-green {
  color: white;
  background: #828282;
  border: 1px solid #828282;
  border-radius: 2px;
  margin: 5px;
}
.input {
  margin-top: 5px;
}
.added-text {
  margin-block-end: -10px;
  margin-block-start: 0.5rem;
}
</style>

<script>
import { mapState } from 'vuex'
import StarRating from 'vue-star-rating'
import Loader from '@/components/Loader.vue'

export default {
  name: "Modal",
  props:['staff'],
  mounted() {
    this.$store.dispatch("getUserFromId", this.staff.userId);
  },
  computed: {
    ...mapState(['userInfo',])
  },
  components: {
    Loader,
    StarRating
  },
  methods: {
    close() {
      this.$emit("close");
      this.$store.dispatch('clearUserState')
    }
  },
  // beforeDestroy() {
  //   this.$store.dispatch('clearUserState')
  // }
};
</script>