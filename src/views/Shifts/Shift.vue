<template>
	<div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <div class="flex align-center">
          <h1>Timesheet</h1>
        </div>
        <div class="flex align-center">
          <button class="btn btn__flat" @click="goBack"><i class="fas fa-arrow-left fa-2x"></i></button>
        </div>
      </div>
      <Loader v-if="!shift" />
      <div class="dashboard__container--body" v-if="shift">
        <div class="dashboard__container--body--col">
          <h2>{{shift.event}}</h2>
          <h3 v-if="shift.position">{{shift.position.title}}</h3>
          <h5>{{shift.day | moment("dddd, MMM Do YYYY") }}</h5>
          <span>{{ [ shift.startTime, "HH:mm" ] | moment("hh:mm A") }}</span> - <span>{{ [ shift.endTime, "HH:mm" ] | moment("hh:mm A") }}</span>
          <div>Staff Requested: {{shift.staff}}</div>
        </div>
      </div>
      <div class="dashboard__container--body" v-if="shift">
        <div class="dashboard__container--body--col max">
          <vue-good-table
            :columns="columns"
            :rows="shiftAssignments"
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
              <span v-if="props.column.field == 'regHours'">
                <input type="number" v-model.trim="props.row.regHours" id="regHours" @change="onSheetEdit(props.row)" />
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

<style scoped type="text/css">
.max {
  width:calc(100% - 3.2rem);
}
</style>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'shift',
  data: () => ({
    activeItem: null,
    columns: [
      {
        label: 'Locked',
        field: 'locked',
        type: 'boolean',
      },
      {
        label: 'Link',
        field: 'link',
        sortable: false,
      },
      {
        label: 'Status',
        field: 'status',
      },
      {
        label: 'First',
        field: 'firstName',
      },
      {
        label: 'Last',
        field: 'lastName',
      },
      {
        label: 'ID',
        field: 'fileId',
      },
      {
        label: 'State',
        field: 'state',
      },
      {
        label: 'Reg Hours',
        field: 'regHours',
      },
      {
        label: 'OT Hours',
        field: 'otHours',
      },
      {
        label: '2OT Hours',
        field: '2otHours',
      },
      {
        label: 'Meal Break Penalty',
        field: 'mbp',
      },
      {
        label: 'Tips',
        field: 'tips',
      },
    ]
  }),
  components: {
    Loader,
  },
  created () {
    this.$store.dispatch("getShiftFromId", this.$route.params.id);
  },
  computed: {
    ...mapState(['userProfile', 'shift', 'shiftAssignments']),
  },
  methods: {
    onSheetEdit(row) {
      this.$store.dispatch('updateTimesheet', row)
    },
    goBack() {
      router.go(-1)
    },
  },
  beforeDestroy () {
    this.$store.dispatch('clearShiftState')
  }
}
</script>