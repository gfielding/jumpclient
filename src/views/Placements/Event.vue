<template>
	<div>
    
    <div class="dashboard__container pt-3">
      <Loader v-if="performingRequest" />
      <div class="dashboard__container--header mb-3" v-if="event">
        <div class="mb-3">
          <div class="flex align-center">
          <h4 v-if="event">Staff Placements</h4>
        </div>
          <!-- <h2 v-if="event &&event.title">Staff Placements for {{event.title}}</h2> -->
         
        </div>
        <span class="flex flex-wrap justify-flex-end">
          <button class="btn btn__outlined btn__small mr-3 mb-3" @click="exportAll()">export all</button>
          <button class="btn btn__outlined btn__small mr-3 mb-3" @click="exportP2()">export placed
            <transition name="fade">
                <span class="ml-2" v-if="spin">
                <i class="fa fa-spinner fa-spin"></i>
                </span>
              </transition>
          </button>
          <!-- <button class="btn btn__outlined btn__small mr-3 mb-3" @click="email()">Preview Info Email</button>
          <button class="btn btn__outlined btn__small mr-3 mb-3" @click="checkIn()">Check-In</button>
          <button class="btn btn__outlined btn__small mr-3 mb-3" @click="shifts()">Shifts</button>
          <button class="btn btn__outlined btn__small mr-3 mb-3" @click="editEvent()">Edit</button>
          <button class="btn btn__outlined btn__small mr-3 mb-3" @click="sheets()">Timesheets</button>
          <button class="btn btn__outlined btn__small mr-3 mb-3" @click="files()">Files</button>
          <button class="btn btn__outlined btn__small mb-3" @click="goBack"><i class="fas fa-arrow-left"></i></button> -->
        </span>
      </div>
      <div class="dashboard__container--body mb-3" v-if="event && event.days && event.days.length > 1">
        <div>
          <button v-for="(day, index) in event.days" :key="index" class="btn btn__small mr-3 mb-3" v-bind:class="{ 'btn__dark': activeDay == day, 'btn__outlined': activeDay != day }" @click="setActiveDay(day)">{{day}}</button>
        </div>
      </div>
      
      <div class="dashboard__container--body">
        <div class="dashboard__container--body--col" style="width: calc(100% - 3.2rem)">
          <Loader v-if="!eventUsers || eventUsers.length < 1" />
          <div class="flex justify-space-between align-center">
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
                        <p style="display: inline;">{{ item.firstName }} {{ item.lastName }} | <span v-if="item.address && item.address">{{item.address.city}} | </span>{{item.email}} | {{item.phone}}</p>
                      </div>
                    </template>
                  </ais-hits>
                </template>
              </ais-state-results>
            </ais-instant-search>

            <button class="btn btn__outlined btn__small mb-2 mt-3" @click="exportUnplaced()">export unplaced</button>
          </div>
          <vue-good-table
            v-if="eventUsers && eventUsers.length >= 1"
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

              <!-- <span v-if="props.column.field == 'preview'">
                <i class="far fa-search ml-2 mr-2" @click="showModal(props.row)"></i>
                <UserModal v-if="modalValue == props.row" @close="closeModal" :staff="modalValue" />
              </span> -->
              <span v-if="props.column.field == 'photoUrl'">
                <span v-if="props.row.photoUrl">
                  <img :src="(props.row.photoUrl || `https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/avatar%20copy.png?alt=media&token=966c07c4-125a-490f-81be-4e2d26bf33fa`)" alt="" style="width: 3.5rem; height:3.5rem; border-radius: 50%; padding: 0.25rem;">
                </span>
              </span>

              
              <span v-else-if="props.column.field == 'created'">
                <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
              </span>
              <span v-else-if="props.column.field == 'notes'">
                <button class="icon mr-2 ml-2" v-if="props.row.note" v-tooltip="props.row.note">
                  <i class="far fa-sticky-note"></i>
                </button>
              </span>

              <span v-if="props.column.field == 'moreInfo'" class="flex">
                  <span v-for="u in filteredInfo(props.row)" class="flex">

                          <v-popover v-if="u.evereeOnboardingComplete">
                          <i class="fa-solid fa-square-check ml-2 mr-2 success"></i>
                          <template slot="popover">
                              <span>Contractor</span>
                            </template>
                          </v-popover>

                          <v-popover v-if="!u.evereeOnboardingComplete">
                            <i class="fa-solid fa-square-check ml-2 mr-2" style="opacity: 50%;"></i>
                            <template slot="popover">
                              <span>Not Contractor</span>
                            </template>
                          </v-popover>

                          <!-- <v-popover v-if="u.employeeOnboard && u.employeeOnboard == true">
                          <i class="fa-solid fa-square-check ml-2 mr-2 successDark"></i>
                          <template slot="popover">
                              <span>Employee</span>
                            </template>
                          </v-popover>

                          <v-popover v-if="!u.employeeOnboard || u.employeeOnboard != true">
                            <i class="fa-solid fa-square-check ml-2 mr-2" style="opacity: 50%;"></i>
                            <template slot="popover">
                              <span>Not Employee</span>
                            </template>
                          </v-popover> -->

                          <span v-if="!u.skills || u.skills.length == 0">
                          <i class="fad fa-briefcase ml-2 mr-2" style="opacity:50%;"></i>
                          </span>

                        <span v-if="u.skills && u.skills.length > 0">
                          <v-popover>
                            <i class="fad fa-briefcase ml-2 mr-2 success"></i>
                            <template slot="popover">
                              <span v-for="(z, index) in props.row.skills" :key="index">{{z.title}} / </span>
                            </template>
                          </v-popover>
                        </span>

                        <span v-if="!u.blacklist || u.blacklist.length == 0">
                          <i class="fas fa-exclamation-triangle ml-2 mr-2" style="opacity:50%;"></i>
                        </span>
                        <span v-if="u.blacklist && u.blacklist.length > 0">
                          <v-popover>
                            <i class="fas fa-exclamation-triangle ml-2 mr-2 danger"></i>
                            <template slot="popover">
                              <span v-for="z in u.blacklist" :key="z.id">{{z.title}} / </span>
                            </template>
                          </v-popover>
                        </span>

                        <span v-if="!u.groups || u.groups.length == 0">
                          <i class="fa-solid fa-user-group ml-2 mr-2" style="opacity:50%;"></i>
                        </span>

                        <span v-if="u.groups && u.groups.length  > 0">
                          <v-popover>
                            <i class="fa-solid fa-user-group ml-2 mr-2 blueHue"></i>
                            <template slot="popover">
                              <span v-for="(z, index) in u.groups" :key="index">{{z.title}} / </span>
                              <!-- <span v-for="z in u.groups" :key="z.id">{{z.title}} / </span> -->
                            </template>
                          </v-popover>
                        </span>

                        <span v-if="!u.certs || u.certs.length == 0">
                          <i class="fa-solid fa-certificate ml-2 mr-2" style="opacity:50%;"></i>
                        </span>
                        <span v-if="u.certs && u.certs.length > 0">
                          <v-popover v-for="(item, index) in u.certs" :key="index" style="display:inline-block;">
                            <i class="fa-solid fa-certificate ml-2 mr-2 success"></i>
                            <template slot="popover">
                              <span>{{item.type}}</span>
                            </template>
                          </v-popover>
                          
                          
                        </span>
                      </span>

                
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


                  <span :class="{ danger: (props.row.blacklist && props.row.blacklist.length >= 1) }">
                    {{props.row.fullName}}
                  </span>
                </router-link>
                <div class="flex justify-flex-start mt-1">
                  <star-rating :read-only="true" :star-size="12" v-if="props.row && props.row.rating" v-model="props.row.rating" class="caption"></star-rating>
                  <span v-if="props.row && props.row.points" class="caption flex align-center ml-2">
                    | {{props.row.points}} Points
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
                <span v-if="props.row.requestedShift && props.row.requestedShift.name">
                   {{props.row.requestedShift.name}}
                </span>
              </span>
              <span v-else>
                <!-- {{props.formattedRow[props.column.field]}} -->
              </span>
            </template>
          </vue-good-table>
        </div>
        
        <div class="dashboard__container--body--col alt-col" style="width:100%;">
          <div v-for="shift in activeShifts" :key="shift.id" style=" padding:1.6rem; background: white; margin-bottom:1.6rem;">
            <div class="flex align-center justify-space-between mb-1">
              <span>
                <h3 v-if="shift.name">{{shift.name}} | <span v-if="activeDay">{{activeDay | moment("dddd, MMM Do") }}</span></h3>
                <div class="caption" v-if="shift.id">{{shift.id}}</div>
                <div class="caption" v-if="shift.position">Default position: {{shift.position.label || shift.position.title}}</div>
                
                <div class="caption" v-if="shift.startTime"> Default Shift Times: {{ [ shift.startTime, "HH:mm" ] | moment("hh:mm A") }}<span v-if="shift.endTime"> - {{ [ shift.endTime, "HH:mm" ] | moment("hh:mm A") }}</span></div>

              </span>
              <div>

              <button class="btn btn__outlined btn__small mb-2 mr-3" @click="showShiftModal(shift)">Preview Email</button>
            
              <InfoEmailTemplate v-if="(modalValue == shift) && eventInfo" @close="closeShiftModal" :eventInfo="eventInfo" :shift="shift" :venueInfo="venueInfo" />

                <button class="btn btn__small btn__outlined mb-2 mr-5" @click="exportStaff(shift)">export</button>
                <button class="btn btn__icon" @click="expand(shift)" v-if="shift.collapse"><i class="fas fa-chevron-up"></i></button>
                <button class="btn btn__icon" @click="collapse(shift)" v-if="!shift.collapse"><i class="fas fa-chevron-down"></i></button>
              </div>
            </div>
            <transition name="fade">
              <div v-if="shift.collapse == true">
                <div class="mb-2">
              

                  <button class="btn btn__flat chip mt-1">{{orderedPlacedUsers(shift).length}} / {{shift.staff}}</button>

                  <button class="btn btn__flat chip mt-1 ml-2" style="color:green; border-color:green;">{{confirmedPlacedUsers(shift).length}}</button>
                </div>
                <div>
                  <span class="caption" v-if="shift.details">Details from Client: {{shift.details}}</span>
                </div>


                <div class="mt-2">
                <textarea :id="shift" cols="30" rows="1" placeholder="send a text to shift" v-model="shift.newMessage"></textarea>
                <transition name="fade">
                  <div class="flex justify-flex-end" v-if="shift.newMessage">
                    <button class="btn btn__small btn__success mb-3 mt-3" @click="messageShift(shift)" :disabled="!shift.newMessage">send message
                      <transition name="fade">
                        <span class="ml-2" v-if="performingRequest7">
                        <i class="fa fa-spinner fa-spin"></i>
                        </span>
                      </transition>
                    </button>
                  </div>
                </transition>
              </div>

                <div class="pt-3" v-if="orderedUsers.length >= 1" style="width:50%; min-width: 30rem;">
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
                    
                    >
                    <div slot="selected-row-actions">
                      <button class="btn btn__small btn__flat" @click="lockAll(shift)">Lock All <i class="fas fa-lock-alt"></i></button>
                    </div>
                    <template slot="table-row" slot-scope="props">

                      <span v-if="props.column.field == 'photoUrl'">
                        <span v-if="props.row.photoUrl">
                          <img :src="(props.row.photoUrl || `https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/avatar%20copy.png?alt=media&token=966c07c4-125a-490f-81be-4e2d26bf33fa`)" alt="" style="width: 3.5rem; height:3.5rem; border-radius: 50%; padding: 0.25rem;">
                        </span>
                      </span>

                      <span v-if="props.column.field == 'moreInfo'" class="flex">


                        <span v-if="props.row.branchOnboard && props.row.branchOnboard == true">
                          <v-popover>
                          <i class="fa-solid fa-square-check ml-2 mr-2 success"></i>
                          <template slot="popover">
                              <span>Fully Onboarded</span>
                            </template>
                          </v-popover>
                        </span>

                        <span v-if="!props.row.branchOnboard || props.row.branchOnboard != true">
                          <v-popover>
                            <i class="fa-solid fa-square-check ml-2 mr-2" style="opacity: 50%;"></i>
                            <template slot="popover">
                              <span>Not Onboarded</span>
                            </template>
                          </v-popover>
                        </span>

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

                        <span v-if="!props.row.blacklist || props.row.blacklist.length == 0">
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

                      </span>

                         
                      <span v-if="props.column.field == 'created'">
                        <span v-if="props.row.created">{{formatDate(props.row.created)}}</span>
                      </span>

                      <span v-if="props.column.field == 'phone'">
                        <span v-if="props.row.phone">
                          <a :href="'sms:' + props.row.phone" class="darkLink">{{props.row.phone}}</a>
                        </span>
                      </span>

                      <span v-if="props.column.field == 'start'">
                        <span v-if="props.row.status == 'assigned'">
                          <span v-if="props.row.start">
                            {{props.row.start | moment("hh:mm A")}}
                          </span>
                          
                         
                        </span>
                        <span v-if="props.row.status != 'assigned'" style="display: flex;">
                          <input type="time" v-model.trim="props.row.start" id="start" @change="updateAssignment(props.row)" />
                          <button  v-if="props.row.start" class="icon" v-tooltip="'remove'" @click="deleteStartTime(props.row)">
                          <i class="fas fa-times ml-2 mr-2"></i>
                        </button>
                        </span>
                      </span>

                      <span v-if="props.column.field == 'end'">
                        <span v-if="props.row.status == 'assigned'">
                          <span v-if="props.row.end">
                            {{props.row.end | moment("hh:mm A")}}
                          </span>
                          
                         
                        </span>
                        <span v-if="props.row.status != 'assigned'" style="display: flex;">
                          <input type="time" v-model.trim="props.row.end" id="end" @change="updateAssignment(props.row)" />
                          <button  v-if="props.row.end" class="icon" v-tooltip="'remove'" @click="deleteEndTime(props.row)">
                          <i class="fas fa-times ml-2 mr-2"></i>
                        </button>
                        </span>
                        
                      </span>

                      <span v-if="props.column.field == 'assigned'">
                        <span v-if="props.row.status == 'assigned'">
                          <span v-if="props.row.job && props.row.job.label">{{props.row.job.label}}</span>
                          <span v-if="props.row.job && !props.row.job.label">{{props.row.job && props.row.job.title}}</span>
                        </span>
                        <span v-if="props.row.status != 'assigned'">
                          <v-select
                            label="title" 
                            :options="event.venue.job || venueInfo.job"
                            v-model="props.row.job"
                            @input="updateAssignment(props.row)"
                            >
                          </v-select>
                        </span>
                        
                      </span>


                      <span v-else-if="props.column.field == 'reservations'" class="flex">
                      <span v-if="
                        (props.row.dayStatus != 'hired') &&
                        (props.row.dayStatus != 'assigned') &&
                        (props.row.dayStatus != 'not requested')
                      " style="display:inline;">
                        <button class="icon" @click="reserveUser(props.row)" v-tooltip="'reserve user'">
                          <i class="far fa-calendar ml-2 mr-2"></i>
                        </button>
                      </span>


                      <span v-if="
                        (props.row.dayStatus == 'hired' && props.row.status == 'assigned')
                      " style="display:inline;">
                        <button class="icon mr-2 ml-2" v-tooltip="'unlock first to cancel reservation'">
                          <i class="fas fa-calendar-check" style="color:green;"></i>
                        </button>
                      </span>

                      <span v-if="
                        (props.row.dayStatus == 'hired' && (!props.row.status || props.row.status != 'assigned'))
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



                      <span v-if="((shift.position && shift.position.title) || (props.row.job && props.row.job.title))">
                       <!--  <span> -->

                        <button v-if="props.row.dayStatus == 'hired' && props.row.status != 'assigned' && props.row.status != 'spinning' && (props.row.start || shift.startTime) && (props.row.end || shift.endTime)" class="icon" v-tooltip="'lock shift'" @click="lockShift(props, shift)" style="display:inline;">
                          <i class="fas fa-lock-open-alt ml-2 mr-2"></i>
                        </button>
                      

                      
                        <span class="icon" v-if="props.row.status == 'spinning'">
                        <i class="fa fa-spinner fa-spin ml-2 mr-2"></i>
                        </span>
                      
                      
                        <button class="icon" v-if="props.row.dayStatus == 'hired' && props.row.status == 'assigned'" style="display:inline;" @click="unlock(props, shift)">
                          <i class="fas fa-lock-alt ml-2 mr-2"></i>
                        </button>
                      </span>
                      
                    </span>

                    <span v-else-if="props.column.field == 'email'">
                      <button v-if="(props.row.shiftEmailSent || (props.row.shiftEmailSent && Object.keys(props.row.shiftEmailSent).length))" class="icon" v-tooltip="`Emails sent ` + props.row.emailsSent" @click="sendInfoEmail(props.row, shift)">
                        <span class="fa-layers fa-fw">
                          <i class="fa-solid fa-envelope"></i>
                          <span class="fa-layers-counter fa-xs" style="background:red; color:white; padding:0.1rem 0.25rem 0.2rem 0.25rem; border-radius: 50%;">{{props.row.emailsSent}}</span>
                        </span>
                        <!-- <i class="fa-solid fa-envelope-open ml-2 mr-2 blueHue" style="opacity: 0.6;"></i> -->
                      </button>


                      <button v-if="(!props.row.shiftEmailSent || (props.row.shiftEmailSent && Object.keys(!props.row.shiftEmailSent).length))" class="icon" v-tooltip="`send info email`" @click="sendInfoEmail(props.row, shift)">
                        <i class="fa-solid fa-envelope ml-2 mr-2"></i>
                      </button>
                    </span>

                    <span v-else-if="props.column.field == 'confirmed'" style="display: flex;">
                      <button v-if="!props.row.confirmed && props.row.status == 'assigned'" class="icon" v-tooltip="'confirm'" @click="confirmPlacement(props)">
                        <i class="fas fa-check ml-2 mr-2" style="opacity: 0.4;"></i>
                      </button>

                      <button v-if="!props.row.confirmed && props.row.status == 'assigned' && (props.row.updatedRequested || (props.row.updatedRequested && Object.keys(props.row.updatedRequested).length && props.row.dayStatus != 'not requested'))" class="icon" v-tooltip="'already sent again'">
                        <i class="fa-solid fa-paper-plane ml-2 mr-2" style="opacity: 0.4;"></i>
                      </button>

                        <button v-if="(!props.row.confirmed && props.row.status == 'assigned' && !props.row.updatedRequested  && props.row.dayStatus != 'not requested')" class="icon" v-tooltip="'resend confirmation text'" @click="requestConfirmation(props)">
                          <i class="fa-solid fa-paper-plane ml-2 mr-2 blueHue"></i>
                        </button>


                     <!--  <transition name="fade">
                        <span class="ml-2" v-if="performingRequestRequest">
                        <i class="fa fa-spinner fa-spin"></i>
                        </span>
                      </transition> -->


                      <!-- <button v-if="!props.row.confirmed && props.row.status == 'assigned' && !props.row.updatedRequested" class="icon" v-tooltip="'resend confirmation text'" @click="requestConfirmation(props)">
                        <i class="fa-solid fa-paper-plane ml-2 mr-2 blueHue"></i>
                      </button> -->

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
                    <span v-else-if="props.column.field == 'delete'" class="flex">

                      <button class="icon mr-2 ml-2" v-if="!props.row.showTrash && (props.row.status != 'assigned' || (!props.row.dayStatus || props.row.dayStatus == 'not requested'))" v-tooltip="'delete instance'" @click="showTrash(props)">
                        <i class="fas fa-times"></i>
                      </button>

                      <button class="icon mr-2 ml-2" v-if="props.row.showTrash" v-tooltip="'cancel'" @click="hideTrash(props)">
                        <i class="fas fa-times"></i>
                      </button>

                      <button class="icon mr-2 ml-2" v-if="props.row.showTrash" v-tooltip="'delete instance'" @click="removePlacement(props.row)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </span>

                  <!--   <span v-else-if="props.column.field == 'delete'">
                      <button v-if="props.row.status == 'placed' || " class="icon" v-tooltip="'remove'" @click="removePlacement(props.row)">
                        <i class="fas fa-times ml-2 mr-2"></i>
                      </button> -->

                      <!-- <button v-if="props.row.status == 'assigned'" class="icon" v-tooltip="'remove'" @click="removeAssignment(props, shift)">
                        <i class="fas fa-times ml-2 mr-2"></i>
                      </button> -->
                    <!-- </span> -->
                      <span v-else-if="props.column.field == 'requestedShift.name'">
                        <span v-if="props.row.requestedShift && props.row.requestedShift.name">
                           {{props.row.requestedShift.name}}
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

        <div class="dashboard__container--body--col" style="width:100%;">
          <h4>Drops</h4>
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
              <span v-else-if="props.column.field == 'email'">
                <a :href="`mailto:` + props.row.email" target="_blank">
                  {{props.row.email}}
                </a>
              </span>
             
              
            
              <span v-else-if="props.column.field == 'day'">
                <span v-if="(props.row.day)">
                  {{props.row.day}}
                </span>
              </span>
              
              <span v-else-if="props.column.field == 'fullName'">
                <router-link :to="'/users/' + props.row.userId">
                  {{props.row.fullName}}
                </router-link>
              </span>
             
              <span v-else-if="props.column.field == 'phone'">
                <span v-if="props.row.phone">
                  <a :href="'sms:' + props.row.phone">{{props.row.phone}}</a>
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

