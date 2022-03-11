f<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header mb-3" v-if="event">
        <div>
          <div class="flex align-center">
          <h1>{{eventInfo.title}} Staff Placements</h1>
          <button class="btn btn__large btn__danger ml-5" v-if="eventInfo && eventInfo.cancelled">
            Cancelled
          </button>
        </div>
          <!-- <h2 v-if="event &&event.title">Staff Placements for {{event.title}}</h2> -->
          <span v-if="event && event.venue && event.venue.title">
          <p>{{event.venue.title}}<span v-if="event.venue && event.venue.address"> | {{event.venue.address.city}}, {{event.venue.address.state}}</span> | {{event.startDate | moment("ddd, MMM Do YYYY") }}<span v-if="event.endDate"> - {{event.endDate | moment("ddd, MMM Do YYYY") }}</span></p>
        </span> 
        </div>
        <span>
          <button class="btn btn__outlined mr-3" @click="exportAll()">export all</button>
          <button class="btn btn__outlined mr-3" @click="exportPlaced()">export placed</button>
          <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
        </span>
      </div>
      <div class="dashboard__container--body mb-3" v-if="event && event.days && event.days.length > 1">
        <div>
          <button v-for="(day, index) in event.days" key="index" class="btn mr-3" v-bind:class="{ 'btn__dark': activeDay == day, 'btn__outlined': activeDay != day }" @click="setActiveDay(day)">{{day}}</button>
        </div>
      </div>
      
      <div class="dashboard__container--body">
        <div class="dashboard__container--body--col">
          <Loader v-if="!eventUsers || eventUsers.length < 1" />

          <ais-instant-search :search-client="searchClient" index-name="a_users" >
            <ais-search-box placeholder="Add User..." />
            <ais-state-results>
              <template slot-scope="{ state: { query } }">
                <ais-hits v-show="query.length > 0">
                  <template v-slot:item="{ item }">
                    <div>
                      <button @click="addUser(item)" class="btn btn__icon btn__flat mr-4">
                        </span>
                        <i class="fas fa-plus" style="color:blue;" v-if="!performingRequest"></i>
                        <i class="fa fa-spinner fa-spin" style="color:blue;" v-if="performingRequest"></i>
                      </button>
                      <p style="display: inline;">{{ item.firstName }} {{ item.lastName }} | <span v-if="item.address && item.address">{{item.address.city}} | </span>{{item.email}} | {{item.phone}}</p style="display: inline;">
                    </div>
                  </template>
                </ais-hits>
              </template>
            </ais-state-results>
          </ais-instant-search>

          <button class="btn btn__outlined mb-2 mt-3" @click="exportUnplaced()">export unplaced</button>
          <vue-good-table
              :columns="columns"
              :rows="filteredUsers"
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

              <span v-if="props.column.field == 'preview'">
                <i class="far fa-search ml-2 mr-2" @click="showModal(props.row)"></i>
                <UserModal v-if="modalValue == props.row" @close="closeModal" :staff="modalValue" />
              </span>

              
              <span v-else-if="props.column.field == 'created'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
              <span v-else-if="props.column.field == 'notes'">
                <button class="icon" v-if="props.row.note" v-tooltip="props.row.note">
                  <i class="far fa-sticky-note"></i>
                </button>
              </span>



              <!-- <span v-else-if="props.column.field == 'photoUrl'">
                <img v-if="props.row.photoUrl" :src="props.row.photoUrl" alt="" style="width:40px;">
                <img v-if="!props.row.photoUrl" src="https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/avatar%20copy.png?alt=media&token=966c07c4-125a-490f-81be-4e2d26bf33fa" alt="" style="width:40px;">
              </span> -->

              
              <!-- <span v-else-if="props.column.field == 'jobs'">
                <span v-if="(props.row)">
                  <span v-for="u in filteredInfo(props.row)">
                    <span v-if="u && u.skills && u.skills.length > 0" style="display:inline;">
                      <v-popover>
                        <i class="fad fa-briefcase"></i>
                        <template slot="popover">
                        <span v-for="z in u.skills">{{z.title}} / </span>
                      </template>
                      </v-popover>
                    </span>
                  </span>
                </span>
              </span> -->
