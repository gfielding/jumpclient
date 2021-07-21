<template>
	<div>
		<h2>User Notes:</h2>
		<vue-good-table
      :columns="columns"
      :rows="notes"
      compactMode
      :pagination-options="{
        enabled: true,
        mode: 'records',
        perPage: 10,
      }"
    >
     <template slot="table-row" slot-scope="props">
     		<span v-if="props.column.field == 'note'">
          <span>{{props.row.note}}</span>
        </span>

        <span v-if="props.column.field == 'created'">
          <span>{{formatDate(props.row.created)}}</span>
        </span>

        <span v-if="props.column.field == 'submittedBy'">
          {{props.row.submittedBy}}
          <!-- <router-link :to="`/users/` + props.row.submittedBy" target="_blank">	<i class="fas fa-external-link"></i>
          </router-link> -->
        </span>
      </template>

      
    </vue-good-table>
	</div>
</template>

<script>
import * as moment from 'moment'

export default {
  props: ['notes'],
  data: () => ({
    performingRequest: false,
    dialogNote: {},
    columns: [
      {
        label: 'Note',
        field: 'note',
      },
      {
        label: 'Created',
        field: 'created',
      },
      {
      	label: 'Submitted By',
        field: 'submittedBy',
        html: true
      }
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