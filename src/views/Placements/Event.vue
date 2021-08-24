<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header mb-3" v-if="event">
        <h1 v-if="event.title">Staff Placements for {{event.title}}</h1>
        <div class="flex align-center"> 
	        <!-- <button class="btn btn__flat mr-3" @click="exportAll()">export all</button> -->
	        <button class="btn btn__icon" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
        </div>
      </div>
      <div class="dashboard__container--body" v-if="eventUsers">
        <div class="dashboard__container--body--col">
          <vue-good-table
              :columns="columns"
              :rows="eventUsers"
              :search-options="{
                enabled: true,
                placeholder: 'Search this table',
              }"
              :pagination-options="{
                enabled: true,
                mode: 'records',
                perPage: 20,
              }"
            >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'created'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
              <span v-else-if="props.column.field == 'notes'">
                <button class="icon" v-if="props.row.note" v-tooltip="props.row.note">
                  <i class="far fa-sticky-note"></i>
                </button>
              </span>
              <span v-else-if="props.column.field == 'state'">
                <span v-if="(props.row)">
                  <span v-for="u in filteredInfo(props.row)">
                    <span v-if="u && u.address && u.address.city && u.address.state" style="display:inline;">
                      <span v-tooltip="u.address.city">{{u.address.state}}</span>
                    </span>
                  </span>
                </span>
              </span>
              <span v-else-if="props.column.field == 'days'">
                <span v-if="(props.row)">
                  {{props.row.start}}
                  <!-- <span v-for="day in filteredInfo(props.row)">
                  </span> -->
                </span>
              </span>
              <span v-else-if="props.column.field == 'extras'">
                <span v-if="(props.row)">
                    <span v-for="u in filteredInfo(props.row)">
                      <v-popover>
                        <button class="tooltip-target" style="display:inline;"><i class="fas fa-th"></i></button>
                        <template slot="popover">
                          <p>
                            Vaccinated: {{u.fullyVaccinated || ''}}
                          </p>
                          <p>
                            Contractor: {{u.contractorStatus || ''}}
                          </p>
                          <p>
                            Employee: {{u.employeeStatus || ''}}
                          </p>
                          <p>
                            Alcohol Cert: <span v-if="u.certTips">yes</span><span v-else>false</span>
                          </p>
                          <p v-for="job in u.skills">{{job.title}}</p>
                          <p v-for="client in u.blacklist" class="danger">{{client.title}}</p>
                        </template>
                      </v-popover>
                      <!-- <span v-if="u && u.address && u.address.city && u.address.state" style="display:inline;">
                        <button class="icon" v-tooltip="u.address.city + ', ' + u.address.state">
                          <i class="fas fa-map-marker"></i>
                        </button>
                      </span> -->
                     <!--  <span v-for="client in u.blacklist" style="display:inline;">
                        <button class="icon" v-tooltip="client.title">
                          <i class="fas fa-exclamation-triangle" style="color:red;"></i>
                        </button>
                      </span> -->
                    </span>
                  

                    <!-- <span v-if="u.fullyVaccinated == 'yes'" style="display:inline; margin-right: 1.5rem;">
                          <i class="fas fa-syringe" style="color:#5cb85c;"></i>
                        </span>
                        <span v-if="u.fullyVaccinated == 'no'" style="display:inline; margin-right: 1.5rem;">
                          <i class="fas fa-syringe" style="color:#d9534f;"></i>
                        </span>
                        <span v-if="!u.fullyVaccinated || u.fullyVaccinated == null" style="display:inline; margin-right: 1.5rem;">
                          <i class="fas fa-syringe"  style="opacity:0.25;"></i>
                        </span> -->

                    <!-- <span v-if="u.contractorStatus == 'applied' || !u.contractorStatus" style="display:inline; margin-right: 1.5rem;">
                          <button class="icon" v-tooltip="'C - ' + u.contractorStatus">
                            <i class="fas fa-hammer"  style="opacity:0.25;"></i>
                          </button>
                        </span>

                        <span v-if="u.contractorStatus == 'payroll invitation'" style="display:inline; margin-right: 1.5rem;">
                          <button class="icon" v-tooltip="'C - ' + u.contractorStatus">
                            <i class="fas fa-hammer" style="color:#f0ad4e;"></i>
                          </button>
                        </span>

                        <span v-if="u.contractorStatus == 'hired contractor'" style="display:inline; margin-right: 1.5rem;">
                          <button class="icon" v-tooltip="'C - ' + u.contractorStatus">
                            <i class="fas fa-hammer" style="color:#5cb85c;"></i>
                          </button>
                        </span>

                        <span v-if="u.employeeStatus == 'hired employee'" style="display:inline; margin-right: 1.5rem;">
                          <button class="icon" v-tooltip="'E - ' + u.employeeStatus">
                            <i class="fas fa-user" style="color:#5cb85c;"></i>
                          </button>
                        </span>

                        <span v-if="u.employeeStatus == 'payroll invitation'" style="display:inline; margin-right: 1.5rem;">
                          <button class="icon" v-tooltip="'E - ' + u.employeeStatus">
                            <i class="fas fa-user" style="color:#f0ad4e;"></i>
                          </button>
                        </span>

                        <span v-if="u.employeeStatus == 'applied' || !u.employeeStatus" style="display:inline; margin-right: 1.5rem;">
                          <button class="icon" v-tooltip="'E - ' + u.employeeStatus">
                            <i class="fas fa-user"></i>
                          </button>
                        </span> -->


                    

                    <!-- <span style="display:inline; margin-right: 1.5rem;">
                      <button class="icon" v-tooltip="'TIPS Certification'">
                        <i class="fas fa-file-certificate" style="color:green;" v-if="u.certTips"></i>
                        <i class="fas fa-file-certificate" v-if="!u.certTips" style="color:red;"></i>
                      </button>
                    </span> -->
                  
                    

                    <!-- <v-popover v-if="u.skills && u.skills.length >= 1" style="display:inline;">
                      <button class="icon" style="display:inline; margin-right: 1.5rem;">
                        <i class="fas fa-briefcase"></i>
                      </button>
                      <template slot="popover">
                        <span v-for="job in u.skills">{{job.title}} / </span>
                      </template>
                    </v-popover> -->

                    <!-- <router-link :to="'/users/' + u.id" style="display:inline; margin-right: 1.5rem;">
                      <i class="fas fa-external-link" style="color:mediumblue;"></i>
                    </router-link> -->



                  </span>
                </span>
              </span>
              <span v-else-if="props.column.field == 'reservations'">
                  <span v-if="
                    (props.row.dayStatus != 'hired') &&
                    (props.row.dayStatus != 'assigned') &&
                    (props.row.dayStatus != 'not requested')
                  " style="display:inline; margin-right: 1.5rem;">
                    <button class="icon" @click="reserveUser(props.row)" v-tooltip="'reserve user'">
                      <i class="far fa-calendar"></i>
                    </button>
                  </span>
                  <span v-if="
                    (props.row.dayStatus == 'hired' || props.row.dayStatus == 'assigned')
                  " style="display:inline;">
                    <button class="icon" v-tooltip="'cancel reservation'" @click="unreserveUser(props.row)">
                      <i class="fas fa-calendar-check" style="color:green;"></i>
                    </button>
                  </span>

                  <span v-if="
                    (props.row.dayStatus != 'hired') &&
                    (props.row.dayStatus != 'assigned') &&
                    (props.row.dayStatus != 'not requested')"
                    style="display:inline;">
                    <button class="icon" v-tooltip="'not use this staff today'" @click="notRequestUser(props.row)">
                      <i class="fas fa-calendar-times"></i>
                    </button>
                  </span>

                  <span v-if="
                    (props.row.dayStatus == 'not requested')
                  " style="display:inline;">
                    <button class="icon" v-tooltip="'cancel cancellation'" @click="cancelNotRequestUser(props.row)">
                      <i class="fas fa-calendar-times" style="color:red;"></i>
                    </button>
                  </span>
              </span>

              <span v-else-if="props.column.field == 'fullName'">
                <router-link :to="'/users/' + props.row.userId">
                  {{props.row.fullName}}
                </router-link>
              </span>
              <span v-else-if="props.column.field == 'delete'">

                <button class="icon" v-if="!props.row.showTrash" v-tooltip="'delete instance'" @click="showTrash(props)">
                  <i class="fas fa-times"></i>
                </button>

                <button class="icon" v-if="props.row.showTrash" v-tooltip="'cancel'" @click="hideTrash(props)">
                  <i class="fas fa-times"></i>
                </button>

                <button class="icon" v-if="props.row.showTrash" v-tooltip="'delete instance'" @click="deleteUser(props.row)" style="margin-left: 1.5rem;">
                  <i class="fas fa-trash"></i>
                </button>
              </span>
              <span v-else>
                {{props.formattedRow[props.column.field]}}
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
import * as moment from 'moment'
import router from '@/router'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'eventplacement',
  data() {
    return {
      columns: [
        {
          label: 'Name',
          field: 'fullName',
        },
        {
          label: '',
          field: 'created',
        },
        {
          label: '',
          field: 'days',
        },
        {
          field: 'state',
          tdClass: 'text-center',
          sortable: false,
        },
        {
          label: '',
          field: 'notes',
          sortable: false,
          tdClass: 'text-center',
        },
        {
          label: '',
          field: 'reservations',
          sortable: false,
        },
        {
          label: '',
          field: 'extras',
          tdClass: 'text-center',
          sortable: false,
        },
        {
          label: '',
          field: 'delete',
          tdClass: 'text-left',
          sortable: false,
        },
      ],
    }
  },
  components: {
    Loader
  },
  created () {
    this.$store.dispatch("getEventPlacementFromId", this.$route.params.id)
    if (!this.users || this.users.length < 1) {
      this.$store.dispatch("getUsers")
    }
  },
  watch: {
    '$route' (to, from) {
      this.$store.dispatch("getEventPlacementFromId", this.$route.params.id)
    }
  },
  computed: {
    ...mapState(['eventUsers', 'eventInfo', 'users']),
    event() {
      return this.eventInfo 
    },
    mergedsUsers() {
      if (this.eventUsers)
      return Object.assign({}, this.eventUsers);
    }
  },
  methods: {
    goBack() {
      router.go(-1)
    },
    reserveUser(user) {
      fb.usersCollection.doc(user.userId).get()
      .then(
        doc => {
          let dateObj = new Date(this.day);
          let month = dateObj.getUTCMonth() + 1;
          let day = dateObj.getUTCDate();
          let year = dateObj.getUTCFullYear();
          let newdate = month + "/" + day + "/" + year;
          console.log(newdate)
          console.log(user.id)
          fb.userDaysCollection.doc(user.id).update({
            dayStatus: 'hired',
            email: doc.data().email,
            phone: doc.data().phone,
            dateFormat: newdate
          })
        }
      )
    },
    notRequestUser(user) {
      fb.userDaysCollection.doc(user.id).update({ dayStatus: 'not requested' })
    },
    unreserveUser(user) {
      fb.userDaysCollection.doc(user.id).update({dayStatus: null})
    },
    cancelNotRequestUser(user) {
      fb.userDaysCollection.doc(user.id).update({dayStatus: null})
    },
    filteredInfo(user) {
      return this.users.filter(member => {
        return member.id == user.userId
      })
    },
    formatAMPM(date) {
      if (typeof date === "string") {
        let [hours, minutes] = date.split(":");
        let ampm = "AM";

        if (Number(hours) >= 12) {
          hours = Number(hours) - 12;
          ampm = "PM";
        }

        return `${hours}:${minutes} ${ampm}`;

      } else if (date instanceof Date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();

        let ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        let strTime = hours + ":" + minutes + " " + ampm;

        return strTime;
      }

      return date;
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY')
      } else {
        return null
      }
    },
  },
  beforeDestroy () {
    this.$store.dispatch("clearEventUsers")
    console.log(this)
  }
}
</script>
