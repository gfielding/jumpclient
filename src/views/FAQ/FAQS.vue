<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>FAQs</h1>
        <router-link :to="{name: 'addfaq'}" class="color--text">
          <button class="btn btn__flat"><i class="fas fa-plus fa-2x"></i></button>
        </router-link>
      </div>
      <div class="dashboard__container--body">
        <Loader v-if="!faqs || faqs.length == 0" />
        <div class="flex pt-3" v-if="faqs && faqs.length >= 1" style="width:100%;">
          <vue-good-table
            :columns="columns"
            :rows="faqs"
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 10,
            }"
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'answer'">
                <span v-html="truncateMethod(props.row.answer)"></span>
              </span>
              <span v-else-if="props.column.field == 'link'">
                <router-link :to="`/faqs/` + props.row.id" target="_blank">
                  <i class="fas fa-external-link ml-3 mr-3"></i>
                </router-link>
              </span>
              <span v-else-if="props.column.field == 'order'">
                <input type="number" v-model.trim="props.row.order" id="order" @change="onRowEdit(props.row)" />
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
  name: 'faqs',
  data: () => ({
    search: '',
    columns: [
      {
        label: 'Order',
        field: 'order',
      },
      {
        label: 'Link',
        field: 'link',
      },
      {
        label: 'Question',
        field: 'question',
      },
      {
        label: 'Answer',
        field: 'answer',
      },
    ]
  }),
  computed: {
    ...mapState(['faqs']),
  },
  components: {
    Loader,
  },
  created () {
    if (!this.faqs || this.faqs.length < 1) {
      this.$store.dispatch("getFaqsState")
    }
  },
  methods: {
    truncateMethod(text) {
      return text.substring(0, 120) + '...';
    },
    onRowClick(params) {
      let url = `/faqs/` + params.row.id
      console.log(url)
      router.push(url)
    },
    onRowEdit(row) {
      row = row
      this.$store.dispatch('updateFaq', row)
    },
  },
}
</script>