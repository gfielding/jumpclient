<template>
  <div>
    <Loader v-if="performingRequest || (!eventAssignments || eventAssignments.length < 1)" />
    <div class="dashboard__container pt-3" v-if="eventInfo && eventInfo.id">
      <div class="dashboard__container--header align-center">
        <div style="width: 100%;">
          <!-- <h2 v-if="eventInfo.title">Timesheets</h2> -->
          <div class="text-left mb-3 mt-1" style="width: 100%;">
          <button class="mr-2 mb-2" @click="showStaff()" v-bind:class="{ 'chipDark': !activeDay, 'chip': activeDay }">
            All Employees
          </button>

          <button class="mr-2 mb-2" v-for="(day, index) in eventInfo.days" :key="index" @click="showEventShifts(day)" v-bind:class="{ 'chipDark': activeDay == day, 'chip': activeDay != day }">
            {{day}}
          </button>
        </div>
        </div>  
        
      </div>
      <div class="dashboard__container--body"  v-if="!activeDay">
        <div class="text-right mb-3" style="width:100%;">
              
          <button class="btn btn__small mr-3" v-bind:class="{ 'btn__dark': isVisible, 'btn__outlined': !isVisible }" @click="showVisible()">Visible</button>
          <button class="btn btn__small mr-3" v-bind:class="{ 'btn__dark': isPaid, 'btn__outlined': !isPaid }" @click="showPaid()">Paid</button>
          <button class="btn btn__small mr-3" v-bind:class="{ 'btn__dark': isHidden, 'btn__outlined': !isHidden }" @click="showHidden()">Hidden</button>

          <button class="btn btn__small btn__outlined mr-3 mb-3" @click.prevent="exportBranch()">Payroll Branch<i class="fas fa-external-link ml-3"></i></button>
          <button class="btn btn__small btn__outlined mr-3 mb-3" @click.prevent="exportRegister()">Billing Export<i class="fas fa-external-link ml-3"></i></button>
          <!-- <button class="btn btn__small btn__outlined mr-3" @click.prevent="exportReportEmp2()">Export Payroll-Peoplease<i class="fas fa-external-link ml-3"></i></button> -->
        </div>  
        <vue-good-table
            v-if="isVisible"
            :columns="columns2"
            :rows="visibleAssignments"
            styleClass="vgt-table bordered condensed"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 50,
            }"
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
           
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'regRate'">
                <input type="number" v-model.trim="props.row.regRate" id="regRate" @change="onEditRegRate(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'dayRate'">
                <input type="text" v-model.trim="props.row.dayRate" id="dayRate" @change="onEditDayRate(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'firstName'">
                <input type="text" v-model.trim="props.row.firstName" id="firstName" readonly />
              </span>
              <span v-else-if="props.column.field == 'lastName'">
                <input type="text" v-model.trim="props.row.lastName" id="lastName" readonly />
              </span>

              <span v-else-if="props.column.field == 'note'">
                <button v-show="!props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="opacity:0.5;"></i></button>
                <button v-show="props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="color:blue"></i></button>
                <transition name="modal">
                  <div v-if="activeItem == props.row">
                    <TimesheetNote :item="props.row" @close="closeNote(props.row)" />
                  </div>
                </transition>
              </span>

              <span v-else-if="props.column.field == 'checkInTimeStamp'">
                <span v-if="props.row.checkInTimeStamp">{{formatDate(props.row.checkInTimeStamp)}}</span>

                <input v-if="!props.row.checkInTimeStamp" type="time" v-model.trim="props.row.inTime" id="in" @change="onEditInOut(props.row)" :readonly="props.row.locked" />

              </span>

              <span v-else-if="props.column.field == 'onboardStatus'">
                <span v-for="u in filteredInfo(props.row)" class="flex">
                  <span v-if="u.evereeOnboardingComplete">
                    <button class="btn btn__small btn__flat">Onboarded<i class="fa-solid fa-check ml-2"></i></button>
                  </span>
                  <span v-if="!u.evereeOnboardingComplete">
                    <button class="btn btn__small btn__flat">In Process<i class="fas fa-exclamation-triangle ml-2 danger"></i></button>
                  </span>
                </span>
              </span>


              <span v-else-if="props.column.field == 'checkOutTimeStamp'">
                <span v-if="props.row.checkOutTimeStamp">{{formatDate(props.row.checkOutTimeStamp)}}</span>

                <input v-if="!props.row.checkOutTimeStamp" type="time" v-model.trim="props.row.outTime" id="in" @change="onEditInOut(props.row)" :readonly="props.row.locked" />

              </span>
              <span v-else-if="props.column.field == 'date'">
                <span v-if="props.row.date">{{props.row.date}}</span>
              </span>

              <span v-else-if="props.column.field == 'position'">
                <span v-if="props.row.position">{{props.row.position}}</span>
              </span>

              <span v-else-if="props.column.field == 'confirmed'">
                <span v-if="props.row.confirmed">{{props.row.confirmed}}</span>
              </span>

              <span v-else-if="props.column.field == 'breakTime'">
                <input type="number" v-model.trim="props.row.breakTime" id="breakTime" @change="onEditBreakTime(props.row)" :readonly="props.row.locked" />
              </span>

              <span v-else-if="props.column.field == 'totalHours'">
                <input type="number" v-model.trim="props.row.totalHours" id="totalHours" @change="onEditTotalHours(props.row)" :readonly="props.row.locked" />
              </span>

              <span v-else-if="props.column.field == 'regHours'">
                <input type="number" v-model.trim="props.row.regHours" id="regHours" @change="onEditRegHours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'otHours'">
                <input type="number" v-model.trim="props.row.otHours" id="otHours" @change="onEditotHours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'ot2Hours'">
                <input type="number" v-model.trim="props.row.ot2Hours" id="ot2Hours" @change="onEditot2Hours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'mbp'">
                <input type="number" v-model.trim="props.row.mbp" id="mbp" @change="onEditMBP(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'tips'">
                <input type="number" v-model.trim="props.row.tips" id="tips" @change="onEditTips(props.row)" :readonly="props.row.locked"  />
              </span>
              <span v-else-if="props.column.field == 'state'">
                <input type="text" v-model.trim="props.row.state" placeholder="CA" id="state" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'status'">
                <v-select
                  label="status" 
                  :options="statuses"
                  v-model="props.row.status"
                  @input="onUpdateStatus(props.row)"
                  :disabled="props.row.locked"
                  :clearable=true
                  >
                </v-select>
              </span>
              <span v-else-if="props.column.field == 'paystatus'">
                <v-select
                  label="status" 
                  :options="paystatuses"
                  v-model="props.row.paystatus"
                  @input="onUpdatePay(props.row)"
                  :disabled="props.row.locked"
                  :clearable=true
                  >
                </v-select>
              </span>
              <span v-else-if="props.column.field == 'locked'">
                <button class="btn btn__outlined btn__small" @click="lock(props.row)" v-if="!props.row.locked">
                  Lock
                  <i class="fas fa-lock-open-alt ml-2"></i>
                </button>
                <button class="btn btn__outlined btn__small" @click="unlock(props.row)" v-if="props.row.locked">
                  Unlock
                  <i class="fas fa-lock-alt ml-2" style="color:#5cb85c;"></i>
                </button>
              </span>
              <span v-if="props.column.field == 'fileId'">
                <span v-if="props.row.fileId">HAS SSN</span>
              </span>


              <span v-else-if="props.column.field == 'delete'">
                <button :disabled="props.row.locked" class="btn btn__dark btn__small ml-2 mr-2" @click="removeEntry(props.row)">
                  hide
                </button>
              </span>


              
              <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.userId" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>
              <span v-else-if="props.column.field == 'payTotal'">
                <input type="text" v-model.trim="props.row.payTotal" id="payTotal" readonly />
              </span>
              <span v-else-if="props.column.field == 'save'">
                <span v-for="u in filteredInfo(props.row)" class="flex">
                  <span v-if="u.evereeOnboardingComplete">
                    <button :disabled="(!props.row.payTotal || props.row.payTotal == null)" class="btn btn__primary btn__small ml-2 mr-2" @click="sendPayment(props.row)">
                    Send Payment
                    </button>
                  </span>
                </span>
              </span>
               <span v-else>
                <!-- {{props.formattedRow[props.column.field]}} -->
              </span>
            </template>
          </vue-good-table>
          <vue-good-table
            v-if="isHidden"
            :columns="columns2"
            :rows="hiddenAssignments"
            styleClass="vgt-table bordered condensed"
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 50,
            }"
           
          >
          
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'regRate'">
                <input type="number" v-model.trim="props.row.regRate" id="regRate" @change="onEditRegRate(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'dayRate'">
                <input type="text" v-model.trim="props.row.dayRate" id="dayRate" @change="onEditDayRate(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'firstName'">
                <input type="text" v-model.trim="props.row.firstName" id="firstName" readonly />
              </span>
              <span v-else-if="props.column.field == 'lastName'">
                <input type="text" v-model.trim="props.row.lastName" id="lastName" readonly />
              </span>

              <span v-else-if="props.column.field == 'note'">
                <button v-show="!props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="opacity:0.5;"></i></button>
                <button v-show="props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="color:blue"></i></button>
                <transition name="modal">
                  <div v-if="activeItem == props.row">
                    <TimesheetNote :item="props.row" @close="closeNote(props.row)" />
                  </div>
                </transition>
              </span>

              <span v-else-if="props.column.field == 'checkInTimeStamp'">
                <span v-if="props.row.checkInTimeStamp">{{formatDate(props.row.checkInTimeStamp)}}</span>

                <input v-if="!props.row.checkInTimeStamp" type="time" v-model.trim="props.row.inTime" id="in" @change="onEditInOut(props.row)" :readonly="props.row.locked" />

              </span>

              <span v-else-if="props.column.field == 'checkOutTimeStamp'">
                <span v-if="props.row.checkOutTimeStamp">{{formatDate(props.row.checkOutTimeStamp)}}</span>

                <input v-if="!props.row.checkOutTimeStamp" type="time" v-model.trim="props.row.outTime" id="in" @change="onEditInOut(props.row)" :readonly="props.row.locked" />

              </span>
              <span v-else-if="props.column.field == 'date'">
                <span v-if="props.row.date">{{props.row.date}}</span>
              </span>

              <span v-else-if="props.column.field == 'position'">
                <span v-if="props.row.position">{{props.row.position}}</span>
              </span>

              <span v-else-if="props.column.field == 'confirmed'">
                <span v-if="props.row.confirmed">{{props.row.confirmed}}</span>
              </span>

              <span v-else-if="props.column.field == 'breakTime'">
                <input type="number" v-model.trim="props.row.breakTime" id="breakTime" @change="onEditBreakTime(props.row)" :readonly="props.row.locked" />
              </span>

              <span v-else-if="props.column.field == 'totalHours'">
                <input type="number" v-model.trim="props.row.totalHours" id="totalHours" @change="onEditTotalHours(props.row)" :readonly="props.row.locked" />
              </span>

              <span v-else-if="props.column.field == 'regHours'">
                <input type="number" v-model.trim="props.row.regHours" id="regHours" @change="onEditRegHours(props.row)" :readonly="props.row.locked" />
              </span>

              <span v-else-if="props.column.field == 'otHours'">
                <input type="number" v-model.trim="props.row.otHours" id="otHours" @change="onEditotHours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'ot2Hours'">
                <input type="number" v-model.trim="props.row.ot2Hours" id="ot2Hours" @change="onEditot2Hours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'mbp'">
                <input type="number" v-model.trim="props.row.mbp" id="mbp" @change="onEditMBP(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'tips'">
                <input type="number" v-model.trim="props.row.tips" id="tips" @change="onEditTips(props.row)" :readonly="props.row.locked"  />
              </span>
              <span v-else-if="props.column.field == 'state'">
                <input type="text" v-model.trim="props.row.state" placeholder="CA" id="state" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'status'">
                <v-select
                  label="status" 
                  :options="statuses"
                  v-model="props.row.status"
                  @input="onUpdateStatus(props.row)"
                  :disabled="props.row.locked"
                  
                  >
                </v-select>
              </span>
              <span v-else-if="props.column.field == 'paystatus'">
                <v-select
                  label="status" 
                  :options="paystatuses"
                  v-model="props.row.paystatus"
                  @input="onUpdatePay(props.row)"
                  :disabled="props.row.locked"
                  :clearable=true
                  >
                </v-select>
              </span>

              <span v-else-if="props.column.field == 'onboardStatus'">
                <span v-for="u in filteredInfo(props.row)" class="flex">
                  <span v-if="u.evereeOnboardingComplete">
                    <button class="btn btn__small btn__flat">Onboarded<i class="fa-solid fa-check ml-2"></i></button>
                  </span>
                  <span v-if="u.evereeOnboardingComplete">
                    <button class="btn btn__small btn__flat">In Process<i class="fas fa-exclamation-triangle ml-2 danger"></i></button>
                  </span>
                </span>
              </span>

              <span v-else-if="props.column.field == 'payTotal'">
                <input type="text" v-model.trim="props.row.payTotal" id="payTotal" readonly />
              </span>


              <!-- <span v-else-if="props.column.field == 'locked'">
                <button class="btn btn__outlined btn__small" @click="lock(props.row)" v-if="!props.row.locked">
                  Lock
                  <i class="fas fa-lock-open-alt ml-2"></i>
                </button>
                <button class="btn btn__outlined btn__small" @click="unlock(props.row)" v-if="props.row.locked">
                  Unlock
                  <i class="fas fa-lock-alt ml-2" style="color:#5cb85c;"></i>
                </button>
              </span>
              <span v-if="props.column.field == 'fileId'">
                <span v-if="props.row.fileId">HAS SSN</span>
              </span> -->


              <span v-else-if="props.column.field == 'delete'">
                <button :disabled="props.row.locked" class="btn btn__primary btn__small ml-2 mr-2" @click="showEntry(props.row)">
                  show
                </button>
              </span>


              
              <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.userId" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>
              <!-- <span v-else-if="props.column.field == 'save'">
                <button :disabled="(props.row.locked || !props.row.editable)" class="btn btn__primary btn__small ml-2 mr-2" @click="onSheetEdit(props.row)">
                  Save
                </button>
              </span> -->




               <span v-else>
                <!-- {{props.formattedRow[props.column.field]}} -->
              </span>
            </template>
          </vue-good-table>

          <vue-good-table
            v-if="isPaid"
            :columns="columns2"
            :rows="paidAssignments"
            styleClass="vgt-table bordered condensed"
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 50,
            }"
           
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'regRate'">
                <input type="number" v-model.trim="props.row.regRate" id="regRate" @change="onEditRegRate(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'dayRate'">
                <input type="text" v-model.trim="props.row.dayRate" id="dayRate" @change="onEditDayRate(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'firstName'">
                <input type="text" v-model.trim="props.row.firstName" id="firstName" readonly />
              </span>
              <span v-else-if="props.column.field == 'lastName'">
                <input type="text" v-model.trim="props.row.lastName" id="lastName" readonly />
              </span>

              <span v-else-if="props.column.field == 'note'">
                <button v-show="!props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="opacity:0.5;"></i></button>
                <button v-show="props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="color:blue"></i></button>
                <transition name="modal">
                  <div v-if="activeItem == props.row">
                    <TimesheetNote :item="props.row" @close="closeNote(props.row)" />
                  </div>
                </transition>
              </span>

              <span v-else-if="props.column.field == 'checkInTimeStamp'">
                <span v-if="props.row.checkInTimeStamp">{{formatDate(props.row.checkInTimeStamp)}}</span>

                <input v-if="!props.row.checkInTimeStamp" type="time" v-model.trim="props.row.inTime" id="in" @change="onEditInOut(props.row)" :readonly="props.row.locked" />

              </span>

              <span v-else-if="props.column.field == 'checkOutTimeStamp'">
                <span v-if="props.row.checkOutTimeStamp">{{formatDate(props.row.checkOutTimeStamp)}}</span>

                <input v-if="!props.row.checkOutTimeStamp" type="time" v-model.trim="props.row.outTime" id="in" @change="onEditInOut(props.row)" :readonly="props.row.locked" />

              </span>
              <span v-else-if="props.column.field == 'date'">
                <span v-if="props.row.date">{{props.row.date}}</span>
              </span>

              <span v-else-if="props.column.field == 'position'">
                <span v-if="props.row.position">{{props.row.position}}</span>
              </span>

              <span v-else-if="props.column.field == 'confirmed'">
                <span v-if="props.row.confirmed">{{props.row.confirmed}}</span>
              </span>

              <span v-else-if="props.column.field == 'payTotal'">
                <input type="text" v-model.trim="props.row.payTotal" id="payTotal" readonly />
              </span>

              <span v-else-if="props.column.field == 'breakTime'">
                <input type="number" v-model.trim="props.row.breakTime" id="breakTime" @change="onEditBreakTime(props.row)" :readonly="props.row.locked" />
              </span>

              <span v-else-if="props.column.field == 'regHours'">
                <input type="number" v-model.trim="props.row.regHours" id="regHours" @change="onEditRegHours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'otHours'">
                <input type="number" v-model.trim="props.row.otHours" id="otHours" @change="onEditotHours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'ot2Hours'">
                <input type="number" v-model.trim="props.row.ot2Hours" id="ot2Hours" @change="onEditot2Hours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'mbp'">
                <input type="number" v-model.trim="props.row.mbp" id="mbp" @change="onEditMBP(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'tips'">
                <input type="number" v-model.trim="props.row.tips" id="tips" @change="onEditTips(props.row)" :readonly="props.row.locked"  />
              </span>
              <span v-else-if="props.column.field == 'state'">
                <input type="text" v-model.trim="props.row.state" placeholder="CA" id="state" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'status'">
                <v-select
                  label="status" 
                  :options="statuses"
                  v-model="props.row.status"
                  @input="onUpdateStatus(props.row)"
                  :disabled="props.row.locked"
                  :clearable=false
                  >
                </v-select>
              </span>
              <span v-else-if="props.column.field == 'paystatus'">
                <v-select
                  label="status" 
                  :options="paystatuses"
                  v-model="props.row.paystatus"
                  @input="onUpdatePay(props.row)"
                  :disabled="props.row.locked"
                  :clearable=true
                  >
                </v-select>
              </span>
              <!-- <span v-else-if="props.column.field == 'locked'">
                <button class="btn btn__outlined btn__small" @click="lock(props.row)" v-if="!props.row.locked">
                  Lock
                  <i class="fas fa-lock-open-alt ml-2"></i>
                </button>
                <button class="btn btn__outlined btn__small" @click="unlock(props.row)" v-if="props.row.locked">
                  Unlock
                  <i class="fas fa-lock-alt ml-2" style="color:#5cb85c;"></i>
                </button>
              </span>
              <span v-if="props.column.field == 'fileId'">
                <span v-if="props.row.fileId">HAS SSN</span>
              </span> -->


              <span v-else-if="props.column.field == 'delete'">
               <!--  <button :disabled="props.row.locked" class="btn btn__primary btn__small ml-2 mr-2" @click="removeEntry(props.row)">
                  hide
                </button> -->
              </span>


              
              <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.userId" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>
             <!--  <span v-else-if="props.column.field == 'save'">
                <button :disabled="(props.row.locked || !props.row.editable)" class="btn btn__primary btn__small ml-2 mr-2" @click="onSheetEdit(props.row)">
                  Save
                </button>
              </span> -->
               <span v-else>
                <!-- {{props.formattedRow[props.column.field]}} -->
              </span>
            </template>
          </vue-good-table>
      </div>
      <div class="dashboard__container--body"  v-if="activeDay">

        <div class="text-right mb-3" style="width:100%;">
              
          <button class="btn btn__small mr-3" v-bind:class="{ 'btn__dark': isVisibleByDay, 'btn__outlined': !isVisibleByDay }" @click="showVisibleByDay()">Visible</button>
          <button class="btn btn__small mr-3" v-bind:class="{ 'btn__dark': isPaidByDay, 'btn__outlined': !isPaidByDay }" @click="showPaidByDay()">Paid</button>
          <button class="btn btn__small mr-3" v-bind:class="{ 'btn__dark': isHiddenByDay, 'btn__outlined': !isHiddenByDay }" @click="showHiddenByDay()">Hidden</button>
          <button class="btn btn__small btn__outlined mr-3 mb-3" @click.prevent="exportBranchByDay()">Payroll Branch (Day)<i class="fas fa-external-link ml-3"></i></button>
          <!-- <button class="btn btn__small btn__outlined mr-3" @click.prevent="exportReportEmp2()">Export Payroll-Peoplease<i class="fas fa-external-link ml-3"></i></button> -->
        </div>  


        <vue-good-table
          v-if="isVisibleByDay"
            :columns="columns2"
            styleClass="vgt-table bordered condensed"
            :rows="visibleAssignmentsByDay"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 50,
            }"
           
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'regRate'">
                <input type="number" v-model.trim="props.row.regRate" id="regRate" @change="onEditRegRate(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'dayRate'">
                <input type="text" v-model.trim="props.row.dayRate" id="dayRate" @change="onEditDayRate(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'firstName'">
                <input type="text" v-model.trim="props.row.firstName" id="firstName" readonly />
              </span>
              <span v-else-if="props.column.field == 'lastName'">
                <input type="text" v-model.trim="props.row.lastName" id="lastName" readonly />
              </span>

              <span v-else-if="props.column.field == 'note'">
                <button v-show="!props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="opacity:0.5;"></i></button>
                <button v-show="props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="color:blue"></i></button>
                <transition name="modal">
                  <div v-if="activeItem == props.row">
                    <TimesheetNote :item="props.row" @close="closeNote(props.row)" />
                  </div>
                </transition>
              </span>

              <span v-else-if="props.column.field == 'checkInTimeStamp'">
                <span v-if="props.row.checkInTimeStamp">{{formatDate(props.row.checkInTimeStamp)}}</span>

                <input v-if="!props.row.checkInTimeStamp" type="time" v-model.trim="props.row.inTime" id="in" @change="onEditInOut(props.row)" :readonly="props.row.locked" />

              </span>

              <span v-else-if="props.column.field == 'checkOutTimeStamp'">
                <span v-if="props.row.checkOutTimeStamp">{{formatDate(props.row.checkOutTimeStamp)}}</span>

                <input v-if="!props.row.checkOutTimeStamp" type="time" v-model.trim="props.row.outTime" id="in" @change="onEditInOut(props.row)" :readonly="props.row.locked" />

              </span>
              <span v-else-if="props.column.field == 'date'">
                <span v-if="props.row.date">{{props.row.date}}</span>
              </span>

              <span v-else-if="props.column.field == 'position'">
                <span v-if="props.row.position">{{props.row.position}}</span>
              </span>

              <span v-else-if="props.column.field == 'confirmed'">
                <span v-if="props.row.confirmed">{{props.row.confirmed}}</span>
              </span>

              <span v-else-if="props.column.field == 'breakTime'">
                <input type="number" v-model.trim="props.row.breakTime" id="breakTime" @change="onEditBreakTime(props.row)" :readonly="props.row.locked" />
              </span>

              <span v-else-if="props.column.field == 'regHours'">
                <input type="number" v-model.trim="props.row.regHours" id="regHours" @change="onEditRegHours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'otHours'">
                <input type="number" v-model.trim="props.row.otHours" id="otHours" @change="onEditotHours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'ot2Hours'">
                <input type="number" v-model.trim="props.row.ot2Hours" id="ot2Hours" @change="onEditot2Hours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'mbp'">
                <input type="number" v-model.trim="props.row.mbp" id="mbp" @change="onEditMBP(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'tips'">
                <input type="number" v-model.trim="props.row.tips" id="tips" @change="onEditTips(props.row)" :readonly="props.row.locked"  />
              </span>
              <span v-else-if="props.column.field == 'state'">
                <input type="text" v-model.trim="props.row.state" placeholder="CA" id="state" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'status'">
                <v-select
                  label="status" 
                  :options="statuses"
                  v-model="props.row.status"
                  @input="onUpdateStatus(props.row)"
                  :disabled="props.row.locked"
                  :clearable=false
                  >
                </v-select>
              </span>
              <span v-else-if="props.column.field == 'paystatus'">
                <v-select
                  label="status" 
                  :options="paystatuses"
                  v-model="props.row.paystatus"
                  @input="onUpdatePay(props.row)"
                  :disabled="props.row.locked"
                  :clearable=true
                  >
                </v-select>
              </span>
              <span v-else-if="props.column.field == 'locked'">
                <button class="btn btn__outlined btn__small" @click="lock(props.row)" v-if="!props.row.locked">
                  Lock
                  <i class="fas fa-lock-open-alt ml-2"></i>
                </button>
                <button class="btn btn__outlined btn__small" @click="unlock(props.row)" v-if="props.row.locked">
                  Unlock
                  <i class="fas fa-lock-alt ml-2" style="color:#5cb85c;"></i>
                </button>
              </span>
              <span v-if="props.column.field == 'fileId'">
                <span v-if="props.row.fileId">HAS SSN</span>
              </span>


              <span v-else-if="props.column.field == 'delete'">
                <button :disabled="props.row.locked" class="btn btn__dark btn__small ml-2 mr-2" @click="removeEntry(props.row)">
                  hide
                </button>
              </span>


              
              <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.userId" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>

              <span v-else-if="props.column.field == 'onboardStatus'">
                <span v-for="u in filteredInfo(props.row)" class="flex">
                  <span v-if="u.evereeOnboardingComplete">
                    <button class="btn btn__small btn__flat">Onboarded<i class="fa-solid fa-check ml-2"></i></button>
                  </span>
                  <span v-if="u.evereeOnboardingComplete">
                    <button class="btn btn__small btn__flat">In Process<i class="fas fa-exclamation-triangle ml-2 danger"></i></button>
                  </span>
                </span>
              </span>

              <span v-else-if="props.column.field == 'save'">
                <span v-for="u in filteredInfo(props.row)" class="flex">
                  <span v-if="u.evereeOnboardingComplete">
                    <button :disabled="(!props.row.payTotal || props.row.payTotal == null)" class="btn btn__primary btn__small ml-2 mr-2" @click="sendPayment(props.row)">
                    Send Payment
                    </button>
                  </span>
                </span>
              </span>
               <span v-else>
                <!-- {{props.formattedRow[props.column.field]}} -->
              </span>
            </template>
          </vue-good-table>   
          <vue-good-table
            v-if="isPaidByDay"
            :columns="columns2"
            :rows="paidAssignmentsByDay"
            styleClass="vgt-table bordered condensed"
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 50,
            }"
           
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'regRate'">
                <input type="number" v-model.trim="props.row.regRate" id="regRate" @change="onEditRegRate(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'dayRate'">
                <input type="text" v-model.trim="props.row.dayRate" id="dayRate" @change="onEditDayRate(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'firstName'">
                <input type="text" v-model.trim="props.row.firstName" id="firstName" readonly />
              </span>
              <span v-else-if="props.column.field == 'lastName'">
                <input type="text" v-model.trim="props.row.lastName" id="lastName" readonly />
              </span>

              <span v-else-if="props.column.field == 'note'">
                <button v-show="!props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="opacity:0.5;"></i></button>
                <button v-show="props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="color:blue"></i></button>
                <transition name="modal">
                  <div v-if="activeItem == props.row">
                    <TimesheetNote :item="props.row" @close="closeNote(props.row)" />
                  </div>
                </transition>
              </span>

              <span v-else-if="props.column.field == 'checkInTimeStamp'">
                <span v-if="props.row.checkInTimeStamp">{{formatDate(props.row.checkInTimeStamp)}}</span>

                <input v-if="!props.row.checkInTimeStamp" type="time" v-model.trim="props.row.inTime" id="in" @change="onEditInOut(props.row)" :readonly="props.row.locked" />

              </span>

              <span v-else-if="props.column.field == 'checkOutTimeStamp'">
                <span v-if="props.row.checkOutTimeStamp">{{formatDate(props.row.checkOutTimeStamp)}}</span>

                <input v-if="!props.row.checkOutTimeStamp" type="time" v-model.trim="props.row.outTime" id="in" @change="onEditInOut(props.row)" :readonly="props.row.locked" />

              </span>
              <span v-else-if="props.column.field == 'date'">
                <span v-if="props.row.date">{{props.row.date}}</span>
              </span>

              <span v-else-if="props.column.field == 'position'">
                <span v-if="props.row.position">{{props.row.position}}</span>
              </span>

              <span v-else-if="props.column.field == 'confirmed'">
                <span v-if="props.row.confirmed">{{props.row.confirmed}}</span>
              </span>

              <span v-else-if="props.column.field == 'payTotal'">
                <input type="text" v-model.trim="props.row.payTotal" id="payTotal" readonly />
              </span>

              <span v-else-if="props.column.field == 'breakTime'">
                <input type="number" v-model.trim="props.row.breakTime" id="breakTime" @change="onEditBreakTime(props.row)" :readonly="props.row.locked" />
              </span>

              <span v-else-if="props.column.field == 'regHours'">
                <input type="number" v-model.trim="props.row.regHours" id="regHours" @change="onEditRegHours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'otHours'">
                <input type="number" v-model.trim="props.row.otHours" id="otHours" @change="onEditotHours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'ot2Hours'">
                <input type="number" v-model.trim="props.row.ot2Hours" id="ot2Hours" @change="onEditot2Hours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'mbp'">
                <input type="number" v-model.trim="props.row.mbp" id="mbp" @change="onEditMBP(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'tips'">
                <input type="number" v-model.trim="props.row.tips" id="tips" @change="onEditTips(props.row)" :readonly="props.row.locked"  />
              </span>
              <span v-else-if="props.column.field == 'state'">
                <input type="text" v-model.trim="props.row.state" placeholder="CA" id="state" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'status'">
                <v-select
                  label="status" 
                  :options="statuses"
                  v-model="props.row.status"
                  @input="onUpdateStatus(props.row)"
                  :disabled="props.row.locked"
                  :clearable=false
                  >
                </v-select>
              </span>
              <span v-else-if="props.column.field == 'paystatus'">
                <v-select
                  label="status" 
                  :options="paystatuses"
                  v-model="props.row.paystatus"
                  @input="onUpdatePay(props.row)"
                  :disabled="props.row.locked"
                  :clearable=true
                  >
                </v-select>
              </span>
              <span v-else-if="props.column.field == 'locked'">
                <button class="btn btn__outlined btn__small" @click="lock(props.row)" v-if="!props.row.locked">
                  Lock
                  <i class="fas fa-lock-open-alt ml-2"></i>
                </button>
                <button class="btn btn__outlined btn__small" @click="unlock(props.row)" v-if="props.row.locked">
                  Unlock
                  <i class="fas fa-lock-alt ml-2" style="color:#5cb85c;"></i>
                </button>
              </span>
              <span v-if="props.column.field == 'fileId'">
                <span v-if="props.row.fileId">HAS SSN</span>
              </span>


              <span v-else-if="props.column.field == 'delete'">
               <!--  <button :disabled="props.row.locked" class="btn btn__primary btn__small ml-2 mr-2" @click="removeEntry(props.row)">
                  hide
                </button> -->
              </span>


              
              <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.userId" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>
              <!-- <span v-else-if="props.column.field == 'save'">
                <button :disabled="(props.row.locked || !props.row.editable)" class="btn btn__primary btn__small ml-2 mr-2" @click="onSheetEdit(props.row)">
                  Save
                </button>
              </span> -->
               <span v-else>
                <!-- {{props.formattedRow[props.column.field]}} -->
              </span>
            </template>
          </vue-good-table>
          <vue-good-table
            v-if="isHiddenByDay"
            :columns="columns2"
            :rows="hiddenAssignmentsByDay"
            styleClass="vgt-table bordered condensed"
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 50,
            }"
           
          >
          
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'regRate'">
                <input type="number" v-model.trim="props.row.regRate" id="regRate" @change="onEditRegRate(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'dayRate'">
                <input type="text" v-model.trim="props.row.dayRate" id="dayRate" @change="onEditDayRate(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'firstName'">
                <input type="text" v-model.trim="props.row.firstName" id="firstName" readonly />
              </span>
              <span v-else-if="props.column.field == 'lastName'">
                <input type="text" v-model.trim="props.row.lastName" id="lastName" readonly />
              </span>

              <span v-else-if="props.column.field == 'note'">
                <button v-show="!props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="opacity:0.5;"></i></button>
                <button v-show="props.row.note" class="btn btn__flat btn__icon" @click="showNote(props.row)" v-tooltip="'Leave a note'"><i class="far fa-sticky-note ml-3 mr-3" style="color:blue"></i></button>
                <transition name="modal">
                  <div v-if="activeItem == props.row">
                    <TimesheetNote :item="props.row" @close="closeNote(props.row)" />
                  </div>
                </transition>
              </span>

              <span v-else-if="props.column.field == 'checkInTimeStamp'">
                <span v-if="props.row.checkInTimeStamp">{{formatDate(props.row.checkInTimeStamp)}}</span>

                <input v-if="!props.row.checkInTimeStamp" type="time" v-model.trim="props.row.inTime" id="in" @change="onEditInOut(props.row)" :readonly="props.row.locked" />

              </span>

              <span v-else-if="props.column.field == 'checkOutTimeStamp'">
                <span v-if="props.row.checkOutTimeStamp">{{formatDate(props.row.checkOutTimeStamp)}}</span>

                <input v-if="!props.row.checkOutTimeStamp" type="time" v-model.trim="props.row.outTime" id="in" @change="onEditInOut(props.row)" :readonly="props.row.locked" />

              </span>
              <span v-else-if="props.column.field == 'date'">
                <span v-if="props.row.date">{{props.row.date}}</span>
              </span>

              <span v-else-if="props.column.field == 'position'">
                <span v-if="props.row.position">{{props.row.position}}</span>
              </span>

              <span v-else-if="props.column.field == 'confirmed'">
                <span v-if="props.row.confirmed">{{props.row.confirmed}}</span>
              </span>

              <span v-else-if="props.column.field == 'breakTime'">
                <input type="number" v-model.trim="props.row.breakTime" id="breakTime" @change="onEditBreakTime(props.row)" :readonly="props.row.locked" />
              </span>

              <span v-else-if="props.column.field == 'totalHours'">
                <input type="number" v-model.trim="props.row.totalHours" id="totalHours" @change="onEditTotalHours(props.row)" :readonly="props.row.locked" />
              </span>

              <span v-else-if="props.column.field == 'regHours'">
                <input type="number" v-model.trim="props.row.regHours" id="regHours" @change="onEditRegHours(props.row)" :readonly="props.row.locked" />
              </span>

              <span v-else-if="props.column.field == 'otHours'">
                <input type="number" v-model.trim="props.row.otHours" id="otHours" @change="onEditotHours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'ot2Hours'">
                <input type="number" v-model.trim="props.row.ot2Hours" id="ot2Hours" @change="onEditot2Hours(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'mbp'">
                <input type="number" v-model.trim="props.row.mbp" id="mbp" @change="onEditMBP(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'tips'">
                <input type="number" v-model.trim="props.row.tips" id="tips" @change="onEditTips(props.row)" :readonly="props.row.locked"  />
              </span>
              <span v-else-if="props.column.field == 'state'">
                <input type="text" v-model.trim="props.row.state" placeholder="CA" id="state" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'status'">
                <v-select
                  label="status" 
                  :options="statuses"
                  v-model="props.row.status"
                  @input="onUpdateStatus(props.row)"
                  :disabled="props.row.locked"
                  
                  >
                </v-select>
              </span>
              <span v-else-if="props.column.field == 'paystatus'">
                <v-select
                  label="status" 
                  :options="paystatuses"
                  v-model="props.row.paystatus"
                  @input="onUpdatePay(props.row)"
                  :disabled="props.row.locked"
                  :clearable=true
                  >
                </v-select>
              </span>
              <span v-else-if="props.column.field == 'payTotal'">
                <input type="text" v-model.trim="props.row.payTotal" id="payTotal" readonly />
              </span>


              <span v-else-if="props.column.field == 'locked'">
                <button class="btn btn__outlined btn__small" @click="lock(props.row)" v-if="!props.row.locked">
                  Lock
                  <i class="fas fa-lock-open-alt ml-2"></i>
                </button>
                <button class="btn btn__outlined btn__small" @click="unlock(props.row)" v-if="props.row.locked">
                  Unlock
                  <i class="fas fa-lock-alt ml-2" style="color:#5cb85c;"></i>
                </button>
              </span>
              <span v-if="props.column.field == 'fileId'">
                <span v-if="props.row.fileId">HAS SSN</span>
              </span>


              <span v-else-if="props.column.field == 'delete'">
                <button :disabled="props.row.locked" class="btn btn__primary btn__small ml-2 mr-2" @click="showEntry(props.row)">
                  show
                </button>
              </span>


              
              <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.userId" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>
              <!-- <span v-else-if="props.column.field == 'save'">
                <button :disabled="(props.row.locked || !props.row.editable)" class="btn btn__primary btn__small ml-2 mr-2" @click="onSheetEdit(props.row)">
                  Save
                </button>
              </span> -->




               <span v-else>
                <!-- {{props.formattedRow[props.column.field]}} -->
              </span>
            </template>
          </vue-good-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
