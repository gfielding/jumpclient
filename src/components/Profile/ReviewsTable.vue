<template>
	<div>
		<h2>User Reviews:</h2>
		<vue-good-table
      :columns="columns"
      :rows="reviews"
      compactMode
      :pagination-options="{
        enabled: true,
        mode: 'records',
        perPage: 10,
      }"
    >
     <template slot="table-row" slot-scope="props">
      <span v-if="props.column.field == 'rating'">
          <span>{{props.row.rating}}</span>
        </span>
     		<span v-if="props.column.field == 'review'">
          <span>{{props.row.review}}</span>
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
  props: ['reviews'],
  data: () => ({
    performingRequest: false,
    dialogNote: {},
    columns: [
      {
        label: 'Rating',
        field: 'rating',
      },
      {
        label: 'Review',
        field: 'review',
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
        const postedDate = new Date(q.seconds) * 1000;
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