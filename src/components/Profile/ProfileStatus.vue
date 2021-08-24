<template>
	<div>
    <h2>Employment Status</h2>
		<div class="mb-3">
			<label for="cont">Contractor Status:</label>
      <select v-model="user.contractorStatus" id="cont" @change="showButton = true">
        <option v-for="item in contStatuses" v-bind:value="item">
          {{item}}
        </option>
      </select>
		</div>
		<transition name="fade">
      <div class="flex align-center justify-space-between mb-3" v-if="showButton">
        <button class="btn btn__primary" @click="updateUser()">
          update
          <transition name="fade">
            <span class="ml-2" v-if="performingRequest">
            <i class="fa fa-spinner fa-spin"></i>
            </span>
          </transition>
        </button>
        <button class="btn btn__outlined" @click="cancelContUpdate()">
          cancel changes
        </button>
      </div>
    </transition>

    <transition name="fade">
      <div class="mb-3" v-if="user.contractorStatus == `hired contractor` || user.contractorStatus == `terminated`">
        <label for="contNum">Contractor Number: (copy and paste {{contNum}})</label>
        <input type="text" placeholder="" v-model.trim="user.contractorNumber" id="contNum" @change="updateUserFile1()" />
      </div>
    </transition>








    <div class="mb-3">
			<label for="emp">Employee Status:</label>
      <select v-model="user.employeeStatus" id="emp" @change="showButton2 = true">
        <option v-for="item in empStatuses" v-bind:value="item">
          {{item}}
        </option>
      </select>
		</div>
		<transition name="fade">
      <div class="flex align-center justify-space-between mb-3" v-if="showButton2">
        <button class="btn btn__primary" @click="updateUser()">
          update
          <transition name="fade">
            <span class="ml-2" v-if="performingRequest">
            <i class="fa fa-spinner fa-spin"></i>
            </span>
          </transition>
        </button>
        <button class="btn btn__outlined" @click="cancelEmpUpdate()">
          cancel changes
        </button>
      </div>
    </transition>

    <transition name="fade">
	    <div class="mb-3" v-if="user.employeeStatus == `hired`">
	      <label for="hireDate">Hire Date:</label>
	      <input type="date" placeholder="" v-model.trim="user.hireDate" id="hireDate" @change="updateUser()" />
	    </div>
	  </transition>
    <div class="mb-3" v-if="user.hireDate && user.employeeStatus == `hired`">
			<label for="position">Position:</label>
      <select v-model="user.position" id="position" @change="showButton3 = true">
        <option v-for="item in positions" v-bind:value="item">
          {{item}}
        </option>
      </select>
		</div>
		<transition name="fade">
      <div class="flex align-center justify-space-between mb-3" v-if="showButton3">
        <button class="btn btn__primary" @click="updateUser()">
          update
          <transition name="fade">
            <span class="ml-2" v-if="performingRequest">
            <i class="fa fa-spinner fa-spin"></i>
            </span>
          </transition>
        </button>
        <button class="btn btn__outlined" @click="cancelPosUpdate()">
          cancel changes
        </button>
      </div>
    </transition>



    <hr v-if="user.employeeStatus == `hired` || user.employeeStatus == `terminated`">
    <transition name="fade">
	    <div class="mb-3" v-if="user.employeeStatus == `hired` || user.employeeStatus == `terminated`">
	      <label for="empNum">Employee Number: (get from OnPay)</label>
	      <input type="text" placeholder="" v-model.trim="user.employeeNumber" id="empNum" @change="updateUserFile2()" />
	    </div>
	  </transition>
	  
	  <hr v-if="user.employeeStatus == `terminated`">
    <transition name="fade">
	    <div class="mb-3" v-if="user.employeeStatus == `terminated`">
	      <label for="terminationDate">Termination Date:</label>
	      <input type="date" placeholder="" v-model.trim="user.terminationDate" id="terminationDate" @change="updateUser()" />
	    </div>
	  </transition>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['user'],
  data: () => ({
    empStatuses: ['applied', 'payroll invitation', 'hired', 'not-hired', 'on-hold', 'terminated'],
    contStatuses: ['applied', 'payroll invitation', 'hired contractor', 'not-hired', 'on-hold', 'terminated', 'hired as employee'],
    positions: ['regular staff', 'shift-lead', 'assistant manager', 'manager', 'admin'],
    showButton: false,
    showButton2: false,
    showButton3: false,
    performingRequest: false,
  }),
  computed: {
    contNum() {
      return this.user.id.slice(0,8)
    }
  },
  methods: {
    updateUser () {
    	this.performingRequest = true
    	let user = this.user
      this.$store.dispatch('updateUser', user)
      setTimeout(() => {
          this.showButton = false
          this.showButton2 = false
          this.showButton3 = false
          this.performingRequest = false
      }, 500)
    },
    updateUserFile1 () {
      this.performingRequest = true
      let user = this.user
      user.fileId = user.contractorNumber
      this.$store.dispatch('updateUser', user)
      setTimeout(() => {
          this.showButton = false
          this.showButton2 = false
          this.showButton3 = false
          this.performingRequest = false
      }, 500)
    },
    updateUserFile2 () {
      this.performingRequest = true
      let user = this.user
      user.fileId = user.employeeNumber
      this.$store.dispatch('updateUser', user)
      setTimeout(() => {
          this.showButton = false
          this.showButton2 = false
          this.showButton3 = false
          this.performingRequest = false
      }, 500)
    },
    cancelContUpdate() {
    	setTimeout(() => {
          this.showButton = false
      }, 500)
    },
    cancelEmpUpdate() {
    	setTimeout(() => {
          this.showButton2 = false
      }, 500)
    },
    cancelPosUpdate() {
    	setTimeout(() => {
          this.showButton3 = false
      }, 500)
    }
  },
  beforeDestroy () {
  	this.showButton = false
  	this.showButton2 = false
  	this.showButton3 = false
  	delete this.showButton
  	delete this.showButton2
  	delete this.showButton3
  	this.performingRequest = false
  	delete this.performingRequest
    this.$store.dispatch('clearUserState')
    this.$store.dispatch('clearErrors')
  }
}
</script>