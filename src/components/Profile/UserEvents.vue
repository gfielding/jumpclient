<template>
	<div style="width:100%;">
		<h2>User Events:</h2>
		<vue-good-table
      :columns="columns"
      :rows="events"
      compactMode
      :pagination-options="{
        enabled: true,
        mode: 'records',
        perPage: 10,
      }"
    >
     <template slot="table-row" slot-scope="props">
     		<span v-if="props.column.field == 'link'">
          <router-link :to="`/events/` + props.row.id">
            {{props.row.title}}
          </router-link>
        </span>

        <span v-if="props.column.field == 'date'">
          {{props.row.startDate | moment("ddd, MMM Do YYYY") }}
          <span v-if="props.row.endDate">
              - {{props.row.endDate | moment("ddd, MMM Do YYYY") }}
          </span>
        </span>

        <span v-else>
            {{props.formattedRow[props.column.field]}}
          </span>
      </template>

      
    </vue-good-table>
	</div>
</template>

<script>
import * as moment from 'moment'

export default {
  props: ['events'],
  data: () => ({
    performingRequest: false,
    dialogNote: {},
    columns: [
      {
        label: 'Title',
        field: 'link',
      },
      {
        label: 'Date',
        field: 'date',
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