<template>
	<div>
    <h2>Sent Messages</h2>
		<div class="mb-3 mt-1">
			
		</div>


    <vue-good-table
      :columns="columns"
      :rows="messages"
      compactMode
      :pagination-options="{
        enabled: true,
        mode: 'records',
        perPage: 10,
      }"
    >
     <template slot="table-row" slot-scope="props">
        

        <span v-if="props.column.field == 'created'">
          <span>{{formatDate(props.row.created)}}</span>
        </span>

        <span v-if="props.column.field == 'message'">
          <span>{{props.row.message}}</span>
        </span>

      </template>

      
    </vue-good-table>


	</div>
</template>

<script>
import * as moment from 'moment'

export default {
  props: ['messages'],
  data: () => ({
    performingRequest: false,
    message: '',
    columns: [
      {
        label: 'Created',
        field: 'created',
      },
      {
        label: 'message',
        field: 'message',
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
  },
}
</script>