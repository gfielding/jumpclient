<template>
  <div class="dashboard__container" v-if="user">
    <div class="dashboard__container--body">
      <div class="dashboard__container--body--col">
        <div class="whiteBack">
          <h4 class="mb-3">Order Background Check</h4>
         <!--  <div class="mb-3">
            <v-select
              :options="statuses"
              v-model="userProfile.backgroundCheckStatus"
              @input="updateProfile()"
              :clearable="false"
              >
            </v-select>
          </div> -->
          <form @submit.prevent>
            <div class="mb-3">
              <label for="company">Company Ordered From:</label>
              <input type="text" placeholder="Checkr, etc" v-model.trim="check.company" id="company" />
            </div>
            <div class="mb-3">
              <label for="type">Order Type:</label>
              <input type="text" placeholder="Checkr, etc" v-model.trim="check.type" id="type" />
            </div>
            <button v-if="check.type && check.company" class="btn btn__primary mt-3" @click="addCheck()">Add Check
              <transition name="fade">
                <span class="ml-2" v-if="performingRequest">
                <i class="fa fa-spinner fa-spin"></i>
                </span>
              </transition>
            </button>
          </form>
        </div>
      </div>
    </div>
    <hr>
    <div class="dashboard__container--body">
      <div class="dashboard__container--body--col" style="width:100%;">
        <div>
          <vue-good-table
            :columns="columns"
            :rows="userBackgroundChecks"
            styleClass="vgt-table condensed"
            compactMode
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 10,
            }"
            @on-row-click="onRowClick"
          >
           <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'note'">
                <span>{{props.row.note}}</span>
              </span>

              <span v-else-if="props.column.field == 'created'">
                <span>{{formatDate(props.row.created)}}</span>
              </span>

              <span v-else-if="props.column.field == 'submittedBy'">
                {{props.row.orderedBy.firstName}} {{props.row.orderedBy.lastName}} 
                <!-- <router-link :to="`/users/` + props.row.submittedBy" target="_blank">  <i class="fas fa-external-link"></i>
                </router-link> -->
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
import * as moment from 'moment'
import router from '@/router'

export default {
  props: ['user'],
  name: 'userBackgroundCheck',
  data: () => ({
    statuses: ['ordered', 'cancelled'],
    check: {
      status: 'Ordered',
    },
    columns: [
      {
        label: 'Created',
        field: 'created',
      },
      {
        label: 'Company',
        field: 'company',
      },
      {
        label: 'Type',
        field: 'type',
      },
      {
        label: 'Status',
        field: 'status',
      },
      {
        label: 'Response',
        field: 'response',
      },
      {
        label: 'Submitted By',
        field: 'submittedBy',
        html: true
      }
    ]
  }),
  created() {
    this.$store.dispatch('getUserBackgroundChecks', this.$route.params.id)
  },
  computed: {
    ...mapState(['currentUser', 'userProfile', 'userBackgroundChecks']),
  },
  components: {
    Loader,
  },
  methods: {
    onRowClick(params) {
      console.log(params)
      let url = `/users/` + this.userProfile.id + `/backgroundcheck/` + params.row.id
      router.push(url)
    },
    addCheck() {
      this.performingRequest = true
      let store = this.$store
      this.check.orderedBy = this.userProfile
      this.check.userId = this.user.id
      store.dispatch('addCheck', this.check)
      setTimeout(() => {
        this.performingRequest = false
        this.check = {}
      }, 1000)
    },
    formatDate(q) {
      if(q) {
        const postedDate = new Date(q.seconds) * 1000;
        return moment(postedDate).format('MMMM Do YYYY')
      } else {
        return null
      }
    },
    deleteItem (item) {
      fb.backgroundChecksCollection.doc(item.id).delete()
    },
  }
}

</script>