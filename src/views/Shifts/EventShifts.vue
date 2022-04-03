<template>
  <div class="dashboard">
    <Loader v-if="performingRequest" />
    <div class="dashboard__container" v-if="eventInfo && eventInfo.id">
      <div class="dashboard__container--header">
        <div class="flex align-center">
          <h1 v-if="eventInfo.title">{{eventInfo.title}} Timesheets</h1>
          <button class="btn btn__large btn__danger ml-5" v-if="eventInfo && eventInfo.cancelled">
            Cancelled
          </button>
        </div>
        <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
      </div>
      <div class="dashboard__container--body" v-if="eventInfo">
        <div class="eventdays mb-3">
          <button class="mr-2 mb-2" @click="showStaff()" v-bind:class="{ 'chipDark': !activeDay, 'chip': activeDay }">
            All Employees
          </button>
          <button class="mr-2 mb-2" v-for="(day, index) in eventInfo.days" :key="index" @click="showEventShfts(day)" v-bind:class="{ 'chipDark': activeDay == day, 'chip': activeDay != day }">
            {{day}}
          </button>
        </div>
      </div>
      <div class="dashboard__container--body"  v-if="!activeDay">
        <div class="text-right mb-3" style="width:100%;">
              
          <button class="btn mr-3" v-bind:class="{ 'btn__dark': isVisible, 'btn__outlined': !isVisible }" @click="showVisible()">Visible</button>
          <button class="btn mr-3" v-bind:class="{ 'btn__dark': isPaid, 'btn__outlined': !isPaid }" @click="showPaid()">Paid</button>
          <button class="btn mr-3" v-bind:class="{ 'btn__dark': isHidden, 'btn__outlined': !isHidden }" @click="showHidden()">Hidden</button>
          <button class="btn btn__outlined mr-3" @click.prevent="exportReportEmp2()">Export Payroll-Peoplease<i class="fas fa-external-link ml-3"></i></button>
        </div>
        <vue-good-table
            v-if="isVisible"
            :columns="columns2"
            :rows="visibleAssignments"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 50,
            }"
           
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'regRate'">
                <input type="number" v-model.trim="props.row.regRate" id="regRate" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'dayRate'">
                <input type="text" v-model.trim="props.row.dayRate" id="dayRate" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
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
              </span>

              <span v-else-if="props.column.field == 'checkOutTimeStamp'">
                <span v-if="props.row.checkOutTimeStamp">{{formatDate(props.row.checkOutTimeStamp)}}</span>
              </span>

              <span v-else-if="props.column.field == 'position'">
                <span v-if="props.row.position">{{props.row.position}}</span>
              </span>

              <span v-else-if="props.column.field == 'confirmed'">
                <span v-if="props.row.confirmed">{{props.row.confirmed}}</span>
              </span>

              <span v-else-if="props.column.field == 'regHours'">
                <input type="number" v-model.trim="props.row.regHours" id="regHours" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'otHours'">
                <input type="number" v-model.trim="props.row.otHours" id="otHours" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'ot2Hours'">
                <input type="number" v-model.trim="props.row.ot2Hours" id="ot2Hours" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'mbp'">
                <input type="number" v-model.trim="props.row.mbp" id="mbp" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'tips'">
                <input type="number" v-model.trim="props.row.tips" id="tips" @change="onSheetEditable(props.row)" :readonly="props.row.locked"  />
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
                <button class="btn btn__icon" @click="lock(props.row)" v-if="!props.row.locked">
                  <i class="fas fa-lock-open-alt ml-3 mr-3"></i>
                </button>
                <button class="btn btn__icon" @click="unlock(props.row)" v-if="props.row.locked">
                  <i class="fas fa-lock-alt ml-3 mr-3" style="color:#5cb85c;"></i>
                </button>
              </span>
              <span v-if="props.column.field == 'fileId'">
                <span v-if="props.row.fileId">HAS SSN</span>
              </span>


              <span v-if="props.column.field == 'onpay'">
                <button class="btn btn__icon" @click="opr(props.row)" v-if="!props.row.opr">
                  <i class="fad fa-money-bill-wave ml-3 mr-3"></i>
                </button>
                <button class="btn btn__icon" @click="removeopr(props.row)" v-if="props.row.opr">
                  <i class="fad fa-money-bill-wave ml-3 mr-3" style="color:#f0ad4e;"></i>
                </button>
              </span>

              <span v-else-if="props.column.field == 'delete'">
                <button :disabled="props.row.locked" class="btn btn__primary btn__small ml-2 mr-2" @click="removeEntry(props.row)">
                  hide
                </button>
              </span>


              
              <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/users/` + props.row.userId" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>
              <span v-else-if="props.column.field == 'save'">
                <button :disabled="(props.row.locked || !props.row.editable)" class="btn btn__primary btn__small ml-2 mr-2" @click="onSheetEdit(props.row)">
                  Save
                </button>
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
                <input type="number" v-model.trim="props.row.regRate" id="regRate" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'dayRate'">
                <input type="text" v-model.trim="props.row.dayRate" id="dayRate" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'firstName'">
                <input type="text" v-model.trim="props.row.firstName" id="firstName" readonly />
              </span>
              <span v-else-if="props.column.field == 'lastName'">
                <input type="text" v-model.trim="props.row.lastName" id="lastName" readonly />
              </span>
              <!-- <span v-else-if="props.column.field == 'fileId'">
                <input type="text" v-model.trim="props.row.fileId" id="fileId" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span> -->
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
              </span>

              <span v-else-if="props.column.field == 'checkOutTimeStamp'">
                <span v-if="props.row.checkOutTimeStamp">{{formatDate(props.row.checkOutTimeStamp)}}</span>
              </span>

              <span v-else-if="props.column.field == 'position'">
                <span v-if="props.row.position">{{props.row.position}}</span>
              </span>

              <span v-else-if="props.column.field == 'confirmed'">
                <span v-if="props.row.confirmed">{{props.row.confirmed}}</span>
              </span>

              <span v-else-if="props.column.field == 'regHours'">
                <input type="number" v-model.trim="props.row.regHours" id="regHours" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'otHours'">
                <input type="number" v-model.trim="props.row.otHours" id="otHours" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'ot2Hours'">
                <input type="number" v-model.trim="props.row.ot2Hours" id="ot2Hours" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'mbp'">
                <input type="number" v-model.trim="props.row.mbp" id="mbp" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'tips'">
                <input type="number" v-model.trim="props.row.tips" id="tips" @change="onSheetEditable(props.row)" :readonly="props.row.locked"  />
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
                <button class="btn btn__icon" @click="lock(props.row)" v-if="!props.row.locked">
                  <i class="fas fa-lock-open-alt ml-3 mr-3"></i>
                </button>
                <button class="btn btn__icon" @click="unlock(props.row)" v-if="props.row.locked">
                  <i class="fas fa-lock-alt ml-3 mr-3" style="color:#5cb85c;"></i>
                </button>
              </span>
              <span v-if="props.column.field == 'fileId'">
                <span v-if="props.row.fileId">HAS SSN</span>
              </span>


              <span v-if="props.column.field == 'onpay'">
                <button class="btn btn__icon" @click="opr(props.row)" v-if="!props.row.opr">
                  <i class="fad fa-money-bill-wave ml-3 mr-3"></i>
                </button>
                <button class="btn btn__icon" @click="removeopr(props.row)" v-if="props.row.opr">
                  <i class="fad fa-money-bill-wave ml-3 mr-3" style="color:#f0ad4e;"></i>
                </button>
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
              <span v-else-if="props.column.field == 'save'">
                <button :disabled="(props.row.locked || !props.row.editable)" class="btn btn__primary btn__small ml-2 mr-2" @click="onSheetEdit(props.row)">
                  Save
                </button>
              </span>
               <span v-else>
                <!-- {{props.formattedRow[props.column.field]}} -->
              </span>
            </template>
          </vue-good-table>

          <vue-good-table
            v-if="isPaid"
            :columns="columns2"
            :rows="paidAssignments"
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
                <input type="number" v-model.trim="props.row.regRate" id="regRate" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'dayRate'">
                <input type="text" v-model.trim="props.row.dayRate" id="dayRate" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'firstName'">
                <input type="text" v-model.trim="props.row.firstName" id="firstName" readonly />
              </span>
              <span v-else-if="props.column.field == 'lastName'">
                <input type="text" v-model.trim="props.row.lastName" id="lastName" readonly />
              </span>
              <!-- <span v-else-if="props.column.field == 'fileId'">
                <input type="text" v-model.trim="props.row.fileId" id="fileId" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span> -->
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
              </span>

              <span v-else-if="props.column.field == 'checkOutTimeStamp'">
                <span v-if="props.row.checkOutTimeStamp">{{formatDate(props.row.checkOutTimeStamp)}}</span>
              </span>

              <span v-else-if="props.column.field == 'position'">
                <span v-if="props.row.position">{{props.row.position}}</span>
              </span>

              <span v-else-if="props.column.field == 'confirmed'">
                <span v-if="props.row.confirmed">{{props.row.confirmed}}</span>
              </span>

              <span v-else-if="props.column.field == 'regHours'">
                <input type="number" v-model.trim="props.row.regHours" id="regHours" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'otHours'">
                <input type="number" v-model.trim="props.row.otHours" id="otHours" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'ot2Hours'">
                <input type="number" v-model.trim="props.row.ot2Hours" id="ot2Hours" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'mbp'">
                <input type="number" v-model.trim="props.row.mbp" id="mbp" @change="onSheetEditable(props.row)" :readonly="props.row.locked" />
              </span>
              <span v-else-if="props.column.field == 'tips'">
                <input type="number" v-model.trim="props.row.tips" id="tips" @change="onSheetEditable(props.row)" :readonly="props.row.locked"  />
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
                <button class="btn btn__icon" @click="lock(props.row)" v-if="!props.row.locked">
                  <i class="fas fa-lock-open-alt ml-3 mr-3"></i>
                </button>
                <button class="btn btn__icon" @click="unlock(props.row)" v-if="props.row.locked">
                  <i class="fas fa-lock-alt ml-3 mr-3" style="color:#5cb85c;"></i>
                </button>
              </span>
              <span v-if="props.column.field == 'fileId'">
                <span v-if="props.row.fileId">HAS SSN</span>
              </span>


              <!-- <span v-if="props.column.field == 'onpay'">
                <button class="btn btn__icon" @click="opr(props.row)" v-if="!props.row.opr">
                  <i class="fad fa-money-bill-wave ml-3 mr-3"></i>
                </button>
                <button class="btn btn__icon" @click="removeopr(props.row)" v-if="props.row.opr">
                  <i class="fad fa-money-bill-wave ml-3 mr-3" style="color:#f0ad4e;"></i>
                </button>
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
              <span v-else-if="props.column.field == 'save'">
                <button :disabled="(props.row.locked || !props.row.editable)" class="btn btn__primary btn__small ml-2 mr-2" @click="onSheetEdit(props.row)">
                  Save
                </button>
              </span>
               <span v-else>
                <!-- {{props.formattedRow[props.column.field]}} -->
              </span>
            </template>
          </vue-good-table>
      </div>
      <div class="dashboard__container--body"  v-if="activeDay">
        <Loader v-if="!eventShifts || eventShifts.length == 0" />
        <vue-good-table
          :columns="columns"
          :rows="filteredEventShifts"
          styleClass="vgt-table striped"
          :search-options="{
            enabled: true,
            placeholder: 'Search this table',
          }"
          :pagination-options="{
            enabled: true,
            mode: 'records',
            perPage: 20,
          }"
          @on-row-click="onRowClick"
        >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'payrollComplete'">
              <span v-if="props.row.payrollComplete">
                <i class="fas fa-check"></i>
              </span>
            </span>
             <span v-else>
              {{props.formattedRow[props.column.field]}}
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
    activeItem: null,
    activeDay: '',
    statuses: ['completed', 'no-show', 'no-response', 'arrived late', 'left early', 'client fired', 'terminated' ],
    paystatuses: ['paid', 'paid tips', 'paid hours', 'not paid' ],
    columns2: [
      {
        field: 'locked',
        type: 'boolean',
        tdClass: 'text-center',
        sortable: false,
      },
      {
        field: 'delete',
        sortable: false,
      },
      {
        field: 'link',
        sortable: false,
      },
      {
        field: 'note',
        sortable: false,
      },
      {
        label: 'Confirmed',
        field: 'confirmed',
        sortable: false,
      },
      {
        label: 'Pay Status',
        field: 'paystatus',
        width: '140px',
        sortable: false,
      },
      {
        label: 'Event Status',
        field: 'status',
        width: '140px',
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
        label: 'Social',
        field: 'fileId',
        width: '100px',
      },
      {
        label: 'Position',
        field: 'position',
      },
      
      {
        label: 'Rate',
        field: 'regRate',
        width: '48px',
        sortable: false,
      },
      {
        label: 'In',
        field: 'checkInTimeStamp',
        width: '64px',
        sortable: false,
      },
      {
        label: 'Out',
        field: 'checkOutTimeStamp',
        width: '64px',
        sortable: false,
      },
      {
        label: 'Hours',
        field: 'regHours',
        width: '48px',
        sortable: false,
      },
      {
        label: 'OT',
        field: 'otHours',
        width: '48px',
        sortable: false,
      },
      {
        label: '2OT',
        field: 'ot2Hours',
        width: '48px',
        sortable: false,
      },
      {
        label: 'Penalty',
        field: 'mbp',
        width: '48px',
        sortable: false,
      },
      {
        label: 'Tips',
        field: 'tips',
        width: '48px',
      },
      {
        label: 'Bonus',
        field: 'dayRate',
        width: '48px',
        sortable: false,
      },
      {
        label: 'Save',
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
  //   this.decryptRow()
  // },
  computed: {
    ...mapState(['eventShifts', 'eventInfo', 'eventAssignments']),
    filteredEventShifts() {
      return this.eventShifts.filter(item => {
        return (item.day = this.activeDay)
      })
    },
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
  },
  components: {
    Loader,
    TimesheetNote
  },
  methods: {
    decryptedText() {
      if (this.userProfile.ssn) {
      return (this.$CryptoJS.AES.decrypt(this.userProfile.ssn, this.encryptionKey).toString(this.CryptoJS.enc.Utf8) || this.$CryptoJS.AES.encrypt(this.ssn, this.encryptionKey).toString())
      }
    },
    showHidden() {
      this.isHidden = true
      this.isVisible = false
      this.isPaid = false
    },
    showVisible() {
      this.isVisible = true
      this.isHidden = false
      this.isPaid = false
    },
    showPaid() {
      this.isPaid = true
      this.isVisible = false
      this.isHidden = false
    },
    goBack() {
      router.go(-1)
    },
    showStaff() {
      this.performingRequest = true
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
      this.$store.dispatch('updateTimesheetPay', {
        id: row.id,
        paystatus: row.paystatus
      })
    },
    onUpdateStatus(row) {
      this.$store.dispatch('updateTimesheetStatus', {
        id: row.id,
        status: row.status
      })
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
    onSheetEditable(row)  {
      row = row
      row.editable = true
      this.$store.dispatch('updateTimesheet', row)
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
    // showEventShfts(day) {
    //   let url = `/timesheets/` + this.$route.params.id + `/` + day
    //   router.push(url)
    // },
    showEventShfts(day) {
      this.performingRequest = true
      this.activeDay = day
      setTimeout(() => {
        this.performingRequest = false
      }, 2000)
    },
    onRowClick(params) {
      let url = `/timesheets/` + params.row.id
      console.log(url)
      router.push(url)
    },
    exportReportEmp2(item) {
      this.performingRequest = true
      const exportHeaders = [
        "first_name",
        "last_name",
        "type",
        "id",
        "ssn",
        "hours",
        "rate",
        "treat_as_cash",
        "day_worked",
        "venue_id",
        "wc_code"
      ];
      const exportItems = [];

      

      for (var key in this.eventAssignments) {
        let uid = this.eventAssignments[key].userId
        let regRate = this.eventAssignments[key].regRate
        let regHours = this.eventAssignments[key].regHours
        let otHours = this.eventAssignments[key].otHours
        let ot2Hours = this.eventAssignments[key].ot2Hours
        let mbp = this.eventAssignments[key].mbp
        let tips = this.eventAssignments[key].tips
        let event = this.eventAssignments[key].name
        let dayRate = this.eventAssignments[key].dayRate
        let venueId = this.eventAssignments[key].eventInfo.venueId

         fb.usersCollection.doc(uid).get()

          .then(doc => {
          
          let wcCode

          if (this.eventAssignments[key].eventInfo.venue.address.state =('AL'||'AK'||'AR'||'CO'||'CT'||'FL'||'GA'||'HI'||'ID'||'IL'||'IN'||'IA'||'KS'||'KY'||'MN'||'MO'||'MS'||'MT'||'NE'||'NV'||'NC'||'NH'||'NM'||'OK'||'OR'||'RI'||'SC'||'SD'||'TN'||'UT'||'VT'||'WI'||'WV')){
            wcCode = '9082'
          }
          else if (this.eventAssignments[key].eventInfo.venue.address.state =('AZ'||'LA'||'VA')){
             wcCode = '9083'
          }
          else if (this.eventAssignments[key].eventInfo.venue.address.state =('CA'||'TX')){
            wcCode ='9079'
          }
          else if (this.eventAssignments[key].eventInfo.venue.address.state =('DE'|| 'PA')){
            wcCode ='9045'
          }
          else if (this.eventAssignments[key].eventInfo.venue.address.state =('ME')){
            wcCode ='9084'
          }
          else if (this.eventAssignments[key].eventInfo.venue.address.state =('MD')){
            wcCode ='9086'
          }
          else if (this.eventAssignments[key].eventInfo.venue.address.state =('MI'||'NY')){
            wcCode ='9058'
          }
          else if (this.eventAssignments[key].eventInfo.venue.address.state =('MA')){
            wcCode ='9085'
          }
          else if (this.eventAssignments[key].eventInfo.venue.address.state =('ND'|| 'OH'|| 'WA'|| 'WY')){
            wcCode ='9082OC'
          }
          else if (this.eventAssignments[key].eventInfo.venue.address.state =('NJ')){
            wcCode ='9078'
          }

          
          var social
          if (doc.data().ssn) {
            social = (this.$CryptoJS.AES.decrypt(doc.data().ssn, this.encryptionKey).toString(this.CryptoJS.enc.Utf8))
          }

          exportItems.push([
            doc.data().firstName || '',
            doc.data().lastName || '',
            "1",
            "7",
            social || '',
            "1",
            dayRate || '',
            "1",
            event || '',
            venueId,
            wcCode || ''
          ]);
          exportItems.push([
            doc.data().firstName || '',
            doc.data().lastName || '',
            "1",
            "1",
            social || '',
            regHours || '',
            regRate || '',
            "0",
            event,
            venueId,
            wcCode || ''
          ]);
          exportItems.push([
            doc.data().firstName || '',
            doc.data().lastName || '',
            "1",
            "2",
            social || '',
            otHours || '',
            regRate * 1.5 || '',
            "0",
            event,
            venueId,
            wcCode || ''
          ]);
          exportItems.push([
            doc.data().firstName || '',
            doc.data().lastName || '',
            "1",
            "22",
            social || '',
            ot2Hours || '',
            regRate * 2 || '',
            "0",
            event,
            venueId,
            wcCode || ''
          ]);
          exportItems.push([
            doc.data().firstName || '',
            doc.data().lastName || '',
            "1",
            "125",
            social || '',
            "1",
            tips || '',
            "1",
            event,
            venueId,
            wcCode || ''
          ]);
          exportItems.push([
            doc.data().firstName || '',
            doc.data().lastName || '',
            "1",
            "4",
            social || '',
            "0",
            mbp || '',
            "0",
            event,
            venueId,
            wcCode || ''
          ]);
          this.$gapi.getGapiClient().then(gapi => {
            const exportService = new ExportService(exportHeaders, Object.values(exportItems), gapi);
            exportService.export();
          });
        })

      }
      
      // fb.shiftsCollection.doc(this.shift.id).update({ exportedEmp: fb.firestore.FieldValue.serverTimestamp() })
      setTimeout(() => {
        // this.$store.dispatch("getShiftFromId", this.$route.params.id)
        this.performingRequest = false
      }, 2000)
    },
  },
  beforeDestroy () {
    this.columns = null
    delete this.columns
    this.$store.dispatch("clearEventState")
    this.$store.dispatch("clearEventShifts")
    this.$store.dispatch("clearEventAssignments")
    this.$store.dispatch('clearErrors')
  }
}
</script>