<template>
	<div>
    <h4>Sent Messages</h4>
		<div class="mb-3 mt-1">
			
		</div>


    <vue-good-table
      :columns="columns"
      :rows="messages"
      styleClass="vgt-table condensed"
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

        <span v-if="props.column.field == 'name'">
          <span>{{props.row.name}}</span>
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
        label: 'Message',
        field: 'message',
      },
      {
        label: 'Sent',
        field: 'created',
      },
      {
        label: 'From',
        field: 'name',
      },
    ]
  }),
  methods: {
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY')
      } else {
        return null
      }
    },
  },
}
</script>