<!--               <span v-else-if="props.column.field == 'extras'">
                        <span v-if="(props.row)">
                          <span v-for="u in filteredInfo(props.row)" style="display:flex; justify-content: space-evenly;"> -->

                            <!-- <span v-if="u.points" style="display:inline; color:#0d3fd1;" class="ml-2 mr-2">
                              {{u.points}}
                            </span>

                            <span v-if="u.rating" style="display:inline; color:#c5950d;" class="ml-2 mr-2">
                              {{u.rating}}
                            </span> -->

                            <!-- <span v-if="u.blacklist && u.blacklist.length >=1" style="display:inline;">
                              <v-popover>
                                <i class="fas fa-exclamation-triangle ml-2 mr-2" style="color:red;"></i>
                                <template slot="popover">
                                <span v-for="z in u.blacklist">{{z.title}}</span>
                              </template>
                              </v-popover>
                            </span> -->

                            <!-- <span v-if="u && u.skills && u.skills.length > 0" style="display:inline;">
                            <v-popover>
                                <i class="fad fa-briefcase ml-2 mr-2"></i>
                                <template slot="popover">
                                <span v-for="z in u.skills">{{z.title}} / </span>
                              </template>
                              </v-popover>
                            </span> -->

                            <!-- <span v-if="u && u.groups && u.groups.length > 0" style="display:inline;">
                            <v-popover>
                                <i class="fad fa-bookmark ml-2 mr-2"></i>
                                <template slot="popover">
                                <span v-for="z in u.groups">{{z}} / </span>
                              </template>
                              </v-popover>
                            </span> -->

                            <!-- <span v-if="u && u.fullyVaccinated && u.fullyVaccinated == `yes`" style="display:inline;">
                              <i class="fas fa-syringe ml-2 mr-2" style="color: green;"></i>
                            </span> -->

