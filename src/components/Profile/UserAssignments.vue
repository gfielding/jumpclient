<template>
	<div style="width:100%;">
		<h4>User Assignments:</h4>
		<vue-good-table
      :columns="columns"
      :rows="assignments"
      styleClass="vgt-table condensed"
      compactMode
      :pagination-options="{
        enabled: true,
        mode: 'records',
        perPage: 20,
      }"
    >
     <template slot="table-row" slot-scope="props">
     		<span v-if="props.column.field == 'link'">
          <router-link :to="`/timesheets/` + props.row.id">
            {{props.row.name}}
          </router-link>
        </span>
        <span v-if="props.column.field == 'position'">
          {{props.row.position}}
        </span>
        <span v-if="props.column.field == 'status'">
          {{props.row.status}}
        </span>
        <span v-if="props.column.field == 'paystatus'">
          {{props.row.paystatus}}
        </span>

        <span v-if="props.column.field == 'date'">
         {{props.row.date}}
        </span>

        <!-- <span v-else>
            {{props.formattedRow[props.column.field]}}
          </span> -->
      </template>

      
    </vue-good-table>
	</div>
</template>

<script>
import * as moment from 'moment'

export default {
  props: ['assignments'],
  data: () => ({
    performingRequest: false,
    dialogNote: {},
    columns: [
      {
        label: 'Date',
        field: 'date',
      },
      {
        label: 'Title',
        field: 'link',
      },
      {
        label: 'Position',
        field: 'position',
      },
      {
        label: 'Status',
        field: 'status',
      },
      {
        label: 'Pay',
        field: 'paystatus',
      },
      
    ]
  }),
  methods: {
  	formatDate(q) {
      if(q) {
        console.log(q)
        const postedDate = new Date(q.seconds) * 1000;
        console.log(postedDate)
        return moment(postedDate).format('MMMM Do YYYY')
      } else {
        return null
      }
    },
    deleteItem (item) {
      fb.noticesCollection.doc(item.id).delete()
    },
  }
}
</script>