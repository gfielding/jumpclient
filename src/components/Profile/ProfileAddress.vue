<template>
	<div>
    <h2 class="mb-3">Address</h2>
    <form ref="form" @submit.prevent v-model="valid">
      <div v-if="userProfile.address && Object.keys(userProfile.address).length >= 1">
      <div class="caption bold">Current Address:</div>
        <div class="caption">{{userProfile.address.street_number}} {{userProfile.address.street}} <span v-if="userProfile.address.unit">#{{userProfile.address.unit}}</span><br />{{userProfile.address.city}}, {{userProfile.address.state}} {{userProfile.address.zip}}</div>
        <hr>
        <div class="mb-2 mt-3">Change your address below:</div>

      </div>
      <div v-if="!userProfile.address || Object.keys(userProfile.address).length === 0">
        <div>Please enter your address below:</div>
      </div>

      <label>
        <gmap-autocomplete
          class="v-input v-input__control outline-fix"
          @place_changed="setPlace" placeholder="Address">
        </gmap-autocomplete>
      </label>
    </form>
	</div>
</template>

<script>
export default {
  props: ['userProfile'],
  data: () => ({
    valid: true,
    center: { lat: 45.508, lng: -73.587 },
    marker: {},
    address: {},
    place: '',
  }),
  computed: {
    complete () {
      if 
      (this.userProfile.address && Object.keys(this.userProfile.address).length >= 1)
      {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    updateProfile(){
      let userProfile = this.userProfile
      this.$store.dispatch('updateUser', userProfile)
    },
    setPlace(place) {
      this.currentPlace = place
        if (this.currentPlace) {
          const marker = {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
          };
          this.marker = {position: marker}
          this.place = this.currentPlace
          this.userProfile.center = marker;
          this.currentPlace = null;
        }
        if (place.address_components) {
          this.performingRequest = true
          this.userProfile.address = {}
          setTimeout(() => {
              this.performingRequest = false
          }, 1000)
          console.log(this.userProfile.address)
          var components = place.address_components;
          for (var i = 0, component; component = components[i]; i++) {
          if (component.types[0] == 'street_number') {
              this.userProfile.address.street_number = component['long_name'];
          }
          if (component.types[0] == 'route') {
              this.userProfile.address.street = component['long_name'];
          }
          if (component.types[0] == 'locality') {
              this.userProfile.address.city = component['long_name'];
          }
          if (component.types[0] == 'administrative_area_level_1') {
              this.userProfile.address.state = component['short_name'];
          }
          if (component.types[0] == 'country') {
              this.userProfile.address.country = component['short_name'];
          }
          if (component.types[0] == 'postal_code') {
              this.userProfile.address.zip = component['short_name'];
          }
        }
      }
      this.updateProfile()
      this.$emit('clicked', this.valid)
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.$emit('clicked', this.valid)
    })
  },
  beforeDestroy () {
  	this.$store.dispatch('clearErrors')
  }
}
</script>