import ExportService from "@/services/ExportService"
import TimesheetNote from '@/components/Timesheets/TimesheetNote.vue'
import firebase from 'firebase/app';
import * as moment from 'moment'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'eventtimesheets',
  data: () => ({
    performingRequest: false,
    encryptionKey: 'SKD433{}{[SKD433{}{[SKD433{}{[32',
    isVisible: true,
    isHidden: false,
    isPaid: false,
    isVisibleByDay: false,
    isHiddenByDay: false,
    isPaidByDay: false,
    activeItem: null,
    activeDay: '',
    statuses: ['completed', 'no-show', 'dropped', 'no-response', 'arrived late', 'left early', 'client fired', 'terminated' ],
    paystatuses: ['paid', 'paid tips', 'paid hours', 'not paid' ],
    columns2: [
      
      {
        field: 'delete',
        sortable: false,
      },
      {
        label: 'Date',
        field: 'date',
      },
      {
        label: 'Confirmed',
        field: 'confirmed',
        sortable: false,
      },
      {
        label: 'Pay Status',
        field: 'paystatus',
        width: '152px',
        sortable: false,
      },
      {
        label: 'Event Status',
        field: 'status',
        width: '152px',
        sortable: false,
      },
      {
        field: 'note',
        sortable: false,
      },
      {
        label: 'First',
        field: 'firstName',
        width: '100px',
      },
      {
        label: 'Last',
        field: 'lastName',
        width: '100px',
      },
      {
        label: 'Shift',
        field: 'position',
      },
      
      {
        label: 'Rate',
        field: 'regRate',
        width: '64px',
        sortable: false,
      },
      {
        label: 'In',
        field: 'checkInTimeStamp',
        width: '88px',
        sortable: false,
      },
      {
        label: 'Out',
        field: 'checkOutTimeStamp',
        width: '88px',
        sortable: false,
      },
      {
        label: 'Break Time',
        field: 'breakTime',
        width: '88px',
        sortable: false,
      },
      {
        label: 'Total Hours',
        field: 'totalHours',
        width: '88px',
        sortable: false,
      },
      {
        label: 'Reg Hours',
        field: 'regHours',
        width: '88px',
        sortable: false,
      },
      {
        label: 'OT',
        field: 'otHours',
        width: '88px',
        sortable: false,
      },
      {
        label: '2OT',
        field: 'ot2Hours',
        width: '88px',
        sortable: false,
      },
      {
        label: 'MBP Penalty',
        field: 'mbp',
        width: '88px',
        sortable: false,
      },
      {
        label: 'Tips',
        field: 'tips',
        width: '88px',
      },
      {
        label: 'Bonus',
        field: 'dayRate',
        width: '88px',
        sortable: false,
      },
      {
        label: 'Pay Total',
        field: 'payTotal',
        width: '88px',
        sortable: false,
      },
      {
        label: 'Onboarded',
        field: 'onboardStatus',
        sortable: false,
      },
      {
        label: 'Send Payment',
        field: 'save',
        sortable: false,
      },
    ],
    columns: [
      {
        label: 'Date',
        field: 'day',
      },
      {
        label: 'Event',
        field: 'event',
      },
      {
        label: 'Staff',
        field: 'staff',
      },
      {
        label: 'Start Time',
        field: 'startTime',
      },
      {
        label: 'End Time',
        field: 'endTime',
      },
      {
        label: 'Position',
        field: 'position.title',
      },
    ]
  }),
  created () {
    this.$store.dispatch("getEventFromId", this.$route.params.id)
    this.$store.dispatch("getEventAssignments", this.$route.params.id)
  },
  // async mounted() {
  //   this.findDate()
  // },
  computed: {
    ...mapState(['eventInfo', 'eventAssignments', 'eventAssignmentsByDay', 'currentUser', 'eventUsersRef']),
    visibleAssignments() {
      return this.eventAssignments.filter(item => {
        return ((!item.hidden || item.hidden != true) && (!item.paystatus || item.paystatus != 'paid'))
      })
    },
    hiddenAssignments() {
      return this.eventAssignments.filter(item => {
        return (item.hidden)
      })
    },
    paidAssignments() {
      return this.eventAssignments.filter(item => {
        return (item.paystatus == 'paid')
      })
    },
    visibleAssignmentsByDay() {
      return this.eventAssignmentsByDay.filter(item => {
        return ((!item.hidden || item.hidden != true) && (!item.paystatus || item.paystatus != 'paid') && item.day == this.activeDay)
      })
    },
    hiddenAssignmentsByDay() {
      return this.eventAssignmentsByDay.filter(item => {
        return (item.hidden && item.day == this.activeDay)
      })
    },
    paidAssignmentsByDay() {
      return this.eventAssignmentsByDay.filter(item => {
        return (item.paystatus == 'paid' && item.day == this.activeDay)
      })
    },
  },
  components: {
    Loader,
    TimesheetNote
  },
  methods: {
    // findDate() {
    //   console.log(new Date().getTime())
    // },
    // filteredEventShifts(activeDay) {
    //   return this.visibleAssignments.filter(item => {
    //     return (item.day = activeDay)
    //   })
    // },
    filteredInfo(user) {
      return this.eventUsersRef.filter(member => {
        if (member && member.id) {
          return (member.id == user.userId)
        }
      })
    },
    decryptedText() {
      if (this.userProfile.ssn) {
      return (this.$CryptoJS.AES.decrypt(this.userProfile.ssn, this.encryptionKey).toString(this.CryptoJS.enc.Utf8) || this.$CryptoJS.AES.encrypt(this.ssn, this.encryptionKey).toString())
      }
    },
    showHidden() {
      this.isHidden = true
      this.isVisible = false
      this.isPaid = false
      this.isPaidByDay = false
      this.isVisibleByDay = false
      this.isHiddenByDay = false
    },
    showVisible() {
      this.isVisible = true
      this.isHidden = false
      this.isPaid = false
      this.isPaidByDay = false
      this.isVisibleByDay = false
      this.isHiddenByDay = false
    },
    showPaid() {
      this.isPaid = true
      this.isVisible = false
      this.isHidden = false
      this.isPaidByDay = false
      this.isVisibleByDay = false
      this.isHiddenByDay = false
    },
    showHiddenByDay() {
      this.isHiddenByDay = true
      this.isVisibleByDay = false
      this.isPaidByDay = false
      this.isHidden = false
      this.isVisible = false
      this.isPaid = false
    },
    showVisibleByDay() {
      this.isVisibleByDay = true
      this.isHiddenByDay = false
      this.isPaidByDay = false
      this.isHidden = false
      this.isVisible = false
      this.isPaid = false
    },
    showPaidByDay() {
      this.isPaidByDay = true
      this.isVisibleByDay = false
      this.isHiddenByDay = false
      this.isHidden = false
      this.isVisible = false
      this.isPaid = false
    },
    goBack() {
      router.go(-1)
    },
    showStaff() {
      this.performingRequest = true
      this.isVisible = true
      this.activeDay = ''
      setTimeout(() => {
        this.performingRequest = false
      }, 2000)
    },
    formatDateCalc(q) {
      if(q) {
        const postedDate = new Date(q) * 1000;
        console.log(postedDate)
        let time = new Date(postedDate).toISOString().substr(11, 8)
        console.log(time)
        let hours = moment.duration(time).asHours()
        return hours
      } else {
        return null
      }
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;

        return moment.utc(postedDate).local().format('HH:mm:ss A')
        // return moment(postedDate).format('HH:MM A')
      } else {
        return null
      }
    },
    formatDate2(q) {
      return moment(q).format('HH:MM A')
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
    onUpdatePay(row) {
      row.editable = true
      this.$store.dispatch('updateTimesheetPay', {
        id: row.id,
        paystatus: row.paystatus
      })
      row.editable = false
    },
    onUpdateStatus(row) {
      row.editable = true
      this.$store.dispatch('updateTimesheetStatus', {
        id: row.id,
        status: row.status
      })
      row.editable = false
    },
    showNote(r) {
      console.log(r)
      this.activeItem = r
    },
    closeNote(r) {
      this.activeItem = null
    },
    removeEntry(row) {
      fb.assignmentsCollection.doc(row.id).update({
        hidden:true
      })
    },
    showEntry(row) {
      fb.assignmentsCollection.doc(row.id).update({
        hidden:false
      })
    },
    // async sendPayment(row) {
    //   const sendUserPayment = firebase.functions().httpsCallable('createNewPayable')
    //     await sendUserPayment({
    //     amount: row.payTotal,
    //     id: row.userId,
    //     note: row.name  
    //   })
    //   .then(result => {
    //     if (result && result.data) {
    //       console.log(result.data)
    //       fb.assignmentsCollection.doc(row.id).update({
    //         paystatus: 'paid',
    //         returned: result.data
    //       })
    //     }
    //   })
    // },
    async sendPayment(row) {
      console.log(row)
      const sendUserPayment = firebase.functions().httpsCallable('createBatchPayment')
        await sendUserPayment({
        amount: row.payTotal,
        id: row.userId,
        note: row.name  
      })
      .then(result => {
        if (result && result.data) {
          console.log(result.data)
          fb.assignmentsCollection.doc(row.id).update({
            paystatus: 'paid',
            returned: result.data
          })
        }
      })
    },
    onEditRegRate(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        regRate: row.regRate
      })
      this.onUpdateTotal(row)
      row.editable = false
    },
    onEditInOut(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        inTime: row.inTime,
        outTime: row.outTime
      })
      console.log(row)
      row.editable = false
    },
    onEditTotalHours(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        totalHours: row.totalHours
      })
      this.onUpdateTotal(row)
      row.editable = false
    },
    onEditRegHours(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        regHours: row.regHours
      })
      this.onUpdateTotal(row)
      row.editable = false
    },
    onEditotHours(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        otHours: row.otHours
      })
      this.onUpdateTotal(row)
      row.editable = false
    },
    onEditot2Hours(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        ot2Hours: row.ot2Hours
      })
      this.onUpdateTotal(row)
      row.editable = false
    },
    onEditDayRate(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        dayRate: row.dayRate
      })
      this.onUpdateTotal(row)
      row.editable = false
    },
    onEditBreakTime(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        breakTime: row.breakTime
      })
      row.editable = false
    },
    onUpdateTotal(row) {
      console.log('editing total')
      console.log(row)
      row.editable = true


      let total = (row.regHours * row.regRate) + 
      (parseFloat(((row.otHours || 0) * (row.regRate * 1.5)))) + 
      (parseFloat(((row.ot2Hours || 0) * ((row.regRate || 0) * 2)))) + 
      (parseFloat(((row.mbp || 0) * row.regRate))) + 
      (parseFloat((row.tips || 0))) + 
      (parseFloat((row.dayRate || 0)))

      

      console.log(total)


      fb.assignmentsCollection.doc(row.id).update({
        payTotal: total,
        paytimestamp: new Date().getTime()
      })
      row.editable = false
    },
    onEditMBP(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        mbp: row.mbp
      })
      this.onUpdateTotal(row)
      row.editable = false
    },
    onEditTips(row) {
      row.editable = true
      fb.assignmentsCollection.doc(row.id).update({
        tips: row.tips
      })
      this.onUpdateTotal(row)
      row.editable = false
    },
    onSheetEditable(row)  {
      row.editable = true
    },
    onSheetEdit(row) {
      row = row
      row.editable = false
      this.$store.dispatch('updateTimesheet', row)
    },
    lock(item) {
      fb.usersCollection.doc(item.userId).get()
      .then(
        doc => {
          console.log(doc.id, " => ", doc.data())
          fb.assignmentsCollection.doc(item.id).update({ 
            locked: true, 
            fileId: doc.data().ssn || null
          })
        }
      )
    },
    unlock(item) {
      fb.assignmentsCollection.doc(item.id).update({ locked: false })
    },
    showEventShifts(day) {
      this.performingRequest = true
      this.isPaid = false
      this.isVisible = false
      this.isHidden = false
      this.isPaidByDay = false
      this.isVisibleByDay = true
      this.isHiddenByDay = false
      this.$store.dispatch("clearEventAssignmentsByDay")
      this.activeDay = day
      this.$store.dispatch("getEventAssignmentsByDay", {
        day: day,
        eventId: this.$route.params.id
      })
      setTimeout(() => {
        this.performingRequest = false
      }, 5000)
    },
    onRowClick(params) {
      let url = `/timesheets/` + params.row.id
      console.log(url)
      router.push(url)
    },
    // exportRegisterByDay() {
    //   this.performingRequest = true
    //   const exportHeaders = [
    //     "Date",
    //     "First Name",
    //     "Last Name",
    //     "Position",
    //     "Hourly Rate",
    //     "Clock-In",
    //     "Clock-Out",
    //     "Reg Hours",
    //     "Overtime",
    //     "2x Overtime",
    //     "Break Penalty",
    //     "CC Tips"
    //   ];
    //   const exportItems = [];
    //   for (var key in this.eventAssignmentsByDay) {
    //     if (!this.eventAssignmentsByDay[key].hidden) {

    //       let inTime = this.formatDate(this.eventAssignmentsByDay[key].checkInTimeStamp)
    //       let outTime = this.formatDate(this.eventAssignmentsByDay[key].checkOutTimeStamp)

    //       exportItems.push([
    //         this.eventAssignmentsByDay[key].date,
    //         this.eventAssignmentsByDay[key].firstName,
    //         this.eventAssignmentsByDay[key].lastName,
    //         this.eventAssignmentsByDay[key].position,
    //         this.eventAssignmentsByDay[key].regRate,
    //         inTime,
    //         outTime,
    //         this.eventAssignmentsByDay[key].regHours,
    //         this.eventAssignmentsByDay[key].otHours,
    //         this.eventAssignmentsByDay[key].ot2Hours,
    //         this.eventAssignmentsByDay[key].mbp,
    //         this.eventAssignmentsByDay[key].tips
    //       ]);
    //     }
    //   }
    //   this.$gapi.getGapiClient().then(gapi => {
    //     const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
    //     exportService.export();
    //   });
    //   setTimeout(() => {
    //     this.performingRequest = false
    //   }, 2000)
    // },
    exportBranch() {
      // this.performingRequest = true
      const exportHeaders = [
        "WorkerID",
        "FirstName",
        "LastName",
        "Amount",
        "TransactionId",
        "Timestamp",
      ];
      const exportItems = [];
      for (var key in this.eventAssignments) {
        if (!this.eventAssignments[key].hidden && (!this.eventAssignments[key].paystatus || this.eventAssignments[key].paystatus != 'paid')) {

          exportItems.push([
            this.eventAssignments[key].userId,
            this.eventAssignments[key].firstName,
            this.eventAssignments[key].lastName,
            this.eventAssignments[key].payTotal,
            this.eventAssignments[key].id,
            // this.eventAssignments[key].paytimestamp,
            moment(this.eventAssignments[key].paytimestamp).format('YYYY/MM/DD'),
          ])
        }
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    exportBranchByDay() {
      // this.performingRequest = true
      const exportHeaders = [
        "WorkerID",
        "FirstName",
        "LastName",
        "Amount",
        "TransactionId",
        "Timestamp",
      ];
      const exportItems = [];
      for (var key in this.eventAssignmentsByDay) {
        if (!this.eventAssignmentsByDay[key].hidden) {

          exportItems.push([
            this.eventAssignmentsByDay[key].userId,
            this.eventAssignmentsByDay[key].firstName,
            this.eventAssignmentsByDay[key].lastName,
            this.eventAssignmentsByDay[key].payTotal,
            this.eventAssignmentsByDay[key].id,
            // this.eventAssignmentsByDay[key].paytimestamp,
            moment(this.eventAssignmentsByDay[key].paytimestamp).format('YYYY/MM/DD'),
          ])
        }
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
    },
    exportRegister() {
      // let logFields = {
      //     user: this.currentUser.email,
      //     export: 'Register (Event Shifts) Export',
      //     eventAssignment: this.eventAssignments.id
      // }
      // this.$store.dispatch('sendExportLog', logFields)
      this.performingRequest = true
      const exportHeaders = [
        "Date",
        "First Name",
        "Last Name",
        "Position",
        "Hourly Rate",
        "Clock-In",
        "Clock-Out",
        "Reg Hours",
        "Overtime",
        "2x Overtime",
        "Break Penalty",
        "CC Tips"
      ];
      const exportItems = [];
      for (var key in this.eventAssignments) {
        if (!this.eventAssignments[key].hidden) {

          let inTime = this.formatDate(this.eventAssignments[key].checkInTimeStamp)
          let outTime = this.formatDate(this.eventAssignments[key].checkOutTimeStamp)

          exportItems.push([
            this.eventAssignments[key].date,
            this.eventAssignments[key].firstName,
            this.eventAssignments[key].lastName,
            this.eventAssignments[key].position,
            this.eventAssignments[key].regRate,
            inTime,
            outTime,
            this.eventAssignments[key].regHours,
            this.eventAssignments[key].otHours,
            this.eventAssignments[key].ot2Hours,
            this.eventAssignments[key].mbp,
            this.eventAssignments[key].tips
          ]);
        }
      }
      this.$gapi.getGapiClient().then(gapi => {
        const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
        exportService.export();
      });
      setTimeout(() => {
        this.performingRequest = false
      }, 2000)
    },

    // exportReportEmp2ByDay(item) {
    //   this.performingRequest = true
    //   const exportHeaders = [
    //     "first_name",
    //     "last_name",
    //     "type",
    //     "id",
    //     "ssn",
    //     "hours",
    //     "rate",
    //     "treat_as_cash",
    //     "day_worked",
    //     "venue_id",
    //     "wc_code"
    //   ];
    //   const exportItems = [];

      

    //   for (var key in this.eventAssignmentsByDay) {
    //     let uid = this.eventAssignmentsByDay[key].userId
    //     let regRate = this.eventAssignmentsByDay[key].regRate
    //     let regHours = this.eventAssignmentsByDay[key].regHours
    //     let otHours = this.eventAssignmentsByDay[key].otHours
    //     let ot2Hours = this.eventAssignmentsByDay[key].ot2Hours
    //     let mbp = this.eventAssignmentsByDay[key].mbp
    //     let tips = this.eventAssignmentsByDay[key].tips
    //     let event = this.eventAssignmentsByDay[key].name
    //     let dayRate = this.eventAssignmentsByDay[key].dayRate
    //     let venueId = this.eventAssignmentsByDay[key].eventInfo.venueId

    //      fb.usersCollection.doc(uid).get()

    //       .then(doc => {
          
    //       let wcCode

    //       if (this.eventAssignmentsByDay[key].eventInfo.venue.address.state =('AL'||'AK'||'AR'||'CO'||'CT'||'FL'||'GA'||'HI'||'ID'||'IL'||'IN'||'IA'||'KS'||'KY'||'MN'||'MO'||'MS'||'MT'||'NE'||'NV'||'NC'||'NH'||'NM'||'OK'||'OR'||'RI'||'SC'||'SD'||'TN'||'UT'||'VT'||'WI'||'WV')){
    //         wcCode = '9082'
    //       }
    //       else if (this.eventAssignmentsByDay[key].eventInfo.venue.address.state =('AZ'||'LA'||'VA')){
    //          wcCode = '9083'
    //       }
    //       else if (this.eventAssignmentsByDay[key].eventInfo.venue.address.state =('CA'||'TX')){
    //         wcCode ='9079'
    //       }
    //       else if (this.eventAssignmentsByDay[key].eventInfo.venue.address.state =('DE'|| 'PA')){
    //         wcCode ='9045'
    //       }
    //       else if (this.eventAssignmentsByDay[key].eventInfo.venue.address.state =('ME')){
    //         wcCode ='9084'
    //       }
    //       else if (this.eventAssignmentsByDay[key].eventInfo.venue.address.state =('MD')){
    //         wcCode ='9086'
    //       }
    //       else if (this.eventAssignmentsByDay[key].eventInfo.venue.address.state =('MI'||'NY')){
    //         wcCode ='9058'
    //       }
    //       else if (this.eventAssignmentsByDay[key].eventInfo.venue.address.state =('MA')){
    //         wcCode ='9085'
    //       }
    //       else if (this.eventAssignmentsByDay[key].eventInfo.venue.address.state =('ND'|| 'OH'|| 'WA'|| 'WY')){
    //         wcCode ='9082OC'
    //       }
    //       else if (this.eventAssignmentsByDay[key].eventInfo.venue.address.state =('NJ')){
    //         wcCode ='9078'
    //       }

          
    //       var social
    //       if (doc.data().ssn) {
    //         social = (this.$CryptoJS.AES.decrypt(doc.data().ssn, this.encryptionKey).toString(this.CryptoJS.enc.Utf8))
    //       }

    //       exportItems.push([
    //         doc.data().firstName || '',
    //         doc.data().lastName || '',
    //         "1",
    //         "7",
    //         social || '',
    //         "1",
    //         dayRate || '',
    //         "1",
    //         event || '',
    //         venueId,
    //         wcCode || ''
    //       ]);
    //       exportItems.push([
    //         doc.data().firstName || '',
    //         doc.data().lastName || '',
    //         "1",
    //         "1",
    //         social || '',
    //         regHours || '',
    //         regRate || '',
    //         "0",
    //         event,
    //         venueId,
    //         wcCode || ''
    //       ]);
    //       exportItems.push([
    //         doc.data().firstName || '',
    //         doc.data().lastName || '',
    //         "1",
    //         "2",
    //         social || '',
    //         otHours || '',
    //         regRate * 1.5 || '',
    //         "0",
    //         event,
    //         venueId,
    //         wcCode || ''
    //       ]);
    //       exportItems.push([
    //         doc.data().firstName || '',
    //         doc.data().lastName || '',
    //         "1",
    //         "22",
    //         social || '',
    //         ot2Hours || '',
    //         regRate * 2 || '',
    //         "0",
    //         event,
    //         venueId,
    //         wcCode || ''
    //       ]);
    //       exportItems.push([
    //         doc.data().firstName || '',
    //         doc.data().lastName || '',
    //         "1",
    //         "125",
    //         social || '',
    //         "1",
    //         tips || '',
    //         "1",
    //         event,
    //         venueId,
    //         wcCode || ''
    //       ]);
    //       exportItems.push([
    //         doc.data().firstName || '',
    //         doc.data().lastName || '',
    //         "1",
    //         "4",
    //         social || '',
    //         "0",
    //         mbp || '',
    //         "0",
    //         event,
    //         venueId,
    //         wcCode || ''
    //       ]);
    //       this.$gapi.getGapiClient().then(gapi => {
    //         const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
    //         exportService.export();
    //       });
    //     })

    //   }
      
    //   // fb.shiftsCollection.doc(this.shift.id).update({ exportedEmp: fb.firestore.FieldValue.serverTimestamp() })
    //   setTimeout(() => {
    //     // this.$store.dispatch("getShiftFromId", this.$route.params.id)
    //     this.performingRequest = false
    //   }, 2000)
    // },
    // exportReportEmp2(item) {
    //   // let logFields = {
    //   //     user: this.currentUser.email,
    //   //     export: 'Report Emp 2 (Event Shifts) Export',
    //   //     eventAssignment: this.eventAssignments.id
    //   // }
    //   // this.$store.dispatch('sendExportLog', logFields)
    //   this.performingRequest = true
    //   const exportHeaders = [
    //     "first_name",
    //     "last_name",
    //     "type",
    //     "id",
    //     "ssn",
    //     "hours",
    //     "rate",
    //     "treat_as_cash",
    //     "day_worked",
    //     "venue_id",
    //     "wc_code"
    //   ];
    //   const exportItems = [];

      

    //   for (var key in this.eventAssignments) {
    //     let uid = this.eventAssignments[key].userId
    //     let regRate = this.eventAssignments[key].regRate
    //     let regHours = this.eventAssignments[key].regHours
    //     let otHours = this.eventAssignments[key].otHours
    //     let ot2Hours = this.eventAssignments[key].ot2Hours
    //     let mbp = this.eventAssignments[key].mbp
    //     let tips = this.eventAssignments[key].tips
    //     let event = this.eventAssignments[key].name
    //     let dayRate = this.eventAssignments[key].dayRate
    //     let venueId = this.eventAssignments[key].eventInfo.venueId

    //      fb.usersCollection.doc(uid).get()

    //       .then(doc => {
          
    //       let wcCode

    //       if (this.eventAssignments[key].eventInfo.venue.address.state =('AL'||'AK'||'AR'||'CO'||'CT'||'FL'||'GA'||'HI'||'ID'||'IL'||'IN'||'IA'||'KS'||'KY'||'MN'||'MO'||'MS'||'MT'||'NE'||'NV'||'NC'||'NH'||'NM'||'OK'||'OR'||'RI'||'SC'||'SD'||'TN'||'UT'||'VT'||'WI'||'WV')){
    //         wcCode = '9082'
    //       }
    //       else if (this.eventAssignments[key].eventInfo.venue.address.state =('AZ'||'LA'||'VA')){
    //          wcCode = '9083'
    //       }
    //       else if (this.eventAssignments[key].eventInfo.venue.address.state =('CA'||'TX')){
    //         wcCode ='9079'
    //       }
    //       else if (this.eventAssignments[key].eventInfo.venue.address.state =('DE'|| 'PA')){
    //         wcCode ='9045'
    //       }
    //       else if (this.eventAssignments[key].eventInfo.venue.address.state =('ME')){
    //         wcCode ='9084'
    //       }
    //       else if (this.eventAssignments[key].eventInfo.venue.address.state =('MD')){
    //         wcCode ='9086'
    //       }
    //       else if (this.eventAssignments[key].eventInfo.venue.address.state =('MI'||'NY')){
    //         wcCode ='9058'
    //       }
    //       else if (this.eventAssignments[key].eventInfo.venue.address.state =('MA')){
    //         wcCode ='9085'
    //       }
    //       else if (this.eventAssignments[key].eventInfo.venue.address.state =('ND'|| 'OH'|| 'WA'|| 'WY')){
    //         wcCode ='9082OC'
    //       }
    //       else if (this.eventAssignments[key].eventInfo.venue.address.state =('NJ')){
    //         wcCode ='9078'
    //       }

          
    //       var social
    //       if (doc.data().ssn) {
    //         social = (this.$CryptoJS.AES.decrypt(doc.data().ssn, this.encryptionKey).toString(this.CryptoJS.enc.Utf8))
    //       }

    //       exportItems.push([
    //         doc.data().firstName || '',
    //         doc.data().lastName || '',
    //         "1",
    //         "7",
    //         social || '',
    //         "1",
    //         dayRate || '',
    //         "1",
    //         event || '',
    //         venueId,
    //         wcCode || ''
    //       ]);
    //       exportItems.push([
    //         doc.data().firstName || '',
    //         doc.data().lastName || '',
    //         "1",
    //         "1",
    //         social || '',
    //         regHours || '',
    //         regRate || '',
    //         "0",
    //         event,
    //         venueId,
    //         wcCode || ''
    //       ]);
    //       exportItems.push([
    //         doc.data().firstName || '',
    //         doc.data().lastName || '',
    //         "1",
    //         "2",
    //         social || '',
    //         otHours || '',
    //         regRate * 1.5 || '',
    //         "0",
    //         event,
    //         venueId,
    //         wcCode || ''
    //       ]);
    //       exportItems.push([
    //         doc.data().firstName || '',
    //         doc.data().lastName || '',
    //         "1",
    //         "22",
    //         social || '',
    //         ot2Hours || '',
    //         regRate * 2 || '',
    //         "0",
    //         event,
    //         venueId,
    //         wcCode || ''
    //       ]);
    //       exportItems.push([
    //         doc.data().firstName || '',
    //         doc.data().lastName || '',
    //         "1",
    //         "125",
    //         social || '',
    //         "1",
    //         tips || '',
    //         "1",
    //         event,
    //         venueId,
    //         wcCode || ''
    //       ]);
    //       exportItems.push([
    //         doc.data().firstName || '',
    //         doc.data().lastName || '',
    //         "1",
    //         "4",
    //         social || '',
    //         "0",
    //         mbp || '',
    //         "0",
    //         event,
    //         venueId,
    //         wcCode || ''
    //       ]);
    //       this.$gapi.getGapiClient().then(gapi => {
    //         const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
    //         exportService.export();
    //       });
    //     })

    //   }
      
    //   // fb.shiftsCollection.doc(this.shift.id).update({ exportedEmp: fb.firestore.FieldValue.serverTimestamp() })
    //   setTimeout(() => {
    //     // this.$store.dispatch("getShiftFromId", this.$route.params.id)
    //     this.performingRequest = false
    //   }, 2000)
    // },
    files() {
      let url = `/events/` + this.$route.params.id + `/files`
      router.push(url)
    },
    placements() {
      let url = `/eventplacements/` + this.$route.params.id
      router.push(url)
    },
    editEvent() {
      let url = `/events/` + this.$route.params.id 
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
  },
  beforeDestroy () {
    this.columns = null
    delete this.columns
    this.$store.dispatch("clearEventState")
    this.$store.dispatch("clearEventAssignments")
    this.$store.dispatch('clearErrors')
  }
}
</script>