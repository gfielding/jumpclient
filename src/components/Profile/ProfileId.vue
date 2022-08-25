<template>
	<div>
    <span class="flex align-center justify-space-between">
		  <h2 class="mb-3">User ID</h2>
     <button class="btn btn__small btn__primary btn__flat mb-2" @click="requestId()">Request New</button>
    </span>
 <!-- <vue-star-rate
      :rateRange="3"
      :maxIcon="5"
      :iconHeight="22"
      :iconWidth="22"
      :hasCounter="false"
      iconColor="#f0ad4e"
      iconColorHover="#f0ad4e"
      iconShape="star"
      value="rating"
    ></vue-star-rate> -->
    <div class="flex flex-column align-center">
			<div class="avatar-wrapper" :style="{ backgroundImage: 'url(' + backgroundUrl + ')' }">
        <div class="avatar-wrapper" :style="{ backgroundImage: 'url(' + backgroundUrl + ')' }" style="height:194.4px; width:308.16px;">
         <!--  <croppa 
          v-model="croppa"
          :prevent-white-space="true"
          :width="280"
          :height="280"
          accept=".jpeg,.png,.jpg,.svg"
          :file-size-limit="2048000"
          :quality="4"
          :placeholder="'Update Image'"
          placeholder-color="white"
          initial-size="cover"
          :remove-button-size="32"
          readonly
        >
        </croppa> -->
        </div>
			</div>
    </div>
	</div>
</template>

<style scoped>
/*  .fa-stack {
    color: rgb(255, 188, 0);
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: rgb(255, 188, 0);
  }
  .fa-layers-text {
    position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  line-height: 1;
  color: white;
    -webkit-text-stroke-color: white;
    font-weight: 100 !important;
  }*/
  .croppa-container canvas {
    border-radius: 0 !important;
    cursor: pointer;
    border-color: transparent !important;
  }
  .avatar-wrapper {
    background-position: center center;
    border-radius: 0 !important;
    background-size: cover;
    transition: 0.2s all;
}
</style>

<script>
const fb = require('../../firebaseConfig.js')
import * as moment from 'moment'

export default {
  props: ['user'],
  data() {
    return {
      rating: ''
    }
  },
  computed: {
  	backgroundUrl() {
  		return this.user.id_card_path || 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/license.png?alt=media&token=cefe8ea1-7d48-44ac-9ff3-b2440c9f9adb'
  	}
  },
  methods: {
    requestId() {
      let newText = {
        name: this.user.firstName,
        phone: this.user.phone,
        userId: this.user.id,
        type: 'requestId'
      }
      this.$store.dispatch('requestIdText', newText)
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MM Do YYYY, hh:mm a')
      } else {
        return null
      }
    },
  },
}
</script>