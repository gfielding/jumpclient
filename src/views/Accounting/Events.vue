<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__container--header">
        <h1>Event Accounting</h1>
        <span v-if="year">
          <button class="btn mr-3" v-bind:class="{ 'btn__dark': year == 2021, 'btn__outlined': year != 2021 }" @click="show2021()">2021</button>
          <button class="btn mr-3" v-bind:class="{ 'btn__dark': year == 2022, 'btn__outlined': year != 2022 }" @click="show2022()">2022</button>
        </span>

      </div>
      <router-view :key="$route.params.id" />
      <!-- <div class="dashboard__container--body pt-3">
        <Loader v-if="!events2022 || events2022.length == 0" />
        <vue-good-table
           v-if="is2022"
            :columns="columns"
            :rows="events2022"
             styleClass="vgt-table striped"
            :search-options="{
              enabled: true,
              placeholder: 'Search this table',
            }"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 50,
            }"
            @on-row-click="onRowClick"
          >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'startDate'">
              {{props.row.startDate | moment("MMM Do, YYYY") }}
              <span v-if="props.row.endDate">
                  - {{props.row.endDate | moment("MMM Do, YYYY") }}
              </span>
            </span>
            <span v-else-if="props.column.field == 'published'">
              <span v-if="props.row.published">
                <i class="fas fa-eye"></i>
              </span>
              <span v-else>
                <i class="fas fa-eye-slash"></i>
              </span>
            </span>
            <span v-else-if="props.column.field == 'paid'">
              <span v-if="props.row.paid">
                <i class="fas fa-check"></i>
              </span>
            </span>
            <span v-else-if="props.column.field == 'invoiced'">
                <input type="text" v-model.trim="props.row.invoiced" id="invoiced" />
              </span>
              <span v-else-if="props.column.field == 'invoiceStatus'">
                <span v-if="props.row.invoiceStatus == 'complete'">
                  <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#5cb85c;"></i>
                </span>
                <span v-if="props.row.invoiceStatus == 'partial'">
                  <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#f0ad4e;"></i>
                </span>
                <span v-if="!props.row.invoiceStatus">
                  <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#d9534f;"></i>
                </span>

              </span>
              <span v-else-if="props.column.field == 'invoiceRequested'">
                <span v-if="props.row.invoiceRequested">
                  <i class="fas fa-square" style="font-size: 2rem; margin-top: 0.12rem; color:#d9534f;"></i>
                </span>
              </span>
             <span v-else>
              {{props.formattedRow[props.column.field]}}
            </span>
          </template>
        </vue-good-table>
        <vue-good-table
             v-if="is2021"
              :columns="columns"
              :rows="events2021"
               styleClass="vgt-table striped"
              :search-options="{
                enabled: true,
                placeholder: 'Search this table',
              }"
              :pagination-options="{
                enabled: true,
                mode: 'records',
                perPage: 50,
              }"
              @on-row-click="onRowClick"
            >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'startDate'">
                {{props.row.startDate | moment("MMM Do, YYYY") }}
                <span v-if="props.row.endDate">
                    - {{props.row.endDate | moment("MMM Do, YYYY") }}
                </span>
              </span>
              <span v-else-if="props.column.field == 'title'">
                <span v-if="props.row.paid">
                  <i class="fas fa-check"></i>
                </span>
              </span>
              <span v-else-if="props.column.field == 'published'">
                <span v-if="props.row.published">
                  <i class="fas fa-eye"></i>
                </span>
                <span v-else>
                  <i class="fas fa-eye-slash"></i>
                </span>
              </span>
              <span v-else-if="props.column.field == 'paid'">
                <span v-if="props.row.paid">
                  <i class="fas fa-check"></i>
                </span>
              </span>
              <span v-else-if="props.column.field == 'invoiceRequested'">
                <span v-if="props.row.invoiceRequested">
                  <i class="fad fa-alarm-plus" style="color:red;"></i>
                </span>
              </span>
              <span v-else-if="props.column.field == 'invoiceStatus'">
                <span v-if="props.row.invoiceRequested">
                  <i class="fas fa-check-square" style="color:green;"></i>
                </span>
              </span>
             

             

               <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
          </vue-good-table>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'

export default {
  name: 'accountingEvents',
  data: () => ({
    showAll: true,
    year: ''
  }),
  components: {
    Loader,
  },
  created () {
    this.year = this.$route.params.id
  },
  methods: {
    show2021() {
      let url = `/accounting/events/year/2021`
      router.push(url)
      this.year = '2021'
    },
    show2022() {
      let url = `/accounting/events/year/2022`
      router.push(url)
      this.year = '2022'
    },
    // onRowClick(params) {
    //   let url = `/accounting/events/` + params.row.id
    //   console.log(url)
    //   router.push(url)
    // }
  },
  beforeDestroy () {
    this.year = null
    delete this.year
    console.log(this)
  }
}
</script>