<!-- 
                          </span>
                        </span>
                      </span>
               -->
              <!-- <span v-if="props.column.field == 'extras'">
                <span v-if="(props.row)">
                  
                    <span v-for="u in filteredInfo(props.row)">
                      <span v-if="u.blacklist && u.blacklist.length >=1">
                        <v-popover>
                          <i class="fas fa-exclamation-triangle" style="color:red;"></i>
                          <template slot="popover">
                          <span v-for="z in u.blacklist">{{z.title}}</span>
                        </template>
                        </v-popover>
                      </span>
                    </span>
                  </span>
                </span> -->
                <span v-else-if="props.column.field == 'days'">
                <span v-if="(props.row)">
                  {{props.row.start}}
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
                <router-link :to="'/users/' + props.row.userId" >
                  {{props.row.fullName}}
                </router-link>
              </span>

              <span v-else-if="props.column.field == 'day'">
                {{props.row.day}}
              </span>

              <span v-else-if="props.column.field == 'delete'">

                <button class="icon" v-if="!props.row.showTrash" v-tooltip="'delete instance'" @click="showTrash(props)">
                  <i class="fas fa-times ml-2 mr-2"></i>
                </button>

                <button class="icon" v-if="props.row.showTrash" v-tooltip="'cancel'" @click="hideTrash(props)">
                  <i class="fas fa-times ml-2 mr-2"></i>
                </button>

                <button class="icon" v-if="props.row.showTrash" v-tooltip="'delete instance'" @click="deleteUser(props.row)">
                  <i class="fas fa-trash ml-2 mr-2"></i>
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
            <div class="mt-5 mb-5"></div>
          <h3>Drops</h3>
          <vue-good-table
              :columns="columnsD"
              :rows="eventDrops"
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
              <span v-if="props.column.field == 'dropped'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
              <span v-else-if="props.column.field == 'notes'">
                <button class="icon" v-if="props.row.note" v-tooltip="props.row.note">
                  <i class="far fa-sticky-note"></i>
                </button>
              </span>
              <!-- <span v-else-if="props.column.field == 'jobs'">
                <span v-if="(props.row)">
                  <span v-for="u in filteredInfo(props.row)">
                    <span v-if="u && u.skills && u.skills.length > 0" style="display:inline;">
                      <v-popover>
                        <i class="fad fa-briefcase"></i>
                        <template slot="popover">
                        <span v-for="z in u.skills">{{z.title}} / </span>
                      </template>
                      </v-popover>
                    </span>
                  </span>
                </span>
              </span> -->
              <span v-else-if="props.column.field == 'extras'">
                        <span v-if="(props.row)">
                          <span v-for="u in filteredInfo(props.row)" style="display:flex; justify-content: space-evenly;">

                            <span v-if="u.rating" style="display:inline;" class="ml-2 mr-2">
                              {{u.rating}}
                            </span>

                            <span v-if="u.blacklist && u.blacklist.length >=1" style="display:inline;">
                              <v-popover>
                                <i class="fas fa-exclamation-triangle ml-2 mr-2" style="color:red;"></i>
                                <template slot="popover">
                                <span v-for="z in u.blacklist">{{z.title}}</span>
                              </template>
                              </v-popover>
                            </span>

                            <span v-if="u && u.skills && u.skills.length > 0" style="display:inline;">
                            <v-popover>
                                <i class="fad fa-briefcase ml-2 mr-2"></i>
                                <template slot="popover">
                                <span v-for="z in u.skills">{{z.title}} / </span>
                              </template>
                              </v-popover>
                            </span>

                            <span v-if="u && u.groups && u.groups.length > 0" style="display:inline;">
                            <v-popover>
                                <i class="fad fa-bookmark ml-2 mr-2"></i>
                                <template slot="popover">
                                <span v-for="z in u.groups">{{z}} / </span>
                              </template>
                              </v-popover>
                            </span>

                            <span v-if="u && u.fullyVaccinated && u.fullyVaccinated == `yes`" style="display:inline;">
                              <i class="fas fa-syringe ml-2 mr-2" style="color: green;"></i>
                            </span>


                          </span>
                        </span>
                      </span>
              
              <!-- <span v-if="props.column.field == 'extras'">
                <span v-if="(props.row)">
                  
                    <span v-for="u in filteredInfo(props.row)">
                      <span v-if="u.blacklist && u.blacklist.length >=1">
                        <v-popover>
                          <i class="fas fa-exclamation-triangle" style="color:red;"></i>
                          <template slot="popover">
                          <span v-for="z in u.blacklist">{{z.title}}</span>
                        </template>
                        </v-popover>
                      </span>
                    </span>
                  </span>
                </span> -->
                <span v-else-if="props.column.field == 'days'">
                <span v-if="(props.row)">
                  {{props.row.start}}
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
                  <i class="fas fa-times ml-2 mr-2"></i>
                </button>

                <button class="icon" v-if="props.row.showTrash" v-tooltip="'cancel'" @click="hideTrash(props)">
                  <i class="fas fa-times ml-2 mr-2"></i>
                </button>

                <button class="icon" v-if="props.row.showTrash" v-tooltip="'delete instance'" @click="deleteUser(props.row)">
                  <i class="fas fa-trash ml-2 mr-2"></i>
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
        <div class="dashboard__container--body--col alt-col">
          <div v-for="shift in activeShifts" :key="shift.id" style=" padding:1.6rem; background: white; margin-bottom:1.6rem;">
            <div class="flex align-center justify-space-between">
              <span>
                <h3>{{shift.day | moment("dddd, MMM Do") }}</h3>
                <span v-if="shift.position.title">{{shift.position.title}}, 
                  <span v-if="shift.startTime" class="ml-2"> {{ [ shift.startTime, "HH:mm" ] | moment("hh:mm A") }}</span> - 
                  <span v-if="shift.endTime">{{ [ shift.endTime, "HH:mm" ] | moment("hh:mm A") }}</span>
                </span>
              </span>
              <div>
                
                <button class="btn btn__outlined mb-2 mr-5" @click="exportStaff(shift)">export</button>
                <button class="btn btn__icon" @click="expand(shift)" v-if="shift.collapse"><i class="fas fa-chevron-up"></i></button>
                <button class="btn btn__icon" @click="collapse(shift)" v-if="!shift.collapse"><i class="fas fa-chevron-down"></i></button>
              </div>
            </div>
            <transition name="fade">
              <div v-if="shift.collapse == true">
                <div class="pt-2 mb-3">
                  <h4 v-if="shift.name">{{shift.name}} <span v-if="shift.location">/ {{shift.location}}</span></h4>
                  <!-- <p v-if="shift.position.title">{{shift.position.title}}, 
                    <span v-if="shift.startTime" class="ml-2"> {{ [ shift.startTime, "HH:mm" ] | moment("hh:mm A") }}</span> - 
                    <span v-if="shift.endTime">{{ [ shift.endTime, "HH:mm" ] | moment("hh:mm A") }}</span>
                  </p> -->

                  <button class="btn btn__flat chip mt-1">{{orderedPlacedUsers(shift).length}} / {{shift.staff}}</button>

                  <button class="btn btn__flat chip mt-1 ml-2" style="color:green; border-color:green;">{{confirmedPlacedUsers(shift).length}}</button>
                </div>

                <div>
                <textarea :id="shift" cols="30" rows="2" v-model="shift.newMessage"></textarea>
                <div class="flex justify-flex-end">
                  <button class="btn btn__outlined mb-3 mt-3" @click="messageShift(shift)" :disabled="!shift.newMessage">send message
                    <transition name="fade">
                      <span class="ml-2" v-if="performingRequest7">
                      <i class="fa fa-spinner fa-spin"></i>
                      </span>
                    </transition>
                  </button>
                </div>
              </div>

                <div class="pt-3" v-if="orderedUsers.length >= 1">
                  <v-select
                    label="fullName" 
                    :options="orderedUsers(shift)"
                    v-model="shift.selectedStaff"
                    @input="assignShift(shift)"
                    
                    >
                    <template #option="{ fullName, day, requestedJob }">
                      <span>{{ fullName }}<span v-if="requestedJob"> | {{requestedJob.title}}</span></span>
                    </template>
                  </v-select>
                </div>
                <div class="pt-3">
                  <vue-good-table
                    :columns="columns2"
                    :id="shift.id"
                    :ref="shift.id"
                    :rows="orderedPlacedUsers(shift)"
                     :select-options="{
                      enabled: true,
                      selectOnCheckboxOnly: true,
                    }"
                    >
                    <div slot="selected-row-actions">
                      <button class="btn btn__small btn__flat" @click="lockAll(shift)">Lock All <i class="fas fa-lock-alt"></i></button>
                    </div>
                    <template slot="table-row" slot-scope="props">
                      <span v-if="props.column.field == 'preview'">
                <i class="far fa-search ml-2 mr-2" @click="showModal(props.row)"></i>
                <UserModal v-if="modalValue == props.row" @close="closeModal" :staff="modalValue" />
              </span>
                      <!-- <span v-if="props.column.field == 'extras'">
                        <span v-if="(props.row)">
                          <span v-for="u in filteredInfo(props.row)" style="display:flex; justify-content: space-evenly;">

                            <span v-if="u.blacklist && u.blacklist.length >=1">
                              <v-popover>
                                <i class="fas fa-exclamation-triangle ml-2 mr-2" style="color:red;"></i>
                                <template slot="popover">
                                <span v-for="z in u.blacklist">{{z.title}}</span>
                              </template>
                              </v-popover>
                            </span>

                            <span v-if="u && u.skills && u.skills.length > 0" style="display:inline;">
                            <v-popover>
                                <i class="fad fa-briefcase ml-2 mr-2"></i>
                                <template slot="popover">
                                <span v-for="z in u.skills">{{z.title}} / </span>
                              </template>
                              </v-popover>
                            </span>

                            <span v-if="u && u.fullyVaccinated && u.fullyVaccinated == `yes`" style="display:inline;">
                              <i class="fas fa-syringe ml-2 mr-2" style="color: green;"></i>
                            </span>


                          </span>
                        </span>
                      </span> -->
  <!--                   </span> -->
                      <!-- <span v-else-if="props.column.field == 'jobs'">
                        <span v-if="(props.row)">
                          <span v-for="u in filteredInfo(props.row)">
                            <span v-if="u && u.skills && u.skills.length > 0" style="display:inline;">
                              <v-popover>
                                <i class="fad fa-briefcase"></i>
                                <template slot="popover">
                                <span v-for="z in u.skills">{{z.title}} / </span>
                              </template>
                              </v-popover>
                            </span>
                          </span>
                        </span>
                      </span>
                      <span v-else-if="props.column.field == 'vaccinated'">
                        <span v-if="(props.row)">
                          <span v-for="u in filteredInfo(props.row)">
                            <span v-if="u && u.vaccinated">
                              <i class="fas fa-syringe" style="color: green;"></i>
                            </span>
                          </span>
                        </span>
                      </span> -->
              
                      <span v-if="props.column.field == 'created'">
                        <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
                      </span>

                      <span v-if="props.column.field == 'phone'">
                        <span v-if="props.row.phone">
                          <a :href="'sms:' + props.row.phone">{{props.row.phone}}</a>
                        </span>
                      </span>


                      <span v-else-if="props.column.field == 'reservations'">
                      <span v-if="
                        (props.row.dayStatus != 'hired') &&
                        (props.row.dayStatus != 'assigned') &&
                        (props.row.dayStatus != 'not requested')
                      " style="display:inline; margin-right: 1.5rem;">
                        <button class="icon" @click="reserveUser(props.row)" v-tooltip="'reserve user'">
                          <i class="far fa-calendar ml-2 mr-2"></i>
                        </button>
                      </span>
                      <span v-if="
                        (props.row.dayStatus == 'hired' || props.row.dayStatus == 'assigned')
                      " style="display:inline;">
                        <button class="icon" v-tooltip="'cancel reservation'" @click="unreserveUser(props.row)">
                          <i class="fas fa-calendar-check ml-2 mr-2" style="color:green;"></i>
                        </button>
                      </span>

                      <span v-if="
                        (props.row.dayStatus != 'hired') &&
                        (props.row.dayStatus != 'assigned') &&
                        (props.row.dayStatus != 'not requested')"
                        style="display:inline;">
                        <button class="icon" v-tooltip="'not use this staff today'" @click="notRequestUser(props.row)">
                          <i class="fas fa-calendar-times ml-2 mr-2"></i>
                        </button>
                      </span>

                      <span v-if="
                        (props.row.dayStatus == 'not requested')
                      " style="display:inline;">
                        <button class="icon" v-tooltip="'cancel cancellation'" @click="cancelNotRequestUser(props.row)">
                          <i class="fas fa-calendar-times ml-2 mr-2" style="color:red;"></i>
                        </button>
                      </span>

                        <button v-if="props.row.dayStatus == 'hired' && props.row.status != 'assigned' && props.row.status != 'spinning'" class="icon" v-tooltip="'lock shift'" @click="lockShift(props, shift)" style="display:inline;">
                          <i class="fas fa-lock-open-alt ml-2 mr-2"></i>
                        </button>
                      

                      
                        <span class="icon" v-if="props.row.status == 'spinning'">
                        <i class="fa fa-spinner fa-spin ml-2 mr-2"></i>
                        </span>
                      
                      
                        <button class="icon" v-if="props.row.dayStatus == 'hired' && props.row.status == 'assigned'" style="display:inline;" @click="unlock(props, shift)">
                          <i class="fas fa-lock-alt ml-2 mr-2"></i>
                        </button>
                      
                    </span>

                    <span v-else-if="props.column.field == 'confirmed'">
                      <button v-if="!props.row.confirmed" class="icon" v-tooltip="'confirm'" @click="confirmPlacement(props)">
                        <i class="fas fa-check ml-2 mr-2" style="opacity: 0.3;"></i>
                      </button>
                      <button v-if="props.row.confirmed" class="icon" v-tooltip="'unconfirm'" @click="unConfirmPlacement(props)">
                        <i class="fas fa-check ml-2 mr-2" style="color:green"></i>
                      </button>
                    </span>

                    <span v-else-if="props.column.field == 'fullName'">
                      <router-link :to="'/users/' + props.row.userId">
                        {{props.row.fullName}}
                      </router-link>
                    </span>
                    <span v-else-if="props.column.field == 'notes'">
                      <button class="icon" v-if="props.row.note" v-tooltip="props.row.note">
                        <i class="far fa-sticky-note ml-2 mr-2"></i>
                      </button>
                    </span>
                    <span v-else-if="props.column.field == 'delete'">
                      <button v-if="props.row.status == 'placed'" class="icon" v-tooltip="'remove'" @click="removePlacement(props.row)">
                        <i class="fas fa-times ml-2 mr-2"></i>
                      </button>

                      <!-- <button v-if="props.row.status == 'assigned'" class="icon" v-tooltip="'remove'" @click="removeAssignment(props, shift)">
                        <i class="fas fa-times ml-2 mr-2"></i>
                      </button> -->
                    </span>
                      <span v-else-if="props.column.field == 'requestedJob.title'">
                        <span v-if="props.row.requestedJob && props.row.requestedJob.title">
                           {{props.row.requestedJob.title}}
                        </span>
                      </span>
                      <!-- <span v-else>
                        {{props.formattedRow[props.column.field]}}
                      </span> -->
                    </template>
                  </vue-good-table>
                </div>
              </div>
            </transition>
          </div>
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
import algoliasearch from 'algoliasearch/lite';
import ExportService from "@/services/ExportService"
import UserModal from "@/components/UserModal.vue";
const fb = require('../../firebaseConfig.js')

