<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Manage Tags</h1>
        <router-link :to="{name: 'addtag'}" class="color--text">
          <button class="btn btn__flat"><i class="fas fa-plus fa-2x"></i></button>
        </router-link>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!tags || tags.length == 0" />
        <div class="flex pt-3" v-if="tags && tags.length >= 1" style="width:100%;">
          <vue-good-table
            :columns="columns"
            :rows="tags"
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'featured'">
                <input type="checkbox" v-model.trim="props.row.featured" id="order" @change="onRowEdit(props.row)" />
              </span>
               <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>

            </template>
          </vue-good-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'tags',
  data: () => ({
    search: '',
    columns: [
      {
        label: 'Title',
        field: 'title',
      },
      {
        label: 'Featured',
        field: 'featured',
      },
    ]
  }),
  computed: {
    ...mapState(['tags']),
  },
  components: {
    Loader,
  },
  created () {
    if (!this.tags || this.tags.length < 1) {
      this.$store.dispatch("getTagsState")
    }
  },
  methods: {
    // truncateMethod(text) {
    //   return text.substring(0, 120) + '...';
    // },
    // onRowClick(params) {
    //   let url = `/faqs/` + params.row.id
    //   console.log(url)
    //   router.push(url)
    // },
    onRowEdit(row) {
      row = row
      this.$store.dispatch('updateTag', row)
    },
  },
  beforeDestroy () {
    this.$store.dispatch("clearTagsState")
  }
}
</script>