<style scoped type="text/css">
  .darkLink {
    color:#606266;
  }
  .darkLink:hover {
    color:#fc3ef9;
  }
</style>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import * as moment from 'moment'
import router from '@/router'
import firebase from 'firebase/app';
import StarRating from 'vue-star-rating'
import algoliasearch from 'algoliasearch/lite';
import ExportService from "@/services/ExportService"
import UserModal from "@/components/UserModal.vue";
import InfoEmailTemplate from "@/components/InfoEmailTemplate.vue";
const fb = require('../../firebaseConfig.js')

export default {
  name: 'eventplacement',
  data() {
    return {
      performingRequest: false,
      performingRequestRequest: false,
      spin: false,
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
        {
          label: 'Phone',
          field: 'phone',
          sortable: false,
          width:'120px',
        },

        {
          label: 'Signed Up',
          field: 'created',
          sortable: false,
          width:'120px',
        },
        {
          label: 'Requested Shift',
          field: 'requestedJob.title',
          sortable: false,
          width:'140px',
        },
        {
          label: 'Notes',
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
          label: 'Phone',
          field: 'phone',
        },
        {
          label: 'Email',
          field: 'email',
        },
        {
          label: 'Day to Work',
          field: 'day',
        },
        {
          label: 'Dropped',
          field: 'dropped',
          sortable: false,
        },
        {
          label: 'Notes',
          field: 'notes',
          sortable: false,
          tdClass: 'text-center',
        },
      ],
      columns2: [
        // {
        //   label: '',
        //   field: 'preview',
        //   sortable: false,
        // },
        {
          label: '',
          field: 'photoUrl',
          sortable: false,
        },
        {
          label: 'Name',
          field: 'fullName',
          width: '120px',
        },
        // {
        //   label: '',
        //   field: 'moreInfo',
        //   sortable: false,
        // },
        {
          label: 'Phone',
          field: 'phone',
          sortable: false,
          width: '112px',
        },
        {
          label: 'Overwrite Start',
          field: 'start',
          // width: '120px'
        },
        {
          label: 'Overwrite End',
          field: 'end',
          // width: '120px'
        },
        {
          label: 'Requested Shift',
          field: 'requestedShift.name',
          // width: '144px',
        },
        {
          label: '',
          field: 'email',
          sortable: false,
          tdClass: 'text-center',
          width: '25px',
        },
        {
          label: '',
          field: 'reservations',
          tdClass: 'text-center',
          sortable: false,
          width: '50px',
        },
        {
          label: '',
          field: 'confirmed',
          tdClass: 'text-center',
          sortable: false,
          width: '50px',
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
    UserModal,
    StarRating,
    InfoEmailTemplate,
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
    // this.$store.dispatch("getUserAvailabilityState", this.$route.params.id)
    // if (this.eventInfo && this.eventInfo.days && this.eventInfo.days[0]) {
    //   this.setInitialDay(this.eventInfo.days[0])
    // } else {
    //   console.log('else')
    // }
    // this.setInitialDay()
  },
  computed: {
    ...mapState(['currentUser', 'venueInfo', 'eventUsers', 'eventShifts', 'eventInfo', 'eventDrops', 'userProfile', 'eventUsersRef']),
    event() {
      return this.eventInfo
    },
    referencedUsers() { 
      // let uniqueChars = this.eventUsersRef.filter((id, index) => {
      //     return this.eventUsersRef.indexOf(id) === index;
      // });
      // let uniqueChars = [...new Set(this.eventUsersRef)];
      return this.eventUsersRef.filter((item, index) => this.eventUsersRef.indexOf(item) === index);
      // if (this.eventUsersRef) {
      //   return this.eventUsersRef.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i)
      // }
      
     // let arrUniq = [...new Map(this.eventUsersRef.map(v => [v.id, v])).values()]
     //  return arrUniq
    },
    activeDay() {
      if (this.eventInfo && this.eventInfo.days && this.eventInfo.days.length > 0) {
        return this.newActiveDay ? this.newActiveDay : this.eventInfo.days[0]
      } else if (this.eventInfo && this.eventInfo.days && this.eventInfo.days.length > 0) {
        return this.eventInfo.days[0]
      } else {

      }
    },

    filteredUsers () {
      return this.eventUsers.filter(user => {
        // return user.status == 'available'
        if (this.activeDay) {
          return ((user.status != 'placed') && (user.status != 'assigned') && (user.day == this.activeDay))
        }
      })
    },
    
    filteredPlacedUsers () {
      return this.eventUsers.filter(user => {
         if (this.activeDay) {
          return (((user.status == 'placed') || (user.status == 'assigned')) && (user.day == this.activeDay))
        }
      })
    },
    filteredPlacedDayUsers () {
      if (this.activeDay) {
        return this.eventUsers.filter(user => {
          return (((user.status == 'placed') || (user.status == 'assigned')) && (user.day == this.activeDay))
        })
      }
    },
    activeShifts() {
      return this.eventShifts.filter(shift => {
        return (shift.day == this.activeDay || shift.day.includes(this.activeDay))
      })
    },
  },
  methods: {
    sendInfoEmail(props, shift) {
      props.shiftEmailSent = ({
        sent: true
      })
      this.$store.dispatch('sendShiftEmail', {
        userDay: props,
      })
    },
    showShiftModal(shift) {
      this.modalValue = shift;
    },
    // showEditIn(user) {
    //   this.modalEditInValue = user;
    // },
    // showEditOut(user) {
    //   this.modalEditOutValue = user;
    // },
    // closeEditModal() {
    //   this.modalEditInValue = null;
    //   this.modalEditOutValue = null;
    // },
    closeShiftModal() {
      this.modalValue = null;
    },
    updateAssignment(row) {
      this.$store.dispatch('updateAssignment', row)
    },
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
    email() {
      let url = `/events/` + this.$route.params.id + `/email`
      router.push(url)
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

      fb.usersCollection.doc(item.objectID).get()
      .then(doc => {
        let branchOnboard = doc.data().branchOnboard || null
        let address = doc.data().address || null
        let blacklist = doc.data().blacklist || null
        let certs = doc.data().certs || null
        let groups = doc.data().groups || null
        let phoneVerified = doc.data().phoneVerified || null
        let photoUrl = doc.data().photoUrl || null
        let points = doc.data().points || null
        let rating = doc.data().rating || null
        let shirtsize = doc.data().shirtsize || null
        let skills = doc.data().skills || null
        let vaccination = doc.data().vaccination || null
        let firstName = doc.data().firstName || null
        let lastName = doc.data().lastName || null
        let phone = doc.data().phone || null
        let ssn = doc.data().ssn || null
        let docHold = doc.data().docHold || null
        fb.userDaysCollection.add({
          branchOnboard: branchOnboard,
          address: address,
          blacklist: blacklist,
          certs: certs,
          groups: groups,
          phoneVerified: phoneVerified,
          photoUrl: photoUrl,
          points: points,
          rating: rating,
          shirtsize: shirtsize,
          skills: skills,
          vaccination: vaccination,
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          ssn: ssn,
          docHold: docHold,
          userId: item.objectID,
          firstName: item.firstName,
          lastName: item.lastName,
          phone: item.phone,
          day: this.activeDay,
          dateFormat: newdate,
          start: this.activeDay,
          preferredEvent: this.event.id,
          preferredEventName: this.event.title,
          status: "available",
          requestedJob: {},
          email: item.email,
          eventSlug: this.event.slug,
          eventTitle: this.event.title,
          fullName: item.firstName + ' ' + item.lastName,
        })
      
        .then(
          doc => {
            fb.userDaysCollection.doc(doc.id).update({
            created: fb.firestore.FieldValue.serverTimestamp(),
            id: doc.id, 
          })
        })
      })
      setTimeout(() => {
        this.performingRequest = false;
        // document
        // .querySelectorAll('.ais-SearchBox-input')
        // .forEach((e) => (e.value = ''))
        // document.querySelectorAll('.ais-Hits-item').forEach((e) => e.remove())
      }, 250)
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
    exportP2() {
      this.spin = true
      const exportHeaders = [
        "First Name",
        "Last Name",
        "Phone",
        "Email",
        "Day",
        "Shift ID",
        ];
      const exportItems = [];
      console.log(this.filteredPlacedDayUsers)
      for (var key in this.filteredPlacedDayUsers) {
        let firstName = this.filteredPlacedDayUsers[key].firstName || null
        let lastName = this.filteredPlacedDayUsers[key].lastName || null
        let phone = this.filteredPlacedDayUsers[key].phone || null
        let email = this.filteredPlacedDayUsers[key].email || null
        let day = this.filteredPlacedDayUsers[key].day
        let shift = this.filteredPlacedDayUsers[key].shift
        let uid = this.filteredPlacedDayUsers[key].userId
        exportItems.push([
          firstName,
          lastName,
          phone,
          email,
          day,
          shift,
        ])

        
      }

      setTimeout(() => {
        this.$gapi.getGapiClient().then(gapi => {
            const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
            exportService.export();
          });
        this.spin = false
      }, 15000)

      
      
      
    },
    exportPlaced() {
      const exportHeaders = [
        "First Name",
        "Last Name",
        "Phone",
        "Email",
        "Day",
        "Event",
        "Shift Name",
        // "Position",
        // "Confirmed",
        // "Points",
        // "DOB",
        // "Shirt Size",
        // "Code",
      ];
      const exportItems = [];
      for (var key in this.filteredPlacedUsers) {
        // let job
        // if (this.filteredPlacedUsers[key].job && this.filteredPlacedUsers[key].job.label) {
        //   job = this.filteredPlacedUsers[key].job.label
        // } else {
        //   job = this.filteredPlacedUsers[key].shiftName || null
        // }
        // if (!this.filteredPlacedUsers[key].job) {
          
        // }
        let firstName = this.filteredPlacedUsers[key].firstName
        let lastName = this.filteredPlacedUsers[key].lastName
        let phone = this.filteredPlacedUsers[key].phone
        let email = this.filteredPlacedUsers[key].email
        let day = this.filteredPlacedUsers[key].day
        let eventName = this.filteredPlacedUsers[key].eventName
        let shiftName = this.filteredPlacedUsers[key].shiftName
        let confirmed = this.filteredPlacedUsers[key].confirmed
        let uid = this.filteredPlacedUsers[key].userId
        fb.usersCollection.doc(uid).get()
        .then(doc => {
          // console.log(doc.data())
          exportItems.push([
            firstName,
            lastName,
            phone,
            email,
            day,
            eventName,
            shiftName,
            // job,
            // confirmed,
            // this.filteredPlacedUsers[key].firstName,
            // this.filteredPlacedUsers[key].lastName,
            // this.filteredPlacedUsers[key].phone,
            // this.filteredPlacedUsers[key].email,
            // this.filteredPlacedUsers[key].day,
            // this.filteredPlacedUsers[key].eventName,
            // this.filteredPlacedUsers[key].shiftName,
            // this.filteredPlacedUsers[key].job.title,
            // this.filteredPlacedUsers[key].start,
            // this.filteredPlacedUsers[key].end,
            // this.filteredPlacedUsers[key].confirmed,
            // doc.data().points,
            // doc.data().dob,
            // doc.data().shirtsize,
            // `=REGEXEXTRACT(C2,"....$")`
          ])
        })
        this.$gapi.getGapiClient().then(gapi => {
          const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
          exportService.export();
        });
      }
    },
    exportStaff(shift) {
      console.log(shift)
      const exportHeaders = [
        "Day",
        "First Name",
        "Last Name",
        "Event",
        "Position",
        "Start",
        "End",
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
        let day = this.activeDay

        let uid = this.orderedPlacedUsers2(shift.id)[key].userId

        let confirmed = this.orderedPlacedUsers2(shift.id)[key].confirmed

        let start
        if (this.orderedPlacedUsers2(shift.id)[key].start) {
          start = this.orderedPlacedUsers2(shift.id)[key].start
        }
        if (!this.orderedPlacedUsers2(shift.id)[key].start && shift.startTime) {
          start = shift.startTime
        }
        let end
        if (this.orderedPlacedUsers2(shift.id)[key].end) {
          end = this.orderedPlacedUsers2(shift.id)[key].end
        }
        if (!this.orderedPlacedUsers2(shift.id)[key].end && shift.endTime) {
          end = shift.endTime
        }
        // let start = this.orderedPlacedUsers2(shift.id)[key].start
        // let end = this.orderedPlacedUsers2(shift.id)[key].end

        let job
        if (this.orderedPlacedUsers2(shift.id)[key].job && this.orderedPlacedUsers2(shift.id)[key].job.label) {
          job = this.orderedPlacedUsers2(shift.id)[key].job.label
        } else {
          job = (shift.position.title || null)
        }

        fb.usersCollection.doc(uid).get()
        .then(doc => {
          // console.log(doc.data())


          exportItems.push([
            day,
            doc.data().firstName,
            doc.data().lastName,
            shift.event,
            job,
            start,
            end,
            doc.data().phone,
            doc.data().email,
            doc.data().points,
            confirmed,
            moment(doc.data().dob).format('M/D/YYYY'),
            doc.data().shirtsize,
            `=REGEXEXTRACT(H2,"....$")`
          ])



          this.$gapi.getGapiClient().then(gapi => {
            const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
            exportService.export();
          })


      
        
          // console.log(exportItems)
          // let uniqueItems = [...new Set(exportItems)];
          // console.log(uniqueItems);
          // this.$gapi.getGapiClient().then(gapi => {
          //   const exportService = new ExportService(exportHeaders, Object.values(uniqueItems), gapi);
          //   exportService.export();
          // })


          
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
        return user.status == 'available' && (user.day == this.activeDay)
      })
    },
    removePlacement(row) {
      row.showTrash = false
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
        return user.shift == shift && user.day == this.activeDay
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
        return user.shift == shift.id
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
        // shiftStart: this.formatAMPM(shift.startTime) ,
        // shiftEnd:this.formatAMPM(shift.endTime)
      })
      
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
      fb.userDaysCollection.doc(props.row.id).update({
        status: "placed",
        confirmed: false,
        updatedRequested: firebase.firestore.FieldValue.delete()
      })
      setTimeout(() => {
        props.row.status = "placed"
      }, 5000)
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
    deleteStartTime(row) {
      row.start = ''
      fb.userDaysCollection.doc(row.id).update({start: ''})
    },
    deleteEndTime(row) {
      row.end = ''
      fb.userDaysCollection.doc(row.id).update({end: ''})
    },
    lockShift(props, shift) {
      console.log(props)
      console.log(shift)
      props.row.status = "spinning"

      let shiftStarting
      let shiftEnding

      let event = this.event
      let shiftDay = this.activeDay
      let dateObj = new Date(this.activeDay);
      let month = dateObj.getUTCMonth() + 1;
      let day = dateObj.getUTCDate();
      let year = dateObj.getUTCFullYear();
      let newdate = month + "/" + day + "/" + year;

      // if (shift.start) {
      //   shiftStarting = this.formatAMPM(shift.start)
      // }
      // if (!shift.start) {
      //   shiftStarting = null
      // }
      // console.log(shiftStarting)
      // if (shift.end) {
      //   shiftEnding = this.formatAMPM(shift.end)
      // }
      // if (!shift.end) {
      //   shiftEnding = null
      // }
      // console.log(shiftEnding)

      if (props.row.start) {
        shiftStarting = this.formatAMPM(props.row.start)
      }
      if (!props.row.start && shift.startTime) {
        shiftStarting = this.formatAMPM(shift.startTime)
      }

      if (props.row.end) {
        shiftEnding = this.formatAMPM(props.row.end)
      }
      if (!props.row.end && shift.endTime) {
        shiftEnding = this.formatAMPM(shift.endTime)
      }


      this.$store.dispatch("lockAShift", {
        event: event,
        day: this.activeDay,
        row: props.row,
        shift: shift,
        shiftStart: shiftStarting || null,
        shiftEnd: shiftEnding || null
      })
      setTimeout(() => {
        props.row.status = "assigned"
      }, 5000)
      // console.log(assignment)
      // this.$store.dispatch("lockShift", assignment)
    },
    requestConfirmation(props) {
      // this.performingRequest = true
      props.row.updatedRequested = ({
        requested: true
      })
      fb.userDaysCollection.doc(props.row.id).update({
        updatedRequested: fb.firestore.FieldValue.serverTimestamp()
      })
      // fb.assignmentsCollection.where("day", "==", this.activeDay).where("shiftId", "==", props.row.shift).where("userId", "==", props.row.userId).get()
      // .then(function(querySnapshot) {
      //   querySnapshot.forEach(doc => {
      //     fb.assignmentsCollection.doc(doc.data().id).update({
      //       updatedRequested: fb.firestore.FieldValue.serverTimestamp()
      //     })
      //   })
      // })
      // setTimeout(() => {
      //   this.performingRequest = false
      // }, 1000)
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

     // let logFields = {
     //      staffMember: this.currentUser.email,
     //      export: 'Reserve User',
     //      event: this.event.title,
     //      user: user.id
     //  }
     //  this.$store.dispatch('sendPlacementsLog', logFields)
    },
    notRequestUser(user) {
      user.dayStatus = "not requested"
      fb.userDaysCollection.doc(user.id).update({ dayStatus: 'not requested' })
    },
    unreserveUser(user) {
      user.dayStatus = null
      fb.userDaysCollection.doc(user.id).update({dayStatus: null})

      let logFields = {
          staffMember: this.currentUser.email,
          export: 'Reserve User',
          event: this.event.title,
          user: user.id
      }
      console.log(this.currentUser.email, event, user)
      this.$store.dispatch('sendPlacementsLog', logFields)
    },
    cancelNotRequestUser(user) {
      user.dayStatus = null
      fb.userDaysCollection.doc(user.id).update({dayStatus: null})
    },
    filteredInfo(user) {
      return this.referencedUsers.filter(member => {
        if (member && member.id) {
          return (member.id == user.userId)
        }
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
    placements() {
      let url = `/eventplacements/` + this.event.id
      router.push(url)
    },
    sheets() {
      let url = `/events/` + this.$route.params.id + `/timesheets`
      router.push(url)
    },
    editEvent() {
      let url = `/events/` + this.$route.params.id
      router.push(url)
    },
    files() {
      let url = `/events/` + this.$route.params.id + `/files`
      router.push(url)
    },
    shifts() {
      let url = `/events/` + this.$route.params.id + `/shifts`
      router.push(url)
    },
    checkIn() {
      let url = `/events/` + this.$route.params.id + `/checkin`
      router.push(url)
    },
    goBack() {
      router.go(-1)
    },
  },
  destroyed () {
    this.$store.dispatch("clearEventUsers")
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