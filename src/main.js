import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './firebaseConfig'
import Croppa from 'vue-croppa'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VTooltip from 'v-tooltip'
import vClickOutside from 'v-click-outside'
import VueGoodTablePlugin from 'vue-good-table'
import * as VueGoogleMaps from "vue2-google-maps"
import {GmapMarker} from 'vue2-google-maps/src/components/marker'
import GmapCluster from 'vue2-google-maps/dist/components/cluster'
import VueMask from 'v-mask'
import 'vue-good-table/dist/vue-good-table.css'
import './assets/sass/main.scss'
const fb = require('./firebaseConfig.js')

Vue.component('v-select', vSelect)
Vue.use(VueGoodTablePlugin);
Vue.use(Croppa);
Vue.use(VueMask);
Vue.use(VTooltip)
Vue.use(vClickOutside)
Vue.use(require('vue-moment'))
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBvT8-4gdOJ8CRHv2mD_MAohqD8vo0To10',
    libraries: 'places' // necessary for places input
  }
})

Vue.config.productionTip = false
Vue.config.devtools = true


Vue.filter('uppercase', function (value) {
  return value.toUpperCase()
})

Vue.filter('lowercase', function (value) {
  return value.toLowerCase()
})

Vue.filter('readMore', function (text, length, suffix) {
  return text.substring(0, length) + suffix;
})

let app
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }

  if (user) {
    store.dispatch('fetchUserProfile', user)
  }
})