<template>
	<div>
		<h2 class="mb-3">Profile Image</h2>
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
        <div class="avatar-wrapper" :style="{ backgroundImage: 'url(' + backgroundUrl + ')' }" style="height:280px; width:280px;">
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


<script>
const fb = require('../../firebaseConfig.js')

export default {
  props: ['user'],
  data() {
    return {
      rating: ''
    }
  },
  computed: {
  	backgroundUrl() {
  		return this.user.photoUrl || 'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/avatar%20copy.png?alt=media&token=966c07c4-125a-490f-81be-4e2d26bf33fa'
  	}
  },
  methods: {
  },
  beforeDestroy () {
    this.$store.dispatch('clearErrors')
  }
}
</script>