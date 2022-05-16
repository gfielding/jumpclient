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
import VueGapi from 'vue-gapi'
import StarRating from 'vue-star-rating'
import VueClipboard from 'vue-clipboard2'
import 'vue-good-table/dist/vue-good-table.css'
import InstantSearch from 'vue-instantsearch';
import VueCryptojs from 'vue-cryptojs'
import VueHtmlToPaper from 'vue-html-to-paper';
import VueQr from 'vue-qr'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import 'instantsearch.css/themes/satellite-min.css';
import './assets/sass/main.scss'
const fb = require('./firebaseConfig.js')

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/PrintCss%2Fprint.css?alt=media&token=1a9b8c56-cef9-4842-ade6-1b44c9856497'
  ],
  timeout: 1000, // default timeout before the print window appears
  autoClose: true, // if false, the window will not close after printing
  windowTitle: "MVP Event Staffin Checkin-Checkout", // override the window title
}

Vue.use(VueHtmlToPaper, options);
Vue.component('v-select', vSelect)
Vue.use(VueGoodTablePlugin)
Vue.use(InstantSearch)
Vue.use(Croppa)
Vue.use(VueQr)
Vue.use(VueMask)
Vue.use(VueCryptojs)
Vue.use(StarRating)
Vue.use(VTooltip)
Vue.use(VueClipboard)
Vue.use(vClickOutside)
Vue.use(VueMoment, {
    moment,
})
Vue.use(VueGoogleMaps, {
  load: {
    // key: 'AIzaSyBvT8-4gdOJ8CRHv2mD_MAohqD8vo0To10',
    key: 'AIzaSyA2Zh7agJPBfwU_VX4rHYazUqrFBWEfuuU',
    libraries: 'places' // necessary for places input
  }
})

Vue.use(VueGapi, {
  apiKey: 'AIzaSyAodk6UTPCONDk1ANHsgvhMDXvaLD0710M',
  clientId: '79524683437-sgf8m6ag6okpijaghonr3hpu6rlfc9q0.apps.googleusercontent.com',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scope: 'https://www.googleapis.com/auth/spreadsheets',
})

Vue.config.productionTip = false
Vue.config.devtools = true

Vue.filter('moment', function (value, format) {
  if (value === null || value === undefined || format === undefined) {
    return ''
  }
  if (format === 'from') {
    return moment(value).fromNow()
  }
  return moment(value).format(format)
})


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

  // if (user) {
  //   store.dispatch('fetchUserProfile', user)
  // }
})