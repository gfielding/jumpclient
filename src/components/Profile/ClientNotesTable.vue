<template>
	<div style="width:100%;">
		<vue-good-table
      :columns="columns"
      :rows="notes"
      
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
        width: '132px',
      },
      {
      	label: 'Submitted By',
        field: 'submittedBy',
        html: true,
        width: '132px',
      }
    ],
    // rows: [
    //   {
    //     mode: 'span',
    //     label: 'Mammal', // this is the label that'll be used for the header
    //     html: false, // if this is true, label will be rendered as html
    //     children: [
    //       { name: 'Elephant', diet: 'herbivore', count: 5 },
    //       { name: 'Cat', diet: 'carnivore', count: 28 }
    //     ]
    //   }
    // ]
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
      fb.clientNotesCollection.doc(item.id).delete()
    },
  }
}
</script>