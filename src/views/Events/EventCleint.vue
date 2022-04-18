<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <div>
          <div class="flex align-center">
          <h1 v-if="event">{{event.title}} Check-In</h1>
          <!-- <button class="btn btn__large btn__danger ml-5" v-if="event && event.cancelled">
            Cancelled
          </button> -->
          </div>
            <!-- <h2 v-if="event &&event.title">Staff Placements for {{event.title}}</h2> -->
            <span v-if="event && event.venue && event.venue.title">
            <p>{{event.venue.title}}<span v-if="event.venue && event.venue.address"> | {{event.venue.address.city}}, {{event.venue.address.state}}</span> | {{event.startDate | moment("ddd, MMM Do YYYY") }}<span v-if="event.endDate"> - {{event.endDate | moment("ddd, MMM Do YYYY") }}</span></p>
          </span> 
        </div>

        <div class="flex align-center justify-flex-end">
          <button class="btn btn__flat" @click="goBack()"><i class="fas fa-arrow-left fa-2x"></i></button>
        </div>
      </div>
      <!-- <Loader v-if="!eventUsers || eventUsers.length < 1" /> -->
    	<div class="dashboard__container--body pt-3">
        <div class="dashboard__container--body--col">
          <vue-good-table
              :columns="columns"
              :rows="filteredUsers"
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

              <span v-else-if="props.column.field == 'notes'">
                <button class="icon mr-2 ml-2" v-if="props.row.note" v-tooltip="props.row.note">
                  <i class="far fa-sticky-note"></i>
                </button>
              </span>

              <span v-if="props.column.field == 'moreInfo'" class="flex">

                        

                        <span v-if="!props.row.skills || props.row.skills.length == 0">
                          <i class="fad fa-briefcase ml-2 mr-2" style="opacity:50%;"></i>
                        </span>
                        <span v-if="props.row.skills && props.row.skills.length > 0">
                          <v-popover>
                            <i class="fad fa-briefcase ml-2 mr-2 success"></i>
                            <template slot="popover">
                              <span v-for="z in props.row.skills">{{z.title}} / </span>
                            </template>
                          </v-popover>
                        </span>

                        <!-- <span v-if="!props.row.blacklist || props.row.blacklist.length == 0">
                          <i class="fas fa-exclamation-triangle ml-2 mr-2" style="opacity:50%;"></i>
                        </span>
                        <span v-if="props.row.blacklist && props.row.blacklist.length > 0">
                          <v-popover>
                            <i class="fas fa-exclamation-triangle ml-2 mr-2 danger"></i>
                            <template slot="popover">
                              <span v-for="z in props.row.blacklist">{{z.title}} / </span>
                            </template>
                          </v-popover>
                        </span>

                        <span v-if="!props.row.groups || props.row.groups.length == 0">
                          <i class="fa-solid fa-user-group ml-2 mr-2" style="opacity:50%;"></i>
                        </span>
                        <span v-if="props.row.groups && props.row.groups.length > 0">
                          <v-popover>
                            <i class="fa-solid fa-user-group ml-2 mr-2 blueHue"></i>
                            <template slot="popover">
                              <span v-for="z in props.row.groups">{{z}} / </span>
                            </template>
                          </v-popover>
                        </span>

                        <span v-if="!props.row.certs || props.row.certs.length == 0">
                          <i class="fa-solid fa-certificate ml-2 mr-2" style="opacity:50%;"></i>
                        </span>
                        <span v-if="props.row.certs && props.row.certs.length > 0">
                          <v-popover>
                            <i class="fa-solid fa-certificate ml-2 mr-2 orangeHue"></i>
                            <template slot="popover">
                              <span v-for="z in props.row.certs">{{z.type}} / </span>
                            </template>
                          </v-popover>
                        </span>

                        <span v-if="props.row.fullyVaccinated && props.row.fullyVaccinated === `yes`">
                          <v-popover>
                          <i class="fa-solid fa-virus-covid ml-2 mr-2 success"></i>
                          <template slot="popover">
                              <span>Vaccinated</span>
                            </template>
                          </v-popover>
                        </span>
                        <span v-if="!props.row.fullyVaccinated">
                          <v-popover>
                            <i class="fa-solid fa-virus-covid ml-2 mr-2" style="opacity:50%;"></i>
                            <template slot="popover">
                              <span>Not Vaccinated</span>
                            </template>
                          </v-popover>
                        </span>
                        <span v-if="props.row.fullyVaccinated && props.row.fullyVaccinated === `no`">
                          <v-popover>
                            <i class="fa-solid fa-virus-covid ml-2 mr-2 danger"></i>
                            <template slot="popover">
                              <span>Not Vaccinated</span>
                            </template>
                          </v-popover>
                        </span> -->
                      </span>

                      <span v-if="props.column.field == 'phone'">
                        <span v-if="props.row.phone">
                          <a :href="'sms:' + props.row.phone" class="darkLink">{{props.row.phone}}</a>
                        </span>
                      </span>

                      <span v-if="props.column.field == 'assigned'">
                        <v-select
                          label="label" 
                          :options="event.venue.job || venueInfo.job"
                          v-model="props.row.job"
                          @input="updateAssignment(props.row)"
                          >
                        </v-select>
                      </span>

                      <span v-if="props.column.field == 'start'">
                        <input type="time" v-model.trim="props.row.start" id="start" @change="updateAssignment(props.row)" />
                      </span>
                      <span v-if="props.column.field == 'end'">
                        <input type="time" v-model.trim="props.row.end" id="end" @change="updateAssignment(props.row)" />
                      </span>


                <span v-else-if="props.column.field == 'days'">
                <span v-if="(props.row)">
                  {{props.row.start}}
                </span>
              </span>
              <span v-else-if="props.column.field == 'reservations'" class="flex">
                  <span v-if="
                    (props.row.dayStatus != 'hired') &&
                    (props.row.dayStatus != 'assigned') &&
                    (props.row.dayStatus != 'not requested')
                  ">
                    <button class="icon mr-2 ml-2" @click="reserveUser(props.row)" v-tooltip="'reserve user'">
                      <i class="far fa-calendar"></i>
                    </button>
                  </span>
                  <span v-if="
                    (props.row.dayStatus == 'hired' || props.row.dayStatus == 'assigned')
                  " style="display:inline;">
                    <button class="icon mr-2 ml-2" v-tooltip="'cancel reservation'" @click="unreserveUser(props.row)">
                      <i class="fas fa-calendar-check" style="color:green;"></i>
                    </button>
                  </span>

                  <span v-if="
                    (props.row.dayStatus != 'hired') &&
                    (props.row.dayStatus != 'assigned') &&
                    (props.row.dayStatus != 'not requested')"
                    style="display:inline;">
                    <button class="icon mr-2 ml-2" v-tooltip="'not use this staff today'" @click="notRequestUser(props.row)">
                      <i class="fas fa-calendar-times"></i>
                    </button>
                  </span>

                  <span v-if="
                    (props.row.dayStatus == 'not requested')
                  " style="display:inline;">
                    <button class="icon mr-2 ml-2" v-tooltip="'cancel cancellation'" @click="cancelNotRequestUser(props.row)">
                      <i class="fas fa-calendar-times" style="color:red;"></i>
                    </button>
                  </span>
              </span>

              <span v-else-if="props.column.field == 'fullName'">
                <router-link :to="'/users/' + props.row.userId" class="darkLink">
                  {{props.row.fullName}}
                </router-link>
                <div class="flex justify-flex-start mt-1">
                  <star-rating :read-only="true" :star-size="12" v-if="props.row && props.row.rating" v-model="props.row.rating" class="caption"></star-rating>
                  <span v-if="props.row && props.row.rating && props.row.points" class="ml-2 mr-2">
                   | 
                  </span>
                  <span v-if="props.row && props.row.points" class="caption flex align-center">
                  {{props.row.points}} Points
                  </span>
                </div>
              </span>

              <span v-else-if="props.column.field == 'day'">
                {{props.row.day}}
              </span>

              <span v-else-if="props.column.field == 'delete'">

                <button class="icon mr-2 ml-2" v-if="!props.row.showTrash" v-tooltip="'delete instance'" @click="showTrash(props)">
                  <i class="fas fa-times"></i>
                </button>

                <button class="icon mr-2 ml-2" v-if="props.row.showTrash" v-tooltip="'cancel'" @click="hideTrash(props)">
                  <i class="fas fa-times"></i>
                </button>

                <button class="icon mr-2 ml-2" v-if="props.row.showTrash" v-tooltip="'delete instance'" @click="deleteUser(props.row)">
                  <i class="fas fa-trash"></i>
                </button>
              </span>
              <span v-else-if="props.column.field == 'requestedJob.title'">
                <span v-if="props.row.requestedJob && props.row.requestedJob.title">
                   {{props.row.requestedJob.title}}
                </span>
              </span>
              <span v-else>
                <!-- {{props.formattedRow[props.column.field]}} -->
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
import * as moment from 'moment'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'eventcheckin',
  components: {
    Loader,
  },
  data() {
    return {
      performingRequest: false,
      columns: [
        // {
        //   label: '',
        //   field: 'preview',
        //   sortable: false,
        // },
        {
          label: '',
          field: 'photoUrl',
          sortable: false,
          width:'42px',
          tdClass: 'text-center',
        },
        {
          label: 'Name',
          field: 'fullName',
          width:'200px',
        },
        {
          label: '',
          field: 'moreInfo',
          sortable: false,
        },
        // {
        //   label: 'Phone',
        //   field: 'phone',
        //   sortable: false,
        //   width:'120px',
        // },

        // {
        //   label: 'Signed Up',
        //   field: 'created',
        //   sortable: false,
        //   width:'120px',
        // },
        // {
        //   label: 'Start Time',
        //   field: 'start',
        //   width:'120px',
        // },
        // {
        //   label: 'End Time',
        //   field: 'end',
        //   width:'120px',
        // },
        // {
        //   label: 'Day',
        //   field: 'day',
        // },
        // {
        //   label: '',
        //   field: 'days',
        // },
        {
          label: 'Requested Job',
          field: 'requestedJob.title',
          sortable: false,
          width:'140px',
        },
        // {
        //   label: 'Assigned Job',
        //   field: 'assigned',
        //   sortable: false,
        //   width:'120px',
        // },
        // {
        //   label: '',
        //   field: 'jobs',
        //   tdClass: 'text-center',
        //   sortable: false,
        // },
        // {
        //   label: '',
        //   field: 'extras',
        //   tdClass: 'text-center',
        //   sortable: false,
        // },
        // {
        //   label: '',
        //   field: 'vaccinated',
        //   tdClass: 'text-center',
        //   sortable: false,
        // },
        {
          label: '',
          field: 'notes',
          sortable: false,
          tdClass: 'text-center',
        },
        // {
        //   label: '',
        //   field: 'reservations',
        //   tdClass: 'text-center',
        //   sortable: false,
        // },
        
        // {
        //   label: '',
        //   field: 'delete',
        //   tdClass: 'text-center',
        //   sortable: false,
        // },
      ],
    }
  },
  created () {
    this.$store.dispatch("getEventCheckin", this.$route.params.id)
  },
  computed: {
    ...mapState(['currentUser', 'venueInfo', 'eventUsers', 'eventShifts', 'eventInfo', 'eventDrops']),
    event() {
      return this.eventInfo
    },
    activeDay() {
      if (this.eventInfo.days) {
        return this.newActiveDay ? this.newActiveDay : this.eventInfo.days[0]
      }
    },
    filteredUsers () {
      return this.eventUsers.filter(user => {
        // return user.status == 'available'
        return ((user.status != 'placed') && (user.status != 'assigned') && (user.day == this.activeDay))
      })
    },
    
    filteredPlacedUsers () {
      return this.eventUsers.filter(user => {
        return ((user.status == 'placed') || (user.status == 'assigned'))
      })
    },
    activeShifts() {
      return this.eventShifts.filter(shift => {
        return (shift.day == this.activeDay || shift.day.includes(this.activeDay))
      })
    },
  },
  methods: {
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMM Do YYYY')
      } else {
        return null
      }
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch("clearEventUsers")
    this.$store.dispatch("clearUsersState")
    this.$store.dispatch("clearEventState")
    this.$store.dispatch('clearVenueState')
    this.$store.dispatch("clearEventShiftsState")
    this.columns = null
    delete this.columns
    this.columns2 = null
    delete this.columns2
    console.log(this)
  }
}
</script>