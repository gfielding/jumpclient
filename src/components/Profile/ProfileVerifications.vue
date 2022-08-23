<template>
	<div>
    <vue-good-table
        :columns="columns"
        :rows="verifications"
        >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field == 'url'">
          <a :href="props.row.url" target="_blank">View Document</a>
        </span>
        <span v-else-if="props.column.field == 'created'">
          <span>{{formatDate(props.row.created)}}</span>
        </span>
        <span v-else-if="props.column.field == 'verified'">

          <button v-tooltip="'Accepted'" class="btn btn__flat btn__small btn__success ma-2" v-if="props.row.verified"><i class="fas fa-check" style="color:white"></i></button>

          <button v-tooltip="'Accept'" class="btn btn__flat btn__small btn__outlined-success ma-2" v-if="!props.row.verified" @click="verify(props.row)"><i class="fas fa-check"></i></button>

          <button v-tooltip="'Rejected'" class="btn btn__flat btn__small btn__danger ma-2" v-if="props.row.rejected"><i class="fas fa-close" style="color:white"></i></button>

          <button  v-tooltip="'Reject'" class="btn btn__flat btn__small btn__outlined-danger ma-2" v-if="!props.row.rejected" @click="unVerify(props.row)"><i class="fas fa-close"></i></button>

        </span>


        <span v-else-if="props.column.field == 'delete'">
          <button class="btn btn__icon pa-0" @click="deleteItem(props.row)">
            <i class="fas fa-trash"></i>
          </button>
        </span>
      </template>
    </vue-good-table>
   <!--  <div class="mb-3" v-for="(referral, index) in referrals" key="index">
      {{referral.friend_firstName}} {{referral.friend_lastName}}
      <hr>
    </div> -->
	</div>
</template>

<script>
import { mapState } from 'vuex'
import * as moment from 'moment'
const fb = require('../../firebaseConfig.js')

export default {
  props: ['userProfile', 'verifications'],
  data: () => ({ 
    columns: [
      {
        label: 'Type',
        field: 'type',
      },
      {
        label: 'Uploaded',
        field: 'created',
      },
      {
        label: 'Verified',
        field: 'verified',
      },
      {
        label: 'Link',
        field: 'url',
      },
      {
        label: 'Delete',
        field: 'delete',
      },
    ]
  }),
  computed: {
    ...mapState(['currentUser']),
  },
  methods: {
    verify(item) {
      this.performingRequest = true
      console.log(item)
      fb.verificationsCollection.doc(item.id).update({
        verified: true,
        rejected: false
      })
      setTimeout(() => {
        this.performingRequest = false
      }, 1000)
    },
    unVerify(item) {
      this.performingRequest = true
      console.log(item)
      fb.verificationsCollection.doc(item.id).update({
        verified: false,
        rejected: true,
      })
      setTimeout(() => {
        this.performingRequest = false
      }, 2000)
    },
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
    deleteItem(item) {
      fb.verificationsCollection.doc(item.id).delete()
    },
  }
}
</script>