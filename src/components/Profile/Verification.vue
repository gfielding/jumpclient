<template>
  <div>
    <h2>I-9 Verification</h2>
    <div v-if="user && user.verifications" class="mt-3">
      <vue-good-table
        :columns="columns"
        :rows="user.verifications"
        >
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'url'">
            <a :href="props.row.url" target="_blank">View Document</a>
          </span>
          <span v-else-if="props.column.field == 'verified'">
            <span v-if="props.row.verified"><i class="fas fa-check" style="color:green"></i></span>
            <span v-if="!props.row.verified"><i class="fas fa-times" style="color:red"></i></span>
            
          </span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script>
const fb = require('../../firebaseConfig.js')

export default {
  props: ['user'],
  data: () => ({ 
    imageData: null,
    uploadValue: 0,
    showBar:false,
    uploadValueFood: 0,
    showBarFood:false,
    imageDataFood: null,
    columns: [
      {
        label: 'Type',
        field: 'type',
      },
      {
        label: 'Open',
        field: 'url',
      },
      {
        label: 'Verified',
        field: 'verified',
      },
    ]
  }),
}
</script>