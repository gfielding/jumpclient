<template>
	<div class="mb-3">
		<h4 class="mb-3">Certifications</h4>
    <div class="mb-3">
      <div v-if="user && user.certs && user.certs.length >= 1">
                <vue-good-table
                  :columns="columns"
                  :rows="user.certs"
                  >
                  <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field == 'url'">
                      <a :href="props.row.url" target="_blank"><i class="fas fa-external-link"></i></a>
                    </span>
                    <span v-else-if="props.column.field == 'extras'">
                      <button @click="deleteUploadedFile(props.row, props.index)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </span>
                    <span v-else>
                      {{props.formattedRow[props.column.field]}}
                    </span>
                  </template>
                </vue-good-table>
              </div>
    </div>
	</div>
</template>

<script>
export default {
  props: ['user'],
  data: () => ({ 
    columns: [
      {
        label: 'Type',
        field: 'type',
      },
      {
        label: 'Url',
        field: 'url',
        tdClass: 'text-right',
      },
      {
        label: '',
        field: 'extras',
        tdClass: 'text-right',
      },
    ]
  }),
  methods: {
    deleteUploadedFile(u, index) {
      console.log(u)
      let userProfile = this.user
      userProfile.certs.splice(index, 1)
      this.$store.dispatch('updateUser', userProfile)
    },
  },
}
</script>