export default {
  name: 'eventplacement',
  data() {
    return {
      performingRequest: false,
      performingRequest7: false,
      newActiveDay: '',
      modalValue: null,
      searchClient: algoliasearch(
        '0T1SIY6Y1V',
        'f03dc899fbdd294d6797791724cdb402',
      ),
      columns: [
        {
          label: '',
          field: 'preview',
        },
        {
          label: 'Name',
          field: 'fullName',
        },
        {
          label: 'Signed Up',
          field: 'created',
          sortable: false,
        },
        // {
        //   label: 'Day',
        //   field: 'day',
        // },
        // {
        //   label: '',
        //   field: 'days',
        // },
        {
          label: 'Job',
          field: 'requestedJob.title',
          tdClass: 'text-center',
        },
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
        {
          label: '',
          field: 'reservations',
          tdClass: 'text-center',
          sortable: false,
        },
        
        {
          label: '',
          field: 'delete',
          tdClass: 'text-center',
          sortable: false,
        },
      ],
      columnsD: [
        {
          label: 'Name',
          field: 'fullName',
        },
        {
          label: 'Dropped',
          field: 'dropped',
          sortable: false,
        },
        {
          label: 'Job',
          field: 'requestedJob.title',
          tdClass: 'text-center',
        },
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
      columns2: [
        {
          label: '',
          field: 'preview',
        },
        {
          label: 'Name',
          field: 'fullName',
        },
        {
          label: 'Phone',
          field: 'phone',
          sortable: false,
        },
        {
          label: 'Job',
          field: 'requestedJob.title',
          tdClass: 'text-center',
        },
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
        //   field: 'notes',
        //   sortable: false,
        //   tdClass: 'text-center',
        // },
        {
          label: '',
          field: 'reservations',
          tdClass: 'text-center',
          tdClass: 'text-center',
          sortable: false,
          width: '60px',
        },
        {
          label: '',
          field: 'confirmed',
          tdClass: 'text-center',
          sortable: false,
        },
        
        {
          label: '',
          field: 'delete',
          tdClass: 'text-center',
          sortable: false,
        },
      ]
    }
  },
  components: {
    Loader,
    UserModal
  },
  created () {
    this.$store.dispatch("getEventPlacementFromId", this.$route.params.id)
    // if (!this.users || this.users.length < 1) {
    //   this.$store.dispatch("getUsers")
    // }
  },
  // watch: {
  //   '$route' (to) {
  //     this.$store.dispatch("getEventPlacementFromId", this.$route.params.id)
  //   }
  // },
  mounted() {
    // if (!this.users || this.users.length < 1) {
    //   this.$store.dispatch("getUsers")
    // }
    this.$store.dispatch("getUserAvailabilityState", this.$route.params.id)
    // if (this.eventInfo && this.eventInfo.days && this.eventInfo.days[0]) {
    //   this.setInitialDay(this.eventInfo.days[0])
    // } else {
    //   console.log('else')
    // }
    // this.setInitialDay()
  },
  computed: {
    ...mapState(['eventUsers', 'eventShifts', 'eventInfo', 'eventDrops', 'userProfile']),
    event() {
      return this.eventInfo
    },

    activeDay() {
      return this.newActiveDay ? this.newActiveDay : this.eventInfo.days[0]
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
        return shift.day == this.activeDay
      })
    },
  },
  methods: {
    // selectAll(params) {
    //   params.selectedRows.forEach((item) => {
    //     console.log(item);
    //   })
    // },

    // isModalVisible(user) {
    //   return this.modalValue = user
    // },
    
    showModal(user) {
      this.modalValue = user;
    },
    closeModal() {
      this.modalValue = null;
    },
    beforeOpen(event) {
      console.log('Event:', event)
      console.log('Params:', event.params)
      if (event.params.show === false) {
        event.cancel()
      }
    },
    // setInitialDay() {
    //   console.log(this.eventInfo.days[0])
    //   this.activeDay = this.eventInfo.days[0]
    // },

    setActiveDay(day) {
      this.newActiveDay = day
    },

    messageShift(shift) {
      this.performingRequest7 = true
      let payload = {
        shift: shift,
        staff: this.orderedPlacedUsers(shift),
        message: shift.newMessage,
        from: (this.userProfile.twilioNumber || null)
      }
      this.$store.dispatch('updateShiftStaff', payload)
      setTimeout(() => {
        this.performingRequest7 = false;
        shift.newMessage = ''
      }, 2000)
    },
    // updateShiftStaff({ commit }, payload) {
    //   console.log(payload)
    //   fb.userDaysCollection.where("event", "==", payload.id).onSnapshot(querySnapshot => {
    //     querySnapshot.forEach(doc => {
    //       let message = {
    //         phone: doc.data().phone || null,
    //         name: doc.data().fullName,
    //         userId: doc.data().userId,
    //         // email: doc.data().email || null,
    //         message: payload.updateMessage,
    //         event: payload
    //       }
    //     })
    //     fb.smsUpdatesCollection.add(message)
    //   })
    //   fb.eventsCollection.doc(payload.id).update({
    //     updateStaffSent: fb.firestore.FieldValue.serverTimestamp()
    //   })
    // },
    addUser(item) {
      console.log(item)
      this.performingRequest = true;
      let dateObj = new Date(this.event.startDate);
      let month = dateObj.getUTCMonth() + 1;
      let day = dateObj.getUTCDate();
      let year = dateObj.getUTCFullYear();
      let newdate = month + "/" + day + "/" + year;

      fb.userDaysCollection.add({
        userId: item.objectID,
        firstName: item.firstName,
        lastName: item.lastName,
        phone: item.phone,
        day: this.activeDay,
        dateFormat: newdate,
        start: this.activeDay,
        preferredEvent: this.event.id,
        status: "available",
        requestedJob: {},
        email: item.email,
        eventSlug: this.event.slug,
        eventTitle: this.event.title,
        fullName: item.firstName + ' ' + item.lastName,

      }).then(
        doc => {
          fb.userDaysCollection.doc(doc.id).update({
          created: fb.firestore.FieldValue.serverTimestamp(),
          id: doc.id, 
        })
      })
      setTimeout(() => {
        this.performingRequest = false;
        document
        .querySelectorAll('.ais-SearchBox-input')
        .forEach((e) => (e.value = ''))
        document.querySelectorAll('.ais-Hits-item').forEach((e) => e.remove())
      }, 250)
    },

    exportAll() {
      const exportHeaders = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Day",
      ]
      const exportItems = [];
      for (var key in this.eventUsers) {
        exportItems.push([
          this.eventUsers[key].firstName,
          this.eventUsers[key].lastName,
          this.eventUsers[key].email,
          this.eventUsers[key].phone,
          this.eventUsers[key].day,
          // this.eventUsers[key].address.state,
        ])
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    exportPlaced() {
      const exportHeaders = [
        "Day",
        "Shift Name",
        "Event",
        "Position",
        "Start",
        "End",
        "First Name",
        "Last Name",
        "Phone",
        "Email",
        "Points",
        "Confirmed",
        "DOB",
        "Shirt Size",
        "Code",
      ];
      const exportItems = [];
      console.log(exportItems)
      this.eventShifts.forEach(shift => {

        for (var key in this.orderedPlacedUsers3(shift.id)) {
          
          let uid = this.orderedPlacedUsers3(shift.id)[key].userId

          let confirmed = this.orderedPlacedUsers3(shift.id)[key].confirmed

          fb.usersCollection.doc(uid).get()
          .then(doc => {
            console.log(doc.data())
            exportItems.push([
              shift.day,
              shift.name,
              shift.event,
              shift.position.title,
              shift.startTime,
              shift.endTime,
              doc.data().firstName,
              doc.data().lastName,
              doc.data().phone,
              doc.data().email,
              doc.data().points,
              confirmed,
              moment(doc.data().dob).format('M/D/YYYY'),
              doc.data().shirtsize,
              `=REGEXEXTRACT(H2,"....$")`
            ])
          })
        }
      })
      
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      })
    },
    exportUnplaced() {
      const exportHeaders = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Day",
      ]
      const exportItems = [];
      for (var key in this.filteredUsers) {
        exportItems.push([
          this.filteredUsers[key].firstName,
          this.filteredUsers[key].lastName,
          this.filteredUsers[key].email,
          this.filteredUsers[key].phone,
          this.filteredUsers[key].day,
        ])
      }
      console.log(exportItems)
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },


    exportStaff(shift) {
      console.log(shift)
      const exportHeaders = [
        "Day",
        "Event",
        "Position",
        "Start",
        "End",
        "First Name",
        "Last Name",
        "Phone",
        "Email",
        "Points",
        "Confirmed",
        "DOB",
        "Shirt Size",
        "Code",
      ];
      const exportItems = [];
      for (var key in this.orderedPlacedUsers2(shift.id)) {

        let uid = this.orderedPlacedUsers2(shift.id)[key].userId

        let confirmed = this.orderedPlacedUsers2(shift.id)[key].confirmed

        fb.usersCollection.doc(uid).get()
        .then(doc => {
          console.log(doc.data())
          exportItems.push([
            shift.day,
            shift.event,
            shift.position.title,
            shift.startTime,
            shift.endTime,
            doc.data().firstName,
            doc.data().lastName,
            doc.data().phone,
            doc.data().email,
            doc.data().points,
            confirmed,
            moment(doc.data().dob).format('M/D/YYYY'),
            doc.data().shirtsize,
            `=REGEXEXTRACT(H2,"....$")`
          ])
        
        console.log(exportItems)
          this.$gapi.getGapiClient().then(gapi => {
            const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
            exportService.export();
          });
        })
      }
    },
    removeAssignment(props, shift) {
      fb.userDaysCollection.doc(props.row.id).update({status: "available", shift: null})
      fb.assignmentsCollection.where("shiftId", "==", shift.id).where("userId", "==", props.row.userId).get().then(function(querySnapshot) {
        querySnapshot.forEach(doc => {
          console.log(doc.id)
          fb.assignmentsCollection.doc(doc.id).delete()
        })
      })
      fb.eventStaffCollection.where("event", "==", shift.eventId).where("user", "==", props.row.userId).get().then(function(querySnapshot) {
        querySnapshot.forEach(doc => {
          fb.eventStaffCollection.doc(doc.id).delete()
        })
      })
    },
    showTrash(p) {
      fb.userDaysCollection.doc(p.row.id).update({showTrash: true})
    },
    hideTrash(p) {
      fb.userDaysCollection.doc(p.row.id).update({showTrash: false})
    },
    deleteUser(userDay) {
      fb.userDaysCollection.doc(userDay.id).update({
        preferredEvent: null
      })
    },
    orderedUsers(shift) {
      function compare(a, b) {
        if (a.firstName < b.firstName)
          return -1;
        if (a.firstName > b.firstName)
          return 1;
        return 0;
      }
      return this.filteredUsers.filter(user => {
        return user.status == 'available' && user.day == shift.day
      })
    },
    removePlacement(row) {
      this.$store.dispatch('removeUserPlacement', row)
    },
    expand(shift) {
      shift.collapse = false
      this.$store.dispatch("updateEventShift", shift)
    },
    collapse(shift) {
      shift.collapse = true
      this.$store.dispatch("updateEventShift", shift)
    },
    // filteredUsers(shift) {
    //   return this.eventUsers.filter(user => {
    //     return user.status == 'available' && user.shift == shift.id && user.day == shift.day
    //   })
    // },
    orderedPlacedUsers2 (shift) {
      function compare(a, b) {
        if (a.firstName < b.firstName)
          return -1;
        if (a.firstName > b.firstName)
          return 1;
        return 0;
      }
      return this.filteredPlacedUsers.sort(compare).filter(user => {
        return user.shift == shift
      });
    },
    orderedPlacedUsers (shift) {
      function compare(a, b) {
        if (a.firstName < b.firstName)
          return -1;
        if (a.firstName > b.firstName)
          return 1;
        return 0;
      }
      return this.filteredPlacedUsers.sort(compare).filter(user => {
        return user.shift == shift.id && user.day == shift.day
      });
    },
    orderedPlacedUsers3 (shift) {
      function compare(a, b) {
        if (a.firstName < b.firstName)
          return -1;
        if (a.firstName > b.firstName)
          return 1;
        return 0;
      }
      return this.filteredPlacedUsers.sort(compare).filter(user => {
        return user.shift == shift.id
      });
    },
    confirmedPlacedUsers(shift) {
      function compare(a, b) {
        if (a.firstName < b.firstName)
          return -1;
        if (a.firstName > b.firstName)
          return 1;
        return 0;
      }
      return this.filteredPlacedUsers.sort(compare).filter(user => {
        return user.shift == shift.id && user.confirmed
      });
    },
    lockAll(shift) {
      let event = this.event
      // this.$refs[shift.id][0].selectedRows[0].status = "haha"
      // console.log(this.$refs[shift.id][0].selectedRows)
      // this.$refs[shift.id][0].selectedRows.forEach(row => {
      //   this.$store.dispatch("lockTheShift", {
      //     shift: shift, 
      //     event: event, 
      //     row: row
      //   })
      // })
      this.$refs[shift.id][0].selectedRows.forEach(row => {
        row.status = "spinning"
      })
      this.$store.dispatch("lockTheShifts", {
        event: event,
        rows: this.$refs[shift.id][0].selectedRows,
        shift: shift,
        shiftStart: this.formatAMPM(shift.startTime) ,
        shiftEnd:this.formatAMPM(shift.endTime)
      })
      // this.$refs[shift.id][0].selectedRows = []
      
    },


    confirmPlacement(props) {
      fb.userDaysCollection.doc(props.row.id).update({confirmed: true})
      .then(doc => {
        fb.assignmentsCollection.where("shiftId", "==", props.row.shift).where("userId", "==", props.row.userId).get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(doc => {
            console.log(doc.data().id)
            fb.assignmentsCollection.doc(doc.data().id).update({
              confirmed: true
            })
          })
        })
      })
      props.row.confirmed = true
      fb.userDaysCollection.where("confirmed", "==", true).get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(doc => {
        console.log(doc.data())
          fb.assignmentsCollection.where("shiftId", "==", doc.data().shift).where("userId", "==", doc.data().userId).get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(doc => {
              console.log(doc.data().id)
              fb.assignmentsCollection.doc(doc.data().id).update({
                confirmed: true
              })
            })
          })
        })
      })

    },
    unConfirmPlacement(props) {
      fb.userDaysCollection.doc(props.row.id).update({confirmed: false})
      .then(doc => {
        fb.assignmentsCollection.where("shiftId", "==", props.row.shift).where("userId", "==", props.row.userId).get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(doc => {
            console.log(doc.data().id)
            fb.assignmentsCollection.doc(doc.data().id).update({
              confirmed: false
            })
          })
        })
      })
      props.row.confirmed = false
    },
    unlock(props, shift) {
      props.row.status = "spinning"
      fb.userDaysCollection.doc(props.row.id).update({status: "placed"})
      setTimeout(() => {
        props.row.status = "placed"
      }, 2000)
      fb.assignmentsCollection.where("shiftId", "==", shift.id).where("userId", "==", props.row.userId).get().then(function(querySnapshot) {
        querySnapshot.forEach(doc => {
          console.log(doc.id)
          fb.assignmentsCollection.doc(doc.id).delete()
        })
      })
      // fb.eventStaffCollection.where("event", "==", shift.eventId).where("user", "==", props.row.userId).get().then(function(querySnapshot) {
      //   querySnapshot.forEach(doc => {
      //     fb.eventStaffCollection.doc(doc.id).delete()
      //   })
      // })
    },
    lockShift(props, shift) {
      console.log(props)
      console.log(shift)
      props.row.status = "spinning"

      let event = this.event
      let shiftDay = shift.day
      let dateObj = new Date(shift.day);
      let month = dateObj.getUTCMonth() + 1;
      let day = dateObj.getUTCDate();
      let year = dateObj.getUTCFullYear();
      let newdate = month + "/" + day + "/" + year;
      // let shiftStart = this.formatAMPM(shift.startTime)
      // let shiftEnd = this.formatAMPM(shift.endTime)

      this.$store.dispatch("lockAShift", {
        event: event,
        row: props.row,
        shift: shift,
        shiftStart: this.formatAMPM(shift.startTime) ,
        shiftEnd:this.formatAMPM(shift.endTime)
      })

      
      // console.log(assignment)
      // this.$store.dispatch("lockShift", assignment)
    },
    assignShift(shift) {
      let userId = shift.selectedStaff.userId
      let day = this.day
      let placement = {
        shiftId: shift.id,
        userId: userId,
        day: this.day

      }
      this.$store.dispatch('addPlacement', {
        id:shift.selectedStaff.id,
        placement: placement
      })
      shift.selectedStaff = null
    },
    reserveUser(user) {
      user.dayStatus = "hired"
      this.$store.dispatch('reserveUser', user)
    },
    notRequestUser(user) {
      user.dayStatus = "not requested"
      fb.userDaysCollection.doc(user.id).update({ dayStatus: 'not requested' })
    },
    unreserveUser(user) {
      user.dayStatus = null
      fb.userDaysCollection.doc(user.id).update({dayStatus: null})
    },
    cancelNotRequestUser(user) {
      user.dayStatus = null
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
    this.$store.dispatch("clearEventShiftsState")
    this.columns = null
    delete this.columns
    this.columns2 = null
    delete this.columns2
    console.log(this)
  }
}
</script>
